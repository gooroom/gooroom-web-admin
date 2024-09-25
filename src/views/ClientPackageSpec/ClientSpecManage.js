import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from "react-i18next";

import * as ClientPackageSpecActions from 'modules/ClientPackageSpecModule';
import * as ClientManageActions from 'modules/ClientManageModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';

import ClientManageCompWithPackage from 'views/Client/ClientManageCompWithPackage';
import ClientGroupTreeComp from 'views/ClientGroup/ClientGroupTreeComp';
import ClientPackageSpecComp from './ClientPackageSpecComp';

import { GRCommonStyle } from 'templates/styles/GRStyles';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

class ClientSpecManage extends Component {
  constructor(props) {
    super(props);
  }

  // Check Group Item
  handleClientGroupCheck = (checkedGroupIdArray) => {
    const { ClientManageProps, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    this.props.ClientGroupActions.changeCompVariableObject({
      compId: compId,
      valueObj: { checkedIds: checkedGroupIdArray }
    });

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: checkedGroupIdArray, page: 0
    }, { isResetSelect: true });
  };

  // Select Client Item
  handleClientSelect = (selectedClientObj) => {
    const { ClientPackageSpecProps, ClientPackageSpecActions, ClientManageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // show client info.
    if (selectedClientObj) {
      // show client information
      ClientManageActions.showClientManageInform({ compId: compId, viewItem: selectedClientObj });

      //show Spec list by client id
      ClientPackageSpecActions.readPackageSpecListPagedInClient(ClientPackageSpecProps, compId, {
        clientId: selectedClientObj.get('clientId'), page: 0, isFiltered: false
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;
    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={12} sm={4} lg={4} style={{ border: '1px solid #efefef', minWidth: 320 }}>
              <Toolbar elevation={0} style={{ minHeight: 0, padding: 0 }}>
                <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                  <Grid item xs={3} sm={3} lg={3}>
                  </Grid>
                </Grid>
              </Toolbar>
              <ClientGroupTreeComp compId={compId}
                selectorType='multiple'
                onCheck={this.handleClientGroupCheck}
                isEnableEdit={false}
                isActivable={false}
              />
            </Grid>
            <Grid item xs={12} sm={8} lg={8} style={{ border: '1px solid #efefef' }}>
              <Toolbar elevation={0} style={{ minHeight: 0, padding: 0 }}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={6} sm={6} lg={6} >
                  </Grid>
                </Grid>
              </Toolbar>
              <ClientManageCompWithPackage compId={compId} isSpec={true}
                onSelectAll={this.handleClientSelectAll}
                onSelect={this.handleClientSelect}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} style={{ border: '1px solid #efefef' }}>
              <ClientPackageSpecComp compId={compId} onSelectAll={this.handleClientPackageSelectAll} onSelect={this.handleClientPackageSelect} />
            </Grid>
          </Grid>
        </GRPane>
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => ({
  ClientPackageSpecProps: state.ClientPackageSpecModule,
  ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientPackageSpecActions: bindActionCreators(ClientPackageSpecActions, dispatch),
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientSpecManage)));


