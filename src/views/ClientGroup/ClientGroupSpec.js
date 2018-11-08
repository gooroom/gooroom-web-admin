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
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';

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
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';
import SoftwareFilterSpec from 'views/Rules/UserConfig/SoftwareFilterSpec';
import DesktopConfDialog from 'views/Rules/DesktopConfig/DesktopConfDialog';
import DesktopConfSpec from 'views/Rules/DesktopConfig/DesktopConfSpec';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupSpec extends Component {

  // edit
  handleEditClick = (id) => {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const viewItem = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    ClientGroupActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };


  // ===================================================================
  handleEditClickForClientConfSetting = (viewItem, compType) => {
    this.props.ClientConfSettingActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };
  handleEditClickForClientHostName = (viewItem, compType) => {
    this.props.ClientHostNameActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientHostNameDialog.TYPE_EDIT
    });
  };
  handleEditClickForClientUpdateServer = (viewItem, compType) => {
    this.props.ClientUpdateServerActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientUpdateServerDialog.TYPE_EDIT
    });
  };
  handleEditClickForMediaRule = (viewItem, compType) => {
    this.props.MediaRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForBrowserRule = (viewItem, compType) => {
    this.props.BrowserRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: BrowserRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForSecurityRule = (viewItem, compType) => {
    this.props.SecurityRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForSoftwareFilter = (viewItem, compType) => {
    this.props.SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };
  handleEditClickForDesktopConf = (viewItem, compType) => {
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  render() {

    const { compId, ClientGroupProps } = this.props;

    const informOpen = ClientGroupProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = ClientGroupProps.getIn(['viewItems', compId, 'viewItem']);

    const selectedClientConfSettingItem = this.props.ClientConfSettingProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedClientHostNameItem = this.props.ClientHostNameProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedClientUpdateServerItem = this.props.ClientUpdateServerProps.getIn(['viewItems', compId, 'GROUP']);

    const selectedMediaRuleItem = this.props.MediaRuleProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedBrowserRuleItem = this.props.BrowserRuleProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedSecurityRuleItem = this.props.SecurityRuleProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedSoftwareFilterItem = this.props.SoftwareFilterProps.getIn(['viewItems', compId, 'GROUP']);
    const selectedDesktopConfItem = this.props.DesktopConfProps.getIn(['viewItems', compId, 'GROUP']);

    let groupInfo = '';
    if(viewItem) {
      groupInfo = viewItem.get('grpId');
      if(viewItem.get('regDate') && viewItem.get('regDate') !== '') {
        groupInfo += ', ' + formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD');
      }
      if(viewItem.get('comment') && viewItem.get('comment') !== '') {
        groupInfo += ', ' + viewItem.get('comment');
      }
    }

    return (
      <div>
      {(informOpen && viewItem) &&
        <Card >
          <CardHeader
            title={viewItem.get('grpNm')}
            subheader={groupInfo}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleEditClick(viewItem.get('grpId'))}
                ><SettingsApplicationsIcon /></Button>
              </div>
            }
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item xs={12} md={12} lg={6} xl={4}>
                <ClientConfSettingSpec compId={compId}
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedClientConfSettingItem}
                  onClickEdit={this.handleEditClickForClientConfSetting}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <MediaRuleSpec compId={compId}
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedMediaRuleItem}
                  onClickEdit={this.handleEditClickForMediaRule}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <ClientUpdateServerSpec compId={compId}
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedClientUpdateServerItem}
                  onClickEdit={this.handleEditClickForClientUpdateServer}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4}>
                <BrowserRuleSpec compId={compId}
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedBrowserRuleItem}
                  onClickEdit={this.handleEditClickForBrowserRule}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <SecurityRuleSpec compId={compId}
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedSecurityRuleItem}
                  onClickEdit={this.handleEditClickForSecurityRule}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <SoftwareFilterSpec compId={compId}
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedSoftwareFilterItem}
                  onClickEdit={this.handleEditClickForSoftwareFilter}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <ClientHostNameSpec compId={compId}
                  specType="inform" targetType="GROUP"
                  selectedItem={selectedClientHostNameItem}
                  onClickEdit={this.handleEditClickForClientHostName}
                  inherit={false}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfSpec compId={compId}
                specType="inform" targetType="GROUP" 
                selectedItem={selectedDesktopConfItem}
                onClickEdit={this.handleEditClickForDesktopConf}
                inherit={false} />
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
  SecurityRuleProps: state.SecurityRuleModule,
  SoftwareFilterProps: state.SoftwareFilterModule,
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupSpec));

