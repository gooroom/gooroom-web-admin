import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import AdminUserDialog from './AdminUserDialog';
import AdminRecordDialog from './AdminRecordDialog';

import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import ListIcon from '@material-ui/icons/List';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class AdminUserManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openRecordDialog: false,
      recordAdminId: ''
    };
  }

  columnHeaders = [
    { id: 'chAdminNm', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chAdminId', isOrder: true, numeric: false, disablePadding: true, label: '아이디' },
    { id: 'chStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
    { id: 'chRecord', isOrder: false, numeric: false, disablePadding: true, label: '작업이력' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleSelectRow = (event, id) => {
    const { AdminUserProps, AdminUserActions } = this.props;
    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    AdminUserActions.showDialog({
      viewItem: viewItem,
      dialogType: AdminUserDialog.TYPE_VIEW
    });
  };

  // show admin records
  handleShowRecord = (event, id) => {
    event.stopPropagation();
    this.setState({
      openRecordDialog: true,
      recordAdminId: id
    });
  };
  
  handleCloseRecord = (event, id) => {
    this.setState({
      openRecordDialog: false,
      recordAdminId: ''
    });
  };
      
  // create dialog
  handleCreateButton = () => {
    this.props.AdminUserActions.showDialog({
      viewItem: {
        adminId: ''
      },
      dialogType: AdminUserDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { AdminUserProps, AdminUserActions } = this.props;
    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    AdminUserActions.showDialog({
      viewItem: viewItem,
      dialogType: AdminUserDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { AdminUserProps, GRConfirmActions } = this.props;
    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    GRConfirmActions.showConfirm({
      confirmTitle: '관리자계정 삭제',
      confirmMsg: '관리자계정(' + viewItem.get('adminId') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { AdminUserProps, AdminUserActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      AdminUserActions.deleteAdminUserData({
        compId: compId,
        adminId: confirmObject.get('adminId')
      }).then(() => {
        AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.AdminUserActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { AdminUserProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listObj = AdminUserProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

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
              <Grid item xs={4} >
                <FormControl fullWidth={true}>
                  <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                </FormControl>
              </Grid>
              <Grid item xs={4} >
                <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
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
                keyId="adminId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('adminId'))}
                      key={n.get('adminId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('adminNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('adminId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('status')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.get('adminId'))}>
                          <BuildIcon />
                        </Button>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleDeleteClick(event, n.get('adminId'))}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleShowRecord(event, n.get('adminId'))}>
                          <ListIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
                  <TableRow key={e}>
                    <TableCell
                      colSpan={this.columnHeaders.length + 1}
                      className={classes.grSmallAndClickCell}
                    />
                  </TableRow>
                )}))}
              </TableBody>
            </Table>
            <TablePagination
              component='div'
              count={listObj.getIn(['listParam', 'rowsFiltered'])}
              rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
              rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
              page={listObj.getIn(['listParam', 'page'])}
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
        {/* dialog(popup) component area */}
        <AdminUserDialog compId={compId} />
        <AdminRecordDialog compId={compId} 
          isOpen={this.state.openRecordDialog} 
          adminId={this.state.recordAdminId} 
          onClose={this.handleCloseRecord} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminUserManage));
