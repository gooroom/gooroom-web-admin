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
import { translate, Trans } from "react-i18next";

class GRConfirm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showOk: true
    };
  }

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
    this.setState({
      showOk: false
    });
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
    const { t, i18n } = this.props;
    const showOk = this.state.showOk;
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
            <Button onClick={this.handleCancel} color="primary" autoFocus>{t("btnNo")}</Button>
            {showOk && <Button onClick={this.handleOk} color="primary">{t("btnYes")}</Button>}
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRConfirm)));
