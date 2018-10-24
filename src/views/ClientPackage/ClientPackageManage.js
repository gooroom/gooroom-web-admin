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
import ClientStatusSelect from "views/Options/ClientStatusSelect";

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search'; 
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import InputLabel from "@material-ui/core/InputLabel";
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import ClientWithPackageComp from 'views/Client/ClientWithPackageComp';
import ClientManageInform from 'views/Client/ClientManageInform';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientGroupInform from 'views/ClientGroup/ClientGroupInform';
import ClientGroupDialog from 'views/ClientGroup/ClientGroupDialog';

import ClientPackageComp from 'views/ClientPackage/ClientPackageComp';

import ClientPackageDialog from './ClientPackageDialog';
import ClientPackageInform from './ClientPackageInform';

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
  handleClientGroupSelect = (selectedGroupObj, selectedGroupIdArray) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId; 

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: selectedGroupIdArray.toJS(), page:0
    }, true);

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
    const { ClientPackageProps, ClientPackageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

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
    //     selectedViewItem: selectedClientObj,
    //   });
    // }
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
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: '단말그룹 삭제',
        confirmMsg: '단말그룹(' + selectedIds.size + '개)을 삭제하시겠습니까?',
        handleConfirmResult: this.handleDeleteButtonForClientGroupConfirmResult,
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
    const selectedGroupItem = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedViewItem']);
    if(selectedGroupItem) {
      this.setState({
        isOpenClientSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(event.currentTarget, '단말을 추가할 그룹을 선택하세요.');
    }
  }

  isClientSelected = () => {
    const selectedIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    return !(selectedIds && selectedIds.size > 0);
  }

  isGroupSelected = () => {
    return (this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedViewItem'])) ? false : true;
  }

  // install package user selected
  handleClientPackageInstall = (selectedPackage) => {
    const { ClientManageProps, GRConfirmActions } = this.props;
    const selectedIds = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    GRConfirmActions.showConfirm({
        confirmTitle: '선택한 패키지 설치',
        confirmMsg: '선택한 패키지를 설치하시겠습니까?',
        handleConfirmResult: this.handleClientPackageInstallConfirmResult,
        confirmObject: {
          selectedClientIds: selectedIds.toJS(),
          selectedPackageIds: selectedPackage.toJS()
        }
    });
  }
  handleClientPackageInstallConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { ClientPackageProps, ClientPackageActions } = this.props;
      ClientPackageActions.updatePackageInClient({
        clientIds: paramObject.selectedClientIds.join(','),
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
    const selectedGroupItem = ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedViewItem']);
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
        }, true);
        ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
        // close dialog
        this.setState({ isOpenClientSelect: false });
      });
    }
  }

  // remove client in group - save
  handleRemoveClientInGroup = (event) => {
    const { ClientManageProps, GRConfirmActions } = this.props;
    const selectedClients = ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
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
        }, true);
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
      
      //const selectedGroupIds = this.props.ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
      const selectedClientIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);

      ClientPackageActions.updateAllPackage({
        compId: compId
      }).then(() => {
        ClientManageActions.readClientListPaged(ClientManageProps, compId, { page:0 });
      });
    }
  };

  handleAddPackage = (event) => {
    const selectedClientIds = this.props.ClientManageProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedIds']);
    if(selectedClientIds && selectedClientIds.size > 0) {
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
          <Grid container spacing={24}>

            <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef'}}>

              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleCreateButtonForClientGroup} >
                  <AddIcon />등록
                </Button>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleDeleteButtonForClientGroup} disabled={this.isClientGroupRemovable()} style={{marginLeft: "10px"}} >
                  <RemoveIcon />삭제
                </Button>
              </Toolbar>

              <ClientGroupComp compId={compId} onSelectAll={this.handleClientGroupSelectAll} onSelect={this.handleClientGroupSelect} />
            </Grid>

            <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
              <Toolbar elevation={0} style={{minHeight:0,padding:0}}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={12} sm={6} lg={6} >
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleAddClientInGroup} disabled={this.isGroupSelected()} >
                      <AddIcon />추가
                    </Button>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleRemoveClientInGroup} disabled={this.isClientSelected()} style={{marginLeft: "10px"}} >
                      <RemoveIcon />제거
                    </Button>
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

              <ClientWithPackageComp compId={compId} onSelectAll={this.handleClientSelectAll} onSelect={this.handleClientSelect} />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} style={{border: '1px solid #efefef'}}>
              <ClientPackageComp compId={compId} onSelectAll={this.handleClientPackageSelectAll} onSelect={this.handleClientPackageSelect} />
            </Grid>

          </Grid>

        </GRPane>
        <ClientGroupDialog compId={compId} />
        <ClientSelectDialog 
          isOpen={this.state.isOpenClientSelect} 
          onSaveHandle={this.handleClientSelectSave} 
          onClose={this.handleClientSelectClose} 
          selectedGroupItem={ClientGroupProps.getIn(['viewItems', this.props.match.params.grMenuId, 'selectedViewItem'])}
        />
        <ClientPackageSelectDialog isOpen={this.state.isOpenClientPackageSelect} onInstallHandle={this.handleClientPackageInstall} onClose={this.handleClientPackageSelectClose} />
        <GRConfirm />
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


