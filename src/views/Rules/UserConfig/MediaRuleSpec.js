import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getRoleTitleClassName } from 'components/GRUtils/GRTableListUtils';

import * as MediaRuleActions from 'modules/MediaRuleModule';
import MediaRuleDialog from './MediaRuleDialog';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
class MediaRuleSpec extends Component {

  

  handleInheritClick = (objId, compType) => {
    const { MediaRuleProps, MediaRuleActions, compId, targetType } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(MediaRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(MediaRuleProps, compId, targetType);

    MediaRuleActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: MediaRuleDialog.TYPE_INHERIT
    });
  };

  // .................................................
  render() {

    const { classes } = this.props;
    const { specType, isOpen, selectedItem } = this.props;
    const { MediaRuleProps, compId, compType, targetType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const viewItem = (selectedItem) ? generateConfigObject(selectedItem) : null;

    const selectedObj = (targetType && targetType != '') ? MediaRuleProps.getIn(['viewItems', compId, targetType]) : MediaRuleProps.getIn(['viewItems', compId]);
    const selectedViewItem = (selectedObj) ? selectedObj.get('selectedViewItem') : null;
    const listAllData = (selectedObj) ? selectedObj.get('listAllData') : null;

    const selectedOptionItemId = (selectedObj) ? selectedObj.get('selectedOptionItemId') : null;
    const isDefault = (selectedObj) ? selectedObj.get('isDefault') : null;
    const isDeptRole = (selectedObj) ? selectedObj.get('isDeptRole') : null;

    const titleClassName = getRoleTitleClassName(this.props.targetType, isDefault, isDeptRole);

    console.log('specType :::::::::: ', specType);
    console.log('selectedItem :::::::::: ', (selectedItem) ? selectedItem.toJS() : null);

    // const viewCompItem = (specType != 'VIEW') ? generateConfigObject(selectedItem) : 
    //   (() => {
    //     console.log('@#$%@#$%#$%#$%#%#$#$#$#$%#$%#$@#$#$%#%#@%#$%#$#$%#$%#$%#$%#$%#%#$%#$%#$%#$%#$%@#%');
    //     if(listAllData && selectedOptionItemId != null) {
    //       const item = listAllData.find((element) => {
    //         return element.get('objId') == selectedOptionItemId;
    //       });
    //       if(item) {
    //         return generateConfigObject(fromJS(item.toJS()));
    //       } else {
    //         return null;
    //       }
    //     }
    //   })()
    // ;

    return (
      <React.Fragment>
        {viewItem && 
          <Card >

            <CardHeader
              title={viewItem.get('objNm')}
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.handleEditClick(viewItem, compType)}
                  ><SettingsApplicationsIcon /></Button>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.handleCopyClick(viewItem)}
                  ><CopyIcon /></Button>
                  {(this.props.inherit && !isDefault) && 
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
                    <TableCell component="th" scope="row">{bull} USB메모리</TableCell>
                    <TableCell numeric>{viewItem.get('usbMemory')}</TableCell>
                    <TableCell component="th" scope="row">{bull} CD/DVD</TableCell>
                    <TableCell numeric>{viewItem.get('cdAndDvd')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 프린터</TableCell>
                    <TableCell numeric>{viewItem.get('printer')}</TableCell>
                    <TableCell component="th" scope="row">{bull} 화면캡쳐</TableCell>
                    <TableCell numeric>{viewItem.get('screenCapture')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 사운드(소리,마이크)</TableCell>
                    <TableCell numeric>{viewItem.get('sound')}</TableCell>
                    <TableCell component="th" scope="row">{bull} 카메라</TableCell>
                    <TableCell numeric>{viewItem.get('camera')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} USB키보드</TableCell>
                    <TableCell numeric>{viewItem.get('keyboard')}</TableCell>
                    <TableCell component="th" scope="row">{bull} USB마우스</TableCell>
                    <TableCell numeric>{viewItem.get('mouse')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 무선랜</TableCell>
                    <TableCell numeric>{viewItem.get('wireless')}</TableCell>
                    <TableCell component="th" scope="row">{bull} 블루투스</TableCell>
                    <TableCell numeric>{viewItem.get('bluetoothState')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell numeric></TableCell>
                    <TableCell component="th" scope="row">{bull} 맥주소(블루투스)</TableCell>
                    <TableCell numeric>{viewItem.get('macAddress').map(function(prop, index) {
                      return <span key={index}>{prop}<br/></span>;
                    })}</TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </CardContent>
          </Card>
        }
        <MediaRuleDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  MediaRuleProps: state.MediaRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(MediaRuleSpec));


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
