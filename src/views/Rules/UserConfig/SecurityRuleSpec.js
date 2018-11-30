import React, { Component } from "react";
import { Map, List } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import SecurityRuleDialog from './SecurityRuleDialog';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import FormLabel from '@material-ui/core/FormLabel';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class SecurityRuleSpec extends Component {

  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateSecurityRuleObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category='단말보안 정책' title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, targetType)}
                  ><EditIcon /></Button>
                  {(this.props.onClickCopy) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, targetType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit && !(selectedItem.get('isDefault'))) && 
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickInherit(compId, targetType)}
                  ><ArrowDropDownCircleIcon /></Button>
                  }
                </div>
              }
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
                    <TableCell style={{width:'25%'}} component="th" scope="row">{bull} 화면보호기 설정시간(분)</TableCell>
                    <TableCell style={{width:'25%'}} numeric>{viewItem.get('screenTime')}</TableCell>
                    <TableCell style={{width:'25%'}} component="th" scope="row">{bull} 패스워드 변경주기(일)</TableCell>
                    <TableCell style={{width:'25%'}} numeric>{viewItem.get('passwordTime')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 패키지추가/삭제 차단기능</TableCell>
                    <TableCell numeric>{(viewItem.get('packageHandle')) ? '켜짐' : '꺼짐'}</TableCell>
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell numeric></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 기본네트워크허용여부</TableCell>
                    <TableCell numeric>{viewItem.get('globalNetwork')}</TableCell>
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell numeric></TableCell>
                  </TableRow>

                </TableBody>
              </Table>
              <FormLabel style={{color:'rgba(0, 0, 0, 0.87)',fontSize:'0.8125rem',fontWeight:400}}>{bull} 방화벽 설정</FormLabel>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th" scope="row">DIRECTION</TableCell>
                    <TableCell component="th" scope="row">PROTOCOL</TableCell>
                    <TableCell component="th" scope="row">ADDRESS</TableCell>
                    <TableCell component="th" scope="row">SRC PORT</TableCell>
                    <TableCell component="th" scope="row">DST PORT</TableCell>
                    <TableCell component="th" scope="row">STATE</TableCell>
                  </TableRow>
                </TableHead>
              {(viewItem.get('netItem') && viewItem.get('netItem').size > 0) &&
              <TableBody>
              {viewItem.get('netItem').map(n => {
                const ns = n.split('|');
                return (
                  <TableRow hover key={ns[0]} >
                  <TableCell >{ns[1]}</TableCell>
                  <TableCell >{ns[2]}</TableCell>
                  <TableCell >{ns[3]}</TableCell>
                  <TableCell >{ns[4]}</TableCell>
                  <TableCell >{ns[5]}</TableCell>
                  <TableCell >{ns[6]}</TableCell>
                  </TableRow>
                );
              })}
              </TableBody>
              }
              </Table>

            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(SecurityRuleSpec);

export const generateSecurityRuleObject = (param, isForViewer) => {

  if(param) {
    let screenTime = '';
    let passwordTime = '';
    let packageHandle = '';
    let netState = '';
    let globalNetwork = '';
    let netItem = List([]);
    
    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'screen_time') {
        screenTime = evalue;
      } else if(ename == 'password_time') {
        passwordTime = evalue;
      } else if(ename == 'package_handle') {
        packageHandle = (evalue == "true");
      } else if(ename == 'state') {
        netState = evalue;
      } else if(ename == 'firewall_network') {
        netItem = netItem.push(evalue);
      } else if(ename == 'global_network') {
        globalNetwork = evalue;
      }
      
    });
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

      screenTime: screenTime,
      passwordTime: passwordTime,
      packageHandle: packageHandle,
      globalNetwork: globalNetwork,
      netState: netState,
      netItem: netItem
    });
  
  } else {
    return param;
  }

};
