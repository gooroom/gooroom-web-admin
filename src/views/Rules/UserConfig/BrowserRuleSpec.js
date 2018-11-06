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

  handleInheritClick = (objId, compType) => {
    const { BrowserRuleProps, BrowserRuleActions, compId, targetType } = this.props;
    const viewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(BrowserRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(BrowserRuleProps, compId, targetType);

    BrowserRuleActions.showDialog({
      viewItem: generateBrowserRuleObject(viewItem),
      dialogType: BrowserRuleDialog.TYPE_INHERIT
    });
  };

  render() {

    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateBrowserRuleObject(selectedItem.get('viewItem'));
      RuleAvartar = getAvatarForRuleGrade(targetType, selectedItem.get('ruleGrade'));
    }
    
    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={4} style={{marginBottom:20}}>
            <GRRuleCardHeader
              avatar={RuleAvartar}
              category='브라우저제어정책'
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
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webSocket')}</TableCell>
                  <TableCell component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webWorker')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:240}}>{bull} 개발자도구(웹 인스펙터) 사용통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('devToolRule_trust') == '0') && "익스텐션내 개발자도구 사용불가"
                  }{
                    (viewItem.get('devToolRule_trust') == '1') && "개발자도구 사용가능"
                  }{
                    (viewItem.get('devToolRule_trust') == '2') && "개발자도구 사용불가"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 다운로드 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('downloadRule_trust') == '0') && "다운로드 제한 없음"
                  }{
                    (viewItem.get('downloadRule_trust') == '1') && "위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule_trust') == '2') && "잠재적인 위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule_trust') == '3') && "모든 다운로드 제한"
                  }</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린팅 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('printRule_trust') == 'true') && "허용"
                  }{
                    (viewItem.get('printRule_trust') == 'false') && "비허용"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 페이지 소스보기 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('viewSourceRule_trust') == 'true') && "허용"
                  }{
                    (viewItem.get('viewSourceRule_trust') == 'false') && "비허용"
                  }</TableCell>
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
                  <TableCell component="th" scope="row" style={{width:240}}>{bull} 개발자도구(웹 인스펙터) 사용통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('devToolRule_untrust') == '0') && "익스텐션내 개발자도구 사용불가"
                  }{
                    (viewItem.get('devToolRule_untrust') == '1') && "개발자도구 사용가능"
                  }{
                    (viewItem.get('devToolRule_untrust') == '2') && "개발자도구 사용불가"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 다운로드 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('downloadRule_untrust') == '0') && "다운로드 제한 없음"
                  }{
                    (viewItem.get('downloadRule_untrust') == '1') && "위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule_untrust') == '2') && "잠재적인 위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule_untrust') == '3') && "모든 다운로드 제한"
                  }</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린팅 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('printRule_untrust') == 'true') && "허용"
                  }{
                    (viewItem.get('printRule_untrust') == 'false') && "비허용"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 페이지 소스보기 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('viewSourceRule_untrust') == 'true') && "허용"
                  }{
                    (viewItem.get('viewSourceRule_untrust') == 'false') && "비허용"
                  }</TableCell>
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
      <BrowserRuleDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleSpec));

export const generateBrowserRuleObject = (param) => {

  if(param) {
    let webSocket = '';
    let webWorker = '';

    let devToolRule_trust = '';
    let downloadRule_trust = '';
    let printRule_trust = '';
    let viewSourceRule_trust = '';

    let devToolRule_untrust = '';
    let downloadRule_untrust = '';
    let printRule_untrust = '';
    let viewSourceRule_untrust = '';

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

      } else if(ename == 'devToolRule_trust') {
        devToolRule_trust = evalue;
      } else if(ename == 'downloadRule_trust') {
        downloadRule_trust = evalue;
      } else if(ename == 'printRule_trust') {
        printRule_trust = evalue;
      } else if(ename == 'viewSourceRule_trust') {
        viewSourceRule_trust = evalue;

      } else if(ename == 'devToolRule_untrust') {
        devToolRule_untrust = evalue;
      } else if(ename == 'downloadRule_untrust') {
        downloadRule_untrust = evalue;
      } else if(ename == 'printRule_untrust') {
        printRule_untrust = evalue;
      } else if(ename == 'viewSourceRule_untrust') {
        viewSourceRule_untrust = evalue;

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

      devToolRule_trust: devToolRule_trust,
      downloadRule_trust: downloadRule_trust,
      printRule_trust: printRule_trust,
      viewSourceRule_trust: viewSourceRule_trust,

      devToolRule_untrust: devToolRule_untrust,
      downloadRule_untrust: downloadRule_untrust,
      printRule_untrust: printRule_untrust,
      viewSourceRule_untrust: viewSourceRule_untrust,

      trustSetup: trustSetup,
      untrustSetup: untrustSetup,
      trustUrlList: List(trustUrlList)
    });
  
  } else {
    return param;
  }

};
