import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import ClientGroupDialog from './ClientGroupDialog';

import ClientConfSettingDialog from 'views/Rules/ClientConfig/ClientConfSettingDialog';
import ClientConfSettingSpec from 'views/Rules/ClientConfig/ClientConfSettingSpec';
import ClientHostNameDialog from 'views/Rules/HostName/ClientHostNameDialog';
import ClientHostNameSpec from 'views/Rules/HostName/ClientHostNameSpec';
import ClientUpdateServerDialog from 'views/Rules/UpdateServer/ClientUpdateServerDialog';
import ClientUpdateServerSpec from 'views/Rules/UpdateServer/ClientUpdateServerSpec';

import BrowserRuleDialog from 'views/Rules/UserConfig/BrowserRuleDialog';
import BrowserRuleSpec from 'views/Rules/UserConfig/BrowserRuleSpec';
import MediaRuleDialog from 'views/Rules/UserConfig/MediaRuleDialog';
import MediaRuleSpec from 'views/Rules/UserConfig/MediaRuleSpec';
import SecurityRuleDialog from 'views/Rules/UserConfig/SecurityRuleDialog';
import SecurityRuleSpec from 'views/Rules/UserConfig/SecurityRuleSpec';

import DesktopConfSpec from 'views/Rules/DesktopConfig/DesktopConfSpec';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupInform extends Component {

  // edit
  handleEditClick = (id) => {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const selectedViewItem = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    ClientGroupActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };


  // ===================================================================
  handleEditClickForClientConfSetting = (viewItem, compType) => {
    this.props.ClientConfSettingActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };
  handleEditClickForClientHostName = (viewItem, compType) => {
    this.props.ClientHostNameActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: ClientHostNameDialog.TYPE_EDIT
    });
  };
  handleEditClickForClientUpdateServer = (viewItem, compType) => {
    this.props.ClientUpdateServerActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: ClientUpdateServerDialog.TYPE_EDIT
    });
  };
  handleEditClickForMediaRule = (viewItem, compType) => {
    this.props.MediaRuleActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForBrowserRule = (viewItem, compType) => {
    this.props.BrowserRuleActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: BrowserRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForSecurityRule = (viewItem, compType) => {
    this.props.SecurityRuleActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };

  // ===================================================================
  
  render() {

    const { compId, ClientGroupProps } = this.props;

    const informOpen = ClientGroupProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = ClientGroupProps.getIn(['viewItems', compId, 'selectedViewItem']);

    const selectedClientConfSettingItem = this.props.ClientConfSettingProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedClientHostNameItem = this.props.ClientHostNameProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedClientUpdateServerItem = this.props.ClientUpdateServerProps.getIn(['viewItems', compId, 'GROUP']);

    const selectedMediaRuleItem = this.props.MediaRuleProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedBrowserRuleItem = this.props.BrowserRuleProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedSecurityRuleItem = this.props.SecurityRuleProps.getIn(['viewItems', compId, 'GROUP']);
    
    let groupInfo = '';
    if(selectedViewItem) {
      groupInfo = selectedViewItem.get('grpId');
      if(selectedViewItem.get('regDate') && selectedViewItem.get('regDate') !== '') {
        groupInfo += ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD');
      }
      if(selectedViewItem.get('comment') && selectedViewItem.get('comment') !== '') {
        groupInfo += ', ' + selectedViewItem.get('comment');
      }
    }

    return (
      <div>
      {(informOpen && selectedViewItem) &&
        <Card >
          <CardHeader
            title={selectedViewItem.get('grpNm')}
            subheader={groupInfo}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleEditClick(selectedViewItem.get('grpId'))}
                ><SettingsApplicationsIcon /></Button>
              </div>
            }
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={12} lg={6}>
                <ClientConfSettingSpec 
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedClientConfSettingItem}
                  handleEditClick={this.handleEditClickForClientConfSetting}
                  inherit={false}
                />
                <MediaRuleSpec 
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedMediaRuleItem}
                  handleEditClick={this.handleEditClickForMediaRule}
                  inherit={false}
                />
                <ClientUpdateServerSpec 
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedClientUpdateServerItem}
                  handleEditClick={this.handleEditClickForClientUpdateServer}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <BrowserRuleSpec 
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedBrowserRuleItem}
                  handleEditClick={this.handleEditClickForBrowserRule}
                  inherit={false}
                />
                <SecurityRuleSpec 
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedSecurityRuleItem}
                  handleEditClick={this.handleEditClickForSecurityRule}
                  inherit={false}
                />
                <ClientHostNameSpec 
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedClientHostNameItem}
                  handleEditClick={this.handleEditClickForClientHostName}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfSpec compId={compId} targetType="GROUP" inherit={false} />
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
  ClientGroupProps: state.ClientGroupModule,

  ClientConfSettingProps: state.ClientConfSettingModule,
  ClientHostNameProps: state.ClientHostNameModule,
  ClientUpdateServerProps: state.ClientUpdateServerModule,
  
  MediaRuleProps: state.MediaRuleModule,
  BrowserRuleProps: state.BrowserRuleModule,
  SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupInform));

