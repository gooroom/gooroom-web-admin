import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getTableSelectedObject } from 'components/GrUtils/GrTableListUtils';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ClientConfSettingComp from 'views/Rules/ClientConfig/ClientConfSettingComp';
import ClientHostNameComp from 'views/Rules/HostName/ClientHostNameComp';
import DesktopConfigComp from 'views/Rules/DesktopConfig/DesktopConfigComp';
import ClientUpdateServerComp from 'views/Rules/UpdateServer/ClientUpdateServerComp';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupInform extends Component {

  render() {

    const { compId, ClientGroupCompProps } = this.props;
    //const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps, ClientDesktopConfigProps } = this.props;

    const selectedItem = getTableSelectedObject(ClientGroupCompProps, compId);

    if(selectedItem && selectedItem.hostNameConfigId) {
      console.log('selectedItem.hostNameConfigId : ' + selectedItem.hostNameConfigId);
    }
 
    return (
      <div>
      {(ClientGroupCompProps.informOpen && selectedItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedItem) ? selectedItem.grpNm : ''}
            subheader={selectedItem.grpId + ', ' + formatDateToSimple(selectedItem.regDate, 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              "{selectedItem.comment}"
            </Typography>
          </CardContent>
          <Divider />
          
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} >
              <ClientConfSettingComp
                compId={compId}
                objId={selectedItem.clientConfigId} 
                objNm={selectedItem.clientConfigNm} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <DesktopConfigComp 
                compId={compId}
                objId={selectedItem.desktopConfigId} 
                objNm={selectedItem.desktopConfigNm} 
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} >
              <ClientHostNameComp
                compId={compId}
                objId={selectedItem.hostNameConfigId} 
                objNm={selectedItem.hostNameConfigNm} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <ClientUpdateServerComp
                compId={compId}
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
  ClientGroupCompProps: state.ClientGroupModule,
  ClientConfSettingProps: state.ClientConfSettingModule,
  ClientHostNameProps: state.ClientHostNameModule,
  ClientUpdateServerProps: state.ClientUpdateServerModule,
  ClientDesktopConfigProps: state.ClientDesktopConfigModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientGroupInform));

