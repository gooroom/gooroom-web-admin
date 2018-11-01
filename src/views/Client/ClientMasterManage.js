import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

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
import * as DesktopConfActions from 'modules/DesktopConfModule';

import { getRowObjectById, getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';
import ClientSelectDialog from "views/Client/ClientSelectDialog";

import BrowserRuleDialog from "views/Rules/UserConfig/BrowserRuleDialog";
import SecurityRuleDialog from "views/Rules/UserConfig/SecurityRuleDialog";
import MediaRuleDialog from "views/Rules/UserConfig/MediaRuleDialog";
import DesktopConfDialog from "views/Rules/DesktopConfig/DesktopConfDialog";
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
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


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientMasterManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenClientSelect: false,
    };
  }

  // Check Group Item
  handleClientGroupCheck = (selectedGroupObj, selectedGroupIdArray) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: selectedGroupIdArray.toJS(), page:0
    }, {isResetSelect:true});

  };

  // Select Group Item - single
  handleClientGroupSelect = (selectedGroupObj) => {
    const { ClientGroupActions, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

    // show client group info.
    if(selectedGroupObj) {
      // close client inform
      ClientManageActions.closeClientManageInform({compId: compId});
      // show client group inform
      ClientGroupActions.showClientGroupInform({
        compId: compId, viewItem: selectedGroupObj, selectId: selectedGroupObj.get('grpId')
      });
      this.resetClientGroupRules(compId, selectedGroupObj.get('grpId'));
    }
  };

  // Select Client Item
  handleClientSelect = (selectedClientObj) => {
    const { ClientGroupProps } = this.props;
    const { ClientManageActions, ClientGroupActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // show client info.
    if(selectedClientObj) {
      // show client information
      ClientManageActions.showClientManageInform({ compId: compId, viewItem: selectedClientObj });
      // show client group info.
      ClientGroupActions.showClientGroupInform({
        compId: compId, viewItem: getRowObjectById(ClientGroupProps, compId, selectedClientObj.get('clientGroupId'), 'grpId'), selectId: ''
      });
      // show client group info.
      this.resetClientGroupRules(compId, selectedClientObj.get('clientGroupId'));
    }
  };

  resetClientGroupRules(compId, grpId) {
    const { ClientGroupProps } = this.props;
    const { ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions, DesktopConfActions } = this.props;

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
      // get desktop conf info
      DesktopConfActions.getDesktopConfByGroupId({ compId: compId, groupId: grpId });   

      ClientGroupActions.showClientGroupInform({ compId: compId, viewItem: selectedGroupObj, selectId: '' });
    }

  }

  // GROUP COMPONENT --------------------------------

  // create group
  handleCreateButtonForClientGroup = () => {
    this.props.ClientGroupActions.showDialog({
      viewItem: Map(),
      dialogType: ClientGroupDialog.TYPE_ADD
    });
  }

  isClientGroupRemovable = () => {
    const checkedIds = getDataObjectVariableInComp(this.props.ClientGroupProps, this.props.match.params.grMenuId, 'checkedIds');
    return !(checkedIds && checkedIds.size > 0);
  }

  // delete group
  handleDeleteButtonForClientGroup = () => {
    const checkedIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(checkedIds && checkedIds.size > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: '단말그룹 삭제',
        confirmMsg: '단말그룹(' + checkedIds.size + '개)을 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteButtonForClientGroupConfirmResult,
        confirmObject: null
      });
    }
  }
  handleDeleteButtonForClientGroupConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientGroupProps, ClientGroupActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      const checkedIds = getDataObjectVariableInComp(ClientGroupProps, compId, 'checkedIds');
      if(checkedIds && checkedIds.size > 0) {
        ClientGroupActions.deleteSelectedClientGroupData({
          grpIds: checkedIds.toArray()
        }).then(() => {
          ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
        });
      }
    }
  }

  // CLIENT COMPONENT --------------------------------

  // add client in group
  handleAddClientInGroup = (event) => {
    const selectedGroupItem = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem']);
    if(selectedGroupItem) {
      this.setState({
        isOpenClientSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '단말을 추가할 그룹을 선택하세요.');
    }
  }

  isClientSelected = () => {
    const checkedIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    // const checkedIds = getDataObjectVariableInComp(this.props.ClientManageProps, this.props.match.params.grMenuId, 'checkedIds');
    return !(checkedIds && checkedIds.size > 0);
  }

  isGroupSelected = () => {
    const groupSelectId = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectId']);
    return (groupSelectId && groupSelectId !== '') ? false : true;
  }

  // add client in group - save
  handleClientSelectSave = (checkedClientIds) => {
    const { ClientGroupProps, GRConfirmActions } = this.props;
    const selectedGroupItem = ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem']);
    GRConfirmActions.showConfirm({
        confirmTitle: '그룹에 단말 추가',
        confirmMsg: '단말을 그룹 추가하시겠습니까?',
        handleConfirmResult: this.handleClientSelectSaveConfirmResult,
        confirmObject: {
          selectedGroupId: selectedGroupItem.get('grpId'),
          checkedClientIds: checkedClientIds
        }
    });
  }
  handleClientSelectSaveConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { ClientGroupActions, ClientGroupProps } = this.props;
      const { ClientManageActions, ClientManageProps } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientGroupActions.addClientsInGroup({
          groupId: paramObject.selectedGroupId,
          clients: paramObject.checkedClientIds.join(',')
      }).then((res) => {
        // show clients list in group
        ClientManageActions.readClientListPaged(ClientManageProps, compId, {
          groupId: paramObject.selectedGroupId, page:0
        }, {isResetSelect:true});
        ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
        // close dialog
        this.setState({ isOpenClientSelect: false });
      });
    }
  }

  // remove client in group - save
  handleRemoveClientInGroup = (event) => {
    const { ClientManageProps, GRConfirmActions } = this.props;
    const checkedClientIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(checkedClientIds && checkedClientIds !== '') {
      GRConfirmActions.showConfirm({
        confirmTitle: '그룹에서 단말 삭제',
        confirmMsg: '선택하신 단말을 그룹에서 삭제하시겠습니까?',
        handleConfirmResult: this.handleRemoveClientInGroupConfirmResult,
        confirmObject: {
          checkedClientIds: checkedClientIds
        }
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '단말을 선택하세요.');
    }
  }
  handleRemoveClientInGroupConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { ClientManageProps, ClientGroupActions, ClientManageActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientGroupActions.removeClientsInGroup({
        clients: paramObject.checkedClientIds.join(',')
      }).then(() => {
        // show user list in dept.
        ClientManageActions.readClientListPaged(ClientManageProps, compId, {
          page:0
        }, {isResetSelect:true});
        // close dialog
        this.setState({ isOpenClientSelect: false });
      });
    }
  };

  // delete client
  handleDeleteClient = () => {
    const { ClientManageProps, ClientGroupActions, ClientManageActions } = this.props;
    const checkedClientIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(checkedClientIds && checkedClientIds.size > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: '단말 삭제',
        confirmMsg: '단말(' + checkedClientIds.size + '개)을 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteClientConfirmResult,
        confirmObject: {checkedClientIds: checkedClientIds}
      });
    }
  }
  handleDeleteClientConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientManageProps, ClientManageActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientManageActions.deleteClientData({
        clientIds: confirmObject.checkedClientIds.join(',')
      }).then(() => {
        ClientManageActions.readClientListPaged(ClientManageProps, compId, {
          page:0
        }, {isResetSelect:true});
      });
    }
  }

  handleClientSelectClose = () => {
    this.setState({
      isOpenClientSelect: false
    })
  }

  render() {
    const { classes } = this.props;
    const { ClientMasterManageProps, ClientGroupProps, ClientManageProps } = this.props;

    const compId = this.props.match.params.grMenuId;
    const { isGroupInformOpen, isClientInformOpen } = ClientMasterManageProps;

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            
            <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
              <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                <Grid item>

                  <Tooltip title="신규 단말그룹 등록">
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleCreateButtonForClientGroup} >
                      <AddIcon /><GroupIcon />
                    </Button>
                  </span>
                  </Tooltip>
                  <Tooltip title="단말그룹 삭제">
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleDeleteButtonForClientGroup} disabled={this.isClientGroupRemovable()} style={{marginLeft: "10px"}} >
                      <RemoveIcon /><GroupIcon />
                    </Button>
                  </span>
                  </Tooltip>

                </Grid>
                <Grid item>

                  <Tooltip title="그룹에 단말추가">
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleAddClientInGroup} disabled={this.isGroupSelected()} >
                      <AddIcon /><ClientIcon />
                    </Button>
                  </span>
                  </Tooltip>

                  <Tooltip title="그룹에 단말삭제">
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleRemoveClientInGroup} disabled={this.isClientSelected()} style={{marginLeft: "10px"}} >
                      <RemoveIcon /><ClientIcon />
                    </Button>
                  </span>
                  </Tooltip>

                </Grid>
              </Grid>
              </Toolbar>
              <ClientGroupComp compId={compId}
                selectorType='multiple'
                hasEdit={true}
                hasShowRule={true}
                onCheckAll={this.handleClientGroupSelectAll}
                onCheck={this.handleClientGroupCheck}
                onSelect={this.handleClientGroupSelect}
              />
            </Grid>

            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} style={{textAlign:'right'}}>
                    <Tooltip title="단말 폐기">
                    <span>
                      <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={this.handleDeleteClient} disabled={this.isClientSelected()} style={{marginLeft: "10px"}}>
                        <DeleteIcon /><ClientIcon />
                      </Button>
                    </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>
              <ClientManageComp compId={compId} selectorType='multiple'
                onSelect={this.handleClientSelect}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef', padding: 0, marginTop: 20}}>
              <ClientManageSpec compId={compId} />
              <ClientGroupSpec compId={compId} />
            </Grid>
          </Grid>
          <ClientGroupDialog compId={compId} />
          <ClientSelectDialog 
            isOpen={this.state.isOpenClientSelect} 
            onSaveHandle={this.handleClientSelectSave} 
            onClose={this.handleClientSelectClose} 
            selectedGroupItem={ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem'])}
          />

          <BrowserRuleDialog compId={compId} />
          <SecurityRuleDialog compId={compId} />
          <MediaRuleDialog compId={compId} />
          <DesktopConfDialog compId={compId} />
          <DesktopAppDialog compId={compId} />
          
          <GRConfirm />
          
        </GRPane>
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
  ClientMasterManageActions: bindActionCreators(ClientMasterManageActions, dispatch),
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),

  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)  

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientMasterManage));

