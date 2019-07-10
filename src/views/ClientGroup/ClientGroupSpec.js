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

import { getAvatarExplainForGroup, getSelectedObjectInComp, getValueInSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import ClientConfSettingSpec, { generateClientConfSettingObject } from 'views/Rules/ClientConfig/ClientConfSettingSpec';
import ClientHostNameSpec, { generateClientHostNameObject } from 'views/Rules/HostName/ClientHostNameSpec';
import ClientUpdateServerSpec, { generateUpdateServerObject } from 'views/Rules/UpdateServer/ClientUpdateServerSpec';

import BrowserRuleSpec, { generateBrowserRuleObject } from 'views/Rules/UserConfig/BrowserRuleSpec';
import MediaRuleSpec, { generateMediaRuleObject } from 'views/Rules/UserConfig/MediaRuleSpec';
import SecurityRuleSpec, { generateSecurityRuleObject } from 'views/Rules/UserConfig/SecurityRuleSpec';
import SoftwareFilterSpec, { generateSoftwareFilterObject } from 'views/Rules/UserConfig/SoftwareFilterSpec';
import DesktopConfSpec from 'views/Rules/DesktopConfig/DesktopConfSpec';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';

import ClientGroupDialog from './ClientGroupDialog';

import ClientConfSettingDialog from 'views/Rules/ClientConfig/ClientConfSettingDialog';
import ClientHostNameDialog from 'views/Rules/HostName/ClientHostNameDialog';
import ClientUpdateServerDialog from 'views/Rules/UpdateServer/ClientUpdateServerDialog';

import BrowserRuleDialog from 'views/Rules/UserConfig/BrowserRuleDialog';
import MediaRuleDialog from 'views/Rules/UserConfig/MediaRuleDialog';
import SecurityRuleDialog from 'views/Rules/UserConfig/SecurityRuleDialog';
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';
import DesktopConfDialog from 'views/Rules/DesktopConfig/DesktopConfDialog';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientGroupSpec extends Component {

  // edit
  handleClickEdit = (viewItem) => {
    const { compId } = this.props;

    this.props.ClientConfSettingActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'GROUP',
      value: getValueInSelectedObjectInComp(this.props.ClientConfSettingProps, compId, 'GROUP', 'objId')
    });
    this.props.ClientHostNameActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'GROUP',
      value: getValueInSelectedObjectInComp(this.props.ClientHostNameProps, compId, 'GROUP', 'objId')
    });
    this.props.ClientUpdateServerActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'GROUP',
      value: getValueInSelectedObjectInComp(this.props.ClientUpdateServerProps, compId, 'GROUP', 'objId')
    });

    this.props.MediaRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'GROUP',
      value: getValueInSelectedObjectInComp(this.props.MediaRuleProps, compId, 'GROUP', 'objId')
    });
    this.props.BrowserRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'GROUP',
      value: getValueInSelectedObjectInComp(this.props.BrowserRuleProps, compId, 'GROUP', 'objId')
    });
    this.props.SecurityRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'GROUP',
      value: getValueInSelectedObjectInComp(this.props.SecurityRuleProps, compId, 'GROUP', 'objId')
    });
    this.props.DesktopConfActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'GROUP',
      value: getValueInSelectedObjectInComp(this.props.DesktopConfProps, compId, 'GROUP', 'confId')
    });

    this.props.ClientGroupActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  // ===================================================================
  handleEditClickForClientConfSetting = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientConfSettingProps, compId, targetType);
    this.props.ClientConfSettingActions.showDialog({
      viewItem: generateClientConfSettingObject(viewItem, false, this.props.t),
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };
  handleEditClickForClientHostName = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientHostNameProps, compId, targetType);
    this.props.ClientHostNameActions.showDialog({
      viewItem: generateClientHostNameObject(viewItem, false),
      dialogType: ClientHostNameDialog.TYPE_EDIT
    });
  };
  handleEditClickForClientUpdateServer = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientUpdateServerProps, compId, targetType);
    this.props.ClientUpdateServerActions.showDialog({
      viewItem: generateUpdateServerObject(viewItem, false),
      dialogType: ClientUpdateServerDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  handleClickEditForBrowserRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.BrowserRuleProps, compId, targetType);
    this.props.BrowserRuleActions.showDialog({
      viewItem: generateBrowserRuleObject(viewItem, false, this.props.t),
      dialogType: BrowserRuleDialog.TYPE_EDIT
    });
  };
  handleClickEditForMediaRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.MediaRuleProps, compId, targetType);
    this.props.MediaRuleActions.showDialog({
      viewItem: generateMediaRuleObject(viewItem, false),
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };
  handleClickEditForSecurityRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SecurityRuleProps, compId, targetType);
    this.props.SecurityRuleActions.showDialog({
      viewItem: generateSecurityRuleObject(viewItem, false),
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };
  handleClickEditForSoftwareFilter = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SoftwareFilterProps, compId, targetType);
    this.props.SoftwareFilterActions.showDialog({
      viewItem: generateSoftwareFilterObject(viewItem, false),
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };
  handleClickEditForDesktopConf = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DesktopConfProps, compId, targetType);
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  handleClickInheritForClientHostName = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientHostNameProps, compId, targetType);
    this.props.ClientHostNameActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientHostNameDialog.TYPE_INHERIT_GROUP
    });
  };
  handleClickInheritForClientUpdateServer = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientUpdateServerProps, compId, targetType);
    this.props.ClientUpdateServerActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientUpdateServerDialog.TYPE_INHERIT_GROUP
    });
  };
  handleClickInheritForClientConfSetting = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientConfSettingProps, compId, targetType);
    this.props.ClientConfSettingActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientConfSettingDialog.TYPE_INHERIT_GROUP
    });
  };

  handleClickInheritForBrowserRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.BrowserRuleProps, compId, targetType);
    this.props.BrowserRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: BrowserRuleDialog.TYPE_INHERIT_GROUP
    });
  };
  handleClickInheritForMediaRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.MediaRuleProps, compId, targetType);
    this.props.MediaRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: MediaRuleDialog.TYPE_INHERIT_GROUP
    });
  };
  handleClickInheritForSecurityRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SecurityRuleProps, compId, targetType);
    this.props.SecurityRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: SecurityRuleDialog.TYPE_INHERIT_GROUP
    });
  };
  handleClickInheritForSoftwareFilter = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SoftwareFilterProps, compId, targetType);
    this.props.SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_INHERIT_GROUP
    });
  };
  handleClickInheritForDesktopConf = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DesktopConfProps, compId, targetType);
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_INHERIT_GROUP
    });
  };
  // ===================================================================

  render() {
    const { compId, ClientGroupProps, isEditable } = this.props;

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
    if(viewItem && viewItem.get('grpId')) {
      groupInfo = viewItem.get('grpId');
      if(viewItem.get('regDate') && viewItem.get('regDate') !== '') {
        groupInfo += ', ' + formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD');
      }
      if(viewItem.get('comment') && viewItem.get('comment') !== '') {
        groupInfo += ', ' + viewItem.get('comment');
      }
    }

    const avatarRef = getAvatarExplainForGroup(this.props.t);

    return (
      <div>
      {(informOpen && viewItem && viewItem.get('grpId')) &&
        <Card >
          <CardHeader
            title={(viewItem.get('grpNm')) ? viewItem.get('grpNm') : ''}
            subheader={groupInfo}
            action={ (isEditable) ?
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleClickEdit(viewItem)}
                ><SettingsApplicationsIcon /></Button>
              </div> : <div></div>
            }
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            {avatarRef}
            <Grid container spacing={16}>
              <Grid item xs={12} md={12} lg={6} xl={6} >
                <ClientHostNameSpec compId={compId} specType="inform" targetType="GROUP"
                  hasAction={true} inherit={false}
                  selectedItem={(selectedClientHostNameItem) ? selectedClientHostNameItem.get('viewItem') : null}
                  ruleGrade={(selectedClientHostNameItem) ? selectedClientHostNameItem.get('ruleGrade') : null}
                  onClickEdit={this.handleEditClickForClientHostName}
                  onClickInherit={this.handleClickInheritForClientHostName}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6} >
                <ClientUpdateServerSpec compId={compId} specType="inform" targetType="GROUP"
                  hasAction={true} inherit={false}
                  selectedItem={(selectedClientUpdateServerItem) ? selectedClientUpdateServerItem.get('viewItem') : null}
                  ruleGrade={(selectedClientUpdateServerItem) ? selectedClientUpdateServerItem.get('ruleGrade') : null}
                  onClickEdit={this.handleEditClickForClientUpdateServer}
                  onClickInherit={this.handleClickInheritForClientUpdateServer}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6}>
                <ClientConfSettingSpec compId={compId} specType="inform" targetType="GROUP"
                  hasAction={true} inherit={false}
                  selectedItem={(selectedClientConfSettingItem) ? selectedClientConfSettingItem.get('viewItem') : null}
                  ruleGrade={(selectedClientConfSettingItem) ? selectedClientConfSettingItem.get('ruleGrade') : null}
                  onClickEdit={this.handleEditClickForClientConfSetting}
                  onClickInherit={this.handleClickInheritForClientConfSetting}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6} >
                <MediaRuleSpec compId={compId} specType="inform" targetType="GROUP"
                  hasAction={true} inherit={false}
                  selectedItem={(selectedMediaRuleItem) ? selectedMediaRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedMediaRuleItem) ? selectedMediaRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForMediaRule}
                  onClickInherit={this.handleClickInheritForMediaRule}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6}>
                <BrowserRuleSpec compId={compId} specType="inform" targetType="GROUP"
                  hasAction={true} inherit={false}
                  selectedItem={(selectedBrowserRuleItem) ? selectedBrowserRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedBrowserRuleItem) ? selectedBrowserRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForBrowserRule}
                  onClickInherit={this.handleClickInheritForBrowserRule}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6} >
                <SecurityRuleSpec compId={compId} specType="inform" targetType="GROUP"
                  hasAction={true} inherit={false}
                  selectedItem={(selectedSecurityRuleItem) ? selectedSecurityRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedSecurityRuleItem) ? selectedSecurityRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForSecurityRule}
                  onClickInherit={this.handleClickInheritForSecurityRule}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <SoftwareFilterSpec compId={compId} specType="inform" targetType="GROUP"
                  hasAction={true} inherit={false}
                  selectedItem={(selectedSoftwareFilterItem) ? selectedSoftwareFilterItem.get('viewItem') : null}
                  ruleGrade={(selectedSoftwareFilterItem) ? selectedSoftwareFilterItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForSoftwareFilter}
                  onClickInherit={this.handleClickInheritForSoftwareFilter}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfSpec compId={compId} specType="inform" targetType="GROUP" 
                  hasAction={true} inherit={false}
                  selectedItem={(selectedDesktopConfItem) ? selectedDesktopConfItem.get('viewItem') : null}
                  ruleGrade={(selectedDesktopConfItem) ? selectedDesktopConfItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForDesktopConf}
                  onClickInherit={this.handleClickInheritForDesktopConf}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={isEditable}
                />
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupSpec)));

