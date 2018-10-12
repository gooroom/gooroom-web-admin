import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GcspManageActions from 'modules/GcspManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';
import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import GcspDialog from './GcspDialog';

import GrPane from 'containers/GrContent/GrPane';

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
import { GrCommonStyle } from 'templates/styles/GrStyles';

class GcspManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openRecordDialog: false,
      recordAdminId: ''
    };
  }

  columnHeaders = [
    { id: 'chGcspNm', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chGcspId', isOrder: true, numeric: false, disablePadding: true, label: '아이디' },
    { id: 'chStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'chRegDt', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
    { id: 'chRecord', isOrder: false, numeric: false, disablePadding: true, label: '작업이력' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId);
  };
  
  handleRowClick = (event, id) => {
    const { GcspManageProps, GcspManageActions } = this.props;
    const selectedViewItem = getRowObjectById(GcspManageProps, this.props.match.params.grMenuId, id, 'gcspId');
    GcspManageActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: GcspDialog.TYPE_VIEW
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
    this.props.GcspManageActions.showDialog({
      selectedViewItem: {
        gcspId: '',
        certGubun: 'cert1'
      },
      dialogType: GcspDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { GcspManageProps, GcspManageActions } = this.props;
    const selectedViewItem = getRowObjectById(GcspManageProps, this.props.match.params.grMenuId, id, 'gcspId');
    GcspManageActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: GcspDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { GcspManageProps, GrConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(GcspManageProps, this.props.match.params.grMenuId, id, 'gcspId');
    GrConfirmActions.showConfirm({
      confirmTitle: '관리자계정 삭제',
      confirmMsg: '관리자계정(' + selectedViewItem.get('gcspId') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { GcspManageProps, GcspManageActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      GcspManageActions.deleteAdminUserData({
        compId: compId,
        gcspId: confirmObject.get('gcspId')
      }).then(() => {
        GcspManageActions.readGcspListPaged(GcspManageProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.GcspManageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { GcspManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listObj = GcspManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
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
                <Button size="small" variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button size="small" variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
                <AddIcon />등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) &&
            <div>
            <Table>
              <GrCommonTableHead
                classes={classes}
                keyId="gcspId"
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
                      onClick={event => this.handleRowClick(event, n.get('gcspId'))}
                      key={n.get('gcspId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('gcspNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('gcspId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('statusCd')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.get('gcspId'))}>
                          <BuildIcon />
                        </Button>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleDeleteClick(event, n.get('gcspId'))}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleShowRecord(event, n.get('gcspId'))}>
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
        </GrPane>
        {/* dialog(popup) component area */}
        <GcspDialog compId={compId} />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  GcspManageProps: state.GcspManageModule
});

const mapDispatchToProps = (dispatch) => ({
  GcspManageActions: bindActionCreators(GcspManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(GcspManage));
