import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getJobStatusToString } from 'components/GRUtils/GRCommonUtils';

import * as JobManageActions from 'modules/JobManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import JobTargetComp from './JobTargetComp';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class JobInform extends Component {

  handleClickTargetSelect = (selectedGroupObj) => {
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
    const { t, i18n } = this.props;

    const bull = <span className={classes.bullet}>•</span>;
    
    const informOpen = JobManageProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = JobManageProps.getIn(['viewItems', compId, 'viewItem']);
    const selectTargetObj = JobManageProps.getIn(['viewItems', compId, 'selectTargetObj']);
    
    // json parse.
    let targetModuleList = <Typography variant="button" gutterBottom>{t("msgNoResult")}</Typography>;
    if(selectTargetObj && selectTargetObj.get('resultData') && viewItem && selectTargetObj.get('jobNo') == viewItem.get('jobNo')) {
      const result = JSON.parse(selectTargetObj.get('resultData'));
      if(result && result.length > 0) {
        targetModuleList = (
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("dtJobModule")}</TableCell>
              <TableCell>{t("dtJobTask")}</TableCell>
              <TableCell>{t("dtJobMessage")}</TableCell>
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
    } else {
      targetModuleList = (<div></div>);
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
                  <TableCell colSpan={2} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ {t("dtJobInfo")} ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} {t("dtJobNo")}</TableCell>
                  <TableCell >{viewItem.get('jobNo')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} {t("dtJobName")}</TableCell>
                  <TableCell >{viewItem.get('jobName')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} {t("dtJobRegDate")}</TableCell>
                  <TableCell >{formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ {t("dtJobTargetResult")} ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} {t("lbClientId")}</TableCell>
                  <TableCell >{selectTargetObj.get('clientId')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} {t("dtJobResultStatus")}</TableCell>
                  <TableCell >{getJobStatusToString(selectTargetObj.get('jobStat'), t)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ {t("dtJobModuleInfo")} ]</TableCell>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(JobInform)));

