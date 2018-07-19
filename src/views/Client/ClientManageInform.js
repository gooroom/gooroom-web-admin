import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from '/components/GrUtils/GrDates';
import { getMergedObject } from '/components/GrUtils/GrCommonUtils';

import * as ClientManageActions from '/modules/ClientManageCompModule';
import * as GrConfirmActions from '/modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';


import ClientConfSettingComp from '../Rules/ClientConf/ClientConfSettingComp';
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
class ClientManageInform extends Component {

  componentWillUpdate(nextProps, nextState) {

    const selectedItem = nextProps.selectedItem;
//console.log(' ClientManageInform componentWillUpdate selectedItem : ', selectedItem);
  }

  // .................................................

  render() {

    const { ClientManageProps } = this.props;
    const { isOpen, selectedClientItem :selectedItem } = this.props;
    const bull = <span className={bullet}>•</span>;

//console.log(' ClientManageInform render selectedItem : ', selectedItem);

    return (
      <div className={componentClass}>
      {(isOpen && selectedItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedItem) ? selectedItem.clientName : ''}
            subheader={selectedItem.clientId + ', ' + formatDateToSimple(selectedItem.regDate, 'YYYY-MM-DD')}
          />
          <CardContent className={contentClass}>
            <Typography component="pre">
              {selectedItem.clientStatus}
            </Typography>
          </CardContent>
          <Divider />
          
          <Grid container spacing={8}>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <ClientConfSettingComp 
                objId={selectedItem.clientConfigId} 
                objNm={selectedItem.clientConfigNm} 
              />
            </Grid>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <DesktopConfigComp 
                objId={selectedItem.desktopConfigId} 
                objNm={selectedItem.desktopConfigNm} 
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <ClientHostNameComp 
                objId={selectedItem.hostNameConfigId} 
                objNm={selectedItem.hostNameConfigNm} 
              />
            </Grid>
            <Grid item xs={6} sm={6} className={cardContainerClass}>
              <ClientUpdateServerComp 
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
  ClientManageProps: state.ClientManageCompModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientManageInform);

