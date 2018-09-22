import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'modules/UserModule';

import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getDataObjectInComp, getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GrUtils/GrTableListUtils';

import { getMergedObject, arrayContainsArray, getListParam, getListData, getViewItem, getMergedArray } from 'components/GrUtils/GrCommonUtils';

import UserStatusSelect from "views/Options/UserStatusSelect";

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrConfirm from 'components/GrComponents/GrConfirm';

import UserManageDialog from "views/User/UserManageDialog";
import UserManageInform from "views/User/UserManageInform";
import GrPane from "containers/GrContent/GrPane";
import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';



import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserManage extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: "chUserId", isOrder: true, numeric: false, disablePadding: true, label: "아이디" },
    { id: "chUserName", isOrder: true, numeric: false, disablePadding: true, label: "사용자이름" },
    { id: "chStatus", isOrder: true, numeric: false, disablePadding: true, label: "상태" },
    { id: "chLastLoginDt", isOrder: true, numeric: false, disablePadding: true, label: "최근로그인날짜" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { UserActions, UserProps } = this.props;
    UserActions.readUserListPaged(UserProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { UserActions, UserProps } = this.props;
    UserActions.readUserListPaged(UserProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, 
      page:0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { UserActions, UserProps } = this.props;
    let orderDir = "desc";
    if (currOrderDir === "desc") {
      orderDir = "asc";
    }
    UserActions.readUserListPaged(UserProps, this.props.match.params.grMenuId, {
      orderColumn: property, 
      orderDir: orderDir
    });
  };

  handleRowClick = (event, id) => {
    const { UserProps, UserActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const clickedRowObject = getRowObjectById(UserProps, compId, id, 'userId');
    const newSelectedIds = setSelectedIdsInComp(UserProps, compId, id);

    UserActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    UserActions.showInform({
      compId: compId,
      selectedViewItem: clickedRowObject,
    });
  };

  handleSelectBtnClick = () => {
    const { UserActions, UserProps } = this.props;
    UserActions.readUserListPaged(UserProps, this.props.match.params.grMenuId);
  };





  handleCreateButton = value => {
    const { UserActions } = this.props;
    UserActions.showDialog({
      selectedViewItem: {
        userId: '',
        userNm: '',
        userPassword: '',
        showPassword: false
      },
      dialogType: UserManageDialog.TYPE_ADD
    });
  };
  
  handleSelectAllClick = (event, checked) => {
    const { UserActions, UserProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const newSelectedIds = setAllSelectedIdsInComp(UserProps, compId, 'userId', checked);

    UserActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };
  
  
  isSelected = id => {
    const { UserProps } = this.props;
    const selectedIds = getDataObjectVariableInComp(UserProps, this.props.match.params.grMenuId, 'selectedIds');

    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
  }
  
  handleEditClick = (event, id) => { 
    const { UserProps, UserActions } = this.props;
    const selectedViewItem = getRowObjectById(UserProps, this.props.match.params.grMenuId, id, 'userId');
    UserActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: UserManageDialog.TYPE_EDIT
    });



    // const { UserProps, UserActions } = this.props;
    // const compId = this.props.match.params.grMenuId;

    // const listData = getListData({ props: UserProps, compId: compId });
    // const selectedViewItem = listData.find(function(element) {
    //   return element.userId == id;
    // });

    // UserActions.showDialog({
    //   compId: compId,
    //   selectedViewItem: {
    //     userId: selectedViewItem.userId,
    //     userName: selectedViewItem.userNm,
    //     userPassword: selectedViewItem.userPasswd
    //   },
    //   dialogType: UserManageDialog.TYPE_EDIT,
    // });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { UserProps, GrConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(UserProps, this.props.match.params.grMenuId, id, 'userId');
    GrConfirmActions.showConfirm({
      confirmTitle: '사용자정보 삭제',
      confirmMsg: '사용자정보(' + selectedViewItem.get('userNm') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { UserProps, UserActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      UserActions.deleteUserData({
        compId: compId,
        userId: confirmObject.get('userId')
      }).then(() => {
        UserActions.readUserListPaged(UserProps, compId);
      });
    }
  };


  // .................................................
  handleKeywordChange = name => event => {
    this.props.UserActions.changeListParamData({
      name: 'keyword', 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleChangeUserStatusSelect = (event) => {
    this.props.UserActions.changeListParamData({
      name: 'status', 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });
  }
  
  render() {
    const { classes } = this.props;
    const { UserProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;//UserProps.listParam.rowsPerPage - UserProps.listData.length;
    const listObj = UserProps.getIn(['viewItems', compId]);

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
            
              <Grid item xs={4} >
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="user-status">사용자상태</InputLabel>
                  <UserStatusSelect onChangeSelect={this.handleChangeUserStatusSelect} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth={true}>
                  <TextField id='keyword' label='검색어' onChange={this.handleKeywordChange('keyword')} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Button size="small" variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                  <Search />
                  조회
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button size="small" variant="contained" color="primary"
                onClick={() => {
                  this.handleCreateButton();
                }}
              >
                <AddIcon />
                등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) && 
          <div>
            <Table>
              <GrCommonTableHead
                classes={classes}
                keyId="userId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                onSelectAllClick={this.handleSelectAllClick}
                selectedIds={listObj.get('selectedIds')}
                listData={listObj.get('listData')}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  const isSelected = this.isSelected(n.get('userId'));
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.get('userId'))}
                      role="checkbox"
                      aria-checked={isSelected}
                      key={n.get('userId')}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                        <Checkbox checked={isSelected} className={classes.grObjInCell} />
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('userId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('userNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('status')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('lastLoginDt'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditClick(event, n.get('userId'))}>
                          <BuildIcon />
                        </Button>
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('userId'))}>
                          <DeleteIcon />
                        </Button>

                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell
                      colSpan={this.columnHeaders.length + 1}
                      className={classes.grSmallAndClickCell}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component='div'
              count={listObj.getIn(['listParam', 'rowsFiltered'])}
              rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
              rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
              page={listObj.getIn(['listParam', 'page'])}
              labelDisplayedRows={() => {return ''}}
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </div>
          }
        </GrPane>
        <UserManageInform compId={compId} />
        <UserManageDialog compId={compId} />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(UserManage));

