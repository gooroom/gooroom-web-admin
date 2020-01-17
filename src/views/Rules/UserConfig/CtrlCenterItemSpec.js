import React, { Component } from "react";
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import CtrlCenterItemDialog from './CtrlCenterItemDialog';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';
import GRSoftwareCardHeader from 'components/GRComponents/GRSoftwareCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class CtrlCenterItemSpec extends Component {

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
      viewItem = generateCtrlCenterItemObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category={t("dtCategoryCTIRule")} title={viewItem.get('objNm')} 
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
              category={t("dtCategoryCTIRule")} title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
            />
            }
            <CardContent>
              <InputLabel className={classes.specTitle} style={{color:'black'}}>{t("msStopRunRedCTI")}</InputLabel>
              <Grid container spacing={8} alignItems="flex-start" direction="row" justify="flex-start" style={{marginTop:10}}>
              {CtrlCenterItemDialog.ITEM_LIST && CtrlCenterItemDialog.ITEM_LIST.map(n => {
                const selected = (viewItem.getIn(['CTRLITEM', n.tag])) ? true : false;
                const swStyle = (selected) ? {color:'blue',fontWeight:'bold'} : {color:'lightgray',fontWeight:'bold'};
                return (
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={n.no}>
                    <Card>
                    <GRSoftwareCardHeader category={n.tag} />
                      <CardContent style={{padding:6}}>
                        <Typography variant="body1" style={swStyle}>{n.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{n.name_kr}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  );
                })
              }
              </Grid>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(CtrlCenterItemSpec));

export const generateCtrlCenterItemObject = (param, isForViewer) => {

  if(param) {
    let ctrlcenter_items = [];

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'ctrlcenter_items') {
        ctrlcenter_items.push(evalue);
      }
    });

    let selectedCtrlCenterItem = Map({});
    ctrlcenter_items.map(n => {
      selectedCtrlCenterItem = selectedCtrlCenterItem.set(n, 'allow');
    })
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

      CTRLITEM: selectedCtrlCenterItem
    });
  
  } else {
    return param;
  }

};
