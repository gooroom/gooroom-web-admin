import React, { Component } from "react";
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import SoftwareFilterDialog from './SoftwareFilterDialog';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class SoftwareFilterSpec extends Component {

  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, compType, targetType, selectedItem, ruleGrade, hasAction } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateSoftwareFilterObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category='소프트웨어 제한 정책' title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, compType)}
                  ><SettingsApplicationsIcon /></Button>
                  {(this.props.onClickCopy) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, compType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit && !(selectedItem.get('isDefault'))) && 
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickInherit(compId, compType)}
                  ><ArrowDropDownCircleIcon /></Button>
                  }
                </div>
              }
            />
            }
            <CardContent>
            <div style={{marginTop:20}}>
              <InputLabel>Red 색상의 소프트웨어는 설치불가(설치금지)로 지정된 소프트웨어입니다.</InputLabel>
              <Grid container spacing={8} alignItems="flex-start" direction="row" justify="flex-start" style={{marginTop:10}}>
              {SoftwareFilterDialog.SW_LIST && SoftwareFilterDialog.SW_LIST.map(n => {
                const selected = (viewItem.getIn(['SWITEM', n.tag])) ? true : false;
                const swStyle = (selected) ? {color:'red'} : {color:'gray'};
                return (
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={n.no}>
                    <Card>
                      <CardContent style={{padding:3}}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        [{n.tag}]
                        </Typography>
                        <Typography variant="h6" component="h4" style={swStyle}>
                          {n.name}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          {n.name_kr}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  );
                })
              }
              </Grid>
            </div>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(SoftwareFilterSpec);

export const generateSoftwareFilterObject = (param, isForViewer) => {

  if(param) {
    let filtered_software = [];

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'filtered_software') {
        filtered_software.push(evalue);
      }
    });

    let selectedSoftware = Map({});
    filtered_software.map(n => {
      selectedSoftware = selectedSoftware.set(n, 'allow');
    })
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

      SWITEM: selectedSoftware
    });
  
  } else {
    return param;
  }

};
