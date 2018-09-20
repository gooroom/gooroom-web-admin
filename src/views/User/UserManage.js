import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'modules/UserModule';

import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject, arrayContainsArray, getListParam, getListData, getViewItem, getMergedArray } from 'components/GrUtils/GrCommonUtils';

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
//  ## Header ########## ########## ########## ########## ########## 
//
class UserManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "chUserId", isOrder: true, numeric: false, disablePadding: true, label: "아이디" },
    { id: "chUserName", isOrder: true, numeric: false, disablePadding: true, label: "사용자이름" },
    { id: "chStatus", isOrder: true, numeric: false, disablePadding: true, label: "상태" },
    { id: "chLastLoginDt", isOrder: true, numeric: false, disablePadding: true, label: "최근로그인날짜" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  render() {
    const { classes } = this.props;
    const { 
      onSelectAllClick, 
      orderDir, 
      orderColumn,
      selectedData,
      listData 
    } = this.props;

    let checkSelection = 0;
    if(listData && listData.length > 0) {
      checkSelection = arrayContainsArray(selectedData, listData.map(x => x.userId));
    }

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" className={classes.grSmallAndHeaderCell}>
            <Checkbox
              indeterminate={checkSelection === 50}
              checked={checkSelection === 100}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {UserManageHead.columnData.map(column => {
            return (
              <TableCell
                className={classes.grSmallAndHeaderCell}
                key={column.id}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(() => {
                if(column.isOrder) {
                  return <TableSortLabel active={orderColumn === column.id}
                            direction={orderDir}
                            onClick={this.createSortHandler(column.id)}
                          >{column.label}</TableSortLabel>
                } else {
                  return <p>{column.label}</p>
                }
              })()}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}


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
    UserActions.readUserList(UserProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { UserActions, UserProps } = this.props;
    UserActions.readUserList(UserProps, this.props.match.params.grMenuId, {
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
    UserActions.readUserList(ClientManagePropsget, this.props.match.params.grMenuId, {
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

    UserActions.showClientManageInform({
      compId: compId,
      selectedViewItem: clickedRowObject,
    });
  };

  handleSelectBtnClick = () => {
    const { UserActions, UserProps } = this.props;
    UserActions.readUserList(UserProps, this.props.match.params.grMenuId);
  };





  handleCreateButton = value => {
    const { UserActions } = this.props;
    UserActions.showDialog({
      selectedViewItem: {
        userId: '',
        userName: '',
        userPassword: '',
        showPassword: false
      },
      dialogType: UserManageDialog.TYPE_ADD
    });
  };
  
  handleSelectAllClick = (event, checked) => {
    const { UserProps, UserActions } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    const viewItem = getViewItem({ props: UserProps, compId: compId });
    const newSelected = viewItem.listData.map(n => n.userId);
    const oldSelected = (viewItem.selected) ? (viewItem.selected) : [];

    UserActions.changeStoreData({
      name: 'selected',
      value: getMergedArray(oldSelected, newSelected, checked),
      compId: compId
    });
  };
  
  
  isSelected = id => {
    const { UserProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const viewItem = getViewItem({ props: UserProps, compId: compId });

    return (viewItem.selected) ? (viewItem.selected.indexOf(id) !== -1) : false;
  }
  
  handleEditClick = (event, id) => { 
    const { UserProps, UserActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listData = getListData({ props: UserProps, compId: compId });
    const selectedViewItem = listData.find(function(element) {
      return element.userId == id;
    });

    UserActions.showDialog({
      compId: compId,
      selectedViewItem: {
        userId: selectedViewItem.userId,
        userName: selectedViewItem.userNm,
        userPassword: selectedViewItem.userPasswd
      },
      dialogType: UserManageDialog.TYPE_EDIT,
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { UserProps, UserActions, GrConfirmActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listData = getListData({ props: UserProps, compId: compId });
    const selectedViewItem = listData.find(function(element) {
      return element.userId == id;
    });

    const re = GrConfirmActions.showConfirm({
      confirmTitle: '사용자정보 삭제',
      confirmMsg: '사용자정보(' + selectedViewItem.userId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { UserProps, UserActions } = this.props;

      UserActions.deleteUserData({
        userId: paramObject.userId
      }).then((res) => {

        const { editingCompId, viewItems } = UserProps;
        viewItems.forEach((element) => {
          if(element && element.listParam) {
            UserActions.readUserList(getMergedObject(element.listParam, {
              compId: element._COMPID_
            }));
          }
        });
      }, () => {
      });
    }
  };


  // .................................................
  handleKeywordChange = name => event => {
    const { UserActions, UserProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listParam = getListParam({ props: UserProps, compId: compId });
    UserActions.changeStoreData({
      name: 'listParam',
      value: getMergedObject(listParam, {keyword: event.target.value}),
      compId: compId
    });
  }
  
  render() {
    const { classes } = this.props;
    const { UserProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;//UserProps.listParam.rowsPerPage - UserProps.listData.length;

    const viewItem = getViewItem({ props: UserProps, compId: compId });

    const listData = (viewItem) ? viewItem.listData : [];
    const listParam = (viewItem) ? viewItem.listParam : UserProps.defaultListParam;
    const orderDir = (viewItem && viewItem.listParam) ? viewItem.listParam.orderDir : UserProps.defaultListParam.orderDir;
    const orderColumn = (viewItem && viewItem.listParam) ? viewItem.listParam.orderColumn : UserProps.defaultListParam.orderColumn;
    const selected = (viewItem && viewItem.selected) ? viewItem.selected : [];

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
              
              <Grid item xs={6}>
                <FormControl fullWidth={true}>
                  <TextField
                    id="keyword"
                    label="검색어"
                    value={this.state.keyword}
                    onChange={this.handleKeywordChange("keyword")}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => this.handleSelectBtnClick() }
                >
                  <Search />
                  조회
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button
                size="small"
                variant="contained"
                color="primary"
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
          <div>
            <Table>

              <UserManageHead
                classes={classes}
                onSelectAllClick={this.handleSelectAllClick}
                orderDir={orderDir}
                orderColumn={orderColumn}
                onRequestSort={this.handleChangeSort}
                selectedData={selected}
                listData={listData}
              />

              <TableBody>
                {listData.map(n => {
                  const isSelected = this.isSelected(n.userId);
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.userId)}
                      role="checkbox"
                      aria-checked={isSelected}
                      key={n.userId}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                        <Checkbox checked={isSelected} className={classes.grObjInCell} />
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.userId}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.userNm}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.status}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.lastLoginDt, 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.regDate, 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditClick(event, n.userId)}>
                          <BuildIcon />
                        </Button>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.userId)}>
                          <DeleteIcon />
                        </Button>

                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell
                      colSpan={UserManageHead.columnData.length + 1}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component="div"
            count={listParam.rowsFiltered}
            rowsPerPage={listParam.rowsPerPage}
            rowsPerPageOptions={listParam.rowsPerPageOptions}
            page={listParam.page}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />

        </GrPane>
        <UserManageInform compId={compId} />
        <UserManageDialog />
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

