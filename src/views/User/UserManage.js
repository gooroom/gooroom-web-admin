import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'modules/UserModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GRUtils/GRTableListUtils';

import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRConfirm from 'components/GRComponents/GRConfirm';

import UserDialog from "views/User/UserDialog";
import UserRuleDialog from "views/User/UserRuleDialog";

import UserRuleInform from "views/User/UserRuleInform";
import GRPane from "containers/GRContent/GRPane";
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserManage extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: "chUserId", isOrder: true, numeric: false, disablePadding: true, label: "아이디" },
    { id: "chUserNm", isOrder: true, numeric: false, disablePadding: true, label: "사용자이름" },
    { id: "chDeptName", isOrder: true, numeric: false, disablePadding: true, label: "조직" },
    { id: "chStatus", isOrder: true, numeric: false, disablePadding: true, label: "상태" },
    { id: "chLastLoginDt", isOrder: true, numeric: false, disablePadding: true, label: "최근로그인날짜" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    this.props.UserActions.readUserListPaged(this.props.UserProps, this.props.match.params.grMenuId, {page: page});
  };

  handleChangeRowsPerPage = event => {
    this.props.UserActions.readUserListPaged(this.props.UserProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.UserActions.readUserListPaged(this.props.UserProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleRowClick = (event, id) => {
    const { UserProps, UserActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const clickedRowObject = getRowObjectById(UserProps, compId, id, 'userId');
    const userId = clickedRowObject.get('userId');
    const newSelectedIds = setSelectedIdsInComp(UserProps, compId, id);

    // check select box
    UserActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
    
    // get browser rule info
    BrowserRuleActions.getBrowserRuleByUserId({ compId: compId, userId: userId });

    // get media control setting info
    MediaRuleActions.getMediaRuleByUserId({ compId: compId, userId: userId });

    // get client secu info
    SecurityRuleActions.getSecurityRuleByUserId({ compId: compId, userId: userId });

    // show user inform pane.
    UserActions.showInform({ compId: compId, selectedViewItem: clickedRowObject });
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
      dialogType: UserDialog.TYPE_ADD
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
      dialogType: UserDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { UserProps, GRConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(UserProps, this.props.match.params.grMenuId, id, 'userId');
    GRConfirmActions.showConfirm({
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
  handleKeywordChange = (name, value) => {
    this.props.UserActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleChangeUserStatusSelect = (value) => {
    this.props.UserActions.changeListParamData({
      name: 'status', 
      value: (value == 'ALL') ? '' : value,
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
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
            
              <Grid item xs={4} >
                <FormControl fullWidth={true}>
                  <UserStatusSelect onChangeSelect={this.handleChangeUserStatusSelect} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth={true}>
                  <KeywordOption handleKeywordChange={this.handleKeywordChange} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Button className={classes.GRIconSmallButton} variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); } } >
                <AddIcon />등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) && 
          <div>
            <Table>
              <GRCommonTableHead
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
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('deptNm')}</TableCell>
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
        </GRPane>
        <UserRuleInform compId={compId} />
        <UserDialog compId={compId} />
        <UserRuleDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserManage));

