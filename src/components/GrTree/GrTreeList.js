import React, { Component } from "react";
import classNames from "classnames";
import { createMuiTheme } from 'material-ui/styles';
import { css } from 'glamor';

import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";

import GrTreeItem from "./GrTreeItem";

import OpenIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/ExpandLess";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";


//
//  ## Style ########## ########## ########## ########## ########## 
//
const parentNodeClass = css({
  color: "#686868"
}).toString();

const childNodeClass = css({
  color: "#a8a8a8"
}).toString();


class GrTreeList extends Component {
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
    this.fetchTreeData(this.state.rootKeyValue);
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
          children: children
        };
        if (index !== undefined) {
          node["parentIndex"] = index;
        }
        return node;
      });

      if (this.state.treeData.length > 0) {
        // set children data for stop refetch.
        let parents = this.state.treeData;
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
        // use SPLICE, CONCAT for insert in array
        parents.splice.apply(parents, [index + 1, 0].concat(resData));
        // reset parentIndex with node after (index + redData.length)
        parents = parents.map((obj, i) => {
          if (i > index + resData.length && obj.parentIndex > this.state.startingDepth) {
            obj.parentIndex = obj.parentIndex + resData.length;
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
    // console.log("handleClickNode... " + listItem.key + ", " + index);
    // console.log("handleClickNode..expandedListItems. " + this.state.expandedListItems);
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
    // console.log("[handleChange] ... " + nodeKey + " -> " + event.target.checked);
    const { checked, imperfect, treeData } = this.state;

    let newChecked = checked;
    let newImperfect = imperfect;

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
    const newStatus = this.updateParentNode(nodeKey, event.target.checked, newChecked, newImperfect);

    this.setState({
      checked: newStatus.newChecked,
      imperfect: newStatus.newImperfect
    });

  };

  render() {
    const contentKey = "title";

    const startingDepth = this.state.startingDepth;
    const listHeight = this.props.listHeight ? this.props.listHeight : "36px";
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
            paddingLeft: (listItem.depth - startingDepth) * 16,
            backgroundColor: activeListItem === i ? "rgba(0,0,0,0.2)" : null,
            height: listHeight,
            cursor: listItem.disabled ? "not-allowed" : "pointer",
            color: listItem.disabled ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.87)",
            overflow: "hidden",
            transform: "translateZ(0)"
          }
        };

        listItem._shouldRender = //(listItem._shouldRender) ||
          (listItem.depth >= startingDepth && parentsAreExpanded(listItem));
        listItem._primaryText = listItem[contentKey];

        return listItem;
      }
    );

    // Search Node...

    // JSX: array of listItems
    const listItemsJSX = listItemsModified.map((listItem, i) => {
      //console.log(listItem);
      if (listItem._shouldRender) {
        return (
          <GrTreeItem
            key={"treeListItem-" + i}
            nodeKey={listItem.key}
            primaryText={listItem._primaryText}
            style={Object.assign({}, listItem._styles.root)}
            checked={this.state.checked}
            imperfect={this.state.imperfect}
            leftIcon={getLeftIcon(listItem, this.props.useFolderIcons)}
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

    function getLeftIcon(listItem, useFolderIcons) {
      if (useFolderIcons) {
        if (listItem.children) {
          return <FolderIcon className={parentNodeClass} />;
        } else {
          return <FileIcon className={childNodeClass} />;
        }
      } else {
        return listItem.icon;
      }
    }

    function parentsAreExpanded(listitem) {
      if (listitem.depth > startingDepth) {
        if (expandedListItems.indexOf(listitem.parentIndex) === -1) {
          return false;
        } else {
          const parent = datas.filter((_listItem, index) => {
            return index === listitem.parentIndex;
          })[0];
          return parentsAreExpanded(parent);
        }
      } else {
        return true;
      }
    }
  }
}

export default GrTreeList;
