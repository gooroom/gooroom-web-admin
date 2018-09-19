import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getDataObjectInComp } from 'components/GrUtils/GrTableListUtils';

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
    const bull = <span className={classes.bullet}>•</span>;

    const { MediaControlSettingProps, compId } = this.props;
    const viewItem = getDataObjectInComp(MediaControlSettingProps, compId);
    const selectedViewItem = (viewItem.get('selectedViewItem')) ? generateConfigObject(viewItem.get('selectedViewItem')) : null;

    return (
      <div>
      {(viewItem.get('informOpen') && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.get('objNm') : ''}
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
                  <TableCell component="th" scope="row">{bull} USB메모리</TableCell>
                  <TableCell numeric>{selectedViewItem.get('usbMemory')}</TableCell>
                  <TableCell component="th" scope="row">{bull} CD/DVD</TableCell>
                  <TableCell numeric>{selectedViewItem.get('cdAndDvd')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린터</TableCell>
                  <TableCell numeric>{selectedViewItem.get('printer')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 화면캡쳐</TableCell>
                  <TableCell numeric>{selectedViewItem.get('screenCapture')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 사운드(소리,마이크)</TableCell>
                  <TableCell numeric>{selectedViewItem.get('sound')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 카메라</TableCell>
                  <TableCell numeric>{selectedViewItem.get('camera')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} USB키보드</TableCell>
                  <TableCell numeric>{selectedViewItem.get('keyboard')}</TableCell>
                  <TableCell component="th" scope="row">{bull} USB마우스</TableCell>
                  <TableCell numeric>{selectedViewItem.get('mouse')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 무선랜</TableCell>
                  <TableCell numeric>{selectedViewItem.get('wireless')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 블루투스</TableCell>
                  <TableCell numeric>{selectedViewItem.get('bluetoothState')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                  <TableCell component="th" scope="row">{bull} 맥주소(블루투스)</TableCell>
                  <TableCell numeric>{selectedViewItem.get('macAddress').map(function(prop, index) {
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

export const generateConfigObject = (param) => {

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
    
    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'usb_memory') {
        usbMemory = evalue;
        if(usbMemory == 'read_only') {
          usbReadonly = 'allow';
        } else {
          usbReadonly = 'disallow';
        }
      } else if(ename == 'cd_dvd') {
        cdAndDvd = evalue;
      } else if(ename == 'printer') {
        printer = evalue;
      } else if(ename == 'screen_capture') {
        screenCapture = evalue;
      } else if(ename == 'sound') {
        sound = evalue;
      } else if(ename == 'camera') {
        camera = evalue;
      } else if(ename == 'keyboard') {
        keyboard = evalue;
      } else if(ename == 'mouse') {
        mouse = evalue;
      } else if(ename == 'wireless') {
        wireless = evalue;
      } else if(ename == 'bluetooth_state') {
        bluetoothState = evalue;
      } else if(ename == 'mac_address') {
        macAddress.push(evalue);
      }
    });
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

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
      macAddress: List(macAddress)  
    });
  
  } else {
    return param;
  }

};
