import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import * as ClientManageActions from 'modules/ClientManageCompModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';


import ClientConfSettingComp from 'views/Rules/ClientConf/ClientConfSettingComp';
import ClientHostNameComp from 'views/Rules/HostName/ClientHostNameComp';
import DesktopConfigComp from 'views/Rules/DesktopConfigComp';
import ClientUpdateServerComp from 'views/Rules/UpdateServer/ClientUpdateServerComp';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManageInform extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientManageProps } = this.props;
    const { isOpen, selectedClientItem :selectedItem } = this.props;

    return (
      <div>
      {(isOpen && selectedItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedItem) ? selectedItem.clientName : ''}
            subheader={selectedItem.clientId + ', ' + formatDateToSimple(selectedItem.regDate, 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              {selectedItem.clientStatus}
            </Typography>
          </CardContent>
          <Divider />
          
          <Grid container spacing={8}>
            <Grid item xs={6} sm={6} >
              <ClientConfSettingComp 
                objId={selectedItem.clientConfigId} 
                objNm={selectedItem.clientConfigNm} 
              />
            </Grid>
            <Grid item xs={6} sm={6} >
              <DesktopConfigComp 
                objId={selectedItem.desktopConfigId} 
                objNm={selectedItem.desktopConfigNm} 
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6} sm={6} >
              <ClientHostNameComp 
                objId={selectedItem.hostNameConfigId} 
                objNm={selectedItem.hostNameConfigNm} 
              />
            </Grid>
            <Grid item xs={6} sm={6} >
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientManageInform));

