import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getMergedObject } from 'components/GRUtils/GRCommonUtils';

import * as JobManageActions from 'modules/JobManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

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
import { GRCommonStyle } from 'templates/styles/GRStyles';


  // static columnData = [
  //   { id: "chClientId", isOrder: true, numeric: false, disablePadding: true, label: "단말아이디" },
  //   { id: "chJobStatus", isOrder: true, numeric: false, disablePadding: true, label: "작업상태" },
  //   { id: "chGroupNm", isOrder: true, numeric: false, disablePadding: true, label: "단말그룹" },
  //   { id: "chClientStatus", isOrder: true, numeric: false, disablePadding: true, label: "단말상태" }
  // ];

class JobInform extends Component {

  render() {
    const { compId, JobManageProps } = this.props;
    const informOpen = JobManageProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = JobManageProps.getIn(['viewItems', compId, 'selectedViewItem']);

    return (
      <div>
      {(informOpen && selectedViewItem) &&
        <Card >
          <CardHeader
            title={selectedViewItem.get('jobName')}
            subheader={selectedViewItem.get('jobNo') + ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD')}
          />
          <Grid container spacing={24}>
          <Grid item xs={12} sm={5}>
            <CardContent>
              <Typography component="pre">
                {selectedViewItem.get('jobData')}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12} sm={7}>
          <CardContent>
{/*
          <Table >
            <JobTargetListHead
              classes={classes}
              orderDir={JobManageProps.targetListParam.orderDir}
              orderColumn={JobManageProps.targetListParam.orderColumn}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {JobManageProps.targetListData.map(n => {
                return (
                  <TableRow
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
*/}
          </CardContent>
          </Grid>
          </Grid>
        </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(JobInform));

