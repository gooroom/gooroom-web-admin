import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as grAlertActions from 'modules/GRAlertModule';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

class GRAlert extends Component {

  handleOk = () => {
    const { GRAlertActions, GRAlertProps } = this.props;
    GRAlertActions.closeConfirm({
      alertResult: true,
      alertOpen: false
    });
  };


  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { GRAlertProps } = this.props;

    return (
       <Dialog
          onClose={this.handleCancel}
          open={GRAlertProps.alertOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{GRAlertProps.alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {GRAlertProps.alertMsg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleOk} color="primary">
              확인
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  GRAlertProps: state.GRAlertModule,
});

const mapDispatchToProps = (dispatch) => ({
  GRAlertActions: bindActionCreators(grAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GRAlert);


