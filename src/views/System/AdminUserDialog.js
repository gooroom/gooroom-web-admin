import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sha256 from 'sha-256-js';

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class AdminUserDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.AdminUserActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.AdminUserActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleValuePasswordChange = name => event => {
        this.props.AdminUserActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    // 생성
    handleCreateData = (event) => {
        const { AdminUserProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '관리자계정 등록',
                confirmMsg: '관리자계정을 등록하시겠습니까?',
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: AdminUserProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { AdminUserProps, AdminUserActions, compId } = this.props;
            AdminUserActions.createAdminUserData({
                adminId: paramObject.get('adminId'),
                adminPw: (paramObject.get('adminPw') !== '') ? sha256(paramObject.get('adminId') + sha256(paramObject.get('adminPw'))) : '',
                adminNm: paramObject.get('adminNm')
            }).then((res) => {
                AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
                this.handleClose();
            });
        }
    }

    // 수정
    handleEditData = (event) => {
        const { AdminUserProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '관리자계정 수정',
                confirmMsg: '관리자계정을 수정하시겠습니까?',
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: AdminUserProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleEditDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { AdminUserProps, AdminUserActions, compId } = this.props;
            AdminUserActions.editAdminUserData({
                adminId: paramObject.get('adminId'),
                adminPw: (paramObject.get('adminPw') !== '') ? sha256(paramObject.get('adminId') + sha256(paramObject.get('adminPw'))) : '',
                adminNm: paramObject.get('adminNm')
            }).then((res) => {
                AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
                this.handleClose();
            });
        }
    }

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { AdminUserProps, AdminUserActions } = this.props;
        const editingItem = AdminUserProps.get('editingItem');
        AdminUserActions.setEditingItemValue({
            name: 'showPasswd',
            value: !editingItem.get('showPasswd')
        });
    };

    render() {
        const { classes } = this.props;
        const { AdminUserProps, compId } = this.props;

        const dialogType = AdminUserProps.get('dialogType');
        const editingItem = (AdminUserProps.get('editingItem')) ? AdminUserProps.get('editingItem') : null;

        let title = "";
        if(dialogType === AdminUserDialog.TYPE_ADD) {
            title = "관리자계정 등록";
        } else if(dialogType === AdminUserDialog.TYPE_VIEW) {
            title = "관리자계정 정보";
        } else if(dialogType === AdminUserDialog.TYPE_EDIT) {
            title = "관리자계정 수정";
        }

        return (
            <div>
            {(AdminUserProps.get('dialogOpen') && editingItem) &&
            <Dialog open={AdminUserProps.get('dialogOpen')}>
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextValidator
                        label="관리자아이디" value={(editingItem.get('adminId')) ? editingItem.get('adminId') : ''}
                        name="adminId" validators={['required', 'matchRegexp:^[a-zA-Z0-9]*$']}
                        errorMessages={['관리자아이디를 입력하세요.', '알파벳 또는 숫자만 입력하세요.']}
                        onChange={this.handleValueChange("adminId")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType == AdminUserDialog.TYPE_EDIT) ? true : false}
                    />
                    <TextValidator
                        label="관리자이름" value={(editingItem.get('adminNm')) ? editingItem.get('adminNm') : ''}
                        name="adminNm" validators={['required']} errorMessages={['관리자이름을 입력하세요.']}
                        onChange={this.handleValueChange("adminNm")}
                        className={classes.fullWidth}
                    />
                    <FormControl className={classNames(classes.fullWidth, classes.dialogItemRow)}>
                        <TextValidator
                            label="Password"
                            type={(editingItem && editingItem.get('showPasswd')) ? 'text' : 'password'}
                            value={(editingItem.get('adminPw')) ? editingItem.get('adminPw') : ''}
                            name="userPasswd" validators={['required']} errorMessages={['password를 입력하세요.']}
                            onChange={this.handleValuePasswordChange('adminPw')}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                    onMouseDown={this.handleMouseDownPassword}
                                    >
                                    {(editingItem && editingItem.get('showPasswd')) ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                            }}
                        />
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    
                {(dialogType === AdminUserDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === AdminUserDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>

                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
    AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminUserDialog));

