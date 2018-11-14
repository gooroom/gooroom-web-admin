import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as DeptActions from 'modules/DeptModule';
import * as UserActions from 'modules/UserModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRPageHeader from "containers/GRContent/GRPageHeader";

import GRTreeList from "components/GRTree/GRTreeList";
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
import MoveIcon from '@material-ui/icons/Redo';
import TuneIcon from '@material-ui/icons/Tune';
import UserIcon from '@material-ui/icons/Person';
import AccountIcon from '@material-ui/icons/AccountBox';
import DeptIcon from '@material-ui/icons/WebAsset';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class UserMasterManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpenUserSelect: false,
      isOpenDeptSelect: false,
      selectedDept: {deptCd:'', deptNm:''}
    };
  }

  handleInitTreeData = () => {
    // Check selectedDeptCd
    this.props.DeptActions.changeCompVariableObject({
      compId: this.props.match.params.grMenuId,
      valueObj: {selectedDeptCd: '', selectedDeptNm: ''}
    });
  }

  // click dept row (in tree)
  handleCheckedDept = (checkedDeptCdArray, imperfect) => {
    const { UserProps, UserActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // Check selectedDeptCd
    this.props.DeptActions.changeCompVariableObject({
      compId: compId,
      valueObj: {checkedDeptCd: checkedDeptCdArray}
    });

    // show user list in dept.
    UserActions.readUserListPaged(UserProps, compId, {
      deptCd: checkedDeptCdArray.join(), page:0
    });
  }
    
  // click dept row (in tree)
  handleSelectDept = (node) => {
    const { DeptProps, DeptActions } = this.props;
    const { UserProps, UserActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions, SoftwareFilterActions, DesktopConfActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    this.setState({
      selectedDept: {deptCd:node.key, deptNm:node.title}
    });

    UserActions.closeInform({
      compId: compId
    });

    // show user list in dept.
    // UserActions.readUserListPaged(UserProps, compId, {
    //   deptCd: node.key, page:0
    // });

    // Check selectedDeptCd
    DeptActions.changeCompVariableObject({
      compId: compId,
      valueObj: {
        selectedDeptCd: node.key, selectedDeptNm: node.title,
        hasChildren: node.hasChildren
      }
    });

    // show rules
    // get browser rule info
    BrowserRuleActions.getBrowserRuleByDeptCd({ compId: compId, deptCd: node.key });
    // get media control setting info
    MediaRuleActions.getMediaRuleByDeptCd({ compId: compId, deptCd: node.key });
    // get client secu info
    SecurityRuleActions.getSecurityRuleByDeptCd({ compId: compId, deptCd: node.key });
    // get filtered software rule
    SoftwareFilterActions.getSoftwareFilterByDeptCd({ compId: compId, deptCd: node.key });   
    // get desktop conf info
    DesktopConfActions.getDesktopConfByDeptCd({ compId: compId, deptCd: node.key });

    // show Dept. inform pane.
    DeptActions.showInform({ compId: compId, viewItem: null });
  }
  
  handleEditDept = (listItem, i) => { 
    this.props.DeptActions.showDialog({
      viewItem: {
        deptCd: listItem.key,
        deptNm: listItem.title
      },
      dialogType: DeptDialog.TYPE_EDIT
    });
  };

  handleCreateButtonForDept = (event) => {
    // 이전에 선택되어진 내용 삭제
    const compId = this.props.match.params.grMenuId;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;
    BrowserRuleActions.deleteCompDataItem({ compId: compId, name: 'selectedOptionItemId', targetType: 'DEPT' });
    MediaRuleActions.deleteCompDataItem({ compId: compId, name: 'selectedOptionItemId', targetType: 'DEPT' });
    SecurityRuleActions.deleteCompDataItem({ compId: compId, name: 'selectedOptionItemId', targetType: 'DEPT' });

    const selectedDeptCd = this.props.DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);
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
      this.props.GlobalActions.showElementMsg(event.currentTarget, '상위 조직을 선택 하세요.');
    }
  }

  handleDeleteButtonForDept = (event) => {
    //this.props.GlobalActions.showElementMsg(event.currentTarget, '테스트 문장입니다.');
  }
  handleDeleteButtonForDeptConfirmResult = (confirmValue, confirmObject) => {
  }

  handleApplyMultiDept = (event) => {
    const compId = this.props.match.params.grMenuId;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;
    // 이전에 선택되어진 내용 삭제
    BrowserRuleActions.deleteCompDataItem({ compId: compId, name: 'selectedOptionItemId', targetType: 'DEPT' });
    MediaRuleActions.deleteCompDataItem({ compId: compId, name: 'selectedOptionItemId', targetType: 'DEPT' });
    SecurityRuleActions.deleteCompDataItem({ compId: compId, name: 'selectedOptionItemId', targetType: 'DEPT' });

    this.props.DeptActions.showMultiDialog({
      multiDialogType: DeptMultiDialog.TYPE_EDIT
    });
  }

  handleResetDeptTree = (deptCd) => {
    this.grTreeList.resetTreeNode(deptCd);
  }

  handleAddUserInDept = (event) => {
    const selectedDeptCd = this.props.DeptProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedDeptCd']);
    if(selectedDeptCd && selectedDeptCd !== '') {
      this.setState({
        isOpenUserSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '사용자를 추가할 조직을 선택하세요.');
    }
  }

  handleMoveUserToDept = (event) => {
    const checkedIds = this.props.UserProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(checkedIds && checkedIds.size > 0) {
      this.setState({
        isOpenDeptSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '사용자를 선택하세요.');
    }
  }

  isUserAddible = () => {
    return (this.props.DeptProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedDeptCd'])) ? false : true;
  }

  isUserChecked = () => {
    const checkedIds = this.props.UserProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    return (checkedIds && checkedIds.size > 0) ? false : true;
  }


  handleDeleteUserInDept = (event) => {
    const { UserProps, DeptProps, GRConfirmActions } = this.props;
    const selectedDeptCd = DeptProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedDeptCd']);
    const selectedUsers = UserProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(selectedUsers && selectedUsers !== '') {
      GRConfirmActions.showConfirm({
        confirmTitle: '사용자 삭제',
        confirmMsg: '선택하신 사용자를 조직에서 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteUserInDeptConfirmResult,
        confirmObject: {
          selectedDeptCd: selectedDeptCd,
          selectedUsers: selectedUsers
        }
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '사용자를 선택하세요.');
    }
  }
  handleDeleteUserInDeptConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DeptProps, DeptActions, UserActions, UserProps } = this.props;
      const compId = this.props.match.params.grMenuId;
      DeptActions.deleteUsersInDept({
        users: paramObject.selectedUsers.join(',')
      }).then(() => {
        // show user list in dept.
        UserActions.readUserListPaged(UserProps, compId, {
          deptCd: paramObject.selectedDeptCd, page:0
        });
        // close dialog
        this.setState({ isOpenUserSelect: false });
      });
    }
  };

  handleUserSelectSave = (selectedUsers) => {
    const selectedDept = this.state.selectedDept;
    const { DeptProps, GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
        confirmTitle: '사용자 조직 변경',
        confirmMsg: '선택한 사용자(' + selectedUsers.size + '명)를 조직(' + selectedDept.deptNm + ')으로 변경하시겠습니까?',
        handleConfirmResult: this.handleUserSelectSaveConfirmResult,
        confirmObject: {
          selectedDeptCd: selectedDept.deptCd,
          selectedUsers: selectedUsers
        }
    });
  }
  handleDeptSelectSave = (selectedDept) => {
    const checkedUserIds = this.props.UserProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    const { DeptProps, GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
        confirmTitle: '사용자 조직 변경',
        confirmMsg: '선택한 사용자(' + checkedUserIds.size + '명)를 조직(' + selectedDept.deptNm + ')으로 변경하시겠습니까?',
        handleConfirmResult: this.handleUserSelectSaveConfirmResult,
        confirmObject: {
          selectedDeptCd: selectedDept.deptCd,
          selectedUsers: checkedUserIds
        }
    });
  }
  handleUserSelectSaveConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DeptProps, DeptActions, UserActions, UserProps } = this.props;
      const compId = this.props.match.params.grMenuId;
      DeptActions.createUsersInDept({
          deptCd: paramObject.selectedDeptCd,
          users: paramObject.selectedUsers.join(',')
      }).then((res) => {
        // show user list in dept.
        UserActions.readUserListPaged(UserProps, compId, {
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

  // Select User Item
  handleUserSelect = (selectedUserObj, selectedUserIdArray) => {
    const { UserActions, DeptActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions, SoftwareFilterActions, DesktopConfActions } = this.props;

    const compId = this.props.match.params.grMenuId;

    // show user info.
    if(selectedUserObj) {
      const userId = selectedUserObj.get('userId');

      DeptActions.closeInform({
        compId: compId
      });

      // show user configurations.....
      // get browser rule info
      BrowserRuleActions.getBrowserRuleByUserId({ compId: compId, userId: userId });
      // get media control setting info
      MediaRuleActions.getMediaRuleByUserId({ compId: compId, userId: userId });
      // get client secu info
      SecurityRuleActions.getSecurityRuleByUserId({ compId: compId, userId: userId });
      // get filtered software rule
      SoftwareFilterActions.getSoftwareFilterByUserId({ compId: compId, userId: userId });   

      // get desktop conf info
      DesktopConfActions.getDesktopConfByUserId({ compId: compId, userId: userId });
      
      
      // show user inform pane.
      UserActions.showInform({ compId: compId, viewItem: selectedUserObj });
      
    }
  };

  handleCreateUserButton = value => {
    const { UserActions } = this.props;
    UserActions.showDialog({
      ruleSelectedViewItem: {
        userId: '',
        userNm: '',
        userPasswd: '',
        showPasswd: false
      },
      ruleDialogType: UserDialog.TYPE_ADD
    }, true);
  };


  render() {
    const { classes } = this.props;
    const compId = this.props.match.params.grMenuId;

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>

          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={12} sm={5} style={{border: '0px solid #efefef'}} >
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                  <Grid item>
                    <Tooltip title="신규조직등록">
                      <span>
                      <Button className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleCreateButtonForDept} disabled={this.isUserAddible()} >
                        <AddIcon /><DeptIcon />
                      </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="조직삭제">
                      <span>
                      <Button className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleDeleteButtonForDept} disabled={this.isUserAddible()} style={{marginLeft: "4px"}} >
                        <RemoveIcon /><DeptIcon />
                      </Button>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="조직정책 일괄변경">
                      <span>
                      <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleApplyMultiDept} >
                        <TuneIcon />
                      </Button>
                      </span>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="조직에 사용자 추가">
                      <span>
                      <Button component="div" className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleAddUserInDept} disabled={this.isUserAddible()} >
                        <AddIcon /><UserIcon />
                      </Button>
                      </span>
                    </Tooltip>
                    {/*
                    <Tooltip title="조직에서 사용자 삭제">
                      <span>
                      <Button component="div" className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleDeleteUserInDept} disabled={this.isUserAddible()} style={{marginLeft: "4px"}} >
                        <RemoveIcon /><UserIcon />
                      </Button>
                      </span>
                    </Tooltip>
                    */}
                  </Grid>
                </Grid>
              </Toolbar>
              <GRTreeList
                useFolderIcons={true}
                listHeight='24px'
                url='readChildrenDeptList'
                paramKeyName='deptCd'
                rootKeyValue='0'
                keyName='key'
                title='title'
                startingDepth='2'
                hasSelectChild={false}
                hasSelectParent={false}
                compId={compId}
                isEnableEdit={true}
                onInitTreeData={this.handleInitTreeData}
                onSelectNode={this.handleSelectDept}
                onCheckedNode={this.handleCheckedDept}
                onEditNode={this.handleEditDept}
                onRef={ref => (this.grTreeList = ref)}
              />
            </Grid>

            <Grid item xs={12} sm={7} style={{border: '0px solid #efefef'}} >
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={0} alignItems="center" direction="row" justify="flex-end">
                    <Tooltip title="부서이동">
                      <span>
                      <Button className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.handleMoveUserToDept} disabled={this.isUserChecked()} >
                        <MoveIcon /><DeptIcon />
                      </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="신규사용자 생성">
                      <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleCreateUserButton} style={{marginLeft: "4px"}}>
                        <AddIcon /><AccountIcon />
                      </Button>
                    </Tooltip>
                </Grid>
              </Toolbar>
              <UserListComp name='UserListComp' compId={compId} deptCd='' 
                onSelect={this.handleUserSelect}
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
        <DesktopConfDialog compId={compId} />
        <DesktopAppDialog compId={compId} />

        <GRConfirm />

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule,
  DeptProps: state.DeptModule,
  UserProps: state.UserModule,
  BrowserRuleProps: state.BrowserRuleModule,
  MediaRuleProps: state.MediaRuleModule,
  SecurityRuleProps: state.SecurityRuleModule,
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  DeptActions: bindActionCreators(DeptActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserMasterManage));


