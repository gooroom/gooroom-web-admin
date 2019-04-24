import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ClientMasterManageActions from 'modules/ClientMasterManageModule';
import * as ClientManageActions from 'modules/ClientManageModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import * as TotalRuleActions from 'modules/TotalRuleModule';

import { getRowObjectById, getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCheckConfirm from 'components/GRComponents/GRCheckConfirm';
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
import ClientIcon from '@material-ui/icons/Laptop';

import ClientManageComp from 'views/Client/ClientManageComp';
import ClientManageSpec from 'views/Client/ClientManageSpec';

import ClientGroupSpec from 'views/ClientGroup/ClientGroupSpec';
import ClientGroupDialog from 'views/ClientGroup/ClientGroupDialog';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";


class ClientMasterManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      compId: this.props.match.params.grMenuId,
      isOpenClientSelect: false,
      isOpenGroupSelect: false
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
    // change selected info in store
    ClientGroupActions.changeTreeDataVariable({ compId: compId, name: 'selectedGrp', value: selectedGroupObj });
    // close client inform
    ClientManageActions.closeClientManageInform({compId: compId});
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
      // get client group info.
      ClientGroupActions.getClientGroup({ compId: compId, groupId: selectedClientObj.get('clientGroupId') });
      // get client group rule info.
      this.showClientGroupSpec(compId, selectedClientObj.get('clientGroupId'));

      // hide client group active
      ClientGroupActions.changeTreeDataVariable({
        compId: compId, name: 'activeListItem', value: ''
      });
      // show client group info.
      ClientGroupActions.showClientGroupInform({
        compId: compId, viewItem: getRowObjectById(ClientGroupProps, compId, selectedClientObj.get('clientGroupId'), 'grpId')
      });
    }
  };

  // get rules info by client group id
  showClientGroupSpec(compId, groupId) {
    const { TotalRuleActions } = this.props;

    if(groupId) {
      TotalRuleActions.getAllClientRuleByGroupId({ compId: compId, groupId: groupId });
      // // get client conf setting info
      // ClientConfSettingActions.getClientConfByGroupId({ compId: compId, groupId: groupId });   
      // // get Hosts conf info
      // ClientHostNameActions.getClientHostNameByGroupId({ compId: compId, groupId: groupId });
      // // get Update server conf info
      // ClientUpdateServerActions.getClientUpdateServerByGroupId({ compId: compId, groupId: groupId });   
      // // get browser rule info
      // BrowserRuleActions.getBrowserRuleByGroupId({ compId: compId, groupId: groupId });
      // // get media control setting info
      // MediaRuleActions.getMediaRuleByGroupId({ compId: compId, groupId: groupId });
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

  getSingleCheckedGrp = () => {
    const checkedGrpIds = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'checkedGrpId']);
    if(checkedGrpIds && checkedGrpIds.size > 0) {
      const grpId = checkedGrpIds.get(0);
      if(grpId !== undefined && grpId !== '') {
        return this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData']).find(e => (e.get('key') === grpId));
      }
    }
    return null;
  }


  // create group in tree
  handleCreateClientGroup = (event) => {
    const { t, i18n } = this.props;
    const checkedGrp = this.getSingleCheckedGrp();
    if(checkedGrp !== undefined) {
      this.props.ClientGroupActions.showDialog({
        viewItem: {
          grpId: checkedGrp.get('key'),
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
    let checkedGrpId = getDataObjectVariableInComp(this.props.ClientGroupProps, this.state.compId, 'checkedGrpId');
    if(checkedGrpId && checkedGrpId.size > 0) {
      // except default item
      checkedGrpId = checkedGrpId.filter(e => (e !== 'CGRPDEFAULT'));
      return !(checkedGrpId && checkedGrpId.size > 0);
    } else {
      return true;
    }
  }

  isClientGroupOneSelect = () => {
    let checkedGrpId = getDataObjectVariableInComp(this.props.ClientGroupProps, this.state.compId, 'checkedGrpId');
    if(checkedGrpId && checkedGrpId.size > 0) {
      return !(checkedGrpId && checkedGrpId.size === 1);
    } else {
      return true;
    }
  }

  // delete group
  handleDeleteButtonForClientGroup = () => {
    const { t, i18n } = this.props;
    let checkedGrpId = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'checkedGrpId']);
    if(checkedGrpId && checkedGrpId.size > 0) {

      // except default item
      checkedGrpId = checkedGrpId.filter(e => (e !== 'CGRPDEFAULT'));

      this.props.GRConfirmActions.showCheckConfirm({
        confirmTitle: t("dtDeleteGroup"),
        confirmMsg: t("msgDeleteGroup", {groupCnt: checkedGrpId.size}),
        confirmCheckMsg: t("lbDeleteInClient"),
        handleConfirmResult: (confirmValue, confirmObject, isChecked) => {
          if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions, ClientManageProps, ClientManageActions } = this.props;
            const checkedGrpId = getDataObjectVariableInComp(ClientGroupProps, this.state.compId, 'checkedGrpId');

            if(checkedGrpId && checkedGrpId.size > 0) {
              ClientGroupActions.deleteSelectedClientGroupData({
                grpIds: checkedGrpId.toArray(),
                compId: this.state.compId,
                isDeleteClient: isChecked
              }).then((reData) => {

                // get parent index
                // const grpIds = checkedGrpId.toArray();
                const treeData = ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData'])
                const parentIndexList = checkedGrpId.map(e => {
                  const treeItem = treeData.find(function(item) {
                    return e === item.get('key');
                  });
                  return treeItem.get('parentIndex');
                }).sort().reverse();

                const uniqueParentIndexList = [...new Set(parentIndexList.toJS())];
                if(uniqueParentIndexList.length > 0) {
                  uniqueParentIndexList.forEach(e => {
                    this.handleResetTreeForDelete(e);
                  });
                }

                // show client list in group.
                ClientManageActions.readClientListPaged(ClientManageProps, this.state.compId, {
                  groupId: [], page:0
                }, {isResetSelect:true});

                
                // ClientGroupActions.changeCompVariableObject({
                //   compId: this.state.compId,
                //   valueObj: {checkedGrpId: []}
                // });

                // ClientGroupActions.changeTreeDataVariable({
                //   compId: this.state.compId, 
                //   name: 'checked', 
                //   value: []
                // });

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

  // add client in group - save
  handleClientSelectSave = (checkedClientIds) => {
    const { t, i18n } = this.props;

    const checkedGrp = this.getSingleCheckedGrp();
    if(checkedGrp !== undefined) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("dtAddClientInGroup"),
        confirmMsg: t("msgAddClientInGroup", {clientCnt: checkedClientIds.size, groupName: checkedGrp.get('title')}),
        handleConfirmResult: (confirmValue, paramObject) => {
          if(confirmValue) {
            const { ClientGroupActions, ClientManageActions, ClientManageProps, ClientGroupProps } = this.props;
            ClientGroupActions.addClientsInGroup({
                groupId: paramObject.selectedGroupId,
                clients: paramObject.checkedClientIds.join(',')
            }).then((res) => {
              if(res && res.status && res.status.result === 'success') {
                // change group node info as client count
                this.handleResetTreeForEdit();
                // show clients list in group
                ClientManageActions.readClientListPaged(ClientManageProps, this.state.compId, {
                  groupId: ClientGroupProps.getIn(['viewItems', this.state.compId, 'checkedGrpId']), 
                  page:0
                }, {isResetSelect:true});
                // close dialog
                this.setState({ isOpenClientSelect: false });
              }
            });
          }
        },
        confirmObject: {
          selectedGroupId: checkedGrp.get('key'),
          checkedClientIds: checkedClientIds
        }
      });
    }
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
            const { ClientManageProps, ClientManageActions, ClientGroupProps, ClientGroupActions } = this.props;
            ClientGroupActions.removeClientsInGroup({
              clients: paramObject.checkedClientIds.join(',')
            }).then(() => {
              // change group node info as client count
              this.handleResetTreeForEdit();
              // show clients list in group
              ClientManageActions.readClientListPaged(ClientManageProps, this.state.compId, {
                groupId: ClientGroupProps.getIn(['viewItems', this.state.compId, 'checkedGrpId']), 
                page:0
              }, {isResetSelect:true});
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

  handleResetTreeForEdit = (index) => {
    // change group node info as client count
    this.props.ClientGroupActions.getClientGroupNodeList({
      groupIds: this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData']).map(e => (e.get('key'))).toJS(),
      compId: this.state.compId
    });

    if(index !== undefined) {
      const parentListItem = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData', index]);
      this.props.ClientGroupActions.readChildrenClientGroupList(this.state.compId, parentListItem.get('key'), index);
    } else {
      this.props.ClientGroupActions.readChildrenClientGroupList(this.state.compId, 'CGRPDEFAULT', 0);
    }
  }

  handleResetTreeForDelete = (index) => {
    // changed grpId - re-select parentId of grpId
    if(index !== undefined) {
      const parentListItem = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData', index]);
      this.props.ClientGroupActions.readChildrenClientGroupList(this.state.compId, parentListItem.get('key'), index);
    } else {
      this.props.ClientGroupActions.readChildrenClientGroupList(this.state.compId, 'CGRPDEFAULT', 0);
    }
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
                    <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleCreateClientGroup} disabled={this.isClientGroupOneSelect()} style={{marginRight: "5px"}} >
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
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleAddClientInGroup} disabled={this.isClientGroupOneSelect()} >
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
                isActivable={true} 
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

        <ClientGroupDialog compId={compId} resetCallback={this.handleResetTreeForEdit} />
        <ClientGroupMultiRuleDialog compId={compId} />

        <ClientSelectDialog 
          compId={compId}
          isOpen={this.state.isOpenClientSelect} 
          onSaveHandle={this.handleClientSelectSave} 
          onClose={() => { this.setState({ isOpenClientSelect: false }); }}
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
        <GRCheckConfirm />
        
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

  TotalRuleActions: bindActionCreators(TotalRuleActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientMasterManage)));

