import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import SoftwareFilterDialog from './SoftwareFilterDialog';
import SoftwareFilterSpec from './SoftwareFilterSpec';
import { generateSoftwareFilterObject } from './SoftwareFilterSpec';

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
class SoftwareFilterManage extends Component {

  columnHeaders = [
    { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: '구분' },
    { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: '정책이름' },
    { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: '정책아이디' },
    { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: '수정자' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.SoftwareFilterActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(SoftwareFilterProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // SoftwareFilterActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: SoftwareFilterDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    SoftwareFilterActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
  };

  handleCreateButton = () => {
    this.props.SoftwareFilterActions.showDialog({
      viewItem: Map({
        'SWITEM': {}
      }),
      dialogType: SoftwareFilterDialog.TYPE_ADD
    });
  }
  
  handleEditListClick = (event, id) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    const viewItem = getRowObjectById(SoftwareFilterProps, this.props.match.params.grMenuId, id, 'objId');

    SoftwareFilterActions.showDialog({
      viewItem: generateSoftwareFilterObject(viewItem),
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { SoftwareFilterProps, GRConfirmActions } = this.props;
    const viewItem = getRowObjectById(SoftwareFilterProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: '매체제어정책정보 삭제',
      confirmMsg: '매체제어정책정보(' + viewItem.get('objId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { SoftwareFilterActions, SoftwareFilterProps } = this.props;

      SoftwareFilterActions.deleteSoftwareFilterData({
        objId: paramObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(SoftwareFilterProps, SoftwareFilterActions.readSoftwareFilterListPaged);
      });
    }
  };

  // ===================================================================
  handleCopyClick = (viewItem) => {
    const { SoftwareFilterActions } = this.props;
    SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_COPY
    });
  };

  handleEditItemClick = (viewItem, compType) => {
    this.props.SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { SoftwareFilterProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    const listObj = SoftwareFilterProps.getIn(['viewItems', compId]);
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
            <Grid item xs={6} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={6}>
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />조회
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={{textAlign:'right'}}>
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
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>

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
        </GRPane>
        {/* dialog(popup) component area */}
        <SoftwareFilterSpec compId={compId}
          specType="inform" 
          selectedItem={listObj}
          onClickCopy={this.handleCopyClick}
          onClickEdit={this.handleEditItemClick}
        />
        <SoftwareFilterDialog compId={compId} />
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  SoftwareFilterProps: state.SoftwareFilterModule
});

const mapDispatchToProps = (dispatch) => ({
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SoftwareFilterManage));



