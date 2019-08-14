import React, { Component } from "react";
import Immutable, { isImmutable } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientManageComp from 'views/Client/ClientManageComp';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class GRClientSelector extends Component {

  componentDidMount() {
    const { ClientGroupActions, ClientManageActions, compId } = this.props;
    
    ClientGroupActions.changeCompVariable({ name: 'selectId', value: '', compId: compId });

    ClientManageActions.changeCompVariable({ name: 'selectId', value: '', compId: compId });
    ClientManageActions.changeListParamData({ name: 'groupId', value: [], compId: compId });
  }



  // Select Group Item - single
  handleClientGroupSelect = (selectedGroupObj) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageActions } = this.props;
    const { compId, selectorType } = this.props;

    ClientGroupActions.changeCompVariable({
      name: 'selectId',
      value: selectedGroupObj.get('grpId'),
      compId: compId
    });

    // show client list
    if(selectorType == 'single') {
      ClientManageActions.readClientListPaged(ClientManageProps, compId, {
        groupId: [selectedGroupObj.get('grpId')], page:0
      }, {isResetSelect:true});
    }

  }

  // Check Group Item
  handleClientGroupCheck = (selectedGroupObj, selectedGroupIdArray) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { ClientManageProps, ClientManageActions, compId } = this.props;

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: selectedGroupIdArray.toJS(), page:0
    }, {isResetSelect:true});

  };
  

  // handle click event in client list, set selected client data and call parent function if exixted.
  handleClientSelect = (selectedClientObj) => {
    // call assigned handler from parameters(properties), don't save in local state
    // only call where type is 'single'
    if(this.props.selectorType == 'single') {
      if(this.props.handleClientSelect) {
        this.props.handleClientSelect(selectedClientObj);
      }
    }
  }


  // RENDER...
  render() {
    const { classes, compId, selectorType } = this.props;

    return (
      <React.Fragment>
        <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
          <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef'}}>
            <ClientGroupComp compId={compId} 
              selectorType={selectorType}
              hasEdit={false}
              hasShowRule={false}
              onCheckAll={this.handleClientGroupSelectAll}
              onCheck={this.handleClientGroupCheck}
              onSelect={this.handleClientGroupSelect}
            />
          </Grid>
          <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
            <ClientManageComp compId={compId} selectorType={selectorType}
              onSelect={this.handleClientSelect}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule,
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRClientSelector));

