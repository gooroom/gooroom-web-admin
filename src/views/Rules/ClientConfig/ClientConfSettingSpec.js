import React, { Component } from 'react';
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientConfSettingSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle } = this.props;
    const { t, i18n } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateClientConfSettingObject(selectedItem, true, t);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    return (
      <React.Fragment>
        {viewItem && 
        <Card elevation={4} className={classes.ruleViewerCard}>
          { (hasAction) &&
          <GRRuleCardHeader
            avatar={RuleAvartar}
            category={t("lbSetupClient")}
            title={viewItem.get('objNm')} 
            subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
            action={
              <div style={{paddingTop:16,paddingRight:24}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.props.onClickEdit(compId, targetType)}
                ><EditIcon /></Button>
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
          { (simpleTitle) &&
          <GRRuleCardHeader
            category={t("lbSetupClient")}
            title={viewItem.get('objNm')} 
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
              <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtOSProtect")}</Grid>
              <Grid item xs={3} className={classes.specContent}>{(viewItem.get('useHypervisor')) ? t("selRun") : t("selStop")}</Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtInitHomeFolder")}</Grid>
              <Grid item xs={3} className={classes.specContent}>{(viewItem.get('useHomeReset')) ? t("selExecute") : t("selStop")}</Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtSetupConnectableIp")}</Grid>
              <Grid item xs={3} className={classes.specContent}>
              {viewItem.get('whiteIp').map(function(prop, index) {
                return <span key={index}>{prop}<br/></span>;
              })}
              </Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPermitAllIp")}</Grid>
              <Grid item xs={3} className={classes.specContent}>{(viewItem.get('whiteIpAll')) ? t("selPermit") : t("selNoPermit")}</Grid>
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("dtSetupLogLevel")} ]</Grid>
              <Grid item xs={12} className={classes.specTitle}>{bull} {t("lbViolatedLogLebel")}</Grid>
              <Grid item xs={12} className={classes.specContent}>
                <Table>
                  <TableBody>
                    <TableRow >
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtTrustedBoot")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtOSProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtExeProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtMediaProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtAgent")}]</TableCell>
                    </TableRow>
                    <TableRow >
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_boot')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_os')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_exe')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_media')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('notify_agent')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} className={classes.specTitle}>{bull} {t("lbClientLogLevel")}</Grid>
              <Grid item xs={12} className={classes.specContent}>
                <Table>
                  <TableBody>
                    <TableRow >
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtTrustedBoot")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtOSProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtExeProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtMediaProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtAgent")}]</TableCell>
                    </TableRow>
                    <TableRow >
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('show_boot')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('show_os')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('show_exe')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('show_media')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('show_agent')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} className={classes.specTitle}>{bull} {t("lbServerLogLevel")}</Grid>
              <Grid item xs={12} className={classes.specContent}>
                <Table>
                  <TableBody>
                    <TableRow >
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtTrustedBoot")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtOSProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtExeProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtMediaProtect")}]</TableCell>
                      <TableCell component="th" className={classes.specTitle} style={{textAlign:'center'}}>[{t("dtAgent")}]</TableCell>
                    </TableRow>
                    <TableRow >
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_boot')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_os')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_exe')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_media')}</TableCell>
                      <TableCell style={{textAlign:'center'}}>{viewItem.get('transmit_agent')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("dtIsUseDeleteFunc")}</Grid>
              <Grid item xs={2} className={classes.specContent}>{(viewItem.get('isDeleteLog')) ? t("selDelete") : t("selNoDelete")}</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} {t("lbSaveDateAfterSend")}</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('logRemainDate')}</Grid>

              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("dtClientLogSetup")} ]</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} {t("lbLogFileMax")}</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('logMaxSize')}</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} {t("lbSavedLogFileCount")}</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('logMaxCount')}</Grid>
              <Grid item xs={5} className={classes.specTitle}>{bull} {t("lbMinimumDiskSizeRate")}</Grid>
              <Grid item xs={1} className={classes.specContent}>{viewItem.get('systemKeepFree')}</Grid>
              <Grid item xs={6} className={classes.specContent}></Grid>
            </Grid>
          </CardContent>
        </Card>
        }
      </React.Fragment>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(ClientConfSettingSpec));

export const convertLogLevelString = (param, t) => {
  if(param == 'emerg') {
    return 'Emergency' + t('stEmergLevel');
  } else if(param == 'alert') {
    return 'Alert' + t('stAlertLevel');
  } else if(param == 'crit') {
    return 'Critical' + t('stCritLevel');
  } else if(param == 'err') {
    return 'Error' + t('stErrLevel');
  } else if(param == 'warnning') {
    return 'Warning' + t('stWarningLevel');
  } else if(param == 'notice') {
    return 'Notice' + t('stNoticeLevel');
  } else if(param == 'info') {
    return 'Informational' + t('stInfoLevel');
  } else if(param == 'debug') {
    return 'Debug' + t('stDebugLevel');
  } else {
    return param;
  }
}

export const convertLogLevelNo = (param) => {
  if(param == 'emerg') {
    return 1;
  } else if(param == 'alert') {
    return 2;
  } else if(param == 'crit') {
    return 3;
  } else if(param == 'err') {
    return 4;
  } else if(param == 'warnning') {
    return 5;
  } else if(param == 'notice') {
    return 6;
  } else if(param == 'info') {
    return 7;
  } else if(param == 'debug') {
    return 8;
  } else {
    return 0;
  }
}

export const generateClientConfSettingObject = (param, isForViewer, t) => {

  if(param) {
    let useHypervisor = false;
    let useHomeReset = false;
    let whiteIpAll = false;
    let whiteIps = [];

    let isDeleteLog = '';
    let logMaxSize = '';
    let logMaxCount = '';
    let logRemainDate = '';
    let systemKeepFree = '';

    let boot_minno = '';
    let os_minno = '';
    let exe_minno = '';
    let media_minno = '';
    let agent_minno = '';

    let transmit_boot = '';
    let transmit_exe = '';
    let transmit_os = '';
    let transmit_media = '';
    let transmit_agent = '';

    let notify_boot = '';
    let notify_exe = '';
    let notify_os = '';
    let notify_media = '';
    let notify_agent = '';

    let show_boot = '';
    let show_exe = '';
    let show_os = '';
    let show_media = '';
    let show_agent = '';

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      
      if(ename == 'USEHYPERVISOR') {
        useHypervisor = (evalue == "true");
      } else if(ename == 'USEHOMERESET') {
        useHomeReset = (evalue == "true");
      } else if(ename == 'WHITEIPALL') {
        whiteIpAll = (evalue == "true");
      } else if(ename == 'WHITEIPS') {
        whiteIps.push(evalue);

      } else if(ename == 'isDeleteLog') {
        isDeleteLog = (evalue == "true");
      } else if(ename == 'logMaxSize') {
        logMaxSize = evalue;
      } else if(ename == 'logMaxCount') {
        logMaxCount = evalue;
      } else if(ename == 'logRemainDate') {
        logRemainDate = evalue;
      } else if(ename == 'systemKeepFree') {
        systemKeepFree = evalue;

      } else if(ename == 'transmit_boot') {
        transmit_boot = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'transmit_exe') {
        transmit_exe = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'transmit_os') {
        transmit_os = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'transmit_media') {
        transmit_media = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'transmit_agent') {
        transmit_agent = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;

      } else if(ename == 'notify_boot') {
        notify_boot = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
        boot_minno = convertLogLevelNo(evalue);
      } else if(ename == 'notify_exe') {
        notify_exe = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
        exe_minno = convertLogLevelNo(evalue);
      } else if(ename == 'notify_os') {
        notify_os = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
        os_minno = convertLogLevelNo(evalue);
      } else if(ename == 'notify_media') {
        notify_media = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
        media_minno = convertLogLevelNo(evalue);
      } else if(ename == 'notify_agent') {
        notify_agent = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
        agent_minno = convertLogLevelNo(evalue);

      } else if(ename == 'show_boot') {
        show_boot = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'show_exe') {
        show_exe = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'show_os') {
        show_os = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'show_media') {
        show_media = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      } else if(ename == 'show_agent') {
        show_agent = (isForViewer) ? convertLogLevelString(evalue, t) : evalue;
      }

    });
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      useHypervisor: useHypervisor,
      useHomeReset: useHomeReset,
      whiteIpAll: whiteIpAll,
      whiteIp: List(whiteIps),

      isDeleteLog: isDeleteLog,
      logMaxSize: logMaxSize,
      logMaxCount: logMaxCount,
      logRemainDate: logRemainDate,
      systemKeepFree: systemKeepFree,

      boot_minno: boot_minno,
      os_minno: os_minno,
      exe_minno: exe_minno,
      media_minno: media_minno,
      agent_minno: agent_minno,

      transmit_boot: transmit_boot,
      transmit_exe: transmit_exe,
      transmit_os: transmit_os,
      transmit_media: transmit_media,
      transmit_agent: transmit_agent,

      notify_boot: notify_boot,
      notify_exe: notify_exe,
      notify_os: notify_os,
      notify_media: notify_media,
      notify_agent: notify_agent,

      show_boot: show_boot,
      show_exe: show_exe,
      show_os: show_os,
      show_media: show_media,
      show_agent: show_agent
    });
  
  } else {
    return param;
  }

};

