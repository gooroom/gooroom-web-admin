import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as JobManageActions from 'modules/JobManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { refreshDataListInComps, getRowObjectByIdInCustomList, getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import GRConfirm from 'components/GRComponents/GRConfirm';

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
import ClearIcon from '@material-ui/icons/Clear'; 

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class JobTargetComp extends Component {

  columnHeaders = [
    { id: "chClientId", isOrder: true, numeric: false, disablePadding: true, label: "단말아이디" },
    { id: "chGroupName", isOrder: true, numeric: false, disablePadding: true, label: "단말그룹이름" },
    { id: "chJobStatus", isOrder: true, numeric: false, disablePadding: true, label: "작업상태" }
  ];

  componentDidMount() {
    this.props.JobManageActions.readClientListInJobPaged(this.props.JobManageProps, this.props.compId, {
      jobNo: this.props.JobManageProps.getIn(['viewItems', this.props.compId, 'selectId'])
    });
  }

  handleChangePage = (event, page) => {
    this.props.JobManageActions.readClientListInJobPaged(this.props.JobManageProps, this.props.compId, {
      jobNo: this.props.JobManageProps.getIn(['viewItems', this.props.compId, 'selectId']),
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.JobManageActions.readClientListInJobPaged(this.props.JobManageProps, this.props.compId, {
      jobNo: this.props.JobManageProps.getIn(['viewItems', this.props.compId, 'selectId']),
      rowsPerPage: event.target.value, 
      page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.JobManageActions.readClientListInJobPaged(this.props.JobManageProps, this.props.compId, {
      jobNo: this.props.JobManageProps.getIn(['viewItems', this.props.compId, 'selectId']),
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };
  
  handleSelectBtnClick = () => {
    const { JobManageActions, JobManageProps, compId } = this.props;
    JobManageActions.readClientListInJobPaged(JobManageProps, compId, {
      jobNo: JobManageProps.getIn(['viewItems', compId, 'listParam_target', 'jobNo']),
      page: 0
    });
  };

  handleClickJobCancel = (event) => {
    const { GRConfirmActions, JobManageProps, compId } = this.props;

    GRConfirmActions.showConfirm({
      confirmTitle: '작업 취소',
      confirmMsg: '작업대상 단말중 "작업전" 상태 단말의 작업을 취소하시겠습니까?',
      handleConfirmResult: (confirmValue, paramObject) => {
        if(confirmValue) {
          const { JobManageProps, JobManageActions } = this.props;
          JobManageActions.cancelJobRunning(paramObject)
            .then((res) => {
            refreshDataListInComps(JobManageProps, JobManageActions.readClientListInJobPaged);
          });
        }
      },
      confirmObject: getDataObjectVariableInComp(JobManageProps, compId, 'selectId')
    });
  };

  handleSelectRow = (event, id) => {
    const { JobManageProps, compId } = this.props;
    const { JobManageActions } = this.props;

    const selectRowObject = getRowObjectByIdInCustomList(JobManageProps, compId, id, 'clientId', 'listData_target');
    JobManageActions.changeCompVariable({
      name: 'selectTargetObj',
      value: selectRowObject,
      compId: compId
    });
  };  

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.JobManageActions.changeTargetListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  render() {
    const { classes } = this.props;
    const { JobManageProps, compId } = this.props;

    const listObj = JobManageProps.getIn(['viewItems', compId]);

    let emptyRows = 0; 
    if(listObj && listObj.get('listData_target')) {
      emptyRows = listObj.getIn(['listParam_target', 'rowsPerPage']) - listObj.get('listData_target').size;
    }

    const selectedJobNo = JobManageProps.getIn(['viewItems', compId, 'listParam_target', 'jobNo']);

    return (

      <div>
        {/* data option area */}
        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={2} >
            <FormControl fullWidth={true}>
              <TextField label="작업번호" value={(selectedJobNo) ? selectedJobNo : ""} disabled={true} />
            </FormControl>
          </Grid>
          <Grid item xs={3} >
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={3} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />조회
            </Button>
          </Grid>
          <Grid item xs={4} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => this.handleClickJobCancel()} >
              <ClearIcon />작업취소
            </Button>
          </Grid>
        </Grid>

        {/* data area */}
        {listObj && listObj.get('listData_target') &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="clientId"
            orderDir={listObj.getIn(['listParam_target', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam_target', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            columnData={this.columnHeaders}
          />
          <TableBody>
          {listObj.get('listData_target').map(n => {
            let clientStatus = '';
            if(n.get('jobStat') == 'R') {
              clientStatus = '작업전';
            } else if(n.get('jobStat') == 'C') {
              clientStatus = '작업완료';
            } else if(n.get('jobStat') == 'D') {
              clientStatus = '작업중';
            } else if(n.get('jobStat') == 'E') {
              clientStatus = '작업오류';
            } else if(n.get('jobStat') == 'Q') {
              clientStatus = '작업취소';
            }

            return (
              <TableRow
                hover
                onClick={event => this.handleSelectRow(event, n.get('clientId'))}
                key={n.get('clientId')}
              >
                <TableCell className={classes.grSmallAndClickCell}>{n.get('clientId')}</TableCell>
                <TableCell className={classes.grSmallAndClickCell}>{n.get('grpNm')}</TableCell>
                <TableCell className={classes.grSmallAndClickAndCenterCell}>{clientStatus}</TableCell>
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
        }
        {listObj && listObj.get('listData_target') && listObj.get('listData_target').size > 0 &&
          <TablePagination
            component='div'
            count={listObj.getIn(['listParam_target', 'rowsFiltered'])}
            rowsPerPage={listObj.getIn(['listParam_target', 'rowsPerPage'])}
            rowsPerPageOptions={listObj.getIn(['listParam_target', 'rowsPerPageOptions']).toJS()}
            page={listObj.getIn(['listParam_target', 'page'])}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        }
        <GRConfirm />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  JobManageProps: state.JobManageModule
});

const mapDispatchToProps = (dispatch) => ({
  JobManageActions: bindActionCreators(JobManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(JobTargetComp));


