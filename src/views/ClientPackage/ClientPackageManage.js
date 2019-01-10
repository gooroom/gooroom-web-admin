import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as ClientManageActions from 'modules/ClientManageModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';

import ClientSelectDialog from "views/Client/ClientSelectDialog";
import ClientPackageSelectDialog from "views/ClientPackage/ClientPackageSelectDialog";

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import GroupIcon from '@material-ui/icons/GroupWork';
import ClientIcon from '@material-ui/icons/Laptop';

import ClientManageCompWithPackage from 'views/Client/ClientManageCompWithPackage';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientGroupDialog from 'views/ClientGroup/ClientGroupDialog';

import ClientPackageComp from 'views/ClientPackage/ClientPackageComp';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class ClientPackageManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenClientSelect: false,
      isOpenClientPackageSelect: false,
    };
  }

  // Select Group Item
  handleClientGroupSelect = (selectedGroupObj) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    ClientGroupActions.changeCompVariable({
      name: 'viewItem',
      value: selectedGroupObj,
      compId: compId
    });
    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: [selectedGroupObj.get('grpId')], page:0
    }, {isResetSelect:true});
  };

  // Check Group Item
  handleClientGroupCheck = (selectedGroupObj, selectedGroupIdArray) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

  };

  // Select Client Item
  handleClientSelect = (selectedClientObj) => {
    const { ClientManageActions, ClientGroupActions } = this.props;
    const { ClientPackageProps, ClientPackageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    ClientManageActions.changeCompVariable({
      name: 'selectId',
      value: selectedClientObj.get('clientId'),
      compId: compId
    });
    // show package list by client id
    ClientPackageActions.readPackageListPagedInClient(ClientPackageProps, compId, {
      clientId: selectedClientObj.get('clientId'), page:0, isFiltered: false
    });

  };

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
    const { t, i18n } = this.props;
    const checkedIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(checkedIds && checkedIds.size > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("dtDeleteGroup"),
        confirmMsg: t("msgDeleteGroup", {groupCnt: checkedIds.size}),
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
    const { t, i18n } = this.props;
    const selectedGroupItem = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem']);
    if(selectedGroupItem) {
      this.setState({
        isOpenClientSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgCfmSelectGroupForInsertClient"));
    }
  }

  isClientChecked = () => {
    const checkedIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    return (checkedIds && checkedIds.size > 0);
  }

  isGroupChecked = () => {
    const checkedIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    return (checkedIds && checkedIds.size > 0);
  }

  isGroupSelected = () => {
    const selectedGroupItem = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem']);
    return (selectedGroupItem) ? true : false;
  }

  // install package user selected
  handleClientPackageInstall = (selectedPackage) => {
    const { ClientGroupProps, ClientManageProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    if(selectedPackage && selectedPackage.size > 0) {
      const checkedGroupIds = ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
      const checkedClientIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
      
      GRConfirmActions.showConfirm({
          confirmTitle: t("dtInstallSelectedPackage"),
          confirmMsg: t("msgInstallSelectedPackage"),
          handleConfirmResult: (confirmValue, paramObject) => {
            if(confirmValue) {
              this.props.ClientPackageActions.updatePackageInClient({
                groupId: paramObject.checkedGroupIds,
                clientId: paramObject.checkedClientIds,
                packageIds: paramObject.selectedPackageIds
              }).then((res) => {
                // close dialog
                this.setState({ isOpenClientPackageSelect: false });
              });
            }
          },
          confirmObject: {
            checkedGroupIds: (checkedGroupIds) ? checkedGroupIds.toJS().join(',') : '',
            checkedClientIds: (checkedClientIds) ? checkedClientIds.toJS().join(',') : '',
            selectedPackageIds: (selectedPackage) ? selectedPackage.toJS().join(',') : ''
          }
      });
    }
  }

  // add client in group - save
  handleClientSelectSave = (checkedClientIds) => {
    const { ClientGroupProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    const selectedGroupItem = ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem']);
    GRConfirmActions.showConfirm({
        confirmTitle: t("dtAddClientInGroup"),
        confirmMsg: t("msgAddClientInGroup", {clientCnt: checkedClientIds.size, groupName: selectedGroupItem.get('grpNm')}),
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
    const { t, i18n } = this.props;

    const checkedClientIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(checkedClientIds && checkedClientIds !== '') {
      GRConfirmActions.showConfirm({
        confirmTitle: t("dtDeleteClientFromGroup"),
        confirmMsg: t("msgCfmDeleteClientFromGroup"),
        handleConfirmResult: this.handleRemoveClientInGroupConfirmResult,
        confirmObject: {
          checkedClientIds: checkedClientIds
        }
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectClient"));
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

  handleClientSelectClose = () => {
    this.setState({
      isOpenClientSelect: false
    })
  }

  handleClientPackageSelectClose = () => {
    this.setState({
      isOpenClientPackageSelect: false
    })
  }

  handleAllUpdateForClient = (event) => {
    event.stopPropagation();
    const { GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    GRConfirmActions.showConfirm({
      confirmTitle: t("dtAllPackageUpadte"),
      confirmMsg: t("msgAllPackageUpadte"),
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

  handleAddPackage = (event) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientManageProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    const checkedGroupIds = ClientGroupProps.getIn(['viewItems', compId, 'checkedIds']);
    const checkedClientIds = ClientManageProps.getIn(['viewItems', compId, 'checkedIds']);
    
    if((checkedGroupIds && checkedGroupIds.size > 0) || (checkedClientIds && checkedClientIds.size > 0)) {
      this.setState({
        isOpenClientPackageSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectClientForUpdate"));
    }
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
            
            <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
              <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                <Grid item>

                  <Tooltip title={t("ttAddNewGroup")}>
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleCreateButtonForClientGroup} >
                      <AddIcon /><GroupIcon />
                    </Button>
                  </span>
                  </Tooltip>
                  <Tooltip title={t("ttDeleteGroup")}>
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleDeleteButtonForClientGroup} disabled={this.isClientGroupRemovable()} style={{marginLeft: "10px"}} >
                      <RemoveIcon /><GroupIcon />
                    </Button>
                  </span>
                  </Tooltip>

                </Grid>
                <Grid item>

                  <Tooltip title={t("ttAddClientInGroup")}>
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleAddClientInGroup} disabled={!(this.isGroupSelected())} >
                      <AddIcon /><ClientIcon />
                    </Button>
                  </span>
                  </Tooltip>

                  <Tooltip title={t("ttDeleteClientFromGroup")}>
                  <span>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleRemoveClientInGroup} disabled={this.isClientChecked()} style={{marginLeft: "10px"}} >
                      <RemoveIcon /><ClientIcon />
                    </Button>
                  </span>
                  </Tooltip>

                </Grid>
              </Grid>
              </Toolbar>

              <ClientGroupComp compId={compId}
                selectorType='multiple'
                onCheck={this.handleClientGroupCheck}
                onSelect={this.handleClientGroupSelect} />
            </Grid>

              <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} style={{textAlign:'right'}}>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={this.handleAllUpdateForClient} disabled={!(this.isClientChecked() || this.isGroupChecked())} style={{marginLeft: "10px"}}>
                      <AddIcon />{t("btnAllUpdate")}
                    </Button>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={this.handleAddPackage} disabled={!(this.isClientChecked() || this.isGroupChecked())} style={{marginLeft: "10px"}}>
                      <AddIcon />{t("btnAddPackage")}
                    </Button>
                  </Grid>
                </Grid>
              </Toolbar>
              <ClientManageCompWithPackage compId={compId} onSelectAll={this.handleClientSelectAll} onSelect={this.handleClientSelect} />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef'}}>
              <ClientPackageComp compId={compId} onSelectAll={this.handleClientPackageSelectAll} onSelect={this.handleClientPackageSelect} />
            </Grid>
          </Grid>

        <ClientGroupDialog compId={compId} />
        <ClientSelectDialog 
          isOpen={this.state.isOpenClientSelect} 
          onSaveHandle={this.handleClientSelectSave} 
          onClose={this.handleClientSelectClose} 
          selectedGroupItem={ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem'])}
        />
        <ClientPackageSelectDialog isOpen={this.state.isOpenClientPackageSelect} onInstallHandle={this.handleClientPackageInstall} onClose={this.handleClientPackageSelectClose} />
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
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageManage)));


