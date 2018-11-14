import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import ClientUpdateServerDialog from './ClientUpdateServerDialog';

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
class ClientUpdateServerSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateUpdateServerObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader
              avatar={RuleAvartar}
              category='업데이트서버 정보'
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
                    <TableCell component="th" scope="row" >{bull} 주 OS 정보</TableCell>
                    <TableCell><pre>{viewItem.get('mainos')}</pre></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" >{bull} 기반 OS 정보</TableCell>
                    <TableCell><pre>{viewItem.get('extos')}</pre></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" >{bull} gooroom.pref</TableCell>
                    <TableCell><pre>{viewItem.get('priorities')}</pre></TableCell>
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

export default withStyles(GRCommonStyle)(ClientUpdateServerSpec);

export const generateUpdateServerObject = (param) => {
  
  if(param) {

    let mainos = '';
    let extos = '';
    let priorities = '';

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'MAINOS') {
        mainos = evalue;
      } else if(ename == 'EXTOS') {
        extos = evalue;
      } else if(ename == 'PRIORITIES') {
        priorities = evalue;
      }
    });

    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      mainos: mainos,
      extos: extos,
      priorities: priorities
    });
    
  } else {
    return param;
  }

};

