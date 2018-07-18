import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedObject } from '../../components/GrUtils/GrCommonUtils';

import * as ClientGroupActions from '../../modules/ClientGroupCompModule';
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
import ClientHostNameComp from '../Rules/ClientHostNameComp';
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
class ClientGroupInform extends Component {

  componentWillUpdate(nextProps, nextState) {
//console.log(' -- componentWillUpdate --');

    const selectedItem = nextProps.selectedItem;
//console.log(' selectedItem : ', selectedItem);
  }

  // .................................................

  render() {

    const { compId, ClientGroupCompProps } = this.props;
    const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps, ClientDesktopConfigProps } = this.props;
    const { isOpen, selectedItem } = this.props;

    return (
      <div className={componentClass}>
      {(isOpen) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedItem) ? selectedItem.grpNm : ''}
            subheader={selectedItem.grpId + ', ' + formatDateToSimple(selectedItem.regDate, 'YYYY-MM-DD')}
          />
          <CardContent className={contentClass}>
            <Typography component="pre">
              "{selectedItem.comment}"
            </Typography>
          </CardContent>
          <Divider />
          
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} className={cardContainerClass}>
              <ClientConfigComp
                compId={ClientConfSettingProps.compHeaderName + compId}
                objId={selectedItem.clientConfigId} 
                objNm={selectedItem.clientConfigNm} 
              />
            </Grid>
            <Grid item xs={12} sm={6} className={cardContainerClass}>
              <DesktopConfigComp 
                compId={ClientDesktopConfigProps.compHeaderName + compId}
                objId={selectedItem.desktopConfigId} 
                objNm={selectedItem.desktopConfigNm} 
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} className={cardContainerClass}>
              <ClientHostNameComp
                compId={ClientHostNameProps.compHeaderName + compId}
                objId={selectedItem.hostNameConfigId} 
                objNm={selectedItem.hostNameConfigNm} 
              />
            </Grid>
            <Grid item xs={12} sm={6} className={cardContainerClass}>
              <ClientUpdateServerComp
                compId={ClientUpdateServerProps.compHeaderName + compId}
                objId={selectedItem.updateServerConfigId} 
                objNm={selectedItem.updateServerConfigNm} 
              />
            </Grid>
          </Grid>
        </Card>
      }
      </div>
    );

  }
}


const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupCompModule,
  ClientConfSettingProps: state.ClientConfSettingModule,
  ClientHostNameProps: state.ClientHostNameModule,
  ClientUpdateServerProps: state.ClientUpdateServerModule,
  ClientDesktopConfigProps: state.ClientDesktopConfigModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupInform);

