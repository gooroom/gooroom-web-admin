import React, { Component } from 'react';
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class ClientConfSettingSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle } = this.props;

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
          { (hasAction) &&
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
                ><EditIcon /></Button>
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
          { (simpleTitle) &&
          <GRRuleCardHeader
            category='단말 설정'
            title={viewItem.get('objNm')} 
            subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
          />
          }
          <CardContent style={{padding: 10}}>
            { !hasAction &&
            <Grid container spacing={0}>
              <Grid item xs={3} className={classes.specTitle}>{bull} 이름(아이디)</Grid>
              <Grid item xs={3} className={classes.specContent}>{viewItem.get('objNm')} ({viewItem.get('objId')})</Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} 설명</Grid>
              <Grid item xs={3} className={classes.specContent}>{viewItem.get('comment')}</Grid>
            </Grid>
            }
            <Grid container spacing={0}>
              <Grid item xs={3} className={classes.specTitle}>{bull} 운영체제 보호</Grid>
              <Grid item xs={3} className={classes.specContent}>{(viewItem.get('useHypervisor')) ? '구동' : '중단'}</Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} 홈폴더 초기화</Grid>
              <Grid item xs={3} className={classes.specContent}>{(viewItem.get('useHomeReset')) ? '실행' : '중단'}</Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} 접속 가능 아이피</Grid>
              <Grid item xs={3} className={classes.specContent}>
              {viewItem.get('whiteIp').map(function(prop, index) {
                return <span key={index}>{prop}<br/></span>;
              })}
              </Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} 전체 아이피 허용</Grid>
              <Grid item xs={3} className={classes.specContent}>{(viewItem.get('whiteIpAll')) ? '허용함' : '허용안함'}</Grid>
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ 단말로그 전송설정 ]</Grid>
              <Grid item xs={12} className={classes.specTitle}>{bull} 전송 로그레벨</Grid>
              <Grid item xs={12} className={classes.specContent}>
                <Table>
                  <TableBody>
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
              </Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} 삭제기능 사용여부</Grid>
              <Grid item xs={2} className={classes.specContent}>{(viewItem.get('isDeleteLog')) ? '삭제함' : '삭제안함'}</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} 서버전송후 로그보관일수</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('logRemainDate')}</Grid>

              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ 단말알림 및 서버경고 설정 ]</Grid>
              <Grid item xs={12} className={classes.specTitle}>{bull} 알림 로그레벨</Grid>
              <Grid item xs={12} className={classes.specContent}>
                <Table>
                  <TableBody>
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
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} className={classes.specTitle}>{bull} 서버/단말 침해 표시레벨</Grid>
              <Grid item xs={12} className={classes.specContent}>
                <Table>
                  <TableBody>
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
              </Grid>
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ 단말 로그 (JournalD Log) 설정 ]</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} 로그파일 최대크기(MB)</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('logMaxSize')}</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} 보관할 로그파일 갯수</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('logMaxCount')}</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} 최소 확보 디스크 공간(%)</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('systemKeepFree')}</Grid>
              <Grid item xs={6} className={classes.specContent}></Grid>
            </Grid>
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
    let whiteIpAll = false;
    let whiteIps = [];

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
      } else if(ename == 'WHITEIPALL') {
        whiteIpAll = (evalue == "true");
      } else if(ename == 'WHITEIPS') {
        whiteIps.push(evalue);

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
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      useHypervisor: useHypervisor,
      useHomeReset: useHomeReset,
      whiteIpAll: whiteIpAll,
      whiteIp: List(whiteIps),

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

