import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as grAlertActions from 'modules/GrAlertModule';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

class GrAlert extends Component {

  handleOk = () => {
    const { GrAlertActions, GrAlertProps } = this.props;
    GrAlertActions.closeConfirm({
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
    const { GrAlertProps } = this.props;

    return (
       <Dialog
          onClose={this.handleCancel}
          open={GrAlertProps.alertOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{GrAlertProps.alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {GrAlertProps.alertMsg}
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
  GrAlertProps: state.GrAlertModule,
});

const mapDispatchToProps = (dispatch) => ({
  GrAlertActions: bindActionCreators(grAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GrAlert);


