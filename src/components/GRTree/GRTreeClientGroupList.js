import React, { Component } from "react";
import { Map, fromJS } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';

import { grRequestPromise } from "components/GRUtils/GRRequester";
import GRTreeItem from "./GRTreeItem";

import List from '@material-ui/core/List';
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRTreeClientGroupList extends Component {
  constructor(props) {
    super(props);
    
    this._isMounted = false;
    this.state = {
      searchTerm: "",
      rootKeyValue: '0',
      startingDepth: '1',
      
      isShowCheck: (props.isShowCheck !== undefined) ? props.isShowCheck : true,
      isEnableEdit: (props.isEnableEdit !== undefined) ? props.isEnableEdit : false,
      isCheckMasterOnly: (props.isCheckMasterOnly !== undefined) ? props.isCheckMasterOnly : false
    };

  }

  componentDidMount() {
    this._isMounted = true;
    
    if(this.props.onRef) {
      this.props.onRef(this);
    }

    if(this.props.onInitTreeData) {
      this.props.onInitTreeData();
    }
    
    //this.fetchTreeData(this.state.rootKeyValue, undefined, true);
    this.props.ClientGroupActions.readChildrenClientGroupList(this.props.compId, this.state.rootKeyValue, undefined)
  }

  componentWillUnmount() {
    this._isMounted = false;
    if(this.props.onRef) {
      this.props.onRef(undefined)
    }
  }
  
  // fetchTreeData(keyValue, index, isDoExpand, onCallback) {

  //   const param = {};
  //   param[this.state.paramKeyName] = keyValue;

  //   grRequestPromise(this.state.url, param).then(res => {
  //     const resData = res.map(x => {
  //       let children = null;
  //       if (x.hasChildren) {
  //         children = [];
  //       }

  //       let node = {
  //         key: x.key,
  //         depth: x.level,
  //         disabled: false,
  //         title: x.title,
  //         children: children,
  //         regDate: x.regDt,
  //         modDate: x.modDt,
  //         comment: x.comment,
  //         clientCount: x.clientCount,
  //         clientTotalCount: x.clientTotalCount,
  //         _shouldRender: true
  //       };
  //       if (index !== undefined) {
  //         node["parentIndex"] = index;
  //       }
  //       return node;
  //     });

  //     if (this.state.treeData.length > 0) {
  //       // set children data for stop refetch.
  //       let parents = this.state.treeData;

  //       parents[index].children = resData.map(d => {
  //         return d.key;
  //       });
        
  //       // data merge.
  //       // 1. delete children
  //       parents = parents.filter(e => e.parentIndex != index);
  //       // 2. insert new child data
  //       parents.splice.apply(parents, [index + 1, 0].concat(resData));

  //       // 3. reset parent index 
  //       parents = parents.map((obj, i) => {
  //         if (i > index + resData.length && obj.parentIndex > 0) {
  //           if(obj.parentIndex > index) {
  //             obj.parentIndex = obj.parentIndex + resData.length;
  //           }
  //         }
  //         return obj;
  //       });

  //       // reset expandedListItems values for adding nodes.
  //       const expandedListItems = this.state.expandedListItems;
  //       const newExpandedListItems = expandedListItems.map(obj => {
  //           if(obj > index) {
  //               return obj + resData.length;
  //           } else {
  //               return obj;
  //           }
  //       });

  //       if(this._isMounted) {
  //         this.setState({
  //           expandedListItems: newExpandedListItems,
  //           treeData: parents
  //         });
  //       }

  //     } else {
  //       if(this._isMounted) {
  //         this.setState({
  //           treeData: resData
  //         });

  //         if(isDoExpand) {
  //           this.handleClickNode(resData[0], 0);
  //         }
  //       }
  //     }

  //     if(this._isMounted && onCallback) {
  //       onCallback((resData && resData.length > 0) ? true : false);
  //     }
  //   }).catch(function (err) {
  //     console.log(err); // Error: Request is failed
  //   });
  // }

  handleClickNode(listItem, index) {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;

    if (listItem.get('children')) {
      // fetch children data
      // request to server if children array is empty.
      if (listItem.get('children').size < 1) {
        ClientGroupActions.readChildrenClientGroupList(this.props.compId, listItem.get('key'), index);
      } else {
        ClientGroupActions.readChildrenClientGroupList(this.props.compId, listItem.get('key'), index);
      }

      const expandedListItems = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'expandedListItems']);
      if(expandedListItems && expandedListItems.length > 0 && expandedListItems.indexOf(index) === -1) {
        ClientGroupActions.changeTreeDataVariable({
          compId: compId, name: 'expandedListItems',
          value: expandedListItems.concat([index])
        });
      } else {
        ClientGroupActions.changeTreeDataVariable({
          compId: compId, name: 'expandedListItems',
          value: (expandedListItems) ? expandedListItems : [index]
        });
      }
    }

    // call select node event
    if (this.props.onSelectNode) this.props.onSelectNode(listItem);
    // set active node
    ClientGroupActions.changeTreeDataVariable({
      compId: compId,
      name: 'activeListItem',
      value: index
    });
  }

  // resetTreeNode(keyValue) {
  //   const { ClientGroupProps, ClientGroupActions, compId } = this.props;
  //   const treeData = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'treeData']);

  //   const index = treeData.findIndex((e) => {
  //     return e.key == keyValue;
  //   })

  //   //this.fetchTreeData(keyValue, index);
  //   this.props.ClientGroupActions.readChildrenClientGroupList(this.props.compId, keyValue, index);

  //   // set active node
  //   ClientGroupActions.changeTreeDataVariable({
  //     compId: compId, name: 'activeListItem', value: index
  //   });
  // }

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
    const { ClientGroupProps, compId } = this.props;
    const treeData = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'treeData']);
    
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
    const { ClientGroupProps, compId } = this.props;
    const treeData = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'treeData']);
    
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

  handleCheckNode = nodeKey => event => {

    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const treeComp = ClientGroupProps.getIn(['viewItems', compId, 'treeComp']);

    const treeData = (treeComp.get('treeData')) ? treeComp.get('treeData') : [];
    const checked = (treeComp.get('checked')) ? treeComp.get('checked') : [];
    const imperfect = (treeComp.get('imperfect')) ? treeComp.get('imperfect') : [];

    let newChecked = checked;
    let newImperfect = imperfect;
    let newStatus = null;

    if(!this.props.hasSelectChild && !this.props.hasSelectParent) {
      newChecked = this.updateCheckStatus(nodeKey, checked, event.target.checked);
      newStatus = {
        newChecked: newChecked,
        newImperfect: newImperfect
      };
    } else {
      if(this.props.hasSelectChild) {
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
        
        newStatus = {
          newChecked: newChecked,
          newImperfect: newImperfect
        };
      }

      if(this.props.hasSelectParent) {
        // check parent from this
        newStatus = this.updateParentNode(nodeKey, event.target.checked, newChecked, newImperfect);
      }
    }

    ClientGroupActions.changeTreeDataVariable({ compId: compId, name: 'checked', value: newStatus.newChecked });
    ClientGroupActions.changeTreeDataVariable({ compId: compId, name: 'imperfect', value: newStatus.newImperfect });

    // call select node event
    if (this.props.onCheckedNode) this.props.onCheckedNode(newStatus.newChecked, newStatus.newImperfect);
  };

  handleClickFoldingNode(listItem, index) {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const expandedListItems = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'expandedListItems']);

    if(expandedListItems && expandedListItems.length > 0) {
      const indexOfListItemInArray = expandedListItems.indexOf(index);
      listItem['hasChildren'] = true;
      let newArray = [].concat(expandedListItems);
      newArray.splice(indexOfListItemInArray, 1);
      ClientGroupActions.changeTreeDataVariable({
        compId: compId,
        name: 'expandedListItems',
        value: newArray
      });
    }
  }

  handleEditClickNode = (listItem, i) => {
    if(this.props.onEditNode) {
      this.props.onEditNode(listItem, i);
    }
  }

  applyStyle = (listItem, isActive) => {
    return fromJS({
      root: {
        paddingLeft: (listItem.get('depth') - this.state.startingDepth) * 8,
        backgroundColor: isActive ? "rgba(0,0,0,0.2)" : null,
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        alignItems: "start",
        cursor: listItem.get('disabled') ? "not-allowed" : "pointer",
        color: listItem.get('disabled') ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.87)",
        overflow: "hidden",
        transform: "translateZ(0)"
      }
    });
  }

  getListItemModified = () => {
    const { startingDepth } = this.state;
    const { ClientGroupProps, compId } = this.props;
    const treeComp = ClientGroupProps.getIn(['viewItems', compId, 'treeComp']);

    const treeData = (treeComp.get('treeData')) ? treeComp.get('treeData') : [];
    const expandedListItems = (treeComp.get('expandedListItems')) ? treeComp.get('expandedListItems') : [];
    const activeListItem = (treeComp.get('activeListItem')) ? treeComp.get('activeListItem') : '';

    let modifiedList = null;
    if(treeData) {

      let parentItem = null;
      let beforeItem = null;

      modifiedList = treeData.map (
        (listItem, i) => {

          if(beforeItem === null) {
            listItem = listItem.set('_styles', this.applyStyle(listItem, (activeListItem === i)))
                                .set('_shouldRender', (listItem.get('depth') >= startingDepth))
                                .set('_primaryText', listItem.get('title'));
          } else {
            if(beforeItem.get('depth') < listItem.get('depth')) {
              // child
              parentItem = beforeItem;
              listItem = listItem.set('_styles', this.applyStyle(listItem, (activeListItem === i)))
                                  .set('_shouldRender', (expandedListItems.indexOf(listItem.get('parentIndex')) > -1) ? (parentItem && parentItem.get('_shouldRender')) : false)
                                  .set('_primaryText', listItem.get('title'));
            } else if(beforeItem.get('depth') > listItem.get('depth')) {
              // upper - another parent
              parentItem = treeData.get(listItem.get('parentIndex'));
              listItem = listItem.set('_styles', this.applyStyle(listItem, (activeListItem === i)))
                                  .set('_shouldRender', (expandedListItems.indexOf(listItem.get('parentIndex')) > -1) ? (parentItem && parentItem.get('_shouldRender')) : false)
                                  .set('_primaryText', listItem.get('title'));
            } else {
              // siblings
              listItem = listItem.set('_styles', this.applyStyle(listItem, (activeListItem === i)))
                                  .set('_shouldRender', (expandedListItems.indexOf(listItem.get('parentIndex')) > -1) ? (parentItem && parentItem.get('_shouldRender')) : false)
                                  .set('_primaryText', listItem.get('title'));
            }
          }
          beforeItem = listItem;

          // listItem._styles = this.applyStyle(listItem, (activeListItem === i));
          // listItem._shouldRender = // (listItem._shouldRender) ||
          //   (listItem.depth >= startingDepth && parentsAreExpanded(listItem));
          // listItem.set('_primaryText', listItem.get('title'));
          return listItem;
        }
      );
    }

    // function parentsAreExpanded(listItem) {
    //   if (listItem.depth > startingDepth) {
    //     if (expandedListItems.indexOf(listItem.parentIndex) === -1) {
    //       return false;
    //     } else {
    //       return true;
    //       // const parent = treeData.filter((_listItem, index) => {
    //       //   return index === listItem.parentIndex;
    //       // })[0];
    //       // return parentsAreExpanded(parent);
    //     }
    //   } else {
    //     return true;
    //   }
    // }

    return modifiedList;
  }

  getTreeItemList = () => {
    const { ClientGroupProps, compId } = this.props;
    const treeComp = ClientGroupProps.getIn(['viewItems', compId, 'treeComp']);
    if(!treeComp) {
      return;
    }

    const expandedListItems = (treeComp.get('expandedListItems')) ? treeComp.get('expandedListItems') : [];
    const checked = (treeComp.get('checked')) ? treeComp.get('checked') : [];
    const imperfect = (treeComp.get('imperfect')) ? treeComp.get('imperfect') : [];

    function getLeftIcon(listItem, localProps) {
      if (localProps.useFolderIcons) {
        if (listItem.get('children')) {
          return <FolderOpenIcon className={localProps.classes.parentNodeClass} />;
        } else {
          return <FolderIcon className={localProps.classes.childNodeClass} />;
        }
      } else {
        return listItem.get('icon');
      }
    }

    const listItemsModified = this.getListItemModified();
    let listItemsJSX = null;
    if(listItemsModified) {
      listItemsJSX = listItemsModified.map((listItem, i) => {
        if (listItem.get('_shouldRender')) {
          return (
            <GRTreeItem
              key={"treeListItem-" + i}
              nodeKey={listItem.get('key')}
              depth={listItem.get('depth')}
              primaryText={listItem.get('title')}
              style={Object.assign({}, listItem.getIn(['_styles','root']).toJS())}
              isShowCheck={this.state.isShowCheck}
              isEnableEdit={this.state.isEnableEdit}
              isCheckMasterOnly={this.state.isCheckMasterOnly}
              checked={checked}
              imperfect={imperfect}
              leftIcon={getLeftIcon(listItem, this.props)}
              isExtend={
                !listItem.get('children') ? null : (expandedListItems && expandedListItems.indexOf(i) === -1) ? ('Y') : ('N')
              }
              onClickNode={() => {
                if (listItem.get('disabled')) {
                  return;
                }
                this.handleClickNode(listItem, i);
              }}
              onCheckNode={this.handleCheckNode}
              onEditNode={() => this.handleEditClickNode(listItem, i)}
              onFoldingNode={() => this.handleClickFoldingNode(listItem, i)}
              isShowMemberCnt={(this.props.isShowMemberCnt) ? this.props.isShowMemberCnt : false}
              memberCntValue={listItem.get('clientCount') + '/' + listItem.get('clientTotalCount')}
            />
          );
        } else {
          return null;
        }
      });
    }

    return listItemsJSX;
  }

  render() {
    const listItemsJSX = this.getTreeItemList();

    return (
      <React.Fragment>
        <List disablePadding={true}>{listItemsJSX}</List>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRTreeClientGroupList));

