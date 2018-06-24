import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as grConfirmActions from '../../modules/GrConfirmModule';

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
    this.setState({ open: false });
  };

  handleCancel = () => {
    this.props.GrConfirmActions.closeWithCallbackConfirm({
      confirmResult: false,
      confirmOpen: false
    });
  };

  handleOk = () => {
    this.props.GrConfirmActions.closeWithCallbackConfirm({
      confirmResult: true,
      confirmOpen: false
    });
  };

  render() {
    //console.log("GrConfirm.... ", this.props);
    const {grConfirmModule} = this.props;

    return (
       <Dialog
          onClose={this.handleClose}
          open={grConfirmModule.confirmOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{grConfirmModule.confirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {grConfirmModule.confirmMsg}
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

  grConfirmModule: state.GrConfirmModule,
  // confirmTitle: state.GrConfirmModule.confirmTitle,
  // confirmMsg: state.GrConfirmModule.confirmMsg,
  // confirmOpen: state.GrConfirmModule.confirmOpen

});

const mapDispatchToProps = (dispatch) => ({

  GrConfirmActions: bindActionCreators(grConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(GrConfirm);


