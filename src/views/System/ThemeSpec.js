import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ThemeManageActions from 'modules/ThemeManageModule';
import ThemeDialog from './ThemeDialog';

import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

import Grid from '@material-ui/core/Grid';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ThemeSpec extends Component {

  render() {

    const { classes } = this.props;
    const { compId, selectedItem } = this.props;

    let viewItem = null;
    if(selectedItem) {
      //viewItem = generateThemeObject(selectedItem.get('viewItem'));
      viewItem = selectedItem.get('viewItem')
    }

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={4} style={{marginBottom:20}}>
            <CardHeader
              title={viewItem.get('themeNm')}
              subheader={viewItem.get('themeCmt')}
              action={
                <div style={{width:48,paddingTop:10}}>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(viewItem)}
                  ><SettingsApplicationsIcon /></Button>
                </div>
              }
            ></CardHeader>
            <CardContent>
              <Grid container >
                {viewItem.get('themeIcons').map(n => {
                  const iconUrl = n.get('imgUrl') + n.get('fileName');
                  return (
                <Grid key={iconUrl} item xs={12} md={6} lg={4} xl={3}>
                  <Card>
                  <CardHeader
                    avatar={
                      <Avatar src={iconUrl} style={{ borderRadius: 0 }} />
                    }
                    title={n.get('fileEtcInfo')}
                    subheader={n.get('fileName')}
                  />
                  </Card>
                </Grid>
                  )})
                }
              </Grid>
            </CardContent>
          </Card>
        }
      <ThemeDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ThemeManageProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  ThemeManageActions: bindActionCreators(ThemeManageActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ThemeSpec));

export const generateThemeObject = (param) => {

  if(param) {
    let webSocket = '';
    let webWorker = '';
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
      trustSetup: trustSetup,
      untrustSetup: untrustSetup,
      trustUrlList: List(trustUrlList)
    });
  
  } else {
    return param;
  }

};
