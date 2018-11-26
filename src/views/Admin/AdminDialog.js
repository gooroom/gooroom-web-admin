import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminActions from 'modules/AdminModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils'; 

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class AdminDialog extends Component {

    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.onClickClose();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.AdminActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleEditData = (event) => {
        const { AdminProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '관리자설정 수정',
            confirmMsg: '관리자설정을 수정하시겠습니까?',
            handleConfirmResult: (confirmValue, paramObject) => {
                if(confirmValue) {
                    const { AdminProps, AdminActions } = this.props;
                    AdminActions.editAdminInfoData(paramObject)
                        .then((res) => {
                            // refreshDataListInComps(AdminProps, AdminActions.readClientUpdateServerListPaged);
                            this.handleClose();
                        });
                }
            },
            confirmObject: AdminProps.toJS()
        });
    }

    render() {
        const { classes } = this.props;
        const { isShowEdit, AdminProps } = this.props;
        const pollingCycle = AdminProps.get('pollingCycle');

        return (
            <div>
            {(isShowEdit) &&
            <Dialog open={isShowEdit} scroll="paper" fullWidth={true} maxWidth="xs">
                <DialogTitle>관리자설정 수정</DialogTitle>
                <DialogContent>
                    <TextField label="갱신주기" className={classes.fullWidth}
                        value={pollingCycle}
                        onChange={this.handleValueChange("pollingCycle")} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                    <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                <GRConfirm />
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
    AdminActions: bindActionCreators(AdminActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminDialog));

