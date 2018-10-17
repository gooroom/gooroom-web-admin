import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import BrowserRuleDialog from './BrowserRuleDialog'

import Button from '@material-ui/core/Button';
import CopyIcon from '@material-ui/icons/FileCopy';

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
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class BrowserRuleInform extends Component {

  handleCopyClick = (selectedViewItem) => {
    const { BrowserRuleActions } = this.props;
    BrowserRuleActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: BrowserRuleDialog.TYPE_COPY
    });
  };

  // .................................................
  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { BrowserRuleProps, compId } = this.props;
    const informOpen = BrowserRuleProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = generateConfigObject(BrowserRuleProps.getIn(['viewItems', compId, 'selectedViewItem']));

    return (
      <div>
      {(informOpen && selectedViewItem) &&
        <Card >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.get('objNm') : ''}
            subheader={selectedViewItem.get('objId') + ', ' + formatDateToSimple(selectedViewItem.get('modDate'), 'YYYY-MM-DD')}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleCopyClick(selectedViewItem)}
                ><CopyIcon /></Button>
              </div>
            }
          />
          <CardContent>
            <Typography variant="subtitle1" component="pre">
              "{selectedViewItem.get('comment')}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{selectedViewItem.get('webSocket')}</TableCell>
                  <TableCell component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{selectedViewItem.get('webWorker')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{selectedViewItem.get('trustSetupId')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 비신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{selectedViewItem.get('untrustSetupId')}</pre></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} White List</TableCell>
                  <TableCell colSpan={3} numeric>{selectedViewItem.get('trustUrlList').map(function(prop, index) {
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
  BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleInform));

export const generateConfigObject = (param) => {

  if(param) {
    let webSocket = '';
    let webWorker = '';
    let trustSetupId = '';
    let untrustSetupId = '';
    let trustUrlList = [];

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'websocket') {
        webSocket = evalue;
      } else if(ename == 'webworker') {
        webWorker = evalue;
      } else if(ename == 'trustSetupId') {
        trustSetupId = evalue;
      } else if(ename == 'untrustSetupId') {
        untrustSetupId = evalue;
      } else if(ename == 'trust') {
        trustUrlList.push(evalue);
      }
    });

  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      webSocket: webSocket,
      webWorker: webWorker,
      trustSetupId: trustSetupId,
      untrustSetupId: untrustSetupId,
      trustUrlList: List(trustUrlList)
    });
  
  } else {
    return param;
  }

};
