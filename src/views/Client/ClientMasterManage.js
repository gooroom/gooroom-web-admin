import React, { Component } from 'react';
import { Map, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ClientMasterManageActions from 'modules/ClientMasterManageModule';
import * as ClientManageActions from 'modules/ClientManageModule';
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

import { getRowObjectById, getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRTreeList from "components/GRTree/GRTreeList";
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';
import ClientSelectDialog from "views/Client/ClientSelectDialog";
import ClientGroupTreeComp from 'views/ClientGroup/ClientGroupTreeComp';

import ClientConfSettingDialog from "views/Rules/ClientConfig/ClientConfSettingDialog";
import ClientHostNameDialog from "views/Rules/HostName/ClientHostNameDialog";
import ClientUpdateServerDialog from "views/Rules/UpdateServer/ClientUpdateServerDialog";
import ClientGroupMultiRuleDialog from "views/ClientGroup/ClientGroupMultiRuleDialog";

import BrowserRuleDialog from "views/Rules/UserConfig/BrowserRuleDialog";
import SecurityRuleDialog from "views/Rules/UserConfig/SecurityRuleDialog";
import MediaRuleDialog from "views/Rules/UserConfig/MediaRuleDialog";
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';
import DesktopConfDialog from "views/Rules/DesktopConfig/DesktopConfDialog";
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TuneIcon from '@material-ui/icons/Tune';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupIcon from '@material-ui/icons/GroupWork';
import ClientIcon from '@material-ui/icons/Laptop';

import ClientManageComp from 'views/Client/ClientManageComp';
import ClientManageSpec from 'views/Client/ClientManageSpec';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientGroupSpec from 'views/ClientGroup/ClientGroupSpec';
import ClientGroupDialog from 'views/ClientGroup/ClientGroupDialog';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientMasterManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      compId: this.props.match.params.grMenuId,
      isOpenClientSelect: false,
      isOpenGroupSelect: false,
      selectedGrp: {grpId:'', grpNm:''}
    };
  }

  handleInitTreeData = () => {
    // Check selectedGrpId
    this.props.ClientGroupActions.changeCompVariableObject({
      compId: this.state.compId,
      valueObj: {selectedGrpId: '', selectedGrpNm: ''}
    });
  }

  // click group checkbox (in tree)
  handleCheckedClientGroup = (checkedGroupIdArray, imperfect) => {
    const { ClientManageProps, ClientManageActions } = this.props;
    // set checkedGrpId
    this.props.ClientGroupActions.changeCompVariableObject({
      compId: this.state.compId,
      valueObj: {checkedGrpId: checkedGroupIdArray}
    });
    // show client list in group.
    ClientManageActions.readClientListPaged(ClientManageProps, this.state.compId, {
      groupId: checkedGroupIdArray, page:0
    }, {isResetSelect:true});
  }

  // click group row (in tree)
  handleSelectClientGroup = (selectedGroupObj) => {
    const { ClientGroupActions, ClientManageActions } = this.props;
    const compId = this.state.compId;
    // change selected info in state
    this.setState({
      selectedGrp: {grpId:selectedGroupObj.get('grpId'), grpNm:selectedGroupObj.get('grpNm')}
    });

    // const selectRowObject = getRowObjectById(ClientGroupProps, compId, selectedGroupId, 'grpId');

    // close client inform
    ClientManageActions.closeClientManageInform({compId: compId});
    
    // // select selectedGrpId
    // ClientGroupActions.changeCompVariableObject({
    //   compId: compId,
    //   valueObj: {
    //     selectedGrpId: treeNode.key, 
    //     selectedGrpNm: treeNode.title,
    //     hasChildren: treeNode.hasChildren
    //   }
    // });
    // // show client group inform
    // ClientGroupActions.showClientGroupInform({
    //   compId: compId, viewItem: Map(treeNode), selectId: treeNode.key
    // });

    // uni
    ClientGroupActions.changeCompVariableObject({
      compId: compId,
      valueObj: {
        viewItem: selectedGroupObj,
        informOpen: true
      }
    });

    this.showClientGroupSpec(compId, selectedGroupObj.get("grpId"));
  }
  
  // click client row (in list)
  handleSelectClient = (selectedClientObj) => {
    const { ClientGroupProps } = this.props;
    const { ClientManageActions, ClientGroupActions } = this.props;
    const compId = this.state.compId;
    
    // show client info.
    if(selectedClientObj) {
      // show client information
      ClientManageActions.showClientManageInform({ compId: compId, viewItem: selectedClientObj });
      // show client group info.
      ClientGroupActions.showClientGroupInform({
        compId: compId, viewItem: getRowObjectById(ClientGroupProps, compId, selectedClientObj.get('clientGroupId'), 'grpId')
      });
      // show client group info.
      ClientGroupActions.getClientGroup({ compId: compId, groupId: selectedClientObj.get('clientGroupId') });
      this.showClientGroupSpec(compId, selectedClientObj.get('clientGroupId'));
    }
  };

  // get rules info by client group id
  showClientGroupSpec(compId, groupId) {
    const { ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions, SoftwareFilterActions, DesktopConfActions } = this.props;

    if(groupId) {
      // get client conf setting info
      // ClientConfSettingActions.getClientConfByGroupId({ compId: compId, groupId: groupId });   
      // // get Hosts conf info
      // ClientHostNameActions.getClientHostNameByGroupId({ compId: compId, groupId: groupId });
      // // get Update server conf info
      // ClientUpdateServerActions.getClientUpdateServerByGroupId({ compId: compId, groupId: groupId });   
      // get browser rule info
      BrowserRuleActions.getBrowserRuleByGroupId({ compId: compId, groupId: groupId });
      // get media control setting info
      MediaRuleActions.getMediaRuleByGroupId({ compId: compId, groupId: groupId });
      // // get client secu info
      // SecurityRuleActions.getSecurityRuleByGroupId({ compId: compId, groupId: groupId });   
      // // get filtered software rule
      // SoftwareFilterActions.getSoftwareFilterByGroupId({ compId: compId, groupId: groupId });   
      // // get desktop conf info
      // DesktopConfActions.getDesktopConfByGroupId({ compId: compId, groupId: groupId });   
    }
  }

  // edit group in tree
  handleEditClientGroup = (treeNode) => {
    this.props.ClientGroupActions.showDialog({
      viewItem: treeNode,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  // create group in tree
  handleCreateClientGroup = () => {
    const { t, i18n } = this.props;
    
    const grpId = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'viewItem', 'grpId']);
    if(grpId && grpId !== '') {
      this.props.ClientGroupActions.showDialog({
        viewItem: {
          grpId: grpId,
          grpNm: '',
        },
        dialogType: ClientGroupDialog.TYPE_ADD
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectParentGroup"));
    }
  }

  // check has group for delete
  isClientGroupRemovable = () => {
    const checkedIds = getDataObjectVariableInComp(this.props.ClientGroupProps, this.state.compId, 'checkedIds');
    return !(checkedIds && checkedIds.size > 0);
  }

  // delete group
  handleDeleteButtonForClientGroup = () => {
    const { t, i18n } = this.props;
    const checkedIds = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    if(checkedIds && checkedIds.size > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("dtDeleteGroup"),
        confirmMsg: t("msgDeleteGroup", {groupCnt: checkedIds.size}),
        handleConfirmResult: (confirmValue, confirmObject) => {
          if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions } = this.props;
            const checkedIds = getDataObjectVariableInComp(ClientGroupProps, this.state.compId, 'checkedIds');
            if(checkedIds && checkedIds.size > 0) {
              ClientGroupActions.deleteSelectedClientGroupData({
                grpIds: checkedIds.toArray()
              }).then(() => {
                ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.state.compId);
              });
            }
          }
        },
        confirmObject: null
      });
    }
  }

  // multiple rule change in groups
  handleApplyMultiGroup = (event) => {
    this.props.ClientGroupActions.showMultiDialog({
      multiDialogType: ClientGroupMultiRuleDialog.TYPE_EDIT
    });
  }

  // add client in group
  handleAddClientInGroup = (event) => {
    const { t, i18n } = this.props;
    const grpId = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'viewItem', 'grpId']);
    if(grpId && grpId !== '') {
      this.setState({
        isOpenClientSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgCfmSelectGroupForInsertClient"));
    }
  }

  isClientChecked = () => {
    const checkedIds = this.props.ClientManageProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    return !(checkedIds && checkedIds.size > 0);
  }

  isClientGroupChecked = () => {
    const checkedIds = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    return !(checkedIds && checkedIds.size > 0);
  }

  isClientGroupSelected = () => {
    return (this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'viewItem', 'grpId'])) ? false : true;
  }

  // add client in group - save
  handleClientSelectSave = (checkedClientIds) => {
    const { t, i18n } = this.props;
    const selectedGrp = this.state.selectedGrp;

    this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("dtAddClientInGroup"),
        confirmMsg: t("msgAddClientInGroup", {clientCnt: checkedClientIds.size, groupName: selectedGrp.grpNm}),
        handleConfirmResult: (confirmValue, paramObject) => {
          if(confirmValue) {
            const { ClientGroupActions, ClientManageActions, ClientManageProps } = this.props;
            ClientGroupActions.addClientsInGroup({
                groupId: paramObject.selectedGroupId,
                clients: paramObject.checkedClientIds.join(',')
            }).then((res) => {
              // show clients list in group
              ClientManageActions.readClientListPaged(ClientManageProps, this.state.compId, {
                groupId: paramObject.selectedGroupId, page:0
              }, {isResetSelect:true});
              // close dialog
              this.setState({ isOpenClientSelect: false });
            });
          }
        },
        confirmObject: {
          selectedGroupId: selectedGrp.grpId,
          checkedClientIds: checkedClientIds
        }
    });
  }

  // remove client in group - save
  handleRemoveClientInGroup = (event) => {
    const { ClientManageProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    const checkedClientIds = ClientManageProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    if(checkedClientIds && checkedClientIds !== '') {
      GRConfirmActions.showConfirm({
        confirmTitle: t("dtDeleteClientFromGroup"),
        confirmMsg: t("msgCfmDeleteClientFromGroup"),
        handleConfirmResult: (confirmValue, paramObject) => {
          if(confirmValue) {
            const { ClientManageProps, ClientGroupActions, ClientManageActions } = this.props;
            ClientGroupActions.removeClientsInGroup({
              clients: paramObject.checkedClientIds.join(',')
            }).then(() => {
              // show user list in dept.
              ClientManageActions.readClientListPaged(ClientManageProps, this.state.compId, {
                page:0
              }, {isResetSelect:true});
              // close dialog
              this.setState({ isOpenClientSelect: false });
            });
          }
        },
        confirmObject: {
          checkedClientIds: checkedClientIds
        }
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectClient"));
    }
  }

  // delete client
  handleDeleteClient = () => {
    const { ClientManageProps } = this.props;
    const { t, i18n } = this.props;

    const checkedClientIds = ClientManageProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    if(checkedClientIds && checkedClientIds.size > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("dtDeleteClient"),
        confirmMsg: t("msgDeleteClient", {clientCnt: checkedClientIds.size}),
        handleConfirmResult: (confirmValue, confirmObject) => {
          if(confirmValue) {
            const { ClientManageProps, ClientManageActions } = this.props;
            ClientManageActions.deleteClientData({
              clientIds: confirmObject.checkedClientIds.join(',')
            }).then(() => {
              ClientManageActions.readClientListPaged(ClientManageProps, this.state.compId, {
                page:0
              }, {isResetSelect:true});
            });
          }
        },
        confirmObject: {checkedClientIds: checkedClientIds}
      });
    }
  }

  handleResetGroupTree = (grpId) => {
    this.grTreeList.resetTreeNode(grpId);
  }

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;
    const compId = this.state.compId;

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef',minWidth:320}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
              <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                <Grid item>
                  <Tooltip title={t("ttAddNewGroup")}>
                  <span>
                    <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleCreateClientGroup} style={{marginRight: "5px"}} >
                      <AddIcon />
                    </Button>
                  </span>
                  </Tooltip>
                  <Tooltip title={t("ttDeleteGroup")}>
                  <span>
                    <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleDeleteButtonForClientGroup} disabled={this.isClientGroupRemovable()} >
                      <RemoveIcon />
                    </Button>
                  </span>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={t("ttChangMultiGroupRule")}>
                    <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleApplyMultiGroup} >
                      <TuneIcon />
                    </Button>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={t("ttAddClientInGroup")}>
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleAddClientInGroup} disabled={this.isClientGroupSelected()} >
                      <AddIcon /><ClientIcon />
                    </Button>
                  </span>
                  </Tooltip>
                </Grid>
              </Grid>
              </Toolbar>
              <ClientGroupTreeComp compId={compId} 
                selectorType='multiple' 
                onCheck={this.handleCheckedClientGroup} 
                onSelect={this.handleSelectClientGroup}
                onEdit={this.handleEditClientGroup}
                isEnableEdit={true} 
              />
            </Grid>
            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                    <Tooltip title={t("ttDeleteClientFromGroup")} >
                    <span>
                      <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleRemoveClientInGroup} disabled={this.isClientChecked()} style={{marginLeft: "10px"}} >
                        <RemoveIcon /><ClientIcon />
                      </Button>
                    </span>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} style={{textAlign:'right'}}>
                    <Tooltip title={t("ttRevokeClient")} >
                    <span>
                      <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={this.handleDeleteClient} disabled={this.isClientChecked()} style={{marginLeft: "10px"}}>
                        <DeleteIcon /><ClientIcon />
                      </Button>
                    </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>
              <ClientManageComp compId={compId} selectorType='multiple'
                onSelect={this.handleSelectClient}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef', padding: 0, marginTop: 20}}>
              <ClientManageSpec compId={compId} />
              <ClientGroupSpec compId={compId} />
            </Grid>
          </Grid>
        </GRPane>

        <ClientGroupDialog compId={compId} resetCallback={this.handleResetGroupTree} />
        <ClientGroupMultiRuleDialog compId={compId} />

        <ClientSelectDialog 
          isOpen={this.state.isOpenClientSelect} 
          onSaveHandle={this.handleClientSelectSave} 
          onClose={() => { this.setState({ isOpenClientSelect: false }); }}
          selectedGroupItem={this.state.selectedGrp}
        />

        <ClientConfSettingDialog compId={compId} />
        <ClientHostNameDialog compId={compId} />
        <ClientUpdateServerDialog compId={compId} />

        <BrowserRuleDialog compId={compId} />
        <SecurityRuleDialog compId={compId} />
        <MediaRuleDialog compId={compId} />
        <SoftwareFilterDialog compId={compId} />
        <DesktopConfDialog compId={compId} isEnableDelete={false} />
        <DesktopAppDialog compId={compId} />
        
        <GRConfirm />
        
      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  ClientMasterManageProps: state.ClientMasterManageModule,
  ClientManageProps: state.ClientManageModule,
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),

  ClientMasterManageActions: bindActionCreators(ClientMasterManageActions, dispatch),
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),

  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)  
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientMasterManage)));

