import React, { Component } from "react";
import Immutable, { isImmutable } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientManageComp from 'views/Client/ClientManageComp';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class GRClientSelector extends Component {


  // Select Group Item
  handleClientGroupSelect = (selectedGroupObj, selectedGroupIds) => {
    const { ClientManageProps, ClientManageActions, compId } = this.props;
    if(this.props.handleGroupSelect) {
      this.props.handleGroupSelect(selectedGroupObj, selectedGroupIds);
    }

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: selectedGroupIds.toJS(), page:0
    }, true);
  };

  // handle click event in client list, set selected client data and call parent function if exixted.
  handleClientSelect = (selectedClientObj, selectedClientIds) => {
    // call assigned handler from parameters(properties), don't save in local state
    // only call where type is 'single'
    if(this.props.handleClientSelect) {
      this.props.handleClientSelect(selectedClientObj, (!!selectedClientIds.toJS) ? selectedClientIds.toJS() : selectedClientIds);
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
              onSelectAll={this.handleClientGroupSelectAll}
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
  ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRClientSelector));

