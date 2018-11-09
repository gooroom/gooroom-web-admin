import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

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

class BrowserRuleViewer extends Component {

  render() {

    const { classes, viewItem, hasAction, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={0} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader
              avatar={this.props.avater}
              category='브라우저제어 정책'
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
          }
          <CardContent style={{padding: 10}}>
          { !hasAction &&
            <div>
            <Grid container>
              <Grid item xs={6}>
                <Typography color="default">
                {(viewItem.get('objNm') != '') ? viewItem.get('objNm') : ''}
                </Typography>
              </Grid>
              <Grid item xs={6}>
              </Grid>
            </Grid>
            <Typography color="textSecondary">
              {(viewItem.get('comment') != '') ? '"' + viewItem.get('comment') + '"' : ''}
            </Typography>
            <Divider />
            </div>
          }
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webSocket')}</TableCell>
                  <TableCell colSpan={2} component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webWorker')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell rowSpan={3} component="th" scope="row">{bull} 신뢰사이트</TableCell>
                  <TableCell component="th" scope="row" style={{width:240}}>{bull} 개발자도구(웹 인스펙터) 사용통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('devToolRule__trust') == '0') && "익스텐션내 개발자도구 사용불가"
                  }{
                    (viewItem.get('devToolRule__trust') == '1') && "개발자도구 사용가능"
                  }{
                    (viewItem.get('devToolRule__trust') == '2') && "개발자도구 사용불가"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 다운로드 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('downloadRule__trust') == '0') && "다운로드 제한 없음"
                  }{
                    (viewItem.get('downloadRule__trust') == '1') && "위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule__trust') == '2') && "잠재적인 위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule__trust') == '3') && "모든 다운로드 제한"
                  }</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린팅 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('printRule__trust') == 'true') && "허용"
                  }{
                    (viewItem.get('printRule__trust') == 'false') && "비허용"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 페이지 소스보기 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('viewSourceRule__trust') == 'true') && "허용"
                  }{
                    (viewItem.get('viewSourceRule__trust') == 'false') && "비허용"
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
                  <TableCell rowSpan={3} component="th" scope="row">{bull} 비신뢰사이트</TableCell>
                  <TableCell component="th" scope="row" style={{width:240}}>{bull} 개발자도구(웹 인스펙터) 사용통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('devToolRule__untrust') == '0') && "익스텐션내 개발자도구 사용불가"
                  }{
                    (viewItem.get('devToolRule__untrust') == '1') && "개발자도구 사용가능"
                  }{
                    (viewItem.get('devToolRule__untrust') == '2') && "개발자도구 사용불가"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 다운로드 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('downloadRule__untrust') == '0') && "다운로드 제한 없음"
                  }{
                    (viewItem.get('downloadRule__untrust') == '1') && "위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule__untrust') == '2') && "잠재적인 위험 다운로드 제한"
                  }{
                    (viewItem.get('downloadRule__untrust') == '3') && "모든 다운로드 제한"
                  }</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린팅 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('printRule__untrust') == 'true') && "허용"
                  }{
                    (viewItem.get('printRule__untrust') == 'false') && "비허용"
                  }</TableCell>
                  <TableCell component="th" scope="row">{bull} 페이지 소스보기 통제</TableCell>
                  <TableCell numeric>{
                    (viewItem.get('viewSourceRule__untrust') == 'true') && "허용"
                  }{
                    (viewItem.get('viewSourceRule__untrust') == 'false') && "비허용"
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
                  <TableCell colSpan={4} numeric>{viewItem.get('trustUrlList').map(function(prop, index) {
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

export default withStyles(GRCommonStyle)(BrowserRuleViewer);

