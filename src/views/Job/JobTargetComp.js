import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as JobManageActions from 'modules/JobManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { refreshDataListInComps, getRowObjectByIdInCustomList, getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';
import { getMergedObject, getJobStatusToString } from 'components/GRUtils/GRCommonUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

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
import { translate, Trans } from "react-i18next";


class JobTargetComp extends Component {
  
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
    const { t, i18n } = this.props;
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtCancelJob"),
      confirmMsg: t("msgCancelJob"),
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
    const { t, i18n } = this.props;

    const listObj = JobManageProps.getIn(['viewItems', compId]);

    const columnHeaders = [
      { id: "chClientId", isOrder: true, numeric: false, disablePadding: true, label: t("colClientId") },
      { id: "chGroupName", isOrder: true, numeric: false, disablePadding: true, label: t("colClientGroup") },
      { id: "chJobStatus", isOrder: true, numeric: false, disablePadding: true, label: t("colJobStatus") }
    ];

    let emptyRows = 0; 
    if(listObj && listObj.get('listData_target')) {
      emptyRows = listObj.getIn(['listParam_target', 'rowsPerPage']) - listObj.get('listData_target').size;
    }

    const selectedJobNo = JobManageProps.getIn(['viewItems', compId, 'listParam_target', 'jobNo']);
    const jobStatus = JobManageProps.getIn(['viewItems', compId, 'viewItem', 'jobStatus']);

    return (

      <div>
        {/* data option area */}
        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={2} >
            <FormControl fullWidth={true}>
              <TextField label={t("dtJobNo")} value={(selectedJobNo) ? selectedJobNo : ""} disabled={true} />
            </FormControl>
          </Grid>
          <Grid item xs={3} >
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={3} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
          <Grid item xs={4} >
          { (jobStatus != 'C') && 
            <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => this.handleClickJobCancel()} >
              <ClearIcon />{t("btnCancelJob")}
            </Button>
          }
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
            columnData={columnHeaders}
          />
          <TableBody>
          {listObj.get('listData_target').map(n => {
            return (
              <TableRow
                hover
                onClick={event => this.handleSelectRow(event, n.get('clientId'))}
                key={n.get('clientId')}
              >
                <TableCell className={classes.grSmallAndClickCell}>{n.get('clientId')}</TableCell>
                <TableCell className={classes.grSmallAndClickCell}>{n.get('grpNm')}</TableCell>
                <TableCell className={classes.grSmallAndClickAndCenterCell}>{getJobStatusToString(n.get('jobStat'), t)}</TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
            <TableRow key={e}>
              <TableCell
                colSpan={columnHeaders.length + 1}
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(JobTargetComp)));


