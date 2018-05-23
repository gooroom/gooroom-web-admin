import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import Dialog, { DialogTitle, DialogActions } from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import AppBar from "@material-ui/core/AppBar";
import Tabs, { Tab } from "@material-ui/core/Tabs";

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
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onClose(this.props.clientInfos);
    this.setState({
      tabValue: 0,
    });
  }

  handleTabChange = (event, value) => {
    this.setState({ 
      tabValue: value 
    });
  };

  render() {
    const { onClose, clientId, clientGroupId, ...other } = this.props;
    const { tabValue } = this.state;

    if (clientId !== "") {

      return (
        <Dialog
          disableBackdropClick={true}
          onClose={this.handleClose}
          aria-labelledby="client-dialog-title"
          {...other}
        >
          <DialogTitle id="client-dialog-title">단말 정보</DialogTitle>

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
            <Button onClick={this.handleClose} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      );

    } else {
      // ERROR

      return (
        <Dialog
          disableBackdropClick={true}
          onClose={this.handleClose}
          {...other}
        >
          <DialogTitle id="simple-dialog-title">단말 정보</DialogTitle>
        </Dialog>
      );
      
    }
  }
}

export default ClientDialog;
