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
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { getDataObjectVariableInComp } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrPane from 'containers/GrContent/GrPane';
import GrConfirm from 'components/GrComponents/GrConfirm';
import ClientSelectDialog from "views/Client/ClientSelectDialog";

import ClientStatusSelect from "views/Options/ClientStatusSelect";

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';

import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import InputLabel from "@material-ui/core/InputLabel";

import ClientManageComp from 'views/Client/ClientManageComp';
import ClientManageInform from 'views/Client/ClientManageInform';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientGroupInform from 'views/ClientGroup/ClientGroupInform';
import ClientGroupDialog from 'views/ClientGroup/ClientGroupDialog';

import Card from "@material-ui/core/Card";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


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

  // Select Group Item
  handleClientGroupSelect = (selectedGroupObj, selectedGroupIdArray) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: selectedGroupIdArray.join(','), page:0
    });

    // show client group info.
    if(selectedGroupObj) {
      ClientManageActions.closeClientManageInform({compId: compId});
      ClientGroupActions.showClientGroupInform({
        compId: compId, selectedViewItem: selectedGroupObj,
      });
    }
  };

  // Select Client Item
  handleClientSelect = (selectedClientObj, selectedClientIdArray) => {
    const { ClientManageActions, ClientGroupActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // show client info.
    if(selectedClientObj) {
      ClientGroupActions.closeClientGroupInform({
        compId: compId
      });
      ClientManageActions.showClientManageInform({
        compId: compId,
        selectedViewItem: selectedClientObj,
      });
    }
  };

  // GROUP COMPONENT --------------------------------

  // create group
  handleCreateButtonForClientGroup = () => {
    this.props.ClientGroupActions.showDialog({
      selectedViewItem: Map(),
      dialogType: ClientGroupDialog.TYPE_ADD
    });
  }

  isClientGroupRemovable = () => {
    const selectedIds = getDataObjectVariableInComp(this.props.ClientGroupProps, this.props.match.params.grMenuId, 'selectedIds');
    return !(selectedIds && selectedIds.size > 0);
  }

  // delete group
  handleDeleteButtonForClientGroup = () => {
    const selectedIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    if(selectedIds && selectedIds.size > 0) {
      this.props.GrConfirmActions.showConfirm({
        confirmTitle: '단말그룹 삭제',
        confirmMsg: '단말그룹(' + selectedIds.size + '개)을 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteButtonForClientGroupConfirmResult,
        confirmOpen: true,
        confirmObject: null
      });
    }
  }
  handleDeleteButtonForClientGroupConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientGroupProps, ClientGroupActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      const selectedIds = getDataObjectVariableInComp(ClientGroupProps, compId, 'selectedIds');
      if(selectedIds && selectedIds.size > 0) {
        ClientGroupActions.deleteSelectedClientGroupData({
          grpIds: selectedIds.toArray()
        }).then(() => {
          ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
        });
      }
    }
  }

  // CLIENT COMPONENT --------------------------------

  // add client in group
  handleAddClientInGroup = (event) => {
    const selectedIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    if(selectedIds && selectedIds.size > 0) {
      if(selectedIds.size > 1) {
        this.props.GlobalActions.showElementMsg(event.currentTarget, '단말을 추가할 그룹을 하나만 선택하세요.');
      } else {
        this.setState({
          isOpenClientSelect: true
        });
      }
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '단말을 추가할 그룹을 선택하세요.');
    }
  }

  isClientRemovable = () => {
    const selectedIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    // const selectedIds = getDataObjectVariableInComp(this.props.ClientManageProps, this.props.match.params.grMenuId, 'selectedIds');
    return !(selectedIds && selectedIds.size > 0);
  }

  // add client in group - save
  handleClientSelectSave = (selectedClients) => {
    const { ClientGroupProps, GrConfirmActions } = this.props;
    const selectedGroupIds = ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    GrConfirmActions.showConfirm({
        confirmTitle: '그룹에 단말 추가',
        confirmMsg: '단말을 그룹 추가하시겠습니까?',
        handleConfirmResult: this.handleClientSelectSaveConfirmResult,
        confirmOpen: true,
        confirmObject: {
          selectedGroupId: selectedGroupIds.get(0),
          selectedClients: selectedClients
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
          clients: paramObject.selectedClients.join(',')
      }).then((res) => {
        // show clients list in group
        ClientManageActions.readClientListPaged(ClientManageProps, compId, {
          groupId: paramObject.selectedGroupId, page:0
        });
        ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
        // close dialog
        this.setState({ isOpenClientSelect: false });
      });
    }
  }

  // remove client in group - save
  handleRemoveClientInGroup = (event) => {
    const { ClientManageProps, GrConfirmActions } = this.props;
    const selectedClients = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    if(selectedClients && selectedClients !== '') {
      GrConfirmActions.showConfirm({
        confirmTitle: '그룹에서 단말 삭제',
        confirmMsg: '선택하신 단말을 그룹에서 삭제하시겠습니까?',
        handleConfirmResult: this.handleRemoveClientInGroupConfirmResult,
        confirmOpen: true,
        confirmObject: {
          selectedClients: selectedClients
        }
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '사용자를 선택하세요.');
    }
  }
  handleRemoveClientInGroupConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { ClientManageProps, ClientGroupActions, ClientManageActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientGroupActions.removeClientsInGroup({
        clients: paramObject.selectedClients.join(',')
      }).then(() => {
        // show user list in dept.
        ClientManageActions.readClientListPaged(ClientManageProps, compId, {
          page:0
        });
        // close dialog
        this.setState({ isOpenClientSelect: false });
      });
    }
  };

  // delete client
  handleDeleteClient = () => {
    const { ClientManageProps, ClientGroupActions, ClientManageActions } = this.props;
    const selectedClientIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    if(selectedClientIds && selectedClientIds.size > 0) {
      this.props.GrConfirmActions.showConfirm({
        confirmTitle: '단말 삭제',
        confirmMsg: '단말(' + selectedClientIds.size + '개)을 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteClientConfirmResult,
        confirmOpen: true,
        confirmObject: {selectedClientIds: selectedClientIds}
      });
    }
  }
  handleDeleteClientConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientManageProps, ClientManageActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientManageActions.deleteClientData({
        clientIds: confirmObject.selectedClientIds.join(',')
      }).then(() => {
        ClientManageActions.readClientListPaged(ClientManageProps, compId, {
          page:0
        });
      });
    }
  }

  handleChangeClientStatusSelect = (event, property) => {
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      clientType: property, page:0
    });
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
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
          
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            
            <Grid item xs={12} sm={4} lg={4} >
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Button size="small" variant="contained" color="primary" onClick={this.handleCreateButtonForClientGroup} >
                  <AddIcon />등록
                </Button>
                <Button size="small" variant="contained" color="primary" onClick={this.handleDeleteButtonForClientGroup} disabled={this.isClientGroupRemovable()} style={{marginLeft: "10px"}} >
                  <RemoveIcon />삭제
                </Button>
              </Toolbar>
              <ClientGroupComp compId={compId}
                onSelectAll={this.handleClientGroupSelectAll}
                onSelect={this.handleClientGroupSelect}
              />
            </Grid>

            <Grid item xs={12} sm={8} lg={8} >
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                    <Button size="small" variant="contained" color="primary" onClick={this.handleAddClientInGroup} >
                      <AddIcon />추가
                    </Button>
                    <Button size="small" variant="contained" color="primary" onClick={this.handleRemoveClientInGroup} disabled={this.isClientRemovable()} style={{marginLeft: "10px"}} >
                      <RemoveIcon />제거
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6} >
                    <InputLabel htmlFor="client-status">상태</InputLabel>
                    <ClientStatusSelect onChangeSelect={this.handleChangeClientStatusSelect} />
                    <Button size="small" variant="contained" color="secondary" onClick={this.handleDeleteClient} disabled={this.isClientRemovable()} style={{marginLeft: "10px"}}>
                      <AddIcon />삭제
                    </Button>
                  </Grid>
                </Grid>
              </Toolbar>
              <ClientManageComp compId={compId}
                onSelectAll={this.handleClientSelectAll}
                onSelect={this.handleClientSelect}
              />
            
            </Grid>
          </Grid>
          
          <ClientGroupInform compId={compId} onSelect={this.handleClientGroupSelect} />
          <ClientManageInform compId={compId} onSelect={this.handleClientSelect}  />
          <ClientGroupDialog compId={compId} />
          <ClientSelectDialog isOpen={this.state.isOpenClientSelect} onSaveHandle={this.handleClientSelectSave} onClose={this.handleClientSelectClose} />
          <GrConfirm />
          
        </GrPane>
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
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientMasterManage));

