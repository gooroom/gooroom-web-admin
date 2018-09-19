import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';

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
class ClientConfSettingInform extends Component {

  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { ClientConfSettingProps, compId } = this.props;
    const informOpen = ClientConfSettingProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = generateConfigObject(ClientConfSettingProps.getIn(['viewItems', compId, 'selectedViewItem']));

    return (
      <div>
      {(informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.get('objNm') : ''}
            subheader={selectedViewItem.get('objId') + ', ' + formatDateToSimple(selectedViewItem.get('modDate'), 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              "{selectedViewItem.get('comment')}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 에이전트 폴링주기(초)</TableCell>
                  <TableCell numeric>{selectedViewItem.get('pollingTime')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(selectedViewItem.get('useHypervisor')) ? '구동' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{selectedViewItem.get('selectedNtpAddress')}</TableCell>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{selectedViewItem.get('ntpAddress').map(function(prop, index) {
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
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientConfSettingInform));

export const generateConfigObject = (param) => {

  if(param) {
    let pollingTime = '';
    let useHypervisor = false;
    let selectedNtpIndex = -1;
    let ntpAddrSelected = '';
    let ntpAddress = [];
    
    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      
      if(ename == 'AGENTPOLLINGTIME') {
        pollingTime = evalue;
      } else if(ename == 'USEHYPERVISOR') {
        useHypervisor = (evalue == "true");
      } else if(ename == 'NTPSELECTADDRESS') {
        ntpAddrSelected = evalue;
      } else if(ename == 'NTPADDRESSES') {
        ntpAddress.push(evalue);
      }
    });
    ntpAddress.forEach(function(e, i) {
      if(ntpAddrSelected == e) {
        selectedNtpIndex = i;
      }
    });
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      useHypervisor: useHypervisor,
      pollingTime: pollingTime,
      selectedNtpAddress: ntpAddrSelected,
      selectedNtpIndex: selectedNtpIndex,
      ntpAddress: List(ntpAddress)
    });
  
  } else {
    return param;
  }

};
