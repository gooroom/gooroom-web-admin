import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getTableSelectedObject } from 'components/GrUtils/GrTableListUtils';

import * as MediaControlSettingActions from 'modules/MediaControlSettingModule';

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
class MediaControlSettingInform extends Component {

  // .................................................

  render() {

    const { classes } = this.props;
    const { MediaControlSettingProps, compId } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = createViewObject(getTableSelectedObject(MediaControlSettingProps, compId));

    return (
      <div>
      {(MediaControlSettingProps.informOpen && selectedViewItem) &&
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
                  <TableCell component="th" scope="row">{bull} USB메모리</TableCell>
                  <TableCell numeric>{selectedViewItem.usbMemory}</TableCell>
                  <TableCell component="th" scope="row">{bull} CD/DVD</TableCell>
                  <TableCell numeric>{selectedViewItem.cdAndDvd}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린터</TableCell>
                  <TableCell numeric>{selectedViewItem.printer}</TableCell>
                  <TableCell component="th" scope="row">{bull} 화면캡쳐</TableCell>
                  <TableCell numeric>{selectedViewItem.screenCapture}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 사운드(소리,마이크)</TableCell>
                  <TableCell numeric>{selectedViewItem.sound}</TableCell>
                  <TableCell component="th" scope="row">{bull} 카메라</TableCell>
                  <TableCell numeric>{selectedViewItem.camera}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} USB키보드</TableCell>
                  <TableCell numeric>{selectedViewItem.keyboard}</TableCell>
                  <TableCell component="th" scope="row">{bull} USB마우스</TableCell>
                  <TableCell numeric>{selectedViewItem.mouse}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 무선랜</TableCell>
                  <TableCell numeric>{selectedViewItem.wireless}</TableCell>
                  <TableCell component="th" scope="row">{bull} 블루투스</TableCell>
                  <TableCell numeric>{selectedViewItem.bluetoothState}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                  <TableCell component="th" scope="row">{bull} 맥주소(블루투스)</TableCell>
                  <TableCell numeric>{selectedViewItem.macAddress.map(function(prop, index) {
                    return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
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
  MediaControlSettingProps: state.MediaControlSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  MediaControlSettingActions: bindActionCreators(MediaControlSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(MediaControlSettingInform));

export const createViewObject = (param) => {

  if(param) {
    let usbMemory = '';
    let usbReadonly = '';
    let wireless = '';
    let bluetoothState = '';
    let cdAndDvd = '';
    let printer = '';
    let screenCapture = '';
    let camera = '';
    let sound = '';
    let keyboard = '';
    let mouse = '';
    let macAddress = [];
    
    param.propList.forEach(function(e) {
      if(e.propNm == 'usb_memory') {
        usbMemory = e.propValue;
        if(usbMemory == 'read_only') {
          usbReadonly = 'allow';
        } else {
          usbReadonly = 'disallow';
        }
      } else if(e.propNm == 'cd_dvd') {
        cdAndDvd = e.propValue;
      } else if(e.propNm == 'printer') {
        printer = e.propValue;
      } else if(e.propNm == 'screen_capture') {
        screenCapture = e.propValue;
      } else if(e.propNm == 'sound') {
        sound = e.propValue;
      } else if(e.propNm == 'camera') {
        camera = e.propValue;
      } else if(e.propNm == 'keyboard') {
        keyboard = e.propValue;
      } else if(e.propNm == 'mouse') {
        mouse = e.propValue;
      } else if(e.propNm == 'wireless') {
        wireless = e.propValue;
      } else if(e.propNm == 'bluetooth_state') {
        bluetoothState = e.propValue;
      } else if(e.propNm == 'mac_address') {
        macAddress.push(e.propValue);
      }
    });
  
    return {
      objId: param.objId,
      objNm: param.objNm,
      comment: param.comment,
      modDate: param.modDate,
      modUserId: param.modUserId,

      usbMemory: usbMemory,
      usbReadonly: usbReadonly,
      cdAndDvd: cdAndDvd,
      printer: printer,
      screenCapture: screenCapture,
      sound: sound,
      camera: camera,
      keyboard: keyboard,
      mouse: mouse,

      wireless: wireless,
      bluetoothState: bluetoothState,
      macAddress: macAddress
    };
  
  } else {
    return param;
  }

};
