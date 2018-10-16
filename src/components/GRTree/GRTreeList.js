import React, { Component } from "react";
import classNames from "classnames";

import { grRequestPromise } from "components/GRUtils/GRRequester";
import GRTreeItem from "./GRTreeItem";

import List from '@material-ui/core/List';
import OpenIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/ExpandLess";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import BuildIcon from '@material-ui/icons/Build';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRTreeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedListItems: [],
      activeListItem: null,
      searchTerm: "",

      url: props.url,
      paramKeyName: props.paramKeyName,
      rootKeyValue: props.rootKeyValue,
      keyName: props.keyName,
      title: props.title,
      startingDepth: props.startingDepth ? props.startingDepth: 0,

      treeData: [],

      checked: [],
      imperfect: []
    };

    this.handleClickNode = this.handleClickNode.bind(this);
    this.fetchTreeData = this.fetchTreeData.bind(this);
  }

  componentDidMount() {
    if(this.props.onInitTreeData) {
      this.props.onInitTreeData();
    }
    if(this.props.onRef) {
      this.props.onRef(this);
    }
    
    this.fetchTreeData(this.state.rootKeyValue);
  }

  componentWillUnmount() {
    if(this.props.onRef) {
      this.props.onRef(undefined)
    }
  }

  fetchTreeData(keyValue, index) {
    const keyName = this.state.keyName;
    const param = {};
    param[this.state.paramKeyName] = keyValue;

    grRequestPromise(this.state.url, param).then(res => {
      let indexCount = 0;

      const resData = res.map(x => {
        let children = null;
        if (x.lazy) {
          children = [];
        }

        let node = {
          key: x[keyName],
          depth: (x.whleDeptCd.match(/;/g) || []).length,
          disabled: false,
          title: x[this.state.title],
          children: children,
          _shouldRender: true
        };
        if (index !== undefined) {
          node["parentIndex"] = index;
        }
        return node;
      });

      if (this.state.treeData.length > 0) {
        // set children data for stop refetch.
        let parents = this.state.treeData;
        const oldChildrenLength = (parents[index].children) ? parents[index].children.length : 0;

        parents[index].children = resData.map(d => {
          return d.key;
        });
        if(this.state.checked.includes(parents[index].key)) {
          // add checked data, by default checked.
          const newChecked = [...this.state.checked];
          resData.map(d => {
            newChecked.push(d.key);  
            return d;
          });
          this.setState({
            checked: newChecked  
          });
        }
        
        // data merge.
        // 1. delete children
        parents = parents.filter(e => e.parentIndex != index);
        // 2. insert new child data
        parents.splice.apply(parents, [index + 1, 0].concat(resData));

        // 3. reset parent index 
        parents = parents.map((obj, i) => {
          if (i > index + resData.length && obj.parentIndex > 0) {
            if(obj.parentIndex > index) {
              obj.parentIndex = obj.parentIndex + resData.length;
            }
          }
          return obj;
        });

        // reset expandedListItems values for adding nodes.
        const expandedListItems = this.state.expandedListItems;
        const newExpandedListItems = expandedListItems.map(obj => {
            if(obj > index) {
                return obj + resData.length;
            } else {
                return obj;
            }
        });

        this.setState({
            expandedListItems: newExpandedListItems,
            treeData: parents
        });

      } else {

        this.setState({
          treeData: resData
        });
      }
    });
  }

  handleClickNode(listItem, index) {
    if (listItem.children) {
      // fetch children data
      // request to server if children array is empty.
      if (listItem.children.length < 1) {
        this.fetchTreeData(listItem.key, index);
      }

      const indexOfListItemInArray = this.state.expandedListItems.indexOf(index);
      if (indexOfListItemInArray === -1) {
        this.setState({
          expandedListItems: this.state.expandedListItems.concat([index])
        });
      } else {
        let newArray = [].concat(this.state.expandedListItems);
        newArray.splice(indexOfListItemInArray, 1);
        this.setState({
          expandedListItems: newArray
        });
      }
    } else {

    }
    // select node
    this.setState({
      activeListItem: index
    });
    // call select node event
    if (this.props.onSelectNode) this.props.onSelectNode(listItem);
  }

  resetTreeNode(keyValue) {
    const index = this.state.treeData.findIndex((e) => {
      return e.key == keyValue;
    })
    this.fetchTreeData(keyValue, index);
    // select node
    this.setState({
      activeListItem: index
    });
  }

  updateCheckStatus = (nodeKey, tempChecked, isChecked) => {
    const newChecked = [...tempChecked];
    const currentCheckedIndex = tempChecked.indexOf(nodeKey);
    if (isChecked) {
      if (currentCheckedIndex === -1) {
        newChecked.push(nodeKey);
      }
    } else {
      if (currentCheckedIndex !== -1) {
        newChecked.splice(currentCheckedIndex, 1);
      }
    }
    return newChecked;
  }

  updateParentNode = (nodeKey, isChecked, newChecked, newImperfect) => {
    const { treeData } = this.state;
    const targetNode = treeData.filter(obj => obj.key === nodeKey)[0];
    let isCheckList = null;
    if(targetNode.parentIndex !== undefined) {

        isCheckList = treeData[targetNode.parentIndex].children.map(obj => {
            return (newChecked.includes(obj) && !(newImperfect.includes(obj)));
        });
        // test one more for newImperfect
        const isImperfect = treeData[targetNode.parentIndex].children.map(obj => {
          return (newImperfect.includes(obj));
        });

        const pIndex = treeData.filter(obj => obj.key === nodeKey)[0].parentIndex;
        if(isImperfect.includes(true)) {
            // parted checked
            newChecked = this.updateCheckStatus(treeData[pIndex].key, newChecked, true);
            newImperfect = this.updateCheckStatus(treeData[pIndex].key, newImperfect, true);
        } else {
          if(isCheckList.every(obj => {if(obj) return obj;})) {
              // all checked.
              newChecked = this.updateCheckStatus(treeData[pIndex].key, newChecked, true);
              newImperfect = this.updateCheckStatus(treeData[pIndex].key, newImperfect, false);
          } else if(isCheckList.every(obj => {if(!obj) return !obj;})) {
              // all unchecked.
              newChecked = this.updateCheckStatus(treeData[pIndex].key, newChecked, false);
              newImperfect = this.updateCheckStatus(treeData[pIndex].key, newImperfect, false);
          } else {
              // parted checked
              newChecked = this.updateCheckStatus(treeData[pIndex].key, newChecked, true);
              newImperfect = this.updateCheckStatus(treeData[pIndex].key, newImperfect, true);
          }
        }

        if(pIndex >= 0) {
            const newStatus = this.updateParentNode(treeData[pIndex].key, isChecked, newChecked, newImperfect);
            newChecked = newStatus.newChecked;
            newImperfect = newStatus.newImperfect;
        }
    }

    return {
        newChecked: newChecked,
        newImperfect: newImperfect
    };
  }

  updateChildrenNode = (subNodes, isChecked, newChecked, newImperfect) => {
    const { treeData } = this.state;
    if(subNodes && subNodes.length > 0) {
      for(var i = 0; i < subNodes.length; i++) {
        if(isChecked) {
          newChecked = this.updateCheckStatus(subNodes[i], newChecked, true);
          newImperfect = this.updateCheckStatus(subNodes[i], newImperfect, false);
        } else {
          newChecked = this.updateCheckStatus(subNodes[i], newChecked, false);
          newImperfect = this.updateCheckStatus(subNodes[i], newImperfect, false);
        }

        const children = treeData.filter(obj => obj.key === subNodes[i])[0].children;
        if(children) {
          const newStatus = this.updateChildrenNode(children, isChecked, newChecked, newImperfect);
          newChecked = newStatus.newChecked;
          newImperfect = newStatus.newImperfect;
        }
      }
    }

    return {
      newChecked: newChecked,
      newImperfect: newImperfect
    };
  }

  handleChange = nodeKey => event => {
    const { checked, imperfect, treeData } = this.state;

    let newChecked = checked;
    let newImperfect = imperfect;
    let newStatus = null;

    if(this.props.relative) {
      const children = treeData.filter(obj => obj.key === nodeKey)[0].children;
      if(children) {
        if(event.target.checked) {
          // check self and children
          newChecked = this.updateCheckStatus(nodeKey, newChecked, true);
        } else {
          // uncheck self and children
          newChecked = this.updateCheckStatus(nodeKey, newChecked, false);
        }
        // remove from imperfect
        newImperfect = this.updateCheckStatus(nodeKey, newImperfect, false);
        // check children from this
        const newChildrenStatus = this.updateChildrenNode(children, event.target.checked, newChecked, newImperfect);
        newChecked = newChildrenStatus.newChecked;
        newImperfect = newChildrenStatus.newImperfect;
      } else {
        newChecked = this.updateCheckStatus(nodeKey, checked, event.target.checked);
      }

      // check parent from this
      newStatus = this.updateParentNode(nodeKey, event.target.checked, newChecked, newImperfect);
    } else {
      
      newChecked = this.updateCheckStatus(nodeKey, checked, event.target.checked);
      newStatus = {
        newChecked: newChecked,
        newImperfect: newImperfect
      };
    }

    this.setState({
      checked: newStatus.newChecked,
      imperfect: newStatus.newImperfect
    });

    // call select node event
    if (this.props.onCheckedNode) this.props.onCheckedNode(newStatus.newChecked, newStatus.newImperfect);
  };

  handleEditClickNode = (listItem, i) => {
    if(this.props.onEditNode) {
      this.props.onEditNode(listItem, i);
    }
  }

  render() {
    const contentKey = "title";

    const startingDepth = this.state.startingDepth;
    const listHeight = this.props.listHeight ? this.props.listHeight : "24px";
    const activeListItem = this.props.activeListItem
      ? this.props.activeListItem
      : this.state.activeListItem;
    const expandedListItems = this.props.expandedListItems
      ? this.props.expandedListItems
      : this.state.expandedListItems;

    const datas = this.state.treeData;

    let listItemsModified = this.state.treeData.map(
      (listItem, i, inputArray) => {
        listItem._styles = {
          root: {
            paddingLeft: (listItem.depth - startingDepth) * 8,
            backgroundColor: activeListItem === i ? "rgba(0,0,0,0.2)" : null,
            height: listHeight,
            cursor: listItem.disabled ? "not-allowed" : "pointer",
            color: listItem.disabled ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.87)",
            overflow: "hidden",
            transform: "translateZ(0)"
          }
        };

        listItem._shouldRender = // (listItem._shouldRender) ||
          (listItem.depth >= startingDepth && parentsAreExpanded(listItem));
        listItem._primaryText = listItem[contentKey];

        return listItem;
      }
    );

    // JSX: array of listItems
    const listItemsJSX = listItemsModified.map((listItem, i) => {

      if (listItem._shouldRender) {
        return (
          <GRTreeItem
            key={"treeListItem-" + i}
            nodeKey={listItem.key}
            primaryText={listItem._primaryText}
            style={Object.assign({}, listItem._styles.root)}
            checked={this.state.checked}
            imperfect={this.state.imperfect}
            leftIcon={getLeftIcon(listItem, this.props)}
            editIcon={<BuildIcon style={{color: 'darkgray', fontSize: 18}} onClick={() => this.handleEditClickNode(listItem, i)} />}
            rightIcon={
              !listItem.children ? null : expandedListItems.indexOf(i) ===
              -1 ? (
                <OpenIcon />
              ) : (
                <CloseIcon />
              )
            }
            onClickNode={() => {
              if (listItem.disabled) {
                return;
              }
              this.handleClickNode(listItem, i);
            }}
            onCheckNode={this.handleChange}
          />
        );
      } else {
        return null;
      }
    });

    return (
      <React.Fragment>
        <List>{listItemsJSX}</List>
      </React.Fragment>
    );

    function getLeftIcon(listItem, localProps) {
      if (localProps.useFolderIcons) {
        if (listItem.children) {
          return <FolderIcon className={localProps.classes.parentNodeClass} />;
        } else {
          return <FileIcon className={localProps.classes.childNodeClass} />;
        }
      } else {
        return listItem.icon;
      }
    }

    function parentsAreExpanded(listItem) {
      if (listItem.depth > startingDepth) {
        if (expandedListItems.indexOf(listItem.parentIndex) === -1) {
          return false;
        } else {
          const parent = datas.filter((_listItem, index) => {
            return index === listItem.parentIndex;
          })[0];
          return parentsAreExpanded(parent);
        }
      } else {
        return true;
      }
    }
  }
}

export default withStyles(GRCommonStyle)(GRTreeList);
