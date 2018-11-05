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
      name: 'selectId',
      value: selectedGroupObj.get('grpId'),
      compId: compId
    });
    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: [selectedGroupObj.get('grpId')], page:0
    }, {isResetSelect:true});

    // show client group info.
    // if(selectedGroupObj) {
    //   ClientManageActions.closeClientManageInform({compId: compId});
    //   ClientGroupActions.showClientGroupInform({
    //     compId: compId, viewItem: selectedGroupObj,
    //   });
    // }
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
      clientId: selectedClientObj.get('clientId'), page:0
    });


    // ClientManageActions.readClientListPaged(ClientManageProps, compId, {
    //   groupId: selectedGroupIdArray.join(','), page:0
    // });

    // // show client info.
    // if(selectedClientObj) {
    //   ClientGroupActions.closeClientGroupInform({
    //     compId: compId
    //   });
    //   ClientManageActions.showClientManageInform({
    //     compId: compId,
    //     viewItem: selectedClientObj,
    //   });
    // }
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

  // install package user selected
  handleClientPackageInstall = (selectedPackage) => {
    const { ClientManageProps, GRConfirmActions } = this.props;
    const checkedIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    GRConfirmActions.showConfirm({
        confirmTitle: '선택한 패키지 설치',
        confirmMsg: '선택한 패키지를 설치하시겠습니까?',
        handleConfirmResult: this.handleClientPackageInstallConfirmResult,
        confirmObject: {
          checkedClientIds: checkedIds.toJS(),
          selectedPackageIds: selectedPackage.toJS()
        }
    });
  }
  handleClientPackageInstallConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { ClientPackageProps, ClientPackageActions } = this.props;
      ClientPackageActions.updatePackageInClient({
        clientIds: paramObject.checkedClientIds.join(','),
        packageIds: paramObject.selectedPackageIds.join(',')
      }).then((res) => {
        // close dialog
        this.setState({ isOpenClientPackageSelect: false });
      });
    }
  }

  // add client in group - save
  handleClientSelectSave = (selectedClients) => {
    const { ClientGroupProps, GRConfirmActions } = this.props;
    const selectedGroupItem = ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'viewItem']);
    GRConfirmActions.showConfirm({
        confirmTitle: '그룹에 단말 추가',
        confirmMsg: '단말을 그룹 추가하시겠습니까?',
        handleConfirmResult: this.handleClientSelectSaveConfirmResult,
        confirmObject: {
          selectedGroupId: selectedGroupItem.get('grpId'),
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
    const selectedClients = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(selectedClients && selectedClients !== '') {
      GRConfirmActions.showConfirm({
        confirmTitle: '그룹에서 단말 삭제',
        confirmMsg: '선택하신 단말을 그룹에서 삭제하시겠습니까?',
        handleConfirmResult: this.handleRemoveClientInGroupConfirmResult,
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
    const { ClientGroupProps, GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
      confirmTitle: '전체패키지 업데이트',
      confirmMsg: '선택하신 단말의 업데이트 가능 패키지를 모두 업데이트 하겠습니까?',
      handleConfirmResult: this.handleAllUpdateForClientConfirmResult,
    });
  }
  handleAllUpdateForClientConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientPackageProps, ClientPackageAction, ClientManageProps } = this.props;
      const compId = this.props.match.params.grMenuId;
      
      //const checkedGroupIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
      const checkedClientIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);

      ClientPackageActions.updateAllPackage({
        compId: compId
      }).then(() => {
        ClientManageActions.readClientListPaged(ClientManageProps, compId, { page:0 });
      });
    }
  };

  handleAddPackage = (event) => {
    const checkedClientIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    if(checkedClientIds && checkedClientIds.size > 0) {
      this.setState({
        isOpenClientPackageSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '패키지를 설치할 단말을 선택하세요.');
    }
  }

  render() {
    const { classes } = this.props;
    const { ClientPackageProps, ClientGroupProps } = this.props;
    const compId = this.props.match.params.grMenuId;

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
                onSelectAll={this.handleClientGroupSelectAll} 
                onSelect={this.handleClientGroupSelect} />
            </Grid>

              <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} style={{textAlign:'right'}}>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={this.handleAllUpdateForClient} disabled={this.isClientSelected()} style={{marginLeft: "10px"}}>
                      <AddIcon />전체업데이트
                    </Button>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={this.handleAddPackage} disabled={this.isClientSelected()} style={{marginLeft: "10px"}}>
                      <AddIcon />패키지추가
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageManage));


