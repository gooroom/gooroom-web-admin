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

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import ClientConfSettingComp from 'views/Rules/ClientConfig/ClientConfSettingComp';
import ClientHostNameComp from 'views/Rules/HostName/ClientHostNameComp';
import ClientUpdateServerComp from 'views/Rules/UpdateServer/ClientUpdateServerComp';

import DesktopConfigComp from 'views/Rules/DesktopConfig/DesktopConfigComp';

import BrowserRuleComp from 'views/Rules/UserConfig/BrowserRuleComp';
import MediaRuleComp from 'views/Rules/UserConfig/MediaRuleComp';
import SecurityRuleComp from 'views/Rules/UserConfig/SecurityRuleComp';


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
          <CardContent>

            <Grid container spacing={16}>
              <Grid item xs={12} sm={6} lg={6}>
                <Card elevation={0}>
                  <CardHeader
                    title={selectedViewItem.get('grpNm')}
                    subheader={selectedViewItem.get('grpId') + ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD')}
                  ></CardHeader>
                  <CardContent>
                    <Typography component="pre">"{selectedViewItem.get('comment')}"</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>

                <Card elevation={0}>
                  <CardContent style={{textAlign: 'right'}}>

                  </CardContent>
                </Card>
              
              </Grid>
            </Grid>

            <Grid container spacing={32}>
              <Grid item xs={12} sm={12} lg={6}>
                <ClientConfSettingComp compId={compId} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <ClientHostNameComp compId={compId} />
              </Grid>
            </Grid>

            <Grid container spacing={32}>
              <Grid item xs={12} sm={12} lg={6}>
                <ClientUpdateServerComp compId={compId} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <BrowserRuleComp compId={compId} />
              </Grid>
            </Grid>

            <Grid container spacing={32}>
              <Grid item xs={12} sm={12} lg={6}>
                <MediaRuleComp compId={compId} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <SecurityRuleComp compId={compId} />
              </Grid>
            </Grid>

            <Grid container spacing={32}>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfigComp compId={compId} />
              </Grid>
            </Grid>


          </CardContent>
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

