import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from '/modules/ClientManageCompModule';
import * as GrConfirmActions from '/modules/GrConfirmModule';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ClientInfoPane from "./ClientInfoPane";
import ClientRuleInfoPane from "./ClientRuleInfoPane";

//
//  ## Style ########## ########## ########## ########## ##########
//
const tabContainerClass = css({
  margin: "0px 30px !important",
  minHeight: 500,
  minWidth: 500
}).toString();

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientDialog extends Component {

  static TYPE_ADD = 'ADD';
  static TYPE_VIEW = 'VIEW';
  static TYPE_EDIT = 'EDIT';

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     tabValue: 0,
  //   };

  //   this.handleClose = this.handleClose.bind(this);
  // }

  handleClose = (event) => {
    this.props.ClientManageActions.closeDialog({
        dialogOpen: false
    });
  }

  handleTabChange = (event, value) => {
    this.setState({ 
      tabValue: value 
    });
  };

  render() {

    const { ClientManageProps } = this.props;
    const { dialogType, tabValue } = ClientManageProps;

    //const { onClose, clientId, clientGroupId, ...other } = this.props;
    //const { tabValue } = this.state;

    if (ClientManageProps.selectedItem !== "") {

      return (
        <Dialog open={ClientManageProps.dialogOpen}>

          <DialogTitle>단말 정보</DialogTitle>

          <div className={tabContainerClass}>
            {tabValue === 0 && <ClientInfoPane clientId={clientId}></ClientInfoPane>}
            {tabValue === 1 && <ClientRuleInfoPane clientGroupId={clientGroupId}></ClientRuleInfoPane>}
            {tabValue === 2 && <div clientId={clientId}>ETC DIV</div>}
          </div>

          <AppBar position="static">
            <Tabs value={tabValue} onChange={this.handleTabChange}>
              <Tab label="기본정보" />
              <Tab label="정책정보" />
              <Tab label="기타" />
            </Tabs>
          </AppBar>

          <DialogActions>
            <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
          </DialogActions>
        </Dialog>
      );

    } else {
      // ERROR

      return (
        <Dialog open={ClientManageProps.dialogOpen}>
          <DialogTitle id="simple-dialog-title">단말 정보</DialogTitle>
        </Dialog>
      );
      
    }
  }
}

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageCompModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDialog);
