import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminActions from 'modules/AdminModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

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
        if(this.refs.form && this.refs.form.isFormValid()) {
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
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }        
    }

    render() {
        const { classes } = this.props;
        const { isShowEdit, AdminProps } = this.props;
        const editPollingCycle = AdminProps.get('editPollingCycle');

        return (
            <div>
            {(isShowEdit) &&
            <Dialog open={isShowEdit} scroll="paper" fullWidth={true} maxWidth="xs">
                <ValidatorForm ref="form">
                <DialogTitle>관리자설정 수정</DialogTitle>
                <DialogContent>
                    <TextValidator label="갱신주기" className={classes.fullWidth}
                        value={editPollingCycle}
                        name="editPollingCycle"
                        validators={['required', 'matchRegexp:^[0-9]*$', 'minNumber:5']}
                        errorMessages={['갱신주기를 입력하세요.', '숫자만 입력하세요.', '5보다 작을수 없습니다.']}
                        onChange={this.handleValueChange("editPollingCycle")} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                    <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                <GRConfirm />
                </ValidatorForm>
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

