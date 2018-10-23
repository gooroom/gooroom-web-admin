import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as DesktopConfActions from 'modules/DesktopConfModule';
import DesktopConfDialog from './DesktopConfDialog';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Typography from '@material-ui/core/Typography';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';



import Avatar from '@material-ui/core/Avatar';
import DefaultIcon from '@material-ui/icons/Language';

import red from '@material-ui/core/colors/red';



import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DesktopConfSpec extends Component {

  // .................................................
  render() {

    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateDesktopConfObject(selectedItem.get('selectedViewItem'));
      RuleAvartar = getAvatarForRuleGrade(targetType, selectedItem.get('ruleGrade'));
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} style={{marginBottom:20}}>
            <CardHeader
              avatar={RuleAvartar}
              title={viewItem.get('confNm')}
              subheader={viewItem.get('confId')}
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
                </div>
              }
              style={{paddingBottom:0}}
            />
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>

                  {viewItem.get('apps') && viewItem.get('apps').map(n => {
                    return (
                        <TableCell className={classes.grSmallAndClickCell} key={n.get('appId')}>

                        <Card className={classes.card}>


                        <CardHeader avatar={<Avatar aria-label="Recipe" src={n.get('iconUrl')}></Avatar>} style={{paddingBottom:0}} />

                          <CardContent>
                            <CardMedia
                              component="img"
                              alt={n.get('appNm')}
                              className={classes.media}
                              height="140"
                              image={n.get('iconUrl')}
                              title={n.get('appNm')}
                            />
                            <CardContent>
                              <Typography gutterBottom variant="h5" component="h2">
                                {n.get('appNm')}
                              </Typography>
                              <Typography component="p">
                                {n.get('appInfo')},{n.get('appExec')}
                              </Typography>
                            </CardContent>
                          </CardContent>
                        </Card>
                        </TableCell>
                    );
                  })}
                       
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        }
        <DesktopConfDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopConfSpec));

export const generateDesktopConfObject = (param) => {

  if(false && param) {
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
