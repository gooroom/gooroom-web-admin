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

import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRPageHeader from "containers/GRContent/GRPageHeader";

import GRTreeList from "components/GRTree/GRTreeList";
import GRPane from "containers/GRContent/GRPane";
import GRConfirm from 'components/GRComponents/GRConfirm';

import UserListComp from 'views/User/UserListComp';
import DeptRuleInform from "views/User/DeptRuleInform";
import DeptDialog from "views/User/DeptDialog";
import UserSelectDialog from "views/User/UserSelectDialog";

import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Toolbar from '@material-ui/core/Toolbar';

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

class DeptManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpenUserSelect: false,
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
  handleSelectDept = (node) => {
    const { DeptProps, DeptActions } = this.props;
    const { UserProps, UserActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;
    const compId = this.props.match.params.grMenuId;
    // show user list in dept.
    UserActions.readUserListPaged(UserProps, compId, {
      deptCd: node.key, page:0
    });
    // Check selectedDeptCd
    DeptActions.changeCompVariableObject({
      compId: compId,
      valueObj: {selectedDeptCd: node.key, selectedDeptNm: node.title}
    });

    // show rules
    // get browser rule info
    BrowserRuleActions.getBrowserRuleByDeptCd({
      compId: compId, deptCd: node.key
    });
    // get media control setting info
    MediaRuleActions.getMediaRuleByDeptCd({
      compId: compId, deptCd: node.key
    });
    // get client secu info
    SecurityRuleActions.getSecurityRuleByDeptCd({
      compId: compId, deptCd: node.key
    });

    // show user inform pane.
    UserActions.showInform({
      compId: compId, selectedViewItem: null
    });
  }

  handleCheckedDept = (checked, imperfect) => {
    //console.log('handleCheckedDept: checked ........ ', checked);
  }

  handleEditDept = (listItem, i) => { 
    this.props.DeptActions.showDialog({
      selectedViewItem: {
        deptCd: listItem.key,
        deptNm: listItem.title
      },
      dialogType: DeptDialog.TYPE_EDIT
    });
  };

  handleCreateButtonForDept = (event) => {
    const compId = this.props.match.params.grMenuId;
    const selectedDeptCd = this.props.DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);
    if(selectedDeptCd && selectedDeptCd !== '') {
      this.props.DeptActions.showDialog({
        selectedViewItem: {
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

  isUserAddible = () => {
    return (this.props.DeptProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedDeptCd'])) ? false : true;
  }

  handleDeleteUserInDept = (event) => {
    const { UserProps, DeptProps, GRConfirmActions } = this.props;
    const selectedDeptCd = DeptProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedDeptCd']);
    const selectedUsers = UserProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    if(selectedUsers && selectedUsers !== '') {
      GRConfirmActions.showConfirm({
        confirmTitle: '사용자 삭제',
        confirmMsg: '선택하신 사용자를 조직에서 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteUserInDeptConfirmResult,
        confirmOpen: true,
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
    const selectedDeptCd = this.props.DeptProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedDeptCd']);
    const { DeptProps, GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
        confirmTitle: '사용자 추가',
        confirmMsg: '사용자정보를 조직에 추가하시겠습니까?',
        handleConfirmResult: this.handleUserSelectSaveConfirmResult,
        confirmOpen: true,
        confirmObject: {
          selectedDeptCd: selectedDeptCd,
          selectedUsers: selectedUsers
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
      });
    }
  }

  handleUserSelectClose = () => {
    this.setState({
      isOpenUserSelect: false
    })
  }

  


  render() {
    const { classes } = this.props;
    const compId = this.props.match.params.grMenuId;

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>

          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >

            <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef'}} >
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleCreateButtonForDept} disabled={this.isUserAddible()} >
                  <AddIcon />등록
                </Button>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleDeleteButtonForDept} disabled={this.isUserAddible()} style={{marginLeft: "10px"}} >
                  <RemoveIcon />삭제
                </Button>
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
                compId={compId}
                onInitTreeData={this.handleInitTreeData}
                onSelectNode={this.handleSelectDept}
                onCheckedNode={this.handleCheckedDept}
                onEditNode={this.handleEditDept}
                onRef={ref => (this.grTreeList = ref)}
              />
            </Grid>

            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}} >
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleAddUserInDept} disabled={this.isUserAddible()} >
                  <AddIcon />추가
                </Button>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleDeleteUserInDept} disabled={this.isUserAddible()} style={{marginLeft: "10px"}} >
                  <RemoveIcon />삭제
                </Button>
              </Toolbar>
              <UserListComp name='UserListComp' compId={compId} deptCd='' />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef'}} >
              <DeptRuleInform compId={compId} />
            </Grid>

          </Grid>
        </GRPane>
        <DeptDialog compId={compId} resetCallback={this.handleResetDeptTree} />
        <UserSelectDialog isOpen={this.state.isOpenUserSelect} onSaveHandle={this.handleUserSelectSave} onClose={this.handleUserSelectClose} />
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
  DeptActions: bindActionCreators(DeptActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptManage));


