import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

import * as BrowserRuleSettingActions from 'modules/BrowserRuleSettingModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class BrowserRuleSettingInform extends Component {

  // .................................................

  render() {

    const { classes } = this.props;
    const { BrowserRuleSettingProps, compId } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = createViewObject(getSelectedObjectInComp(BrowserRuleSettingProps, compId));

    return (
      <div>
      {(BrowserRuleSettingProps.informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.objNm : ''}
            subheader={selectedViewItem.objId + ', ' + formatDateToSimple(selectedViewItem.modDate, 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              "{selectedViewItem.comment}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{selectedViewItem.webSocket}</TableCell>
                  <TableCell component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{selectedViewItem.webWorker}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{selectedViewItem.trustSetupId}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 비신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{selectedViewItem.untrustSetupId}</pre></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} White List</TableCell>
                  <TableCell colSpan={3} numeric>{selectedViewItem.trustUrlList.map(function(prop, index) {
                    return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>

              </TableBody>
            </Table>

          </CardContent>
        </Card>
      }
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  BrowserRuleSettingProps: state.BrowserRuleSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleSettingActions: bindActionCreators(BrowserRuleSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(BrowserRuleSettingInform));

export const createViewObject = (param) => {

  if(param) {
    let webSocket = '';
    let webWorker = '';
    
    let trustSetupId = '';
    let untrustSetupId = '';
    let trustUrlList = [];
    
    param.propList.forEach(function(e) {
      if(e.propNm == 'websocket') {
        webSocket = e.propValue;
      } else if(e.propNm == 'webworker') {
        webWorker = e.propValue;
      } else if(e.propNm == 'trustSetupId') {
        trustSetupId = e.propValue;
      } else if(e.propNm == 'untrustSetupId') {
        untrustSetupId = e.propValue;
      } else if(e.propNm == 'trust') {
        trustUrlList.push(e.propValue);
      }
    });
  
    return {
      objId: param.objId,
      objNm: param.objNm,
      comment: param.comment,
      modDate: param.modDate,
      modUserId: param.modUserId,

      webSocket: webSocket,
      webWorker: webWorker,
      trustSetupId: trustSetupId,
      untrustSetupId: untrustSetupId,

      trustUrlList: trustUrlList
    };
  
  } else {
    return param;
  }

};
