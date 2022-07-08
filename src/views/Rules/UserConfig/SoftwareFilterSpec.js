import React, { Component } from "react";
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import SoftwareFilterDialog from './SoftwareFilterDialog';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';
import GRSoftwareCardHeader from 'components/GRComponents/GRSoftwareCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class SoftwareFilterSpec extends Component {

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
      viewItem = generateSoftwareFilterObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category={t("dtCategorySWRule")} title={viewItem.get('objNm')} 
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
              category={t("dtCategorySWRule")} title={viewItem.get('objNm')} 
              subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
            />
          }
            <CardContent>
              <InputLabel className={classes.specTitle} style={{color:'black'}}>{t("msStopRunRedSW")}</InputLabel>
              <Grid container spacing={8} alignItems="flex-start" direction="row" justify="flex-start" style={{marginTop:10}}>
              {SoftwareFilterDialog.SW_LIST && SoftwareFilterDialog.SW_LIST.map(n => {
                const selected = (viewItem.getIn(['SWITEM', n.tag])) ? true : false;
                const swStyle = (selected) ? {color:'red',fontWeight:'bold'} : {color:'#8484',fontWeight:'bold'};
                return (
                  <div style={{width: 570,height: 240,margin: 10,border:'1.5px solid #BFBFBF'}}>
                    {/* Header */}
                    <div style={{height: 46,position:'relative',lineHeight:'46px',padding: '0 20px',background:'#F2F2F2',borderBottom: '1.5px solid #BFBFBF'}}>
                      <span>{n.tag}</span>
                      <span style={{position: 'absolute',right: 0}}>
                        <FormControlLabel control={
                            <Switch 
                              // onChange={} 
                              color="primary"
                              // checked={} 
                            />
                          }
                        />
                      </span>
                    </div>
                    {/* Body */}
                    <div >
                      <ul style={{listStyle:'none',margin: 0,padding: 0,height: 192,overflow:'auto'}}>
                        {/* 반복 시작 */}
                        <li style={{padding:'20px 30px'}}>
                          <div style={{display:'inline-block'}}>
                            <img src={{/* 경로 추가 */}} height="50" width="50" />
                          </div>
                          <div style={{display:'inline-block',verticalAlign:'top',marginLeft:'30px'}}>
                            <div style={swStyle}>{n.name}</div>
                            <div>{n.name_kr}</div>
                          </div>
                        </li>{/* 반복 끝 */}
                      </ul>
                    </div>
                  </div>

                  // 기존 소스
                  //   <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={n.no}>
                  //   <Card>
                  //     <GRSoftwareCardHeader category={n.tag} style={{height:30}}/>
                  //     <CardContent style={{padding:6}}>
                  //       <Typography variant="body1" style={swStyle}>{n.name}</Typography>
                  //       <Typography variant="caption" color="textSecondary">{n.name_kr}</Typography>
                  //     </CardContent>
                  //   </Card>
                  // </Grid>
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

export default translate("translations")(withStyles(GRCommonStyle)(SoftwareFilterSpec));

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
