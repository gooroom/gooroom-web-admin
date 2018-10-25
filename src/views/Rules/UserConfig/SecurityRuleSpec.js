import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import SecurityRuleDialog from './SecurityRuleDialog';

import FormLabel from '@material-ui/core/FormLabel';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
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
class SecurityRuleSpec extends Component {

  handleInheritClick = (objId, compType) => {
    const { SecurityRuleProps, SecurityRuleActions, compId, targetType } = this.props;
    const viewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(SecurityRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(SecurityRuleProps, compId, targetType);

    SecurityRuleActions.showDialog({
      viewItem: generateSecurityRuleObject(viewItem),
      dialogType: SecurityRuleDialog.TYPE_INHERIT
    });
  };

  render() {

    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateSecurityRuleObject(selectedItem.get('viewItem'));
      RuleAvartar = getAvatarForRuleGrade(targetType, selectedItem.get('ruleGrade'));
    }

    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} style={{marginBottom:20}}>
            <CardHeader
              avatar={RuleAvartar}
              title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.handleEditClick(viewItem, compType)}
                  ><SettingsApplicationsIcon /></Button>
                  {(this.props.handleCopyClick) &&
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.handleCopyClick(viewItem)}
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
              <Table style={{marginBottom:30}}>
                <TableBody>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 화면보호기 설정시간(분)</TableCell>
                    <TableCell numeric>{viewItem.get('screenTime')}</TableCell>
                    <TableCell component="th" scope="row">{bull} 패스워드 변경주기(일)</TableCell>
                    <TableCell numeric>{viewItem.get('passwordTime')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 패키지추가/삭제 기능</TableCell>
                    <TableCell numeric>{viewItem.get('packageHandle')}</TableCell>
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


const mapStateToProps = (state) => ({
  SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityRuleSpec));

export const generateSecurityRuleObject = (param) => {

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
        packageHandle = evalue;
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
