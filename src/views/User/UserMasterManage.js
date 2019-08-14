import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as DeptActions from 'modules/DeptModule';
import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import * as TotalRuleActions from 'modules/TotalRuleModule';

import { getRowObjectById, getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import DeptTreeComp from 'views/User/DeptTreeComp';

import GRPane from "containers/GRContent/GRPane";
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCheckConfirm from 'components/GRComponents/GRCheckConfirm';

import BrowserRuleDialog from "views/Rules/UserConfig/BrowserRuleDialog";
import SecurityRuleDialog from "views/Rules/UserConfig/SecurityRuleDialog";
import MediaRuleDialog from "views/Rules/UserConfig/MediaRuleDialog";
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';
import DesktopConfDialog from "views/Rules/DesktopConfig/DesktopConfDialog";
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';

import UserListComp from 'views/User/UserListComp';
import UserSpec from "views/User/UserSpec";
import UserSelectDialog from "views/User/UserSelectDialog";
import UserDialog from "views/User/UserDialog";
import UserBasicDialog from "views/User/UserBasicDialog";

import DeptSpec from "views/User/DeptSpec";
import DeptSelectDialog from "views/User/DeptSelectDialog";
import DeptDialog from "views/User/DeptDialog";
import DeptMultiDialog from "views/User/DeptMultiDialog";

import Grid from "@material-ui/core/Grid";
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TuneIcon from '@material-ui/icons/Tune';
import UserIcon from '@material-ui/icons/Person';
import DeptIcon from '@material-ui/icons/WebAsset';
import MoveIcon from '@material-ui/icons/Redo';
import AccountIcon from '@material-ui/icons/AccountBox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";

class UserMasterManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      compId: this.props.match.params.grMenuId,
      isOpenUserSelect: false,
      isOpenDeptSelect: false,
      selectedDept: {deptCd:'', deptNm:''}
    };
  }

  handleInitTreeData = () => {
    // Check selectedDeptCd
    this.props.DeptActions.changeCompVariableObject({
      compId: this.state.compId,
      valueObj: {selectedDeptCd: '', selectedDeptNm: ''}
    });
  }

  // click dept checkbox (in tree)
  handleCheckedDept = (checkedDeptCdArray, imperfect) => {
    const { UserProps, UserActions } = this.props;
    // set checkedDeptCd
    this.props.DeptActions.changeCompVariableObject({
      compId: this.state.compId,
      valueObj: {checkedDeptCd: checkedDeptCdArray}
    });

    // show user list in dept.
    UserActions.readUserListPaged(UserProps, this.state.compId, {
      deptCd: checkedDeptCdArray, page:0
    }, {isResetSelect:true});
  }
    
  // click dept row (in tree)
  handleSelectDept = (selectedDeptObj) => {
    const { TotalRuleActions, DeptActions, UserActions } = this.props;
    const compId = this.state.compId;
    // change selected info in store
    DeptActions.changeTreeDataVariable({ compId: compId, name: 'selectedDept', value: selectedDeptObj });
    // close user inform
    UserActions.closeInform({ compId: compId });
    // Check selectedDeptCd
    DeptActions.changeCompVariableObject({
      compId: compId,
      valueObj: {
        viewItem: selectedDeptObj,
        informOpen: true
      }
    });
    
    TotalRuleActions.getAllClientUseRuleByDeptCd({ compId: compId, deptCd: selectedDeptObj.get('deptCd') });
  }
  
  // click user row (in list)
  handleSelectUser = (selectedUserObj) => {
    const { TotalRuleActions } = this.props;
    const { UserActions, DeptActions } = this.props;
    const compId = this.state.compId;

    // show user info.
    if(selectedUserObj) {
      // show user configurations.....
      TotalRuleActions.getAllClientUseRuleByUserId({ compId: compId, userId: selectedUserObj.get('userId') });
      // close dept infrom
      DeptActions.closeInform({ compId: compId });
      // show user inform pane.
      UserActions.showInform({ compId: compId, viewItem: selectedUserObj });
    }
  };

  // edit dept in tree
  handleEditDept = (treeNode) => { 
    this.props.DeptActions.showDialog({
      viewItem: treeNode,
      dialogType: DeptDialog.TYPE_EDIT
    });
  };

  // create dept in tree
  handleCreateDept = (event) => {
    const { t, i18n } = this.props;

    const deptCd = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'viewItem', 'deptCd']);
    if(deptCd && deptCd !== '') {
      this.props.DeptActions.showDialog({
        viewItem: {
          deptCd: '',
          deptNm: '',
        },
        dialogType: DeptDialog.TYPE_ADD
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectParentDept"));
    }
  }

  // check has group for delete
  isDeptRemovable = () => {
    let checkedDeptCd = getDataObjectVariableInComp(this.props.DeptProps, this.state.compId, 'checkedDeptCd');
    if(checkedDeptCd && checkedDeptCd.size > 0) {
      // except default item
      checkedDeptCd = checkedDeptCd.filter(e => (e !== 'DEPTDEFAULT'));
      return !(checkedDeptCd && checkedDeptCd.size > 0);
    } else {
      return true;
    }
  }

  handleDeleteButtonForDept = () => {
    const { t, i18n } = this.props;
    let checkedDeptCd = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'checkedDeptCd']);
    if(checkedDeptCd && checkedDeptCd.size > 0) {

      // except default item
      checkedDeptCd = checkedDeptCd.filter(e => (e !== 'DEPTDEFAULT'));

      this.props.GRConfirmActions.showCheckConfirm({
        confirmTitle: t("dtDeleteDept"),
        confirmMsg: t("msgDeletedDept", {deptCnt: checkedDeptCd.size}),
        confirmCheckMsg: t("lbDeleteInUser"),
        handleConfirmResult: (confirmValue, confirmObject, isChecked) => {
          if(confirmValue) {
            const { DeptProps, DeptActions } = this.props;
            const checkedDeptCd = getDataObjectVariableInComp(DeptProps, this.state.compId, 'checkedDeptCd');

            if(checkedDeptCd && checkedDeptCd.size > 0) {
              DeptActions.deleteSelectedDeptData({
                deptCds: checkedDeptCd.toArray(),
                isDeleteUser: isChecked
              }).then((reData) => {

                // get parent index
                const treeData = DeptProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData'])
                const parentIndexList = checkedDeptCd.map(e => {
                  const treeItem = treeData.find(function(item) {
                    return e === item.get('key');
                  });
                  return treeItem.get('parentIndex');
                }).sort().reverse();

                const uniqueParentIndexList = [...new Set(parentIndexList.toJS())];
                if(uniqueParentIndexList.length > 0) {
                  uniqueParentIndexList.forEach(e => {
                    this.handleResetTreeForDelete(e);
                  });
                }
                
                DeptActions.changeCompVariableObject({
                  compId: this.state.compId,
                  valueObj: {checkedDeptCd: []}
                });

                DeptActions.changeTreeDataVariable({
                  compId: this.state.compId, 
                  name: 'checked', 
                  value: []
                });

              });
            }
          }
        },
        confirmObject: null
      });
    }
  }

  // multiple rule change in depts
  handleApplyMultiDept = (event) => {
    this.props.DeptActions.showMultiDialog({
      multiDialogType: DeptMultiDialog.TYPE_EDIT
    });
  }

  // add user in dept
  handleAddUserInDept = (event) => {
    const { t, i18n } = this.props;
    const deptCd = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'viewItem', 'deptCd']);
    if(deptCd && deptCd !== '') {
      this.setState({
        isOpenUserSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectDeptForAddUser"));
    }
  }

  isUserChecked = () => {
    const checkedIds = this.props.UserProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    return !(checkedIds && checkedIds.size > 0);
  }

  handleMoveUserToDept = (event) => {
    const { t, i18n } = this.props;
    const checkedIds = this.props.UserProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    if(checkedIds && checkedIds.size > 0) {
      this.setState({
        isOpenDeptSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectUser"));
    }
  }

  isDeptSelected = () => {
    return (this.props.DeptProps.getIn(['viewItems', this.state.compId, 'viewItem', 'deptCd'])) ? false : true;
  }

  handleDeleteUserInDept = (event) => {
    const { t, i18n } = this.props;
    const { UserProps, DeptProps, GRConfirmActions } = this.props;
    const selectedDeptCd = DeptProps.getIn(['viewItems', this.state.compId, 'selectedDeptCd']);
    const selectedUsers = UserProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    if(selectedUsers && selectedUsers !== '') {
      GRConfirmActions.showConfirm({
        confirmTitle: t("lbDeleteUser"),
        confirmMsg: t("msgDeleteUser"),
        handleConfirmResult: this.handleDeleteUserInDeptConfirmResult,
        confirmObject: {
          selectedDeptCd: selectedDeptCd,
          selectedUsers: selectedUsers
        }
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectUser"));
    }
  }
  handleDeleteUserInDeptConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DeptProps, DeptActions, UserActions, UserProps } = this.props;
      DeptActions.deleteUsersInDept({
        users: paramObject.selectedUsers.join(',')
      }).then(() => {
        // show user list in dept.
        UserActions.readUserListPaged(UserProps, this.state.compId, {
          deptCd: paramObject.selectedDeptCd, page:0
        });
        // close dialog
        this.setState({ isOpenUserSelect: false });
      });
    }
  };

  handleUserSelectSave = (checkedUserIds) => {
    const { t, i18n } = this.props;
    const selectedDept = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'treeComp', 'selectedDept']);
    this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("lbChangeDeptForUser"),
        confirmMsg: t("msgChangeDeptForUser", {userCnt:checkedUserIds.size, deptNm:selectedDept.get('deptNm')}),
        handleConfirmResult: (confirmValue, paramObject) => {
          if(confirmValue) {
            const { DeptActions, DeptProps, UserActions, UserProps } = this.props;
            DeptActions.createUsersInDept({
                deptCd: paramObject.selectedDeptCd,
                users: paramObject.checkedUserIds.join(',')
            }).then((res) => {
              if(res && res.status && res.status.result === 'success') {
                // change dept node info as user count
                this.handleResetTreeForEdit();
                // show users list in dept
                UserActions.readUserListPaged(UserProps, this.state.compId, {
                  groupId: DeptProps.getIn(['viewItems', this.state.compId, 'checkedDeptCd']), 
                  page:0
                }, {isResetSelect:true});
                // close dialog
                this.setState({ isOpenUserSelect: false });
              }
            });
          }
        },
        confirmObject: {
          selectedDeptCd: selectedDept.get('deptCd'),
          checkedUserIds: checkedUserIds
        }
    });
  }

  handleDeptSelectSave = (selectedDept) => {
    const { t, i18n } = this.props;
    const checkedUserIds = this.props.UserProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    const { GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
        confirmTitle: t("lbChangeDeptForUser"),
        confirmMsg: t("msgChangeDeptForUser", {userCnt:checkedUserIds.size, deptNm:selectedDept.deptNm}),
        handleConfirmResult: (confirmValue, paramObject) => {
          if(confirmValue) {
            const { DeptActions, DeptProps, UserActions, UserProps } = this.props;
            DeptActions.createUsersInDept({
                deptCd: paramObject.selectedDeptCd,
                users: paramObject.selectedUsers.join(',')
            }).then((res) => {
              if(res && res.status && res.status.result === 'success') {
                // change dept node info as user count
                this.handleResetTreeForEdit();
                // show user list in dept.
                UserActions.readUserListPaged(UserProps, this.state.compId, {
                  deptCd: DeptProps.getIn(['viewItems', this.state.compId, 'checkedDeptCd']),
                  page:0
                });
              }
              // close dialog
              this.setState({ isOpenDeptSelect: false });
            });
          }
        },
        confirmObject: {
          selectedDeptCd: selectedDept.deptCd,
          selectedUsers: checkedUserIds
        }
    });
  }

  handleUserSelectionClose = () => {
    this.setState({
      isOpenUserSelect: false
    })
  }

  handleDeptSelectionClose = () => {
    this.setState({
      isOpenDeptSelect: false
    })
  }

  handleResetDeptTree = (listItem) => {
    const compId = this.state.compId;
    const { DeptProps, DeptActions } = this.props;

    // changed dept - re-select parentId of deptCd
    if(listItem.get('parentIndex') !== undefined) {
      const parentListItem = DeptProps.getIn(['viewItems', compId, 'treeComp', 'treeData', listItem.get('parentIndex')]);
      DeptActions.readChildrenDeptList(compId, parentListItem.get('key'), listItem.get('parentIndex'));
    } else {
      DeptActions.readChildrenDeptList(compId, 0, undefined);
    }
  }

  handleResetTreeForEdit = (index) => {
    // change group node info as client count
    this.props.DeptActions.getDeptNodeList({
      deptCds: this.props.DeptProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData']).map(e => (e.get('key'))).toJS(),
      compId: this.state.compId
    });
  }

  handleResetTreeForDelete = (index) => {
    // changed grpId - re-select parentId of grpId
    if(index !== undefined) {
      const parentListItem = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData', index]);
      this.props.DeptActions.readChildrenDeptList(this.state.compId, parentListItem.get('key'), index);
    } else {
      this.props.DeptActions.readChildrenDeptList(this.state.compId, 'DEPTDEFAULT', 0);
    }
  }

 
  handleCreateUserButton = value => {
    const { UserActions } = this.props;
    UserActions.showDialog({
      ruleSelectedViewItem: {
        userId: '',
        userNm: '',
        userPasswd: '',
        showPasswd: false,
        userEmail: '',
      },
      ruleDialogType: UserDialog.TYPE_ADD
    }, true);
  };

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;
    const compId = this.state.compId;

    const selectedDept = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'treeComp', 'selectedDept']);

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef',minWidth:320}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
              <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                <Grid item>
                  <Tooltip title={t("ttAddNewDept")}>
                    <span>
                    <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleCreateDept} disabled={this.isDeptSelected()} style={{marginRight: "5px"}} >
                      <AddIcon />
                    </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title={t("ttDeleteDept")}>
                    <span>
                    <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleDeleteButtonForDept} disabled={this.isDeptRemovable()} >
                      <RemoveIcon />
                    </Button>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={t("ttChangMultiDeptRule")}>
                    <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleApplyMultiDept} >
                      <TuneIcon />
                    </Button>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={t("ttAddUserInDept")}>
                    <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleAddUserInDept} disabled={this.isDeptSelected()} >
                      <AddIcon /><UserIcon />
                    </Button>
                    </span>
                  </Tooltip>
                  {/*
                  <Tooltip title={t("ttDeleteUserInDept")}>
                    <span>
                    <Button component="div" className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleDeleteUserInDept} disabled={this.isDeptSelected()} style={{marginLeft: "4px"}} >
                      <RemoveIcon /><UserIcon />
                    </Button>
                    </span>
                  </Tooltip>
                  */}
                </Grid>
              </Grid>
              </Toolbar>
              <DeptTreeComp compId={compId} 
                selectorType='multiple' 
                onCheck={this.handleCheckedDept} 
                onSelect={this.handleSelectDept}
                onEdit={this.handleEditDept}
                isEnableEdit={true}
                isActivable={true} 
              />
            </Grid>
            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                    <Tooltip title={t("ttMoveDept")}>
                    <span>
                      <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleMoveUserToDept} disabled={this.isUserChecked()} >
                        <MoveIcon /><DeptIcon />
                      </Button>
                    </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} style={{textAlign:'right'}}>
                    <Tooltip title={t("ttAddUser")}>
                    <span>
                      <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleCreateUserButton} style={{marginLeft: "4px"}}>
                        <AddIcon /><AccountIcon />
                      </Button>
                    </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>
              <UserListComp name='UserListComp' compId={compId} deptCd='' 
                onSelect={this.handleSelectUser}
                onMoveUserToDept={this.handleMoveUserToDept}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef'}} >
              <UserSpec compId={compId} />
              <DeptSpec compId={compId} />
            </Grid>
          </Grid>
        </GRPane>

        <UserDialog compId={compId} />
        <UserBasicDialog compId={compId} />

        <DeptDialog compId={compId} resetCallback={this.handleResetDeptTree} />
        <DeptMultiDialog compId={compId} />
        
        <UserSelectDialog isOpen={this.state.isOpenUserSelect}
          deptNm={(selectedDept !== undefined) ? selectedDept.get('deptNm') : ''}
          onSaveHandle={this.handleUserSelectSave} 
          onClose={this.handleUserSelectionClose} />
        <DeptSelectDialog isOpen={this.state.isOpenDeptSelect}
          isShowCheck={false}
          onSaveHandle={this.handleDeptSelectSave} 
          onClose={this.handleDeptSelectionClose} />

        <BrowserRuleDialog compId={compId} />
        <SecurityRuleDialog compId={compId} />
        <MediaRuleDialog compId={compId} />
        <SoftwareFilterDialog compId={compId} />
        <DesktopConfDialog compId={compId} isEnableDelete={false} />
        <DesktopAppDialog compId={compId} />

        <GRConfirm />
        <GRCheckConfirm />

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  DeptProps: state.DeptModule,
  UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),

  DeptActions: bindActionCreators(DeptActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch),

  TotalRuleActions: bindActionCreators(TotalRuleActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserMasterManage)));


