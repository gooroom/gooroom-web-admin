import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as grConfirmActions from 'modules/GRConfirmModule';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRConfirm extends Component {

  handleCancel = () => {
    const { GRConfirmActions, GRConfirmProps } = this.props;
    GRConfirmProps.handleConfirmResult(false);
    GRConfirmActions.closeConfirm({
      confirmResult: false,
      confirmOpen: false,
      confirmObject: GRConfirmProps.confirmObject
    });
  };

  handleOk = () => {
    const { GRConfirmActions, GRConfirmProps } = this.props;
    GRConfirmProps.handleConfirmResult(true, GRConfirmProps.confirmObject);
    GRConfirmActions.closeConfirm({
      confirmResult: true,
      confirmOpen: false,
      confirmObject: GRConfirmProps.confirmObject
    });
  };

  render() {
    const { GRConfirmProps } = this.props;

    return (
       <Dialog
          onClose={this.handleCancel}
          open={GRConfirmProps.confirmOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{GRConfirmProps.confirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {GRConfirmProps.confirmMsg}
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

const mapStateToProps = (state) => ({
  GRConfirmProps: state.GRConfirmModule,
});

const mapDispatchToProps = (dispatch) => ({
  GRConfirmActions: bindActionCreators(grConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRConfirm));
