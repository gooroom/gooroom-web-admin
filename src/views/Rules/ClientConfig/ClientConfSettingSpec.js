import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import ClientConfSettingDialog from './ClientConfSettingDialog';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientConfSettingSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateClientConfSettingObject(selectedItem.get('viewItem'));
      RuleAvartar = getAvatarForRuleGrade(targetType, selectedItem.get('ruleGrade'));
    }

    return (
      <React.Fragment>
        {viewItem && 
        <Card elevation={4} style={{marginBottom:20}}>
          <GRRuleCardHeader
            avatar={RuleAvartar}
            category='단말설정'
            title={viewItem.get('objNm')} 
            subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
            action={
              <div style={{paddingTop:16,paddingRight:24}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.props.onClickEdit(viewItem, compType)}
                ><SettingsApplicationsIcon /></Button>
                {(this.props.onClickCopy) &&
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                  onClick={() => this.props.onClickCopy(viewItem)}
                ><CopyIcon /></Button>
                }
                {(this.props.inherit && !(selectedItem.get('isDefault'))) && 
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                  onClick={() => this.handleInheritClick(viewItem.get('objId'), compType)}
                ><ArrowDropDownCircleIcon /></Button>
                }
              </div>
            }
            style={{paddingBottom:0}}
          />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 에이전트 폴링주기(초)</TableCell>
                  <TableCell numeric>{viewItem.get('pollingTime')}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(viewItem.get('useHypervisor')) ? '구동' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{viewItem.get('selectedNtpAddress')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{viewItem.get('ntpAddress').map(function(prop, index) {
                      return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        }
        <ClientConfSettingDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientConfSettingSpec));

export const generateClientConfSettingObject = (param) => {

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

