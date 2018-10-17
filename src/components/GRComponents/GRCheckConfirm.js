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

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRCheckConfirm extends Component {

  state = {
    checkedConfirm: false
  };

  handleCancel = () => {
    const { GRConfirmActions, GRConfirmProps } = this.props;
    GRConfirmProps.handleConfirmResult(false);
    GRConfirmActions.closeConfirm({
      confirmResult: false,
      confirmCheckOpen: false,
      confirmObject: GRConfirmProps.confirmObject
    });
  };

  handleOk = () => {
    const { GRConfirmActions, GRConfirmProps } = this.props;
    GRConfirmProps.handleConfirmResult(true, GRConfirmProps.confirmObject, this.state.checkedConfirm);
    GRConfirmActions.closeConfirm({
      confirmResult: true,
      confirmCheckOpen: false,
      confirmObject: GRConfirmProps.confirmObject
    });
  };

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { GRConfirmProps } = this.props;

    return (
       <Dialog
          onClose={this.handleCancel}
          open={GRConfirmProps.confirmCheckOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{GRConfirmProps.confirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {GRConfirmProps.confirmMsg}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkedConfirm}
                    onChange={this.handleCheckChange('checkedConfirm')}
                    value="checkedConfirm"
                  />
                }
                label={GRConfirmProps.confirmCheckMsg}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRCheckConfirm));
