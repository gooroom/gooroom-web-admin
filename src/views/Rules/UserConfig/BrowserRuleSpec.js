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


class BrowserRuleSpec extends Component {

  render() {

    const { classes } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateBrowserRuleObject(selectedItem, true, t);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }
    
    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category={t("dtCategoryBrowserRule")} title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, targetType)}
                  ><EditIcon /></Button>
                  {(this.props.onClickCopy) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, targetType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit && !(viewItem.get('isDefault'))) && 
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
              category={t("dtCategoryBrowserRule")} title={viewItem.get('objNm')} 
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
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("lbSetupTrustSite")} ]</Grid>
              <Grid item xs={6} className={classes.specTitle}>{bull} {t("lbDevToolUseStop")}</Grid>
              <Grid item xs={6} className={classes.specContent}>{viewItem.get('devToolRule__trust')}</Grid>
              <Grid item xs={6} className={classes.specTitle}>{bull} {t("lbLimitDownload")}</Grid>
              <Grid item xs={6} className={classes.specContent}>{viewItem.get('downloadRule__trust')}</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbControlPrint")}</Grid>
              <Grid item xs={2} className={classes.specContent}>{viewItem.get('printRule__trust')}</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbControlShowSource")}</Grid>
              <Grid item xs={2} className={classes.specContent}>{viewItem.get('viewSourceRule__trust')}</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbSetupTrustSiteInfo")}</Grid>
              <Grid item xs={8} className={classes.specContent}>
                <div style={{maxHeight:120,overflowY:'auto'}}>{viewItem.get('trustSetup')}</div>
              </Grid>
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("lbSetupUntrustSite")} ]</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbUseWebSocket")}</Grid>
              <Grid item xs={2} className={classes.specContent}>{viewItem.get('webSocket')}</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbUseWebWorker")}</Grid>
              <Grid item xs={2} className={classes.specContent}>{viewItem.get('webWorker')}</Grid>
              <Grid item xs={6} className={classes.specTitle}>{bull} {t("lbDevToolUseStop")}</Grid>
              <Grid item xs={6} className={classes.specContent}>{viewItem.get('devToolRule__untrust')}</Grid>
              <Grid item xs={6} className={classes.specTitle}>{bull} {t("lbLimitDownload")}</Grid>
              <Grid item xs={6} className={classes.specContent}>{viewItem.get('downloadRule__untrust')}</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbControlPrint")}</Grid>
              <Grid item xs={2} className={classes.specContent}>{viewItem.get('printRule__untrust')}</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbControlShowSource")}</Grid>
              <Grid item xs={2} className={classes.specContent}>{viewItem.get('viewSourceRule__untrust')}</Grid>
              <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbSetupUntrustSiteInfo")}</Grid>
              <Grid item xs={8} className={classes.specContent}>
                <div style={{maxHeight:120,overflowY:'auto'}}>{viewItem.get('untrustSetup')}</div>
              </Grid>
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("lbConnectableAddress")} ]</Grid>
              <Grid item xs={3} className={classes.specTitle}>{bull} {t("lbWhiteAddressList")}</Grid>
              <Grid item xs={9} className={classes.specContent}>
              {viewItem.get('trustUrlList').map(function(prop, index) {
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

export default translate("translations")(withStyles(GRCommonStyle)(BrowserRuleSpec));

export const generateBrowserRuleObject = (param, isForViewer, t) => {

  if(param) {
    let webSocket = '';
    let webWorker = '';

    let devToolRule__trust = '';
    let downloadRule__trust = '';
    let printRule__trust = '';
    let viewSourceRule__trust = '';

    let devToolRule__untrust = '';
    let downloadRule__untrust = '';
    let printRule__untrust = '';
    let viewSourceRule__untrust = '';

    let trustSetup = '';
    let untrustSetup = '';
    let trustUrlList = [];

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'websocket') {
        webSocket = evalue;
      } else if(ename == 'webworker') {
        webWorker = evalue;
      } else if(ename == 'devToolRule__trust') {
        if(isForViewer) {
          if(evalue == '1') {
            devToolRule__trust = t("selEnableDevTool")
          } else if(evalue == '2') {
            devToolRule__trust = t("selDisableDevTool")
          }
        } else {
          devToolRule__trust = evalue;
        }        
      } else if(ename == 'downloadRule__trust') {
        if(isForViewer) {
          if(evalue == '0') {
            downloadRule__trust = t("selNolimitDownload")
          } else if(evalue == '3') {
            downloadRule__trust = t("selLimitAllDownload")
          }
        } else {
          downloadRule__trust = evalue;
        }        
      } else if(ename == 'printRule__trust') {
        if(isForViewer) {
          if(evalue == 'true') {
            printRule__trust = t("selPermitRule")
          } else if(evalue == 'false') {
            printRule__trust = t("selNoPermitRule")
          }
        } else {
          printRule__trust = evalue;
        }        
      } else if(ename == 'viewSourceRule__trust') {
        if(isForViewer) {
          if(evalue == 'true') {
            viewSourceRule__trust = t("selPermitRule")
          } else if(evalue == 'false') {
            viewSourceRule__trust = t("selNoPermitRule")
          }
        } else {
          viewSourceRule__trust = evalue;
        }        
      } else if(ename == 'devToolRule__untrust') {
        if(isForViewer) {
          if(evalue == '1') {
            devToolRule__untrust = t("selEnableDevTool")
          } else if(evalue == '2') {
            devToolRule__untrust = t("selDisableDevTool")
          }
        } else {
          devToolRule__untrust = evalue;
        }
      } else if(ename == 'downloadRule__untrust') {
        if(isForViewer) {
          if(evalue == '0') {
            downloadRule__untrust = t("selNolimitDownload")
          } else if(evalue == '3') {
            downloadRule__untrust = t("selLimitAllDownload")
          }
        } else {
          downloadRule__untrust = evalue;
        }        
      } else if(ename == 'printRule__untrust') {
        if(isForViewer) {
          if(evalue == 'true') {
            printRule__untrust = t("selPermitRule")
          } else if(evalue == 'false') {
            printRule__untrust = t("selNoPermitRule")
          }
        } else {
          printRule__untrust = evalue;
        }        
      } else if(ename == 'viewSourceRule__untrust') {
        if(isForViewer) {
          if(evalue == 'true') {
            viewSourceRule__untrust = t("selPermitRule")
          } else if(evalue == 'false') {
            viewSourceRule__untrust = t("selNoPermitRule")
          }
        } else {
          viewSourceRule__untrust = evalue;
        }        
      } else if(ename == 'trustSetup') {
        trustSetup = evalue;
      } else if(ename == 'untrustSetup') {
        untrustSetup = evalue;
      } else if(ename == 'trust') {
        trustUrlList.push(evalue);
      }
    });
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

      webSocket: webSocket,
      webWorker: webWorker,

      devToolRule__trust: devToolRule__trust,
      downloadRule__trust: downloadRule__trust,
      printRule__trust: printRule__trust,
      viewSourceRule__trust: viewSourceRule__trust,

      devToolRule__untrust: devToolRule__untrust,
      downloadRule__untrust: downloadRule__untrust,
      printRule__untrust: printRule__untrust,
      viewSourceRule__untrust: viewSourceRule__untrust,

      trustSetup: trustSetup,
      untrustSetup: untrustSetup,
      trustUrlList: List(trustUrlList)
    });
  
  } else {
    return param;
  }

};
