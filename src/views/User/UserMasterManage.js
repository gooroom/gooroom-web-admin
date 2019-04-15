import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as DeptActions from 'modules/DeptModule';
import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import * as TotalRuleActions from 'modules/TotalRuleModule';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import DeptTreeComp from 'views/User/DeptTreeComp';

import GRPane from "containers/GRContent/GRPane";
import GRConfirm from 'components/GRComponents/GRConfirm';

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
import { translate, Trans } from "react-i18next";

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
      deptCd: checkedDeptCdArray.join(), page:0
    });
  }
    
  // click dept row (in tree)
  handleSelectDept = (selectedDeptObj) => {
    const { TotalRuleActions } = this.props;
    const { DeptActions, UserActions } = this.props;
    const compId = this.state.compId;
    // change selected info in state
    this.setState({
      selectedDept: {deptCd:selectedDeptObj.get('deptCd'), deptNm:selectedDeptObj.get('deptNm')}
    });
    // close user inform
    UserActions.closeInform({ compId: compId });
    // Check selectedDeptCd
    DeptActions.changeCompVariableObject({
      compId: compId,
      valueObj: {
        selectedDeptCd: selectedDeptObj.get('deptCd'), selectedDeptNm: selectedDeptObj.get('deptNm'),
        hasChildren: selectedDeptObj.get('hasChildren')
      }
    });

    TotalRuleActions.getAllClientUseRuleByDeptCd({ compId: compId, deptCd: selectedDeptObj.get('deptCd') });

    // show Dept. inform pane.
    DeptActions.showInform({ compId: compId, viewItem: null });
  }
  
  // Select User Item
  handleSelectUser = (selectedUserObj, selectedUserIdArray) => {
    const { TotalRuleActions } = this.props;
    const { UserActions, DeptActions } = this.props;
    const compId = this.state.compId;

    // show user info.
    if(selectedUserObj) {
      const userId = selectedUserObj.get('userId');
      DeptActions.closeInform({
        compId: compId
      });

      // show user configurations.....
      TotalRuleActions.getAllClientUseRuleByUserId({ compId: compId, userId: userId });
      
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

    const selectedDeptCd = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'selectedDeptCd']);
    if(selectedDeptCd && selectedDeptCd !== '') {
      this.props.DeptActions.showDialog({
        viewItem: {
          deptCd: '',
          deptNm: '',
          selectedDeptCd: selectedDeptCd
        },
        dialogType: DeptDialog.TYPE_ADD
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectParentDept"));
    }
  }

  handleDeleteButtonForDept = (event) => {
    //this.props.GlobalActions.showElementMsg(event.currentTarget, '테스트 문장입니다.');
  }
  handleDeleteButtonForDeptConfirmResult = (confirmValue, confirmObject) => {
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
    const selectedDeptCd = this.props.DeptProps.getIn(['viewItems', this.state.compId, 'selectedDeptCd']);
    if(selectedDeptCd && selectedDeptCd !== '') {
      this.setState({
        isOpenUserSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectDeptForAddUser"));
    }
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

  isUserSelected = () => {
    return (this.props.DeptProps.getIn(['viewItems', this.state.compId, 'selectedDeptCd'])) ? false : true;
  }

  isUserChecked = () => {
    const checkedIds = this.props.UserProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    return !(checkedIds && checkedIds.size > 0);
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

  handleUserSelectSave = (selectedUsers) => {
    const { t, i18n } = this.props;
    const selectedDept = this.state.selectedDept;
    const { DeptProps, GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
        confirmTitle: t("lbChangeDeptForUser"),
        confirmMsg: t("msgChangeDeptForUser", {userCnt:selectedUsers.size, deptNm:selectedDept.deptNm}),
        handleConfirmResult: this.handleUserSelectSaveConfirmResult,
        confirmObject: {
          selectedDeptCd: selectedDept.deptCd,
          selectedUsers: selectedUsers
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
        handleConfirmResult: this.handleUserSelectSaveConfirmResult,
        confirmObject: {
          selectedDeptCd: selectedDept.deptCd,
          selectedUsers: checkedUserIds
        }
    });
  }
  handleUserSelectSaveConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DeptActions, UserActions, UserProps } = this.props;
      DeptActions.createUsersInDept({
          deptCd: paramObject.selectedDeptCd,
          users: paramObject.selectedUsers.join(',')
      }).then((res) => {
        // show user list in dept.
        UserActions.readUserListPaged(UserProps, this.state.compId, {
          deptCd: paramObject.selectedDeptCd, page:0
        });
        // close dialog
        this.setState({ isOpenUserSelect: false });
        this.setState({ isOpenDeptSelect: false });
      });
    }
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
                    <Button className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleCreateDept} disabled={this.isUserSelected()} >
                      <AddIcon /><DeptIcon />
                    </Button>
                    </span>
                  </Tooltip>
                  {/**
                  <Tooltip title={t("ttDeleteDept")}>
                    <span>
                    <Button className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleDeleteButtonForDept} disabled={this.isUserSelected()} style={{marginLeft: "4px"}} >
                      <RemoveIcon /><DeptIcon />
                    </Button>
                    </span>
                  </Tooltip>
                  */}
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
                    <Button component="div" className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleAddUserInDept} disabled={this.isUserSelected()} >
                      <AddIcon /><UserIcon />
                    </Button>
                    </span>
                  </Tooltip>
                  {/*
                  <Tooltip title={t("ttDeleteUserInDept")}>
                    <span>
                    <Button component="div" className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleDeleteUserInDept} disabled={this.isUserSelected()} style={{marginLeft: "4px"}} >
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
              />
            </Grid>
            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                    <Tooltip title={t("ttMoveDept")}>
                    <span>
                      <Button className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleMoveUserToDept} disabled={this.isUserChecked()} >
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
          selectedDept={this.state.selectedDept}
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


