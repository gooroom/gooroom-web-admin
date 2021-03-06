import React, { Component } from 'react';
import { Map } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as ClientManageActions from 'modules/ClientManageModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as CtrlCenterItemActions from 'modules/CtrlCenterItemModule';
import * as PolicyKitRuleActions from 'modules/PolicyKitRuleModule';

import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';

import ClientPackageSelectDialog from "views/ClientPackage/ClientPackageSelectDialog";

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import ClientManageCompWithPackage from 'views/Client/ClientManageCompWithPackage';

import ClientGroupTreeComp from 'views/ClientGroup/ClientGroupTreeComp';
import ClientPackageComp from 'views/ClientPackage/ClientPackageComp';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";

class ClientPackageManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenClientPackageSelect: false,
      targetType: ''
    };
  }

  // Check Group Item
  handleClientGroupCheck = (checkedGroupIdArray) => {
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

    this.props.ClientGroupActions.changeCompVariableObject({
      compId: compId,
      valueObj: {checkedIds: checkedGroupIdArray}
    });

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: checkedGroupIdArray, page:0
    }, {isResetSelect:true});
  };

  // Select Group Item
  handleClientGroupSelect = (selectedGroupId, selectedGroupNm) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const selectRowObject = getRowObjectById(ClientGroupProps, compId, selectedGroupId, 'grpId');
    // show client group info.
    if(selectRowObject) {
      ClientGroupActions.changeCompVariable({
        name: 'viewItem',
        value: selectRowObject,
        compId: compId
      });
      this.resetClientGroupRules(compId, selectRowObject.get('grpId'));
    }
  };

  // Select Client Item
  handleClientSelect = (selectedClientObj) => {
    const { ClientPackageProps, ClientPackageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // show client info.
    if(selectedClientObj) {
      
      // show client information
      this.props.ClientManageActions.showClientManageInform({ compId: compId, viewItem: selectedClientObj });

      // show package list by client id
      ClientPackageActions.readPackageListPagedInClient(ClientPackageProps, compId, {
        clientId: selectedClientObj.get('clientId'), page:0, isFiltered: false
      });

    }
  };

  resetClientGroupRules(compId, grpId) {
    const { ClientGroupProps } = this.props;
    const { ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions, SoftwareFilterActions, CtrlCenterItemActions, PolicyKitRuleActions, DesktopConfActions } = this.props;

    const selectedGroupObj = getRowObjectById(ClientGroupProps, compId, grpId, 'grpId');
    if(selectedGroupObj) {
      // show rules
      ClientConfSettingActions.getClientConfByGroupId({ compId: compId, groupId: grpId });   
      ClientHostNameActions.getClientHostNameByGroupId({ compId: compId, groupId: grpId });
      ClientUpdateServerActions.getClientUpdateServerByGroupId({ compId: compId, groupId: grpId });   
      // get browser rule info
      BrowserRuleActions.getBrowserRuleByGroupId({ compId: compId, groupId: grpId });
      // get media control setting info
      MediaRuleActions.getMediaRuleByGroupId({ compId: compId, groupId: grpId });
      // get client secu info
      SecurityRuleActions.getSecurityRuleByGroupId({ compId: compId, groupId: grpId });   
      // get filtered software rule
      SoftwareFilterActions.getSoftwareFilterByGroupId({ compId: compId, groupId: grpId });   
      // get control center item rule
      CtrlCenterItemActions.getCtrlCenterItemByGroupId({ compId: compId, groupId: grpId });   
      // get policy kit  rule
      PolicyKitRuleActions.getPolicyKitByGroupId({ compId: compId, groupId: grpId });   
      // get desktop conf info
      DesktopConfActions.getDesktopConfByGroupId({ compId: compId, groupId: grpId });   

      ClientGroupActions.showClientGroupInform({ compId: compId, viewItem: selectedGroupObj, selectId: '' });
    }

  }
  // CLIENT COMPONENT --------------------------------

  isClientChecked = () => {
    const checkedIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    return (checkedIds && checkedIds.size > 0);
  }

  isGroupChecked = () => {
    const checkedIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    return (checkedIds && checkedIds.size > 0);
  }

  // install package user selected
  handleClientPackageInstall = (selectedPackage) => {
    const { ClientGroupProps, ClientManageProps, GRConfirmActions, t } = this.props;

    if(selectedPackage && selectedPackage.size > 0) {

      if(this.state.targetType === 'GROUP') {

        const checkedGroupIds = ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
        GRConfirmActions.showConfirm({
            confirmTitle: t("dtInstallSelectedPackage"),
            confirmMsg: t("msgInstallSelectedPackage"),
            handleConfirmResult: (confirmValue, paramObject) => {
              if(confirmValue) {
                this.props.ClientPackageActions.updatePackageInGroup({
                  groupIds: paramObject.checkedGroupIds,
                  packageIds: paramObject.selectedPackageIds
                }).then((res) => {
                  // close dialog
                  this.setState({ isOpenClientPackageSelect: false });
                });
              }
            },
            confirmObject: {
              checkedGroupIds: (checkedGroupIds) ? checkedGroupIds.toJS().join(',') : '',
              selectedPackageIds: (selectedPackage) ? selectedPackage.toJS().join(',') : ''
            }
        });
  
      } else if(this.state.targetType === 'CLIENT') {

        const checkedClientIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
        GRConfirmActions.showConfirm({
            confirmTitle: t("dtInstallSelectedPackage"),
            confirmMsg: t("msgInstallSelectedPackage"),
            handleConfirmResult: (confirmValue, paramObject) => {
              if(confirmValue) {
                this.props.ClientPackageActions.updatePackageInClient({
                  clientIds: paramObject.checkedClientIds,
                  packageIds: paramObject.selectedPackageIds
                }).then((res) => {
                  // close dialog
                  this.setState({ isOpenClientPackageSelect: false });
                });
              }
            },
            confirmObject: {
              checkedClientIds: (checkedClientIds) ? checkedClientIds.toJS().join(',') : '',
              selectedPackageIds: (selectedPackage) ? selectedPackage.toJS().join(',') : ''
            }
        });
  
      }
    }
  }

  handleClientPackageSelectClose = () => {
    this.setState({
      isOpenClientPackageSelect: false
    })
  }

  handleAllUpdateForClient = (event) => {
    event.stopPropagation();
    const { GRConfirmActions, t } = this.props;
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtAllPackageUpdate"),
      confirmMsg: t("msgAllPackageUpdate"),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if(confirmValue) {
          const { ClientGroupProps, ClientManageProps, ClientPackageActions } = this.props;
          const compId = this.props.match.params.grMenuId;
          const checkedGroupIds = ClientGroupProps.getIn(['viewItems', compId, 'checkedIds']);
          const checkedClientIds = ClientManageProps.getIn(['viewItems', compId, 'checkedIds']);

          ClientPackageActions.createPackageAllUpgrade({
            compId: compId,
            clientId: (checkedClientIds) ? checkedClientIds.toJS().join(',') : '',
            groupId: (checkedGroupIds) ? checkedGroupIds.toJS().join(',') : ''
          }).then(() => {
            ClientManageActions.readClientListPaged(ClientManageProps, compId, { page:0 });
          });
        }
      },
      confirmObject: {}
    });
  }

  handleTotalPackageUpgradeForClient = (event) => {
    event.stopPropagation();
    const { GRConfirmActions, t } = this.props;
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtAllPackageUpdate"),
      confirmMsg: t("msgTotalPackageUpdateForClient"),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if(confirmValue) {
          const { ClientManageProps, ClientPackageActions } = this.props;
          const compId = this.props.match.params.grMenuId;
          const checkedClientIds = ClientManageProps.getIn(['viewItems', compId, 'checkedIds']);
          ClientPackageActions.createTotalPackageUpgradeForClient({
            compId: compId,
            clientIds: (checkedClientIds) ? checkedClientIds.toJS().join(',') : ''
          }).then(() => {
            ClientManageActions.readClientListPaged(ClientManageProps, compId, { page:0 });
          });
        }
      },
      confirmObject: {}
    });
  }

  handleTotalPackageUpgradeForGroup = (event) => {
    event.stopPropagation();
    const { GRConfirmActions, t } = this.props;
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtAllPackageUpdate"),
      confirmMsg: t("msgTotalPackageUpdateForGroup"),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if(confirmValue) {
          const { ClientGroupProps, ClientManageProps, ClientPackageActions } = this.props;
          const compId = this.props.match.params.grMenuId;
          const checkedGroupIds = ClientGroupProps.getIn(['viewItems', compId, 'checkedIds']);
          ClientPackageActions.createTotalPackageUpgradeForGroup({
            compId: compId,
            groupIds: (checkedGroupIds) ? checkedGroupIds.toJS().join(',') : ''
          }).then((res) => {
            this.props.GRAlertActions.showAlert({
              alertTitle: t("dtSystemNotice"),
              alertMsg: res.response.data.status.message
            });
            ClientManageActions.readClientListPaged(ClientManageProps, compId, { page:0 });
          });
        }
      },
      confirmObject: {}
    });
  }

  // handleAddPackage = (event) => {
  //   event.stopPropagation();
  //   const { ClientGroupProps, ClientManageProps } = this.props;
  //   const { t, i18n } = this.props;
  //   const compId = this.props.match.params.grMenuId;

  //   const checkedGroupIds = ClientGroupProps.getIn(['viewItems', compId, 'checkedIds']);
  //   const checkedClientIds = ClientManageProps.getIn(['viewItems', compId, 'checkedIds']);
    
  //   if((checkedGroupIds && checkedGroupIds.size > 0) || (checkedClientIds && checkedClientIds.size > 0)) {
  //     this.setState({
  //       isOpenClientPackageSelect: true
  //     });
  //   } else {
  //     this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectClientForUpdate"));
  //   }
  // }

  handleAddPackageForClient = (event) => {
    event.stopPropagation();
    this.setState({
      isOpenClientPackageSelect: true,
      targetType: 'CLIENT'
    });
  }

  handleAddPackageForGroup = (event) => {
    event.stopPropagation();
    this.setState({
      isOpenClientPackageSelect: true,
      targetType: 'GROUP'
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientPackageProps, ClientGroupProps } = this.props;
    const { t, i18n } = this.props;

    const compId = this.props.match.params.grMenuId;

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef',minWidth:320}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
              <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                <Grid item xs={3} sm={3} lg={3}>
                </Grid>
                <Grid item xs={9} sm={9} lg={9} style={{textAlign:'right'}}>
                  <Tooltip title={t("ttUpdateTotalPackgeInGroup")}>
                    <span>
                      <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleTotalPackageUpgradeForGroup} disabled={!(this.isGroupChecked())} style={{marginRight: "10px"}} >
                        {t("btnAllUpdate")}
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title={t("ttUpdateSelectedPackgeInGroup")}>
                    <span>
                      <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleAddPackageForGroup} disabled={!(this.isGroupChecked())} style={{marginRight: "10px"}} >
                        {t("btnAddPackage")}
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
              </Toolbar>
              <ClientGroupTreeComp compId={compId} 
                selectorType='multiple' 
                onCheck={this.handleClientGroupCheck} 
                onSelect={this.handleClientGroupSelect}
                isEnableEdit={false} 
                isActivable={false} 
              />
            </Grid>
            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={6} sm={6} lg={6} >
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6} style={{textAlign:'right'}}>
                    <Tooltip title={t("ttUpdateTotalPackgeInClient")}>
                    <span>
                      <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleTotalPackageUpgradeForClient} disabled={!(this.isClientChecked())} style={{marginLeft: "10px"}}>
                        {t("btnAllUpdate")}
                      </Button>
                    </span>
                    </Tooltip>
                    <Tooltip title={t("ttUpdateSelectedPackgeInClient")}>
                    <span>
                      <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleAddPackageForClient} disabled={!(this.isClientChecked())} style={{marginLeft: "10px"}}>
                        {t("btnAddPackage")}
                      </Button>
                    </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>
              <ClientManageCompWithPackage compId={compId} 
                onSelectAll={this.handleClientSelectAll} 
                onSelect={this.handleClientSelect} 
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef'}}>
              <ClientPackageComp compId={compId} onSelectAll={this.handleClientPackageSelectAll} onSelect={this.handleClientPackageSelect} />
            </Grid>
          </Grid>

        <ClientPackageSelectDialog 
          isOpen={this.state.isOpenClientPackageSelect} 
          onInstallHandle={this.handleClientPackageInstall} 
          onClose={this.handleClientPackageSelectClose} />
        <GRConfirm />
        
        </GRPane>
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => ({
  ClientPackageProps: state.ClientPackageModule,
  ClientManageProps: state.ClientManageModule,
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),

  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  CtrlCenterItemActions: bindActionCreators(CtrlCenterItemActions, dispatch),
  PolicyKitRuleActions: bindActionCreators(PolicyKitRuleActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)  
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageManage)));


