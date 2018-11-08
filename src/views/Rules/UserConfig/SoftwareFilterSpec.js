import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import SoftwareFilterDialog from './SoftwareFilterDialog';

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
class SoftwareFilterSpec extends Component {

  handleInheritClick = (objId, compType) => {
    const { SoftwareFilterProps, SoftwareFilterActions, compId, targetType } = this.props;
    const viewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(SoftwareFilterProps, compId, 'objId', targetType) : getSelectedObjectInComp(SoftwareFilterProps, compId, targetType);

    SoftwareFilterActions.showDialog({
      viewItem: generateSoftwareFilterObject(viewItem),
      dialogType: SoftwareFilterDialog.TYPE_INHERIT
    });
  };

  // .................................................
  render() {

    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateSoftwareFilterObject(selectedItem.get('viewItem'));
      RuleAvartar = getAvatarForRuleGrade(targetType, selectedItem.get('ruleGrade'));
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} style={{marginBottom:20}}>
            <GRRuleCardHeader
              avatar={RuleAvartar}
              category='매체제어정책'
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
        <SoftwareFilterDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  SoftwareFilterProps: state.SoftwareFilterModule
});

const mapDispatchToProps = (dispatch) => ({
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SoftwareFilterSpec));

export const generateSoftwareFilterObject = (param) => {

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
