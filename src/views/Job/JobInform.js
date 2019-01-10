import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getMergedObject, getJobStatusToString } from 'components/GRUtils/GRCommonUtils';

import * as JobManageActions from 'modules/JobManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import JobTargetComp from './JobTargetComp';

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

class JobInform extends Component {

  handleClickTargetSelect = (selectedTargetObj) => {
    const { ClientGroupActions, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

    // show client group info.
    if(selectedGroupObj) {
      // close client inform
      ClientManageActions.closeClientManageInform({compId: compId});
      // show client group inform
      ClientGroupActions.showClientGroupInform({
        compId: compId, viewItem: selectedGroupObj, selectId: selectedGroupObj.get('grpId')
      });
      this.resetClientGroupRules(compId, selectedGroupObj.get('grpId'));
    }
  };

  render() {
    const { classes, compId, JobManageProps } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    
    const informOpen = JobManageProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = JobManageProps.getIn(['viewItems', compId, 'viewItem']);
    const selectTargetObj = JobManageProps.getIn(['viewItems', compId, 'selectTargetObj']);
    
    // json parse.
    let targetModuleList = <Typography variant="button" gutterBottom>결과가 없습니다.</Typography>;
    if(selectTargetObj && selectTargetObj.get('resultData')) {
      const result = JSON.parse(selectTargetObj.get('resultData'));
      if(result && result.length > 0) {
        targetModuleList = (
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>모듈</TableCell>
              <TableCell>타스크</TableCell>
              <TableCell>메세지</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            result.map(n => {
              return (
                <TableRow key={n.module.task.task_name}>
                  <TableCell >{n.module.module_name}</TableCell>
                  <TableCell >{n.module.task.task_name}</TableCell>
                  <TableCell >{n.module.task.out.message}</TableCell>
                </TableRow>
              );
            })
          }
          </TableBody>
          </Table>
        );
      }
    }
    
    return (
      <div>
      {(informOpen && viewItem) &&

        <Grid container spacing={16} direction="row" justify="space-between" alignItems="stretch" >
          <Grid item xs={6}>
            <JobTargetComp compId={compId} 
              onSelect={this.handleClickTargetSelect} 
            />
          </Grid>
          <Grid item xs={6}>
            {(selectTargetObj) &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ 작업정보 ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} 작업번호</TableCell>
                  <TableCell >{viewItem.get('jobNo')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} 작업이름</TableCell>
                  <TableCell >{viewItem.get('jobName')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} 작업생성일</TableCell>
                  <TableCell >{formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ 작업대상 결과정보 ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} 단말아이디</TableCell>
                  <TableCell >{selectTargetObj.get('clientId')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} 작업상태(결과)</TableCell>
                  <TableCell >{getJobStatusToString(selectTargetObj.get('jobStat'))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ 작업모듈 정보 ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} >{targetModuleList}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            }
          </Grid>
        </Grid>
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

