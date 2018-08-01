import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import * as JobManageActions from 'modules/JobManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Header ########## ########## ########## ########## ########## 
//
class JobTargetListHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "chClientId", isOrder: true, numeric: false, disablePadding: true, label: "단말아이디" },
    { id: "chJobStatus", isOrder: true, numeric: false, disablePadding: true, label: "작업상태" },
    { id: "chGroupNm", isOrder: true, numeric: false, disablePadding: true, label: "단말그룹" },
    { id: "chClientStatus", isOrder: true, numeric: false, disablePadding: true, label: "단말상태" }
  ];

  render() {
    const { classes } = this.props;
    const {
      orderDir,
      orderColumn,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {JobTargetListHead.columnData.map(column => {
            return (
              <TableCell
                className={classes.grSmallAndHeaderCell}
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(column.isOrder) &&
                <TableSortLabel
                  active={orderColumn === column.id}
                  direction={orderDir}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              }
              {(!column.isOrder) &&
                <p>{column.label}</p>
              }
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
class JobInform extends Component {

  // .................................................
  handleRequestSort = (event, property) => {

    const { jobManageModule, JobManageActions } = this.props;
    let orderDir = "desc";
    if (jobManageModule.listParam.orderColumn === property && jobManageModule.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    JobManageActions.readJobTargetList(getMergedObject(jobManageModule.targetListParam, {orderColumn: property, orderDir: orderDir}));
  };

  render() {
    const { classes } = this.props;
    const { jobManageModule } = this.props;

    const emptyRows = jobManageModule.targetListParam.rowsPerPage - jobManageModule.targetListData.length;

    return (
      <div>
        <Card >
          <CardHeader
            title={jobManageModule.selectedItem.jobName}
            subheader={jobManageModule.selectedItem.jobNo + ', ' + formatDateToSimple(jobManageModule.selectedItem.regDate, 'YYYY-MM-DD')}
          />
          <Grid container spacing={24}>
          <Grid item xs={12} sm={5}>
            <CardContent>
              <Typography component="pre">
                {jobManageModule.selectedItem.jobData}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12} sm={7}>
          <CardContent>
          <Table >
            <JobTargetListHead
              classes={classes}
              orderDir={jobManageModule.targetListParam.orderDir}
              orderColumn={jobManageModule.targetListParam.orderColumn}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {jobManageModule.targetListData.map(n => {
                return (
                  <TableRow
                    className={classes.grNormalTableRow}
                    hover
                    key={n.clientId}
                  >
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.clientId}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.jobStat}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.grpNm}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.isOn}
                    </TableCell>
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow >
                  <TableCell
                    colSpan={JobTargetListHead.columnData.length + 1}
                    className={classes.grSmallAndClickCell}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
          </CardContent>
          </Grid>
          </Grid>
        </Card>
      </div>
    );

  }
}


const mapStateToProps = (state) => ({

  jobManageModule: state.JobManageModule,
  grConfirmModule: state.GrConfirmModule,

});


const mapDispatchToProps = (dispatch) => ({

  JobManageActions: bindActionCreators(JobManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(JobInform));

