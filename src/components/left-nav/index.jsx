import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
import { connect } from 'react-redux'//step1

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
// import './index.less'
import './index.css'
import memoryUtils from "../../utils/memoryUtils";
import { setHeadTitle } from '../../redux/actions'

const SubMenu = Menu.SubMenu;

/*
左侧导航的组件
 */
class LeftNav extends Component {

  /*
  判断当前登陆用户对item是否有权限
   */
  hasAuth = (item) => {
    const { key, isPublic } = item

    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }

    return false
  }

  /*
  根据menu的数据数组生成对应的标签数组
  使用map() + 递归调用
  */
  getMenuNodes_map = (menuList) => {
    const path = this.props.location.pathname
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {//有children，还要判断子菜单有没有被展开
        // 查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        // 如果存在, 说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = item.key
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }

    })
  }

  /*
  根据menu的数据数组生成对应的标签数组
  使用reduce() + 递归调用
  */
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname
    // 第一次pre代表初始值，后面一直累加
    return menuList.reduce((pre, item) => {

      // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        // 向pre添加<Menu.Item>
        if (!item.children) {
          // 判断item是否是当前对应的item
          if (item.key === path || path.indexOf(item.key) === 0) {
            // 更新redux中的headerTitle状态
            this.props.setHeadTitle(item.title)
          }

          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {

          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key
          }

          // 向pre添加<SubMenu>
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }

      return pre
    }, [])
  }

  /*
  componentWillMount：在第一次render()之前执行一次
  为第一个render()准备数据(必须同步的)
   */
  componentWillMount() {
    // this.menuNodes = this.getMenuNodes_map(menuList)
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    // debugger
    // 得到当前请求的路由路径
    let path = this.props.location.pathname
    console.log('render()', path)
    if (path.indexOf('/product') === 0) { // 当前请求的是商品或其子路由界面
      path = '/product'
    }

    // 得到需要打开菜单项的key
    const openKey = this.openKey

    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>硅谷后台</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >

          {
            this.menuNodes
          }

        </Menu>
      </div>
    )
  }
}

// export default LeftNav//这样this.props.location=undefined
/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
// export default withRouter(LeftNav)

export default connect(
  state => ({}),
  { setHeadTitle }
)(withRouter(LeftNav))
