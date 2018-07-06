import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import * as ClientManageActions from '../../modules/ClientManageModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';


import ClientConfigComp from '../Rules/ClientConfigComp';
import ClientHostsComp from '../Rules/ClientHostsComp';
import DesktopConfigComp from '../Rules/DesktopConfigComp';
import ClientUpdateServerComp from '../Rules/ClientUpdateServerComp';


//
//  ## Style ########## ########## ########## ########## ########## 
//
const componentClass = css({
  marginTop: "20px !important"
}).toString();

const contentClass = css({
  paddingTop: "0px !important"
}).toString();

const cardContainerClass = css({
  padding: "10px !important"
}).toString();


const title = css({
  marginBottom: 16,
  fontSize: 14,
}).toString();

const card = css({
  minWidth: 275,
}).toString();

const bullet = css({
  display: 'inline-block',
  margin: '0 2px',
  transform: 'scale(0.8)',
}).toString();

const pos = css({
  marginBottom: 12,
}).toString();


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManageInform extends Component {

  // .................................................

  render() {

    const { ClientManageProps } = this.props;
    const bull = <span className={bullet}>•</span>;

    console.log('ClientManageProps.viewItem : ', ClientManageProps.viewItem);

    return (
      <div className={componentClass}>
      {(ClientManageProps.informOpen) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(ClientManageProps.viewItem) ? ClientManageProps.viewItem.clientName : ''}
            subheader={ClientManageProps.viewItem.clientId + ', ' + formatDateToSimple(ClientManageProps.viewItem.regDate, 'YYYY-MM-DD')}
          />
          <CardContent className={contentClass}>
            <Typography component="pre">
              {ClientManageProps.viewItem.clientStatus}
            </Typography>
          </CardContent>
          <Divider />
          
          <Grid container spacing={8}>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <ClientConfigComp />
            </Grid>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <DesktopConfigComp />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <ClientHostsComp />
            </Grid>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <ClientUpdateServerComp />
            </Grid>
          </Grid>
        </Card>
      }
      </div>
    );

  }
}


const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientManageInform);
