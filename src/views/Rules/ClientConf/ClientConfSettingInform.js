import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from 'glamor';

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


//
//  ## Style ########## ########## ########## ########## ########## 
//
const componentClass = css({
  marginTop: "20px !important"
}).toString();

const contentClass = css({
  paddingTop: "0px !important"
}).toString();

const cardContainerClass = css({
  padding: "10px !important"
}).toString();


const title = css({
  marginBottom: 16,
  fontSize: 14,
}).toString();

const card = css({
  minWidth: 275,
}).toString();

const bullet = css({
  display: 'inline-block',
  margin: '0 2px',
  transform: 'scale(0.8)',
}).toString();

const pos = css({
  marginBottom: 12,
}).toString();


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientConfSettingInform extends Component {

  // .................................................

  render() {

    const bull = <span className={bullet}>•</span>;
    const { ClientConfSettingProps, compId } = this.props;
    const { viewItems } = ClientConfSettingProps;

    let selectedViewItem = null;
    if(viewItems) {
      const viewItem = viewItems.find(function(element) {
        return element._COMPID_ == compId;
      });
      if(viewItem) {
        selectedViewItem = createViewObject(viewItem.selectedItem);
      }
    }

    return (
      <div className={componentClass}>
      {(ClientConfSettingProps.informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.objNm : ''}
            subheader={selectedViewItem.objId + ', ' + formatDateToSimple(selectedViewItem.modDate, 'YYYY-MM-DD')}
          />
          <CardContent className={contentClass}>
            <Typography component="pre">
              "{selectedViewItem.comment}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 에이전트 폴링주기(초)</TableCell>
                  <TableCell numeric>{selectedViewItem.pollingTime}</TableCell>
                  <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(selectedViewItem.useHypervisor) ? '구동' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{(selectedViewItem.selectedNtpIndex > -1) ? selectedViewItem.ntpAddress[selectedViewItem.selectedNtpIndex] : ''}</TableCell>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{selectedViewItem.ntpAddress.map(function(prop, index) {
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientConfSettingInform);

export const createViewObject = (param) => {

  if(param) {
    let pollingTime = '';
    let useHypervisor = false;
    let selectedNtpIndex = -1;
    let ntpAddrSelected = '';
    let ntpAddress = [];
    
    param.propList.forEach(function(e) {
      if(e.propNm == 'AGENTPOLLINGTIME') {
        pollingTime = e.propValue;
      } else if(e.propNm == 'USEHYPERVISOR') {
        useHypervisor = (e.propValue == "true");
      } else if(e.propNm == 'NTPSELECTADDRESS') {
        ntpAddrSelected = e.propValue;
      } else if(e.propNm == 'NTPADDRESSES') {
        ntpAddress.push(e.propValue);
      }
    });
    ntpAddress.forEach(function(e, i) {
      if(ntpAddrSelected == e) {
        selectedNtpIndex = i;
      }
    });
  
    return {
      objId: param.objId,
      objNm: param.objNm,
      comment: param.comment,
      modDate: param.modDate,
      useHypervisor: useHypervisor,
      pollingTime: pollingTime,
      selectedNtpIndex: selectedNtpIndex,
      ntpAddress: ntpAddress
    };
  
  } else {
    return param;
  }

};
