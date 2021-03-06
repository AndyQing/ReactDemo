import React, { Component } from 'react';
import { Tree, Icon } from 'antd';
// import styles from './EditableTree.less';
// import './EditableTree.css';
import s from './EditableTree.css';
const { TreeNode } = Tree;

const content = [
  {
    "keys": "progress",
    "name": "实施进度",
    "defaultValue": "实施进度",
    "width": 10,
    "colCount": "2",
    "index": 1,
    "id": "1_1_1_5",
    "rowCount": "1",
    "content": [],
    "height": 10,
    "columnAttr": 1
  },
  {
    "keys": "company",
    "name": "云上贵州集团公司",
    "defaultValue": "云上贵州集团公司",
    "width": 10,
    "colCount": "1",
    "index": 3,
    "id": "1_1_1_6",
    "rowCount": "2",
    "content": [
      {
        "pos": 100100,
        "keys": "team",
        "name": "项目团队",
        "defaultValue": "项目团队",
        "width": 10,
        "content": [],
        "height": 10,
        "columnAttr": 1
      },
      {
        "pos": 100200,
        "keys": "leadPerson",
        "name": "团队负责人",
        "defaultValue": "团队负责人",
        "width": 10,
        "content": [],
        "height": 10,
        "columnAttr": 1
      }
    ],
    "height": 10,
    "columnAttr": 1
  },
  {
    "keys": "userUnit1",
    "name": "用户单位",
    "defaultValue": "用户单位",
    "width": 10,
    "colCount": "1",
    "index": 2,
    "id": "1_1_1_7",
    "rowCount": "1",
    "content": [
      {
        "pos": 100100,
        "keys": "company1",
        "name": "联系人",
        "defaultValue": "联系人",
        "width": 10,
        "content": [],
        "height": 10,
        "columnAttr": 1
      }
    ],
    "height": 10,
    "columnAttr": 1
  }
]

//可以拖动的tree
class EditableTree extends Component {

  data = content;
  expandedKeys = [];

  state = {
    expandedKeys: [],
    data: this.data
  };

  componentDidMount() {
    // Tip: Must have, or the parent node will not expand automatically when you first add a child node
    this.onExpand([]); // 手动触发，否则会遇到第一次添加子节点不展开的Bug
  }
  render() {
    return (
      <div>
        <button onClick={this.addFather}>添加一级菜单</button>
        <Tree
          draggable
          expandedKeys={this.state.expandedKeys}
          selectedKeys={[]}
          onExpand={this.onExpand}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}>
          {this.renderTreeNodes(this.state.data)}
        </Tree>

        <button onClick={this.getData}>得到当前data值</button>
      </div>
    )
  }
  addFather = () => {
    let newTemp = {
      name: 'default',
      defaultValue: 'default',
      keys: Math.random(100), // 这个 key 应该是唯一的。 Tip: The key should be unique
      parentKey: 0,
      key: Math.random(100),
      isEditable: false
    };
    let newList = this.state.data;
    newList.push(newTemp)
    console.log("newList---", newList);
    this.setState({
      data: newList
    });
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    this.expandedKeys = expandedKeys;
    this.setState({ expandedKeys: expandedKeys })
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.isEditable) {
      item.title = (
        <div>
          <input
            className={s.inputField}
            value={item.name}
            onChange={(e) => this.onChange(e, item.keys)} />
             <input
            className={s.inputField}
            value={item.name}/>
             <input
            className={s.inputField}
            value={item.name} />
          <Icon type='close' style={{ marginLeft: 10 }} onClick={() => this.onClose(item.keys, item.defaultValue)} />
          <Icon type='check' style={{ marginLeft: 10 }} onClick={() => this.onSave(item.keys)} />
        </div>
      );
    } else {
      item.title = (
        <div>
          <span>
            {item.name}
          </span>
          <span >
            <Icon style={{ marginLeft: 10 }} type='edit' onClick={() => this.onEdit(item.keys)} />
            <Icon style={{ marginLeft: 10 }} type='plus' onClick={() => this.onAdd(item.keys)} />
            {item.parentKey === '0' ? null : (<Icon style={{ marginLeft: 10 }} type='minus' onClick={() => this.onDelete(item.keys)} />)}
          </span>
        </div>
      )
    }

    if (item.content) {
      return (
        <TreeNode title={item.title} key={item.keys} dataRef={item}>
          {this.renderTreeNodes(item.content)}
        </TreeNode>
      );
    }

    return <TreeNode {...item} />;
  })

  onAdd = (e) => {
    console.log('add');
    // 防止expandedKeys重复
    // Tip: Must have, expandedKeys should not be reduplicative
    if (this.state.expandedKeys.indexOf(e) === -1) {
      this.expandedKeys.push(e);
    }
    this.addNode(e, this.data);
    this.setState({
      expandedKeys: this.expandedKeys,
      data: this.data
    });
  }

  addNode = (key, data) => data.map((item) => {
    if (item.keys === key) {
      if (item.content) {
        item
          .content
          .push({
            name: 'default',
            defaultValue: 'default',
            keys: key + Math.random(100), // 这个 key 应该是唯一的。 Tip: The key should be unique
            parentKey: key,
            isEditable: false
          });
      } else {
        item.content = [];
        item
          .content
          .push({
            name: 'default',
            defaultValue: 'default',
            keys: key + Math.random(100),
            parentKey: key,
            isEditable: false
          });
      }
      return;
    }
    if (item.content) {
      this.addNode(key, item.content)
    }
  })

  onDelete = (key) => {
    console.log('delete');
    console.log("this.data---", this.data);
    this.deleteNode(key, this.data);
    this.setState({
      data: this.data
    });
  }

  deleteNode = (key, data) => data.map((item, index) => {
    if (item.keys === key) {
      data.splice(index, 1);
      return;
    } else {
      if (item.content) {
        this.deleteNode(key, item.content)
      }
    }
  })

  onEdit = (key) => {
    console.log('edit');
    this.editNode(key, this.data);
    this.setState({
      data: this.data
    });
  }

  editNode = (key, data) => data.map((item) => {
    if (item.keys === key) {
      item.isEditable = true;
    } else {
      item.isEditable = false;
    }
    //Tip: Must have, when a node is editable, and you click a button to make other node editable, the node which you don't save yet will be not editable, and its value should be defaultValue 
    item.name = item.defaultValue; // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
    if (item.content) {
      this.editNode(key, item.content)
    }
  })

  onClose = (key, defaultValue) => {
    console.log('close');
    this.closeNode(key, defaultValue, this.data);
    this.setState({
      data: this.data
    });
  }

  closeNode = (key, defaultValue, data) => data.map((item) => {
    item.isEditable = false;
    if (item.keys === key) {
      item.name = defaultValue;
    }
    if (item.content) {
      this.closeNode(key, defaultValue, item.content)
    }
  })

  onSave = (key) => {
    console.log('save')
    this.saveNode(key, this.data);
    this.setState({
      data: this.data
    });
    console.log("data---", this.data);
  }

  saveNode = (key, data) => data.map((item) => {
    if (item.keys === key) {
      item.defaultValue = item.name;
    }
    if (item.content) {
      this.saveNode(key, item.content)
    }
    item.isEditable = false;
  })

  onChange = (e, key) => {
    console.log('onchange')
    this.changeNode(key, e.target.value, this.data);
    this.setState({
      data: this.data
    });
  }

  changeNode = (key, value, data) => data.map((item) => {
    if (item.keys === key) {
      item.name = value;
    }
    if (item.content) {
      this.changeNode(key, value, item.content)
    }
  })
  getData = () => {
    console.log('this.data', this.data);
  }
  onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.keys === key) {
          return callback(item, index, arr);
        }
        if (item.content) {
          return loop(item.content, key, callback);
        }
      });
    };
    const data = [...this.state.data];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.content = item.content || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.content.push(dragObj);
      });
    } else if (
      (info.node.props.content || []).length > 0 && // Has content
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.content = item.content || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.content.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      data: data,
    });
  };
  onDragEnter = info => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

}

export default EditableTree;
