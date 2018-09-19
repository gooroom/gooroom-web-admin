import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

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

    const { compId, ClientGroupProps } = this.props;
    const informOpen = ClientGroupProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = ClientGroupProps.getIn(['viewItems', compId, 'selectedViewItem']);

    return (
      <div>
      {(informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={selectedViewItem.get('grpNm')}
            subheader={selectedViewItem.get('grpId') + ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">"{selectedViewItem.get('comment')}"</Typography>
          </CardContent>
          <Divider />
          
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} >
              <ClientConfSettingComp
                compId={compId}
                objId={selectedViewItem.get('clientConfigId')} 
                objNm={selectedViewItem.get('clientConfigNm')} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <DesktopConfigComp 
                compId={compId}
                objId={selectedViewItem.get('desktopConfigId')} 
                objNm={selectedViewItem.get('desktopConfigNm')} 
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} >
              <ClientHostNameComp
                compId={compId}
                objId={selectedViewItem.get('hostNameConfigId')} 
                objNm={selectedViewItem.get('hostNameConfigNm')} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <ClientUpdateServerComp
                compId={compId}
                objId={selectedViewItem.get('updateServerConfigId')} 
                objNm={selectedViewItem.get('updateServerConfigNm')} 
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
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientGroupInform));

