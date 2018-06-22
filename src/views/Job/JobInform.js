import React, { Component } from "react";
import PropTypes from "prop-types";
//import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import { withStyles } from '@material-ui/core/styles';

import * as JobManageActions from '../../modules/JobManageModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import classnames from 'classnames';

import { css } from 'glamor';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = theme => ({
  card: {
    maxWidth: "100%",
    marginLeft: "20px",
    marginRight: "20px",
  }
});

const tableClass = css({
  minWidth: "100px !important"
}).toString();

const tableHeadCellClass = css({
  whiteSpace: "nowrap",
  padding: "0px !important"
}).toString();

const tableContainerClass = css({
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    position: "absolute",
    height: 10,
    marginLeft: "-10px",
    },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#CFD8DC", 
    },
  "&::-webkit-scrollbar-thumb": {
    height: "30px",
    backgroundColor: "#78909C",
    backgroundClip: "content-box",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px 1px",
    }
}).toString();

const tableRowClass = css({
  height: "2em !important"
}).toString();

const tableCellClass = css({
  height: "1em !important",
  padding: "0px !important",
  cursor: "pointer"
}).toString();


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
                className={tableCellClass}
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
    JobManageActions.readJobTargetList(getMergedListParam(jobManageModule.targetListParam, {orderColumn: property, orderDir: orderDir}));
  };

  render() {

    const { classes, jobManageModule } = this.props;
    console.log('JobInform-render jobManageModule >> ', jobManageModule);

    const emptyRows = jobManageModule.targetListParam.rowsPerPage - jobManageModule.targetListData.length;

    return (
      <div>
        <Card className={classes.card} >
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
          <Table className={tableClass}>
            <JobTargetListHead
                orderDir={jobManageModule.targetListParam.orderDir}
                orderColumn={jobManageModule.targetListParam.orderColumn}
                onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {jobManageModule.targetListData.map(n => {
                return (
                  <TableRow
                    className={tableRowClass}
                    hover
                    key={n.clientId}
                  >
                    <TableCell className={tableCellClass}>
                      {n.clientId}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {n.jobStat}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {n.grpNm}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {n.isOn}
                    </TableCell>
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 32 * emptyRows }}>
                  <TableCell
                    colSpan={JobTargetListHead.columnData.length + 1}
                    className={tableCellClass}
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobInform));

