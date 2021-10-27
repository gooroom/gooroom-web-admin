import React, { Component } from "react";
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class SecurityRuleSpec extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedItem } = nextProps;
    if(selectedItem !== undefined && selectedItem !== null) {
      return true;
    } else {
      return false;
    }
  }

  render() {

    const { classes } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle, isEditable } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateSecurityRuleObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category={t("dtCategorySecuRule")} title={viewItem.get('objNm')} 
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
              category={t("dtCategorySecuRule")} title={viewItem.get('objNm')} 
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
                <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbScreenSaverTime")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('screenTime')}</Grid>
                <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbPasswordChangeCycle")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('passwordTime')}</Grid>
                <Grid item xs={5} className={classes.specTitle}>{bull} {t("dtPackageEditStop")}</Grid>
                <Grid item xs={7} className={classes.specContent}>{(viewItem.get('packageHandle')) ? t("selPackageStopOn") : t("selPackageStopOff")}</Grid>
                <Grid item xs={5} className={classes.specTitle}>{bull} {t("dtBasicNetwork")}</Grid>
                <Grid item xs={7} className={classes.specContent}>{viewItem.get('globalNetwork')}</Grid>
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t("lbSetupFirewall")} ]</Grid>
                <Grid item xs={12} className={classes.specContent}>
                <Table>
                  {(viewItem.get('netItem') && viewItem.get('netItem').size > 0) &&
                  <TableBody>
                  {viewItem.get('netItem').map(n => {
                    return (
                      n.type === 'basic' 
                      ? <TableRow hover key={n.no} >
                          <TableCell>
                            <Grid container direction="column">
                              <Grid item>DIRECTION</Grid>
                              <Grid item>{n.direction}</Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container direction="column">
                              <Grid item>PROTOCOL</Grid>
                              <Grid item>{n.protocol}</Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container direction="column">
                              <Grid item>ADDRESS</Grid>
                              <Grid item>{n.address}</Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container direction="column">
                              <Grid item>SRC PORT</Grid>
                              <Grid item>{n.src}</Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container direction="column">
                              <Grid item>DST PORT</Grid>
                              <Grid item>{n.dst}</Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container direction="column">
                              <Grid item>STATE</Grid>
                              <Grid item>{n.state}</Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      : <TableRow>
                          <TableCell>
                            <Grid container direction="column">
                              <Grid item>COMMAND</Grid>
                              <Grid item>{n.command}</Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                    );
                  })}
                  </TableBody>
                  }
                  </Table>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(SecurityRuleSpec));

export const generateSecurityRuleObject = (param, isForViewer) => {

  if(param) {
    let screenTime = '';
    let passwordTime = '';
    let packageHandle = '';
    let netState = '';
    let globalNetwork = '';
    let netItem = List([]);
    
    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'screen_time') {
        screenTime = evalue;
      } else if(ename == 'password_time') {
        passwordTime = evalue;
      } else if(ename == 'package_handle') {
        packageHandle = (evalue == "true");
      } else if(ename == 'state') {
        netState = evalue;
      } else if(ename == 'firewall_network') {
        const es = evalue.split('|');
        if(es[1] === 'basic') {
          netItem = netItem.push({
            no: Number(es[0]),
            type: es[1],
            direction: es[2],
            protocol: es[3],
            address: es[4],
            src: es[5],
            dst: es[6],
            state: es[7]
          });
        } else { //advanced
          netItem = netItem.push({
            no: Number(es[0]),
            type: es[1],
            command: es[2],
          });
        }
      } else if(ename == 'global_network') {
        globalNetwork = evalue;
      }
    });

    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

      screenTime: screenTime,
      passwordTime: passwordTime,
      packageHandle: packageHandle,
      globalNetwork: globalNetwork,
      netState: netState,
      netItem: netItem.sortBy(item => item.no)
    });
  
  } else {
    return param;
  }

};
