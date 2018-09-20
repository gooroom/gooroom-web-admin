import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientMasterManageActions from 'modules/ClientMasterManageModule';
import * as ClientManageCompActions from 'modules/ClientManageModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { getDataObjectInComp, getDataObjectVariableInComp } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrPane from 'containers/GrContent/GrPane';
import GrConfirm from 'components/GrComponents/GrConfirm';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

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
      loading: true,
    };
  }

  // .................................................

  handleSelectBtnClick = () => {
    console.log('ClientMasterManage Buttons................');
  };

  // Select Group Item
  handleClientGroupSelect = (selectedGroupObj, selectedGroupIdArray) => {
    const { ClientMasterManageProps, ClientMasterManageActions, ClientConfSettingActions } = this.props;
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageCompActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

    // show client list
    ClientManageCompActions.readClientList(ClientManageProps, compId, {
      groupId: selectedGroupIdArray.join(','), 
      page:0
    }, true);

    // show client group info.
    if(selectedGroupObj) {
      ClientManageCompActions.closeClientManageInform({
        compId: compId
      });
      ClientGroupActions.showClientGroupInform({
        compId: compId,
        selectedViewItem: selectedGroupObj,
      });
    }
  };

  // Select Client Item
  handleClientSelect = (selectedClientObj, selectedClientIdArray) => {
    const { ClientMasterManageProps, ClientMasterManageActions } = this.props;
    const { ClientManageProps, ClientManageCompActions } = this.props;
    const { ClientGroupActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // show client info.
    if(selectedClientObj) {
      ClientGroupActions.closeClientGroupInform({
        compId: compId
      });
      ClientManageCompActions.showClientManageInform({
        compId: compId,
        selectedViewItem: selectedClientObj,
      });
    }
  };

  // CLIENT GROUP COMPONENT
  // add client group
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

  handleDeleteButtonForClientGroup = () => {
    const dataObject = getDataObjectInComp(this.props.ClientGroupProps, this.props.match.params.grMenuId);
    if(dataObject.get('selectedIds') && dataObject.get('selectedIds').size > 0) {
      this.props.GrConfirmActions.showConfirm({
        confirmTitle: '단말그룹 삭제',
        confirmMsg: '단말그룹(' + dataObject.get('selectedIds').size + '개)을 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteButtonForClientGroupConfirmResult,
        confirmOpen: true,
        confirmObject: dataObject
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

  // CLIENT COMPONENT
  // add client group
  handleCreateButtonForClientGroup = () => {
    this.props.ClientGroupActions.showDialog({
      selectedViewItem: Map(),
      dialogType: ClientGroupDialog.TYPE_ADD
    });
  }

  isClientRemovable = () => {
    const selectedIds = getDataObjectVariableInComp(this.props.ClientManageProps, this.props.match.params.grMenuId, 'selectedIds');
    return !(selectedIds && selectedIds.size > 0);
  }

  handleClientDeleteButton = () => {
    
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
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
            
              <Grid item xs={6}>
                <Button size="small" variant="contained" color="primary" onClick={() => {this.handleCreateButtonForClientGroup();}} >
                  <AddIcon />
                  등록
                </Button>
                <Button size="small" variant="contained" color="primary" onClick={() => {this.handleDeleteButtonForClientGroup();}} disabled={this.isClientGroupRemovable()} style={{marginLeft: "10px"}} >
                  <RemoveIcon />
                  삭제
                </Button>
              </Grid>

            </Grid>
            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button size="small" variant="contained" color="primary" onClick={() => {this.handleClientDeleteButton();}} disabled={this.isClientRemovable()} style={{marginLeft: "10px"}} >
                <RemoveIcon />
                삭제
              </Button>
          </Grid>
          </Grid>
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
          &nbsp;
          </Grid>
          <Grid container spacing={24} style={{border:"0px solid red",minWidth:"990px"}}>
            <Grid item xs={4} sm={3}>
              <Card style={{minWidth:"240px",boxShadow:"0px"}}>
                <ClientGroupComp compId={compId}
                  onSelectAll={this.handleClientGroupSelectAll}
                  onSelect={this.handleClientGroupSelect}
                />
              </Card>
            </Grid>
            <Grid item xs>
              <Card style={{minWidth:"710px",boxShadow:"0px"}}>
                <ClientManageComp compId={compId}
                onSelectAll={this.handleClientSelectAll}
                onSelect={this.handleClientSelect}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={24} style={{marginTop:"0px",minWidth:"990px"}}>
            <Grid item xs={4} sm={3}>
              {(isGroupInformOpen) &&
              <GetAppIcon />
              }
            </Grid>
            <Grid item xs style={{textAlign:"right"}}>
              {(ClientManageProps.informOpen) &&
              <GetAppIcon />
              }
            </Grid>
          </Grid>
          
          <ClientGroupInform compId={compId} onSelect={this.handleClientGroupSelect} />
          <ClientManageInform compId={compId} onSelect={this.handleClientSelect}  />
          <ClientGroupDialog compId={compId} />
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
  ClientMasterManageActions: bindActionCreators(ClientMasterManageActions, dispatch),
  ClientManageCompActions: bindActionCreators(ClientManageCompActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientMasterManage));

