import React, { Component } from 'react';
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ClientMasterManageActions from 'modules/ClientMasterManageModule';
import * as ClientManageActions from 'modules/ClientManageModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as UserActions from 'modules/UserModule';

import * as TotalRuleActions from 'modules/TotalRuleModule';

import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

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
import CtrlCenterItemDialog from 'views/Rules/UserConfig/CtrlCenterItemDialog';
import PolicyKitRuleDialog from 'views/Rules/UserConfig/PolicyKitRuleDialog';
import DesktopConfDialog from "views/Rules/DesktopConfig/DesktopConfDialog";
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';

import Grid from '@material-ui/core/Grid';

import ClientManageComp from 'views/Client/ClientManageComp';
import ClientManageSpec from 'views/Client/ClientManageSpec';

import ClientGroupSpec from 'views/ClientGroup/ClientGroupSpec';
import ClientGroupDialog from 'views/ClientGroup/ClientGroupDialog';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";


class UserClientManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      compId: this.props.match.params.grMenuId,
      isOpenClientSelect: false,
      isOpenGroupSelect: false,
      userClientId: '',
      userName: '',
      clientCnt: 0
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    const compId = this.state.compId;
    const { ClientManageActions, ClientGroupActions, UserActions } = this.props;
    ClientGroupActions.closeClientGroupInform({compId:compId});
    ClientManageActions.closeClientManageInform({compId: compId});
    //ClientManageActions.showClientManageInform({ compId: compId, viewItem: null});
    console.log("unmount");
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
    }
  }
  getSingleCheckedClientGroup = () => {
    const checkedGrpIds = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'checked']);
    if(checkedGrpIds && checkedGrpIds.length > 0) {
      const grpId = checkedGrpIds[0];
      if(grpId !== undefined && grpId !== '') {
        return this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData']).find(e => (e.get('key') === grpId));
      }
    }
    return null;
  }

  isClientChecked = () => {
    const checkedIds = this.props.ClientManageProps.getIn(['viewItems', this.state.compId, 'checkedIds']);
    return !(checkedIds && checkedIds.size > 0);
  }

  // add client in group - save
  handleClientSelectSave = (checkedClientIds) => {
    const { t, i18n } = this.props;

    const checkedGrp = this.getSingleCheckedClientGroup();
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
                  groupId: ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'checked']), 
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

  handleResetTreeForEdit = (index) => {
    // change group node info as client count TODO
    this.props.ClientGroupActions.getClientGroupNodeList({
      groupIds: this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData']).map(e => (e.get('key'))).toJS(),
      compId: this.state.compId
    }).then(() => {
      if(index !== undefined) {
        const parentListItem = this.props.ClientGroupProps.getIn(['viewItems', this.state.compId, 'treeComp', 'treeData', index]);
        this.props.ClientGroupActions.readChildrenClientGroupList(this.state.compId, parentListItem.get('key'), index);
      } else {
        this.props.ClientGroupActions.readChildrenClientGroupList(this.state.compId, 'CGRPDEFAULT', 0);
      }
    });

  }

  render() {
    const compId = this.state.compId;
    const isEditable = (window.gpmsain === Constants.SUPER_RULECODE) ? false : true;

    let clientCnt = 0;
    let userName = '';
    const userId = this.props.UserProps.getIn(['viewItems', this.state.compId, 'selectId']);
    const clientObj = this.props.UserProps.getIn(['viewItems', this.state.compId]);
    const listObj = clientObj && clientObj.get('listData');
    if (listObj) {
      const obj = listObj.find (n => n.get('userId') === userId);
      clientCnt  = obj ? obj.get('useClientCnt') : 0;
      userName = obj ? obj.get('userNm') : '';
    }

    console.log ("@@@@@ ", userId);

    return (
      <React.Fragment>
        <GRPageHeader name={ userName + " (" + clientCnt + ")"}/>
        <GRPane>
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <ClientManageComp compId={compId} selectorType='multiple'
                userClient={true}
                userId={userId}
                onSelect={this.handleSelectClient}
                selectorType={(isEditable) ? 'multiple' : 'single'}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef', padding: 0, marginTop: 20}}>
              <ClientManageSpec compId={compId} />
              <ClientGroupSpec compId={compId} isEditable={isEditable} />
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
        <CtrlCenterItemDialog compId={compId} />
        <PolicyKitRuleDialog compId={compId} />
        <DesktopConfDialog compId={compId} isEnableDelete={false} />
        <DesktopAppDialog compId={compId} />
        
        <GRConfirm />
        <GRCheckConfirm />
        
      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  UserProps: state.UserModule,
  ClientMasterManageProps: state.ClientMasterManageModule,
  ClientManageProps: state.ClientManageModule,
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),

  ClientMasterManageActions: bindActionCreators(ClientMasterManageActions, dispatch),
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),

  TotalRuleActions: bindActionCreators(TotalRuleActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserClientManage)));

