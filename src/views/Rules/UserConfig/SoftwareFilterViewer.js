import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import SoftwareFilterDialog from './SoftwareFilterDialog';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class SoftwareFilterViewer extends Component {

  render() {

    const { classes, viewItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={0} className={classes.ruleViewerCard}>
            <CardContent style={{padding: 10}}>
            <Grid container>
              <Grid item xs={6}>
                <Typography color="default">
                {(viewItem.get('objNm') != '') ? viewItem.get('objNm') : ''}
                </Typography>
              </Grid>
              <Grid item xs={6}>
              </Grid>
            </Grid>
            <Typography color="textSecondary">
              {(viewItem.get('comment') != '') ? '"' + viewItem.get('comment') + '"' : ''}
            </Typography>
            <Divider />
            <div style={{marginTop:20}}>
              <InputLabel>Red 색상의 소프트웨어는 설치불가(설치금지)로 지정된 소프트웨어입니다.</InputLabel>
              <Grid container spacing={8} alignItems="stretch" direction="row" justify="flex-start" style={{marginTop:10}}>
              {SoftwareFilterDialog.SW_LIST && SoftwareFilterDialog.SW_LIST.map(n => {
                const selected = (viewItem.getIn(['SWITEM', n.tag])) ? true : false;
                const swStyle = (selected) ? {color:'red'} : {color:'gray'};
                return (
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={n.no}>
                    <Card>
                      <CardContent style={{padding:3}}>
                        <Typography variant="subtitle2" style={swStyle}>
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

export default withStyles(GRCommonStyle)(SoftwareFilterViewer);
