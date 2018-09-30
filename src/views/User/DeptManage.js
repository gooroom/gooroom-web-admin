import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as DeptActions from 'modules/DeptModule';
import * as UserActions from 'modules/UserModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrPageHeader from "containers/GrContent/GrPageHeader";

import GrTreeList from "components/GrTree/GrTreeList";
import GrPane from "containers/GrContent/GrPane";
import GrConfirm from 'components/GrComponents/GrConfirm';

import UserListComp from 'views/User/UserListComp';
import DeptDialog from "views/User/DeptDialog";
import UserSelectDialog from "views/User/UserSelectDialog";


import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

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
  
  handleSelectDept = (node) => {
    const { DeptProps, DeptActions } = this.props;
    const { UserProps, UserActions } = this.props;
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
  }

  handleCheckedDept = (checked, imperfect) => {
    //console.log('handleCheckedDept: checked ........ ', checked);
  }

  handleCreateButtonForDept = (event) => {
    const { DeptProps, DeptActions } = this.props;
    const compId = this.props.match.params.grMenuId;
    const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);
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
      })
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '사용자를 추가할 조직을 선택 하세요.');
    }
  }

  handleUserSelectSave = (selectedUsers) => {

    const selectedDeptCd = this.props.DeptProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedDeptCd']);

    console.log('handleUserSelectSave........................');

        console.log('deptCd : ' + selectedDeptCd);
        console.log('selectedUsers : ' + selectedUsers);

  }

  handleUserSelectClose = () => {
    this.setState({
      isOpenUserSelect: false
    })
  }

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { DeptProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const selectedDeptNm = DeptProps.getIn(['viewItems', compId, 'selectedDeptNm']);
    const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} style={{border: "1px sold red"}} />
        <GrPane>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Button size="small" variant="contained" color="primary" onClick={this.handleCreateButtonForDept} >
                <AddIcon />
                등록
              </Button>
              <Button size="small" variant="contained" color="primary" onClick={this.handleDeleteButtonForDept} style={{marginLeft: "10px"}} >
                <RemoveIcon />
                삭제
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} lg={4}>
              <Card className={classes.deptTreeCard}>
                <GrTreeList
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
                  onRef={ref => (this.grTreeList = ref)}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={8} lg={8}>
              <Card className={classes.deptInfoCard}>
                <CardContent>
                  <Typography className={classes.deptTitle} color="textSecondary">조직 정보</Typography>
                  <Typography variant="headline" component="h2">{selectedDeptNm}</Typography>
                  <Typography className={classes.deptCd} color="textSecondary">{bull} 부서코드 - {selectedDeptCd}</Typography>
                  <Typography component="p">{bull} {'"이 조직에 대한 설명 또는 상세 정보"'}</Typography>
                </CardContent>
              </Card>
              <Card className={classes.deptUserCard}>
                <CardContent>
                  <Grid container spacing={8}>
                  <Grid item xs={6} sm={6} lg={6}>
                  <Typography className={classes.deptTitle} color="textSecondary">사용자 정보</Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6}>
                  <Button size="small" variant="contained" color="primary" onClick={this.handleAddUserInDept} >
                  <AddIcon />
                    추가
                  </Button>
                  <Button size="small" variant="contained" color="primary" onClick={this.handleDeleteUserInDept} style={{marginLeft: "10px"}} >
                  <RemoveIcon />
                    삭제
                  </Button>
                  </Grid>
                  </Grid>
                  <UserListComp name='UserListComp' compId={compId} deptCd='' />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </GrPane>
        <DeptDialog compId={compId} resetCallback={this.handleResetDeptTree} />
        <GrConfirm />
        <UserSelectDialog isOpen={this.state.isOpenUserSelect} onSaveHandle={this.handleUserSelectSave} onClose={this.handleUserSelectClose} />
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
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(DeptManage));


