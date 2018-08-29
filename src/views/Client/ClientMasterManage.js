import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientMasterManageActions from 'modules/ClientMasterManageModule';
import * as ClientManageCompActions from 'modules/ClientManageCompModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrPane from 'containers/GrContent/GrPane';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';

import ClientManageComp from 'views/Client/ClientManageComp';
import ClientManageInform from 'views/Client/ClientManageInform';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientGroupInform from 'views/ClientGroup/ClientGroupInform';

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
  handleClientGroupSelect = (selectedGroupObj='', selectedGroupIdArray) => {

    const { ClientMasterManageActions, ClientGroupActions } = this.props;
    const { ClientManageCompProps, ClientManageCompActions } = this.props;

    const menuId = this.props.match.params.grMenuId;

    ClientManageCompActions.readClientList(getMergedObject(ClientManageCompProps.listParam, {
      groupId: selectedGroupIdArray.join(','), 
      page: 0,
      compId: menuId
    }));

    // show group info.
    if(selectedGroupObj !== '') {
      ClientMasterManageActions.closeClientManageInform();
      ClientGroupActions.setSelectedItemObj({
        compId: menuId,
        selectedItem: selectedGroupObj
      });

      // Show inform
      ClientMasterManageActions.showClientGroupInform();
    }
  };

  // 제거해야할 코드
  handleChangeClientGroupSelected = (selectedGroupObj='', selectedGroupIdArray) => {

    const { ClientMasterManageProps, ClientMasterManageActions, ClientConfSettingActions } = this.props;
    const { ClientGroupCompProps, ClientGroupActions } = this.props;
    const { ClientManageCompProps, ClientManageCompActions } = this.props;

    ClientManageCompActions.readClientList(getMergedObject(ClientManageCompProps.listParam, {
      groupId: selectedGroupIdArray.join(','), 
      page:0,
      compId: this.props.match.params.grMenuId
    }));

    // show group info.
    if(selectedGroupObj !== '') {
      ClientMasterManageActions.closeClientManageInform();
      ClientGroupActions.setSelectedItemObj({
        compId: this.props.match.params.grMenuId,
        selectedItem: selectedGroupObj
      });

      // Show inform
      ClientMasterManageActions.showClientGroupInform();
    }
  };

  // Select Client Item
  handleChangeClientSelected = (selectedClientObj='', selectedClientIdArray) => {

    const { ClientMasterManageProps, ClientMasterManageActions } = this.props;
    const { ClientManageCompProps, ClientManageCompActions } = this.props;

    // show client info.
    if(selectedClientObj !== '') {

      ClientMasterManageActions.closeClientGroupInform();
      ClientManageCompActions.setSelectedItemObj({
        compId: this.props.match.params.grMenuId,
        selectedItem: selectedClientObj
      });
      ClientMasterManageActions.showClientManageInform();

    }
  };

  render() {

    const { classes } = this.props;
    const { ClientMasterManageProps, ClientGroupCompProps, ClientManageCompProps } = this.props;

    const menuId = this.props.match.params.grMenuId;
    const { isGroupInformOpen, isClientInformOpen } = ClientMasterManageProps;
    const selectedGroupItem = ClientGroupCompProps[menuId + '__selectedItem'];
    const selectedClientItem = ClientManageCompProps[menuId + '__selectedItem'];

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
            
              <Grid item xs={6}>
                <Button size="small" variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() }>그룹등록</Button>
                <Button size="small" variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() }>그룹삭제</Button>
                <Button size="small" variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() }>그룹정책변경</Button>
              </Grid>

              <Grid item xs={6}>
                <Button size="small" variant="outlined" color="primary" onClick={ () => this.handleSelectBtnClick() }>조회</Button>
              </Grid>
            </Grid>

            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button size="small" variant="outlined" color="primary" onClick={ () => this.handleSelectBtnClick() }>조회</Button>
              <Button size="small" variant="outlined" color="primary" onClick={ () => this.handleSelectBtnClick() }>조회</Button>
            </Grid>
          </Grid>

          <Grid container spacing={24} style={{border:"0px solid red",minWidth:"990px"}}>
            <Grid item xs={4} sm={3}>
              <Card style={{minWidth:"240px",boxShadow:"2px 2px 8px blue"}}>
                <ClientGroupComp
                  compId={menuId}
                  isMulti="true"
                  onSelect={this.handleClientGroupSelect}
                  onChangeGroupSelected={this.handleChangeClientGroupSelected}
                />
              </Card>
            </Grid>
            <Grid item xs>
              <Card style={{minWidth:"710px",boxShadow:"2px 2px 8px green"}}>
                <ClientManageComp compId={menuId}
                  onChangeClientSelected={this.handleChangeClientSelected}
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
              {(ClientManageCompProps.informOpen) &&
              <GetAppIcon />
              }
            </Grid>
          </Grid>
          
          <ClientGroupInform
            compId={menuId}
            isOpen={isGroupInformOpen} 
            selectedItem={selectedGroupItem}
            compShadow="2px 2px 8px blue" 
          />
          <ClientManageInform 
            isOpen={isClientInformOpen}
            selectedItem={selectedClientItem}
            compShadow="2px 2px 8px green"
          />
          
        </GrPane>
      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  ClientMasterManageProps: state.ClientMasterManageModule,
  ClientManageCompProps: state.ClientManageCompModule,
  ClientGroupCompProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientMasterManageActions: bindActionCreators(ClientMasterManageActions, dispatch),
  ClientManageCompActions: bindActionCreators(ClientManageCompActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientMasterManage));

