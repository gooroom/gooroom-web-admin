import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getDataObjectInComp } from 'components/GrUtils/GrTableListUtils';

import * as ClientSecuSettingActions from 'modules/ClientSecuSettingModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientSecuSettingInform extends Component {

  // .................................................

  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { ClientSecuSettingProps, compId } = this.props;
    const viewItem = getDataObjectInComp(ClientSecuSettingProps, compId);
    const selectedViewItem = (viewItem.get('selectedViewItem')) ? createViewObject(viewItem.get('selectedViewItem')) : null;

    return (
      <div>
      {(viewItem.get('informOpen') && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.get('objNm')  : ''}
            subheader={selectedViewItem.get('objId') + ', ' + formatDateToSimple(selectedViewItem.get('modDate'), 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              "{selectedViewItem.get('comment')}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 화면보호기 설정시간(분)</TableCell>
                  <TableCell numeric>{selectedViewItem.get('screenTime')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 패스워드 변경주기(일)</TableCell>
                  <TableCell numeric>{selectedViewItem.get('passwordTime')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 패키지추가/삭제 기능</TableCell>
                  <TableCell numeric>{selectedViewItem.get('packageHandle')}</TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 전체네트워크허용</TableCell>
                  <TableCell numeric>{selectedViewItem.get('state')}</TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
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
  ClientSecuSettingProps: state.ClientSecuSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientSecuSettingActions: bindActionCreators(ClientSecuSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientSecuSettingInform));

export const createViewObject = (param) => {

  if(param) {
    let screenTime = '';
    let passwordTime = '';
    let packageHandle = '';
    let state = '';
    
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
        state = evalue;
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
      state: state
    });
  
  } else {
    return param;
  }

};
