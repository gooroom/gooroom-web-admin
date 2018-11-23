import React, { Component } from 'react';
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
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

class ClientConfSettingSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const cartBull = <span className={classes.cartBullet}>#</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateClientConfSettingObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    return (
      <React.Fragment>
        {viewItem && 
        <Card elevation={4} className={classes.ruleViewerCard}>
        { hasAction &&
          <GRRuleCardHeader
            avatar={RuleAvartar}
            category='단말 설정'
            title={viewItem.get('objNm')} 
            subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
            action={
              <div style={{paddingTop:16,paddingRight:24}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.props.onClickEdit(compId, targetType)}
                ><SettingsApplicationsIcon /></Button>
                {(this.props.onClickCopy) &&
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                  onClick={() => this.props.onClickCopy(compId, targetType)}
                ><CopyIcon /></Button>
                }
              </div>
            }
          />
          }
          <CardContent>
          { !hasAction &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{width:'25%'}} component="th" scope="row">{bull} 이름(아이디)</TableCell>
                  <TableCell style={{width:'25%'}} numeric>{viewItem.get('objNm')} ({viewItem.get('objId')})</TableCell>
                  <TableCell style={{width:'25%'}} component="th" scope="row">{bull} 설명</TableCell>
                  <TableCell style={{width:'25%'}} numeric>{viewItem.get('comment')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(viewItem.get('useHypervisor')) ? '구동' : '중단'}</TableCell>
                  <TableCell component="th" scope="row">{bull} 홈폴더 초기화</TableCell>
                  <TableCell numeric>{(viewItem.get('useHomeReset')) ? '실행' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{viewItem.get('selectedNtpAddress')}</TableCell>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{viewItem.get('ntpAddress').map(function(prop, index) {
                      return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table>
              <TableBody>
                <TableRow>
                    <TableCell component="th" colSpan={5} scope="row">{cartBull} 단말 로그 전송 설정</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div style={{marginLeft:16}}>
              <Table>
                <TableBody>
                  <TableRow>
                      <TableCell component="th" colSpan={5} scope="row">{bull} 서버 전송 로그 레벨(수준)</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell component="th" style={{textAlign:'center'}}>신뢰부팅</TableCell>
                    <TableCell component="th" style={{textAlign:'center'}}>운영체제보호</TableCell>
                    <TableCell component="th" style={{textAlign:'center'}}>실행파일보호</TableCell>
                    <TableCell component="th" style={{textAlign:'center'}}>매체제어</TableCell>
                    <TableCell component="th" style={{textAlign:'center'}}>에이전트</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_boot')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_os')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_exe')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_media')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_agent')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" >{bull} 삭제기능 사용여부</TableCell>
                    <TableCell >{(viewItem.get('isDeleteLog')) ? '삭제함' : '삭제안함'}</TableCell>
                    <TableCell component="th" scope="row" >{bull} 서버전송후 로그보관일수</TableCell>
                    <TableCell >{(viewItem.get('isDeleteLog')) ? viewItem.get('logRemainDate') : <s>{viewItem.get('logRemainDate')}</s>}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <Table>
              <TableBody>
                <TableRow>
                    <TableCell component="th" colSpan={5} scope="row">{cartBull} 단말 알림 및 단말 서버 경고 설정</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div style={{marginLeft:16}}>
              <Table>
                <TableBody>
                  <TableRow>
                      <TableCell component="th" colSpan={5} scope="row">{bull} 단말 알림 로그 레벨(수준)</TableCell>
                  </TableRow>
                  <TableRow >
                  <TableCell component="th" style={{textAlign:'center'}}>신뢰부팅</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>운영체제보호</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>실행파일보호</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>매체제어</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>에이전트</TableCell>
                </TableRow>
                  <TableRow >
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_boot')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_os')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_exe')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_media')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_agent')}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell component="th" colSpan={5} scope="row">{bull} 서버/단말 침해 표시 레벨(수준)</TableCell>
                  </TableRow>
                  <TableRow >
                  <TableCell component="th" style={{textAlign:'center'}}>신뢰부팅</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>운영체제보호</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>실행파일보호</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>매체제어</TableCell>
                  <TableCell component="th" style={{textAlign:'center'}}>에이전트</TableCell>
                </TableRow>
                  <TableRow >
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('show_boot')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('show_os')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('show_exe')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('show_media')}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{viewItem.get('show_agent')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <Table>
              <TableBody>
                <TableRow>
                    <TableCell component="th" colSpan={5} scope="row">{cartBull} 단말 로그 (JournalD Log) 설정</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div style={{marginLeft:16}}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 로그파일 최대크기(MB)</TableCell>
                    <TableCell numeric>{viewItem.get('logMaxSize')}</TableCell>
                    <TableCell component="th" scope="row">{bull} 보관할 로그파일 갯수</TableCell>
                    <TableCell numeric>{viewItem.get('logMaxCount')}</TableCell>
                    <TableCell component="th" scope="row">{bull} 최소 확보 디스크 공간(%)</TableCell>
                    <TableCell numeric>{viewItem.get('systemKeepFree')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>
        }
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(ClientConfSettingSpec);

export const convertLogLevelString = (param) => {
  if(param == 'emerg') {
    return 'Emergency (긴급)';
  } else if(param == 'alert') {
    return 'Alert (경보)';
  } else if(param == 'crit') {
    return 'Critical (위험)';
  } else if(param == 'err') {
    return 'Error (오류)';
  } else if(param == 'warnning') {
    return 'Warning (경고)';
  } else if(param == 'notice') {
    return 'Notice (알림)';
  } else if(param == 'info') {
    return 'Informational (정보)';
  } else if(param == 'debug') {
    return 'Debug (디버깅)';
  } else {
    return param;
  }
}

export const generateClientConfSettingObject = (param, isForViewer) => {

  if(param) {
    let useHypervisor = false;
    let useHomeReset = false;
    let selectedNtpIndex = -1;
    let ntpAddrSelected = '';
    let ntpAddress = [];

    let isDeleteLog = '';
    let logMaxSize = '';
    let logMaxCount = '';
    let logRemainDate = '';
    let systemKeepFree = '';

    let transmit_boot = '';
    let transmit_exe = '';
    let transmit_os = '';
    let transmit_media = '';
    let transmit_agent = '';

    let notify_boot = '';
    let notify_exe = '';
    let notify_os = '';
    let notify_media = '';
    let notify_agent = '';

    let show_boot = '';
    let show_exe = '';
    let show_os = '';
    let show_media = '';
    let show_agent = '';

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      
      if(ename == 'USEHYPERVISOR') {
        useHypervisor = (evalue == "true");
      } else if(ename == 'USEHOMERESET') {
        useHomeReset = (evalue == "true");
      } else if(ename == 'NTPSELECTADDRESS') {
        ntpAddrSelected = evalue;
      } else if(ename == 'NTPADDRESSES') {
        ntpAddress.push(evalue);

      } else if(ename == 'isDeleteLog') {
        isDeleteLog = (evalue == "true");
      } else if(ename == 'logMaxSize') {
        logMaxSize = evalue;
      } else if(ename == 'logMaxCount') {
        logMaxCount = evalue;
      } else if(ename == 'logRemainDate') {
        logRemainDate = evalue;
      } else if(ename == 'systemKeepFree') {
        systemKeepFree = evalue;

      } else if(ename == 'transmit_boot') {
        transmit_boot = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'transmit_exe') {
        transmit_exe = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'transmit_os') {
        transmit_os = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'transmit_media') {
        transmit_media = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'transmit_agent') {
        transmit_agent = (isForViewer) ? convertLogLevelString(evalue) : evalue;

      } else if(ename == 'notify_boot') {
        notify_boot = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'notify_exe') {
        notify_exe = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'notify_os') {
        notify_os = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'notify_media') {
        notify_media = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'notify_agent') {
        notify_agent = (isForViewer) ? convertLogLevelString(evalue) : evalue;

      } else if(ename == 'show_boot') {
        show_boot = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'show_exe') {
        show_exe = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'show_os') {
        show_os = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'show_media') {
        show_media = (isForViewer) ? convertLogLevelString(evalue) : evalue;
      } else if(ename == 'show_agent') {
        show_agent = (isForViewer) ? convertLogLevelString(evalue) : evalue;
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
      useHomeReset: useHomeReset,
      selectedNtpAddress: ntpAddrSelected,
      selectedNtpIndex: selectedNtpIndex,
      ntpAddress: List(ntpAddress),

      isDeleteLog: isDeleteLog,
      logMaxSize: logMaxSize,
      logMaxCount: logMaxCount,
      logRemainDate: logRemainDate,
      systemKeepFree: systemKeepFree,

      transmit_boot: transmit_boot,
      transmit_exe: transmit_exe,
      transmit_os: transmit_os,
      transmit_media: transmit_media,
      transmit_agent: transmit_agent,

      notify_boot: notify_boot,
      notify_exe: notify_exe,
      notify_os: notify_os,
      notify_media: notify_media,
      notify_agent: notify_agent,

      show_boot: show_boot,
      show_exe: show_exe,
      show_os: show_os,
      show_media: show_media,
      show_agent: show_agent
    });
  
  } else {
    return param;
  }

};

