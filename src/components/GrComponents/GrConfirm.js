import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as grConfirmActions from 'modules/GrConfirmModule';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

class GrConfirm extends Component {

  handleCancel = () => {
    const { GrConfirmActions, GrConfirmProps } = this.props;
    GrConfirmActions.closeConfirm({
      confirmResult: false,
      confirmOpen: false,
      confirmObject: GrConfirmProps.confirmObject
    });
  };

  handleOk = () => {
    const { GrConfirmActions, GrConfirmProps } = this.props;
    GrConfirmProps.handleConfirmResult(true, GrConfirmProps.confirmObject);
    GrConfirmActions.closeConfirm({
      confirmResult: true,
      confirmOpen: false,
      confirmObject: GrConfirmProps.confirmObject
    });
  };

  render() {
    const { GrConfirmProps } = this.props;

    return (
       <Dialog
          onClose={this.handleCancel}
          open={GrConfirmProps.confirmOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{GrConfirmProps.confirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {GrConfirmProps.confirmMsg}
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
  GrConfirmProps: state.GrConfirmModule,
});

const mapDispatchToProps = (dispatch) => ({
  GrConfirmActions: bindActionCreators(grConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GrConfirm);


