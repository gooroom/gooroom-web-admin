import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import GRConfirm from 'components/GRComponents/GRConfirm';
import AdminRecordListComp from 'views/System/AdminRecordListComp';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class AdminRecordDialog extends Component {
    render() {
        const { isOpen, adminId } = this.props;
        return (
                <Dialog open={isOpen} fullWidth={true} maxWidth="md">
                    <DialogTitle>관리자({adminId}) 작업 이력</DialogTitle>
                    <DialogContent><AdminRecordListComp adminId={adminId} /></DialogContent>
                    <DialogActions><Button onClick={this.props.onClose} variant='contained' color="primary">{t("btnClose")}</Button></DialogActions>
                    <GRConfirm />
                </Dialog>
        );
    }
}

export default withStyles(GRCommonStyle)(AdminRecordDialog);
