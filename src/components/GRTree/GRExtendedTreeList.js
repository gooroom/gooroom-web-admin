import React, { Component } from "react";
import classNames from "classnames";

import { grRequestPromise } from "components/GRUtils/GRRequester";
import GRTreeItem from "./GRTreeItem";

import List from '@material-ui/core/List';
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import FileIcon from "@material-ui/icons/InsertDriveFile";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRExtendedTreeList extends Component {
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
      
      isShowCheck: (props.isShowCheck !== undefined) ? props.isShowCheck : true,
      isEnableEdit: (props.isEnableEdit !== undefined) ? props.isEnableEdit : false,
      isCheckMasterOnly: (props.isCheckMasterOnly !== undefined) ? props.isCheckMasterOnly : false,

      treeData: [],

      checked: (props.checkedNodes && props.checkedNodes.size > 0) ? (props.checkedNodes.map(n => n.get('value'))) : [],
      imperfect: []
    };

    this.handleClickNode = this.handleClickNode.bind(this);
    this.fetchTreeData = this.fetchTreeData.bind(this);
  }

  componentDidMount() {
    
    if(this.props.onRef) {
      this.props.onRef(this);
    }

    if(this.props.onInitTreeData) {
      this.props.onInitTreeData();
    }
    
    this.fetchTreeData(this.state.rootKeyValue, undefined, true);
  }

  componentWillUnmount() {
    if(this.props.onRef) {
      this.props.onRef(undefined)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.checkedNodes) {
      if(!(this.props.checkedNodes.equals(nextProps.checkedNodes))) {
        this.setState({
          checked: (nextProps.checkedNodes && nextProps.checkedNodes.size > 0) ? (nextProps.checkedNodes.map(n => n.get('value'))) : []  
        });
      }
    }
  }
  
  fetchTreeData(keyValue, index, isDoExpand, onCallback) {

    const keyName = this.state.keyName;
    const param = {};
    param[this.state.paramKeyName] = keyValue;

    grRequestPromise(this.state.url, param).then(res => {

      let resData = [];
      if(res !== undefined && res !== '' && res.length > 0) {
      
        resData = res.map(x => {
          let children = null;
          if (x.hasChildren) {
            children = [];
          }

          let node = {
            key: x[keyName],
            depth: x.level,
            disabled: false,
            title: x[this.state.title],
            children: children,
            regDate: x.regDt,
            modDate: x.modDt,
            comment: x.comment,
            regClientIp: x.regClientIp,
            itemCount: x.itemCount,
            itemTotalCount: x.itemTotalCount,
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
          parents[index].children = resData.map(d => {
            return d.key;
          });
          
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

          // init tree and expand
          if(isDoExpand) {
            this.handleClickNode(resData[0], 0);
          }
        }
      }

      if(onCallback) {
        onCallback((resData && resData.length > 0) ? true : false);
      }
    }).catch(function (err) {
      console.log(err); // Error: Request is failed
    });
  }

  handleClickNode(listItem, index) {
    if (listItem.children) {
      // fetch children data
      // request to server if children array is empty.
      if (listItem.children.length < 1) {
        this.fetchTreeData(listItem.key, index, false, (hasChildren) => {
          // call select node event
          listItem['hasChildren'] = hasChildren;
          if (this.props.onSelectNode) {
            this.props.onSelectNode({name: listItem.title, value: listItem.key});
          }
        });
      } else {
        // call select node event
        listItem['hasChildren'] = true;
        if (this.props.onSelectNode) {
          this.props.onSelectNode({name: listItem.title, value: listItem.key});
        }
      }

      const indexOfListItemInArray = this.state.expandedListItems.indexOf(index);
      if (indexOfListItemInArray === -1) {
        listItem['hasChildren'] = false;
        this.setState({
          expandedListItems: this.state.expandedListItems.concat([index])
        });
      } else {
        // listItem['hasChildren'] = true;
        // let newArray = [].concat(this.state.expandedListItems);
        // newArray.splice(indexOfListItemInArray, 1);
        // this.setState({
        //   expandedListItems: newArray
        // });
      }
    } else {
      listItem['hasChildren'] = false;
      if (this.props.onSelectNode) {
        this.props.onSelectNode({name: listItem.title, value: listItem.key});
      }
    }

    // select node
    this.setState({
      activeListItem: index
    });
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

  resetTreeCheckedNode(newChecked) {
    this.setState({
      checked: newChecked  
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

  // handle node check event
  handleCheckNode = (event, listItem, index) => {
    const { checked, imperfect, treeData } = this.state;

    let newChecked = checked;
    let newImperfect = imperfect;
    let newStatus = null;

    if(!this.props.hasSelectChild && !this.props.hasSelectParent) {
      newChecked = this.updateCheckStatus(listItem.key, checked, event.target.checked);
      newStatus = {
        newChecked: newChecked,
        newImperfect: newImperfect
      };
    } else {
      if(this.props.hasSelectChild) {
        const children = treeData.filter(obj => obj.key === listItem.key)[0].children;
        if(children) {
          if(event.target.checked) {
            // check self and children
            newChecked = this.updateCheckStatus(listItem.key, newChecked, true);
          } else {
            // uncheck self and children
            newChecked = this.updateCheckStatus(listItem.key, newChecked, false);
          }
          // remove from imperfect
          newImperfect = this.updateCheckStatus(listItem.key, newImperfect, false);
          // check children from this
          const newChildrenStatus = this.updateChildrenNode(children, event.target.checked, newChecked, newImperfect);
          newChecked = newChildrenStatus.newChecked;
          newImperfect = newChildrenStatus.newImperfect;
        } else {
          newChecked = this.updateCheckStatus(listItem.key, checked, event.target.checked);
        }
        
        newStatus = {
          newChecked: newChecked,
          newImperfect: newImperfect
        };
      }

      if(this.props.hasSelectParent) {
        // check parent from this
        newStatus = this.updateParentNode(listItem.key, event.target.checked, newChecked, newImperfect);
      }
    }

    this.setState({
      checked: newStatus.newChecked,
      imperfect: newStatus.newImperfect
    });

    // call node check event
    if (this.props.onCheckedNode) {

      const isChecked = event.target.checked;
      this.props.onCheckedNode({name: listItem.title, value: listItem.key, isChecked: isChecked});

    }
  };

  handleClickFoldingNode(listItem, index) {
    const indexOfListItemInArray = this.state.expandedListItems.indexOf(index);
    listItem['hasChildren'] = true;
    let newArray = [].concat(this.state.expandedListItems);
    newArray.splice(indexOfListItemInArray, 1);
    this.setState({
      expandedListItems: newArray
    });
  }

  handleEditClickNode = (listItem, i) => {
    if(this.props.onEditNode) {
      this.props.onEditNode(listItem, i);
    }
  }

  render() {

    const contentKey = "title";

    const startingDepth = this.state.startingDepth;
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
            paddingTop: "0px",
            paddingBottom: "0px",
            alignItems: "start",
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
            depth={listItem.depth}
            startingDepth={startingDepth}
            primaryText={listItem._primaryText}
            style={Object.assign({}, listItem._styles.root)}
            isShowCheck={this.state.isShowCheck}
            isShowDetail={false}
            isShowMemberCnt={true}
            isEnableEdit={this.state.isEnableEdit}
            isCheckMasterOnly={this.state.isCheckMasterOnly}
            checked={this.state.checked}
            imperfect={this.state.imperfect}
            leftIcon={getLeftIcon(listItem, this.props)}
            isExtend={
              !listItem.children ? null : expandedListItems.indexOf(i) === -1 ? ('Y') : ('N')
            }
            onClickNode={() => {
              if (listItem.disabled) {
                return;
              }
              this.handleClickNode(listItem, i);
            }}
            onCheckNode={() => this.handleCheckNode(event, listItem, i)}
            onEditNode={() => this.handleEditClickNode(listItem, i)}
            onFoldingNode={() => this.handleClickFoldingNode(listItem, i)}
            memberCntValue={listItem.itemCount + '/' + listItem.itemTotalCount}
          />
        );
      } else {
        return null;
      }
    });

    return (
      <React.Fragment>
        <List disablePadding={true}>{listItemsJSX}</List>
      </React.Fragment>
    );

    function getLeftIcon(listItem, localProps) {
      if (localProps.useFolderIcons) {
        if (listItem.children) {
          return <FolderOpenIcon className={localProps.classes.parentNodeClass} />;
        } else {
          return <FolderIcon className={localProps.classes.childNodeClass} />;
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

export default withStyles(GRCommonStyle)(GRExtendedTreeList);
