import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import BrowserRuleDialog from './BrowserRuleDialog';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class BrowserRuleSpec extends Component {

  // handleInheritClick = (objId, compType) => {
  //   const { BrowserRuleProps, BrowserRuleActions, compId, targetType } = this.props;
  //   const viewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(BrowserRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(BrowserRuleProps, compId, targetType);

  //   BrowserRuleActions.showDialog({
  //     viewItem: generateBrowserRuleObject(viewItem),
  //     dialogType: BrowserRuleDialog.TYPE_INHERIT
  //   });
  // };

  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, compType, targetType, selectedItem, ruleGrade } = this.props;
    const { hasAction } = this.props;

    console.log('selectedItem :::::::::::::::::::: ', (selectedItem) ? selectedItem.toJS() : 'NNNNNNNNNNNNN');

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateBrowserRuleObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }
    
    return (
      <React.Fragment>
        {(viewItem) && 

          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader
              avatar={RuleAvartar}
              category='브라우저제어 정책'
              title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, compType)}
                  ><SettingsApplicationsIcon /></Button>
                  {(this.props.onClickCopy) &&
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, compType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit && !(viewItem.get('isDefault'))) && 
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickInherit(compId, compType)}
                  ><ArrowDropDownCircleIcon /></Button>
                  }
                </div>
              }
              style={{paddingBottom:0}}
            />
          }
          <CardContent style={{padding: 10}}>
            <Table>
              <TableBody>
              { !hasAction &&
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 이름</TableCell>
                  <TableCell numeric>{viewItem.get('objNm')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 설명</TableCell>
                  <TableCell numeric>{viewItem.get('comment')}</TableCell>
                </TableRow>
              }
                <TableRow>
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webSocket')}</TableCell>
                  <TableCell component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webWorker')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={4} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ 신뢰사이트 설정 ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:240}}>{bull} 개발자도구(웹 인스펙터) 사용통제</TableCell>
                  <TableCell numeric>{viewItem.get('devToolRule__trust')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 다운로드 통제</TableCell>
                  <TableCell numeric>{viewItem.get('downloadRule__trust')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린팅 통제</TableCell>
                  <TableCell numeric>{viewItem.get('printRule__trust')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 페이지 소스보기 통제</TableCell>
                  <TableCell numeric>{viewItem.get('viewSourceRule__trust')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:17}}>
                    <div style={{maxHeight:120,overflowY:'auto'}}>
                      <pre>{viewItem.get('trustSetup')}</pre>
                    </div>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell colSpan={4} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ 비신뢰사이트 설정 ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:240}}>{bull} 개발자도구(웹 인스펙터) 사용통제</TableCell>
                  <TableCell numeric>{viewItem.get('devToolRule__untrust')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 다운로드 통제</TableCell>
                  <TableCell numeric>{viewItem.get('downloadRule__untrust')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린팅 통제</TableCell>
                  <TableCell numeric>{viewItem.get('printRule__untrust')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 페이지 소스보기 통제</TableCell>
                  <TableCell numeric>{viewItem.get('viewSourceRule__untrust')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 비신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:17}}>
                    <div style={{maxHeight:120,overflowY:'auto'}}>
                      <pre>{viewItem.get('untrustSetup')}</pre>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} component="td" scope="row" style={{fontWeight:'bold',verticalAlign:'bottom',border:0}}>[ 접속가능 주소설정 ]</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} White List</TableCell>
                  <TableCell colSpan={3} numeric>{viewItem.get('trustUrlList').map(function(prop, index) {
                    return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>
              </TableBody>

            </Table>
            </CardContent>
          </Card>

        }
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(BrowserRuleSpec);

export const generateBrowserRuleObject = (param, isForViewer) => {

  if(param) {
    let webSocket = '';
    let webWorker = '';

    let devToolRule__trust = '';
    let downloadRule__trust = '';
    let printRule__trust = '';
    let viewSourceRule__trust = '';

    let devToolRule__untrust = '';
    let downloadRule__untrust = '';
    let printRule__untrust = '';
    let viewSourceRule__untrust = '';

    let trustSetup = '';
    let untrustSetup = '';
    let trustUrlList = [];

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'websocket') {
        webSocket = evalue;
      } else if(ename == 'webworker') {
        webWorker = evalue;
      } else if(ename == 'devToolRule__trust') {
        if(isForViewer) {
          if(evalue == '0') {
            devToolRule__trust = "익스텐션내 개발자도구 사용불가"
          } else if(evalue == '1') {
            devToolRule__trust = "개발자도구 사용가능"
          } else if(evalue == '2') {
            devToolRule__trust = "개발자도구 사용불가"
          }
        } else {
          devToolRule__trust = evalue;
        }        
      } else if(ename == 'downloadRule__trust') {
        if(isForViewer) {
          if(evalue == '0') {
            downloadRule__trust = "다운로드 제한 없음"
          } else if(evalue == '1') {
            downloadRule__trust = "위험 다운로드 제한"
          } else if(evalue == '2') {
            downloadRule__trust = "잠재적인 위험 다운로드 제한"
          } else if(evalue == '3') {
            downloadRule__trust = "모든 다운로드 제한"
          }
        } else {
          downloadRule__trust = evalue;
        }        
      } else if(ename == 'printRule__trust') {
        if(isForViewer) {
          if(evalue == 'true') {
            printRule__trust = "허용"
          } else if(evalue == 'false') {
            printRule__trust = "비허용"
          }
        } else {
          printRule__trust = evalue;
        }        
      } else if(ename == 'viewSourceRule__trust') {
        if(isForViewer) {
          if(evalue == 'true') {
            viewSourceRule__trust = "허용"
          } else if(evalue == 'false') {
            viewSourceRule__trust = "비허용"
          }
        } else {
          viewSourceRule__trust = evalue;
        }        
      } else if(ename == 'devToolRule__untrust') {
        if(isForViewer) {
          if(evalue == '0') {
            devToolRule__untrust = "익스텐션내 개발자도구 사용불가"
          } else if(evalue == '1') {
            devToolRule__untrust = "개발자도구 사용가능"
          } else if(evalue == '2') {
            devToolRule__untrust = "개발자도구 사용불가"
          }
        } else {
          devToolRule__untrust = evalue;
        }
      } else if(ename == 'downloadRule__untrust') {
        if(isForViewer) {
          if(evalue == '0') {
            downloadRule__untrust = "다운로드 제한 없음"
          } else if(evalue == '1') {
            downloadRule__untrust = "위험 다운로드 제한"
          } else if(evalue == '2') {
            downloadRule__untrust = "잠재적인 위험 다운로드 제한"
          } else if(evalue == '3') {
            downloadRule__untrust = "모든 다운로드 제한"
          }
        } else {
          downloadRule__untrust = evalue;
        }        
      } else if(ename == 'printRule__untrust') {
        if(isForViewer) {
          if(evalue == 'true') {
            printRule__untrust = "허용"
          } else if(evalue == 'false') {
            printRule__untrust = "비허용"
          }
        } else {
          printRule__untrust = evalue;
        }        
      } else if(ename == 'viewSourceRule__untrust') {
        if(isForViewer) {
          if(evalue == 'true') {
            viewSourceRule__untrust = "허용"
          } else if(evalue == 'false') {
            viewSourceRule__untrust = "비허용"
          }
        } else {
          viewSourceRule__untrust = evalue;
        }        
      } else if(ename == 'trustSetup') {
        trustSetup = evalue;
      } else if(ename == 'untrustSetup') {
        untrustSetup = evalue;
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

      devToolRule__trust: devToolRule__trust,
      downloadRule__trust: downloadRule__trust,
      printRule__trust: printRule__trust,
      viewSourceRule__trust: viewSourceRule__trust,

      devToolRule__untrust: devToolRule__untrust,
      downloadRule__untrust: downloadRule__untrust,
      printRule__untrust: printRule__untrust,
      viewSourceRule__untrust: viewSourceRule__untrust,

      trustSetup: trustSetup,
      untrustSetup: untrustSetup,
      trustUrlList: List(trustUrlList)
    });
  
  } else {
    return param;
  }

};
