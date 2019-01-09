import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as JobManageActions from 'modules/JobManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';
import { getJobStatusToString } from 'components/GRUtils/GRCommonUtils';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRPane from 'containers/GRContent/GRPane';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

// option components
import JobStatusSelect from 'views/Options/JobStatusSelect';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

import JobInform from './JobInform';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class JobManage extends Component {

  columnHeaders = [
    { id: "chJobNo", isOrder: true, numeric: false, disablePadding: true, label: "작업번호" },
    { id: "chJobName", isOrder: true, numeric: false, disablePadding: true, label: "작업이름" },
    { id: "chReadyCount", isOrder: true, numeric: false, disablePadding: true, label: "진행상태" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "대상단말수" },
    { id: "chErrorCount", isOrder: true, numeric: false, disablePadding: true, label: "작업오류수" },
    { id: "chCompCount", isOrder: true, numeric: false, disablePadding: true, label: "작업완료수" },
    { id: "chRegUserId", isOrder: true, numeric: false, disablePadding: true, label: "등록자" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    this.props.JobManageActions.readJobManageListPaged(this.props.JobManageProps, this.props.match.params.grMenuId, { page: page });
  };

  handleChangeRowsPerPage = event => {
    this.props.JobManageActions.readJobManageListPaged(this.props.JobManageProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.JobManageActions.readJobManageListPaged(this.props.JobManageProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };
  
  handleSelectBtnClick = () => {
    const { JobManageActions, JobManageProps } = this.props;
    JobManageActions.readJobManageListPaged(JobManageProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleSelectRow = (event, id) => {
    const { JobManageProps, JobManageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const selectRowObject = getRowObjectById(JobManageProps, compId, id, 'jobNo');

    JobManageActions.readClientListInJobPaged(JobManageProps, compId, {
      jobNo: selectRowObject.get('jobNo'), 
      page:0
    });

    JobManageActions.showJobInform({
      compId: compId,
      viewItem: selectRowObject,
    });
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.JobManageActions.changeListParamData(this.props.JobManageProps, {
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleChangeJobStatusSelect = (event, property) => {
    this.props.JobManageActions.changeListParamData(this.props.JobManageProps, {
      name: 'jobStatus', 
      value: property,
      compId: this.props.match.params.grMenuId,
      isGetList: true
    });
  };


  render() {
    const { classes } = this.props;
    const { JobManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    const listObj = JobManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (

      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>

          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={4} >
                  <FormControl fullWidth={true}>
                    <InputLabel htmlFor="job-status">작업상태</InputLabel>
                    <JobStatusSelect onChangeSelect={this.handleChangeJobStatusSelect} />
                  </FormControl>
                </Grid>
                <Grid item xs={4} >
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                  </FormControl>
                </Grid>
                <Grid item xs={4} >
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />{t('buttonSearch')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2} style={{textAlign:'right'}}>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) && 
          <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="jobNo"
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
                      onClick={event => this.handleSelectRow(event, n.get('jobNo'))}
                      key={n.get('jobNo')}
                    >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('jobNo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('jobName')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{getJobStatusToString(n.get('jobStatus'))}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('clientCount')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('errorCount')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('compCount')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD HH:mm')}</TableCell>
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
        <JobInform compId={compId} />
        <GRConfirm />
        </GRPane>
      </React.Fragment>
      
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(JobManage));

