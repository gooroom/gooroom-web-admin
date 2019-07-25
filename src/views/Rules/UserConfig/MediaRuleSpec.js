import React, { Component } from "react";
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class MediaRuleSpec extends Component {

  render() {

    const { classes } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle, isEditable} = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateMediaRuleObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category={t("dtCategoryMediaRule")} title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  {isEditable &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, targetType)}
                  ><EditIcon /></Button>
                  }
                  {(this.props.onClickCopy && isEditable) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, targetType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit && isEditable && !(viewItem.get('isDefault'))) && 
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickInherit(compId, targetType)}
                  ><ArrowDropDownCircleIcon /></Button>
                  }
                </div>
              }
            />
            }
          { simpleTitle &&
            <GRRuleCardHeader
              category={t("dtCategoryMediaRule")} title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
            />
            }

            <CardContent style={{padding: 10}}>
              { !hasAction &&
              <Grid container spacing={0}>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtNameAndId")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{viewItem.get('objNm')} ({viewItem.get('objId')})</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("lbDesc")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{viewItem.get('comment')}</Grid>
              </Grid>
              }
              <Grid container spacing={0}>

                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtCdDvd")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('cdAndDvd')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPrinter")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('printer')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtCamera")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('camera')}</Grid>

                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtWifi")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('wireless')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtSound")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('sound')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtMicrophone")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('microphone')}</Grid>

                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtScreenCapture")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('screenCapture')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtUsbKeyboard")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('keyboard')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtUsbMouse")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('mouse')}</Grid>

                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtClipboard")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('clipboard')}</Grid>
                <Grid item xs={8}></Grid>

                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtUsbMemory")}</Grid>
                <Grid item xs={1} className={classes.specContent}>{viewItem.get('usbMemory')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtUsbSerial")}</Grid>
                <Grid item xs={5} className={classes.specContent}>
                {viewItem.get('usbSerialNo').map(function(prop, index) {
                  return <span key={index}>{prop}<br/></span>;
                })}
                </Grid>
                <Grid item xs={2} className={classes.specTitle}>{bull} {t("dtBluetooth")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('bluetoothState')}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtBluetoothMac")}</Grid>
                <Grid item xs={5} className={classes.specContent}>
                {viewItem.get('macAddress').map(function(prop, index) {
                  return <span key={index}>{prop}<br/></span>;
                })}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(MediaRuleSpec));

export const generateMediaRuleObject = (param, isForViewer) => {

  if(param) {
    let usbMemory = '';
    let usbSerialNo = [];
    let usbReadonly = '';
    let wireless = '';
    let bluetoothState = '';
    let cdAndDvd = '';
    let printer = '';
    let camera = '';
    let sound = '';
    let microphone = '';
    let screenCapture = '';
    let clipboard = '';
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
      } else if(ename == 'sound') {
        sound = evalue;
      } else if(ename == 'microphone') {
        microphone = evalue;
      } else if(ename == 'screencapture') {
        screenCapture = evalue;
      } else if(ename == 'clipboard') {
        clipboard = evalue;
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
      } else if(ename == 'usb_serialno') {
        usbSerialNo.push(evalue);
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
      sound: sound,
      microphone: microphone,
      screenCapture: screenCapture,
      clipboard: clipboard,
      camera: camera,
      keyboard: keyboard,
      mouse: mouse,

      wireless: wireless,
      bluetoothState: bluetoothState,
      macAddress: List(macAddress),
      usbSerialNo: List(usbSerialNo)
    });
  
  } else {
    return param;
  }

};
