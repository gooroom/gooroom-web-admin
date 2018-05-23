import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

class GrConfirm extends Component {

  state = {
    open: false,
  }

  handleClose = (selectValue) => {
    console.log('GrConfirm : handleClose -> ' + selectValue);
    this.setState({ open: false });
  };

  handleCancel = () => {
    this.props.resultConfirm(false);
  };

  handleOk = () => {
    this.props.resultConfirm(true);
  };

  render() {
    const {onClose, confirmTitle, confirmMsg, resultConfirm, ...other} = this.props;

    return (
       <Dialog
          onClose={this.handleClose}
          {...other}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{confirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirmMsg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary" autoFocus>
              아니오
            </Button>
            <Button onClick={this.handleOk} color="primary">
              예
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default GrConfirm;


