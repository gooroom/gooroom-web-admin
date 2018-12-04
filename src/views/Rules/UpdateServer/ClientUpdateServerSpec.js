import React, { Component } from 'react';
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientUpdateServerSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateUpdateServerObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader
              avatar={RuleAvartar}
              category='업데이트서버 정보'
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
            <CardContent style={{padding: 10}}>
              { !hasAction &&
              <Grid container spacing={0}>
                <Grid item xs={3} className={classes.specTitle}>{bull} 이름(아이디)</Grid>
                <Grid item xs={3} className={classes.specContent}>{viewItem.get('objNm')} ({viewItem.get('objId')})</Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} 설명</Grid>
                <Grid item xs={3} className={classes.specContent}>{viewItem.get('comment')}</Grid>
              </Grid>
              }
              <Grid container spacing={0}>
                <Grid item xs={3} className={classes.specTitle}>{bull} 주 OS 정보</Grid>
                <Grid item xs={9} className={classes.specContent} style={{fontSize:'12px',textAlign:'left'}}><pre>{viewItem.get('mainos')}</pre></Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} 기반 OS 정보</Grid>
                <Grid item xs={9} className={classes.specContent} style={{fontSize:'12px',textAlign:'left',overflow:'auto'}}><pre>{viewItem.get('extos')}</pre></Grid>
                <Grid item xs={3} className={classes.specTitle}>{bull} gooroom.pref</Grid>
                <Grid item xs={9} className={classes.specContent} style={{fontSize:'12px',textAlign:'left'}}><pre>{viewItem.get('priorities')}</pre></Grid>
              </Grid>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(ClientUpdateServerSpec);

export const generateUpdateServerObject = (param) => {
  
  if(param) {

    let mainos = '';
    let extos = '';
    let priorities = '';

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'MAINOS') {
        mainos = evalue;
      } else if(ename == 'EXTOS') {
        extos = evalue;
      } else if(ename == 'PRIORITIES') {
        priorities = evalue;
      }
    });

    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      mainos: mainos,
      extos: extos,
      priorities: priorities
    });
    
  } else {
    return param;
  }

};

