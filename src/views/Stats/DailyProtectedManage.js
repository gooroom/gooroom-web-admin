import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyProtectedActions from 'modules/DailyProtectedModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import DailyProtectedDialog from './DailyProtectedDialog';
import DailyProtectedSpec from './DailyProtectedSpec';
import { generateDailyProtectedObject } from './DailyProtectedSpec';

import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DailyProtectedManage extends Component {

  columnHeaders = [
    { id: 'LOG_SEQ', isOrder: false, numeric: false, disablePadding: true, label: '번호' },
    { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'USER_ID', isOrder: true, numeric: false, disablePadding: true, label: '사용자' },
    { id: 'LOG_TP', isOrder: true, numeric: false, disablePadding: true, label: '로그타입' },
    { id: 'LOG_VALUE', isOrder: true, numeric: false, disablePadding: true, label: '로그정보' },
    { id: 'REG_DT', isOrder: false, numeric: false, disablePadding: true, label: '등록일' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    DailyProtectedActions.readDailyProtectedListPaged(DailyProtectedProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    DailyProtectedActions.readDailyProtectedListPaged(DailyProtectedProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    DailyProtectedActions.readDailyProtectedListPaged(DailyProtectedProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    DailyProtectedActions.readDailyProtectedListPaged(DailyProtectedProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DailyProtectedActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id) => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(DailyProtectedProps, compId, id, 'logSeq');

    // choice one from two views.

    // 1. popup dialog
    // DailyProtectedActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: DailyProtectedDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    DailyProtectedActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
  };

  handleCreateButton = () => {
    this.props.DailyProtectedActions.showDialog({
      viewItem: Map(),
      dialogType: DailyProtectedDialog.TYPE_ADD
    });
  }
  
  handleEditListClick = (event, id) => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    const viewItem = getRowObjectById(DailyProtectedProps, this.props.match.params.grMenuId, id, 'logSeq');

    DailyProtectedActions.showDialog({
      viewItem: generateDailyProtectedObject(viewItem, false),
      dialogType: DailyProtectedDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { DailyProtectedProps, GRConfirmActions } = this.props;
    const viewItem = getRowObjectById(DailyProtectedProps, this.props.match.params.grMenuId, id, 'logSeq');
    GRConfirmActions.showConfirm({
      confirmTitle: '매체제어정책정보 삭제',
      confirmMsg: '매체제어정책정보(' + viewItem.get('logSeq') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DailyProtectedActions, DailyProtectedProps } = this.props;

      DailyProtectedActions.deleteDailyProtectedData({
        logSeq: paramObject.get('logSeq'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(DailyProtectedProps, DailyProtectedActions.readDailyProtectedListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DailyProtectedProps, compId, targetType);
    this.props.DailyProtectedActions.showDialog({
      viewItem: viewItem,
      dialogType: DailyProtectedDialog.TYPE_COPY
    });
  };

  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DailyProtectedProps, compId, targetType);
    this.props.DailyProtectedActions.showDialog({
      viewItem: generateDailyProtectedObject(viewItem, false),
      dialogType: DailyProtectedDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  handleParamChange = name => event => {
    this.props.DailyProtectedActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });

  };


  render() {
    const { classes } = this.props;
    const { DailyProtectedProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    const listObj = DailyProtectedProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={2} >
            <TextField label="조회시작일" type="date" style={{width:150}}
              value={(listObj && listObj.getIn(['listParam', 'fromDate'])) ? listObj.getIn(['listParam', 'fromDate']) : '1999-01-01'}
              onChange={this.handleParamChange('fromDate')}
              className={classes.fullWidth} />
            </Grid>
            <Grid item xs={2} >
            <TextField label="조회종료일" type="date" style={{width:150}}
              value={(listObj && listObj.getIn(['listParam', 'toDate'])) ? listObj.getIn(['listParam', 'toDate']) : '1999-01-01'}
              onChange={this.handleParamChange('toDate')}
              className={classes.fullWidth} />
            </Grid>
            <Grid item xs={3} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />조회
            </Button>
            </Grid>
          </Grid>            

          {/* data area */}
          {(listObj) &&
          <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="logSeq"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  return (
                    <TableRow hover key={n.get('logSeq')} >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('logSeq')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('clientId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('userId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('logTp')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} style={{width:400}}>{n.get('logValue')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD HH:mm')}</TableCell>
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
        {/* dialog(popup) component area */}
        <DailyProtectedSpec compId={compId} specType="inform" 
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          hasAction={true}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        </GRPane>
        <DailyProtectedDialog compId={compId} />
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  DailyProtectedProps: state.DailyProtectedModule
});

const mapDispatchToProps = (dispatch) => ({
  DailyProtectedActions: bindActionCreators(DailyProtectedActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyProtectedManage));



