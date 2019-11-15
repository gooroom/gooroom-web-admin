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


class PolicyKitRuleSpec extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedItem } = nextProps;
    if(selectedItem !== undefined && selectedItem !== null) {
      return true;
    } else {
      return false;
    }
  }

  chgValueToReadable = (value) => {
    const { t, i18n } = this.props;

    switch(value) {
      case 'yes':
        return t('dtPkitAllow');
      case 'auth_self':
        return t('dtPkitUserAuth');
      case 'auth_self_keep':
        return t('dtPkitUserAuthKeep');
      case 'auth_admin':
        return t('dtPkitAdminAuth');
      case 'auth_admin_keep':
        return t('dtPkitAdminAuthKeep');
      case 'no':
        return t('dtPkitDisallow');
      default:
        return '';
    }

  }

  render() {

    const { classes } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle, isEditable} = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generatePolicyKitRuleObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category={t("dtCategoryPolicyKitRule")} title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  {isEditable &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, targetType)}
                  ><EditIcon /></Button>
                  }
                  {(this.props.onClickCopy && isEditable && !selectedItem.get('objId').endsWith('DEFAULT')) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, targetType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit && isEditable) && 
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
              category={t("dtCategoryPolicyKitRule")} title={viewItem.get('objNm')} 
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
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("dtPkitGooroom")} ]</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitUpdate")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('gooroomUpdate'))}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitAgent")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('gooroomAgent'))}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitRegister")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('gooroomRegister'))}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitGracEdit")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('gracEditor'))}</Grid>

                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("dtPkitNetwork")} ]</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitWireless")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('wireWireless'))}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitNetworkConfig")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('networkConfig'))}</Grid>

                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("dtPkitDevice")} ]</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitPrinter")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('printer'))}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitMount")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('diskMount'))}</Grid>

                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("dtPkitSystem")} ]</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitAdminExec")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('pkexec'))}</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} {t("dtPkitPackageManager")}</Grid>
                <Grid item xs={3} className={classes.specContent}>{this.chgValueToReadable(viewItem.get('packageManager'))}</Grid>

              </Grid>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(PolicyKitRuleSpec));

export const generatePolicyKitRuleObject = (param, isForViewer) => {

  if(param) {
    let gooroomUpdate = '';
    let gooroomAgent = '';
    let gooroomRegister = '';
    let gracEditor = '';
    let wireWireless = '';
    let networkConfig = '';
    let printer = '';
    let diskMount = '';
    let bluetooth = '';
    let pkexec = '';
    let packageManager = '';

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'gooroom_update') {
        gooroomUpdate = evalue;
      } else if(ename == 'gooroom_agent') {
        gooroomAgent = evalue;
      } else if(ename == 'gooroom_register') {
        gooroomRegister = evalue;
      } else if(ename == 'grac_editor') {
        gracEditor = evalue;
      } else if(ename == 'wire_wireless') {
        wireWireless = evalue;
      } else if(ename == 'network_config') {
        networkConfig = evalue;
      } else if(ename == 'printer') {
        printer = evalue;
      } else if(ename == 'disk_mount') {
        diskMount = evalue;
      } else if(ename == 'bluetooth') {
        bluetooth = evalue;
      } else if(ename == 'pkexec') {
        pkexec = evalue;
      } else if(ename == 'package_manager') {
        packageManager = evalue;
      }
    });
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

      gooroomUpdate: gooroomUpdate,
      gooroomAgent: gooroomAgent,
      gooroomRegister: gooroomRegister,
      gracEditor: gracEditor,
      wireWireless: wireWireless,
      networkConfig: networkConfig,
      printer: printer,
      diskMount: diskMount,
      bluetooth: bluetooth,
      pkexec: pkexec,
      packageManager: packageManager
    });
  
  } else {
    return param;
  }

};
