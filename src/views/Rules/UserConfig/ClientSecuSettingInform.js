import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

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
    const { ClientSecuSettingProps, compId } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = createViewObject(getSelectedObjectInComp(ClientSecuSettingProps, compId));

    return (
      <div>
      {(ClientSecuSettingProps.informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.objNm : ''}
            subheader={selectedViewItem.objId + ', ' + formatDateToSimple(selectedViewItem.modDate, 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              "{selectedViewItem.comment}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 화면보호기 설정시간(분)</TableCell>
                  <TableCell numeric>{selectedViewItem.screenTime}</TableCell>
                  <TableCell component="th" scope="row">{bull} 패스워드 변경주기(일)</TableCell>
                  <TableCell numeric>{selectedViewItem.passwordTime}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 패키지추가/삭제 기능</TableCell>
                  <TableCell numeric>{selectedViewItem.packageHandle}</TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 전체네트워크허용</TableCell>
                  <TableCell numeric>{selectedViewItem.state}</TableCell>
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
    
    param.propList.forEach(function(e) {
      if(e.propNm == 'screen_time') {
        screenTime = e.propValue;
      } else if(e.propNm == 'password_time') {
        passwordTime = e.propValue;
      } else if(e.propNm == 'package_handle') {
        packageHandle = e.propValue;
      } else if(e.propNm == 'state') {
        state = e.propValue;
      }
    });
  
    return {
      objId: param.objId,
      objNm: param.objNm,
      comment: param.comment,
      modDate: param.modDate,
      modUserId: param.modUserId,

      screenTime: screenTime,
      passwordTime: passwordTime,
      packageHandle: packageHandle,
      state: state
    };
  
  } else {
    return param;
  }

};
