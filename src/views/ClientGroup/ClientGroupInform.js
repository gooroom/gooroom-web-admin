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

    console.log('ClientGroupInform selectedItem : ', ((selectedItem) ? selectedItem.toJS() : ''));
 
    return (
      <div>
      {(ClientGroupCompProps.get('informOpen') && selectedItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={selectedItem.get('grpNm')}
            subheader={selectedItem.get('grpId') + ', ' + formatDateToSimple(selectedItem.get('regDate'), 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">"{selectedItem.get('comment')}"</Typography>
          </CardContent>
          <Divider />
          
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} >
              <ClientConfSettingComp
                compId={compId}
                objId={selectedItem.get('clientConfigId')} 
                objNm={selectedItem.get('clientConfigNm')} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <DesktopConfigComp 
                compId={compId}
                objId={selectedItem.get('desktopConfigId')} 
                objNm={selectedItem.get('desktopConfigNm')} 
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} >
              <ClientHostNameComp
                compId={compId}
                objId={selectedItem.get('hostNameConfigId')} 
                objNm={selectedItem.get('hostNameConfigNm')} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <ClientUpdateServerComp
                compId={compId}
                objId={selectedItem.get('updateServerConfigId')} 
                objNm={selectedItem.get('updateServerConfigNm')} 
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

