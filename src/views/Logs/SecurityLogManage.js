import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SecurityLogActions from 'modules/SecurityLogModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";
import ProtectionTypeSelect from "views/Options/ProtectionTypeSelect";

import SecurityLogDialog from './SecurityLogDialog';
import SecurityLogSpec from './SecurityLogSpec';
import { generateSecurityLogObject } from './SecurityLogSpec';

import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import InputLabel from '@material-ui/core/InputLabel';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class SecurityLogManage extends Component {

  columnHeaders = [
    { id: 'LOG_SEQ', isOrder: false, numeric: false, disablePadding: true, label: '번호' },
    { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'USER_ID', isOrder: true, numeric: false, disablePadding: true, label: '사용자' },
    { id: 'LOG_TP', isOrder: true, numeric: false, disablePadding: true, label: '로그타입' },
    { id: 'LOG_VALUE', isOrder: true, numeric: false, disablePadding: true, label: '로그정보' },
    { id: 'EXTRA_INFO', isOrder: false, numeric: false, disablePadding: true, label: '추가정보' },
    { id: 'REG_DT', isOrder: false, numeric: false, disablePadding: true, label: '등록일' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { SecurityLogActions, SecurityLogProps } = this.props;
    SecurityLogActions.readSecurityLogListPaged(SecurityLogProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { SecurityLogActions, SecurityLogProps } = this.props;
    SecurityLogActions.readSecurityLogListPaged(SecurityLogProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { SecurityLogActions, SecurityLogProps } = this.props;
    SecurityLogActions.readSecurityLogListPaged(SecurityLogProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { SecurityLogActions, SecurityLogProps } = this.props;
    SecurityLogActions.readSecurityLogListPaged(SecurityLogProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.SecurityLogActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id) => {
    const { SecurityLogActions, SecurityLogProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(SecurityLogProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // SecurityLogActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: SecurityLogDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    SecurityLogActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
  };

  handleCreateButton = () => {
    this.props.SecurityLogActions.showDialog({
      viewItem: Map(),
      dialogType: SecurityLogDialog.TYPE_ADD
    });
  }
  
  handleEditListClick = (event, id) => {
    const { SecurityLogActions, SecurityLogProps } = this.props;
    const viewItem = getRowObjectById(SecurityLogProps, this.props.match.params.grMenuId, id, 'objId');

    SecurityLogActions.showDialog({
      viewItem: generateSecurityLogObject(viewItem, false),
      dialogType: SecurityLogDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { SecurityLogProps, GRConfirmActions } = this.props;
    const viewItem = getRowObjectById(SecurityLogProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: '매체제어정책정보 삭제',
      confirmMsg: '매체제어정책정보(' + viewItem.get('objId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { SecurityLogActions, SecurityLogProps } = this.props;

      SecurityLogActions.deleteSecurityLogData({
        objId: paramObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(SecurityLogProps, SecurityLogActions.readSecurityLogListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SecurityLogProps, compId, targetType);
    this.props.SecurityLogActions.showDialog({
      viewItem: viewItem,
      dialogType: SecurityLogDialog.TYPE_COPY
    });
  };

  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SecurityLogProps, compId, targetType);
    this.props.SecurityLogActions.showDialog({
      viewItem: generateSecurityLogObject(viewItem, false),
      dialogType: SecurityLogDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  handleParamChange = name => event => {
    this.props.SecurityLogActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });

  };


  render() {
    const { classes } = this.props;
    const { SecurityLogProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    const listObj = SecurityLogProps.getIn(['viewItems', compId]);
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
            <Grid item xs={4} >
            <TextField label="조회시작일" type="date" style={{width:150}}
              value={(listObj && listObj.getIn(['listParam', 'fromDate'])) ? listObj.getIn(['listParam', 'fromDate']) : '1999-01-01'}
              onChange={this.handleParamChange('fromDate')}
              className={classes.fullWidth} />
            <TextField label="조회종료일" type="date" style={{width:150}}
              value={(listObj && listObj.getIn(['listParam', 'toDate'])) ? listObj.getIn(['listParam', 'toDate']) : '1999-01-01'}
              onChange={this.handleParamChange('toDate')}
              className={classes.fullWidth} />
            </Grid>
            <Grid item xs={5} style={{textAlign:'right'}}>

            <InputLabel htmlFor="client-status">구분</InputLabel>
                                        <ProtectionTypeSelect name="protectionGubun" 
value={(listObj && listObj.getIn(['listParam', 'gubun'])) ? listObj.getIn(['listParam', 'gubun']) : 'ALL'}                                        
                                            onChangeSelect={this.handleParamChange('gubun')}
                                        />

              <FormControl fullWidth={true}>
                <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
              </FormControl>
            </Grid>
            <Grid item xs={3} style={{textAlign:'right'}}>
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
                keyId="objId"
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
                      onClick={event => this.handleSelectRow(event, n.get('objId'))}
                      tabIndex={-1}
                      key={n.get('objId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objId').endsWith('DEFAULT') ? '기본' : '일반'}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditListClick(event, n.get('objId'))}>
                          <SettingsApplicationsIcon />
                        </Button>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('objId'))}>
                          <DeleteIcon />
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
        {/* dialog(popup) component area */}
        <SecurityLogSpec compId={compId} specType="inform" 
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          hasAction={true}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        </GRPane>
        <SecurityLogDialog compId={compId} />
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  SecurityLogProps: state.SecurityLogModule
});

const mapDispatchToProps = (dispatch) => ({
  SecurityLogActions: bindActionCreators(SecurityLogActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityLogManage));



