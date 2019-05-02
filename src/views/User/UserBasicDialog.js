import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { InlineDatePicker } from 'material-ui-pickers';

import GRConfirm from 'components/GRComponents/GRConfirm';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";

import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class UserBasicDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.UserActions.closeDialog(false);
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.UserActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { UserProps, UserActions } = this.props;
        const editingItem = UserProps.get('editingItem');
        UserActions.setEditingItemValue({
            name: 'showPasswd',
            value: !editingItem.get('showPasswd')
        });
    };

    // 데이타 생성
    handleCreateData = (event) => {
        const { UserProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddUserInfo"),
                confirmMsg: t("msgAddUserInfo"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { UserProps, UserActions, compId } = this.props;
                        UserActions.createUserData({
                            userId: UserProps.getIn(['editingItem', 'userId']),
                            userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                            userNm: UserProps.getIn(['editingItem', 'userNm']),
                            expireDate: UserProps.getIn(['editingItem', 'useUserExpireDate']),
                            passwordExpireDate: UserProps.getIn(['editingItem', 'usePasswordExpireDate'])
                        }).then((res) => {
                            UserActions.readUserListPaged(UserProps, compId);
                            this.handleClose();
                        });
                    }
                },
                confirmObject: UserProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleEditData = (event) => {
        const { UserProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditUserInfo"),
                confirmMsg: t("msgEditUserInfo"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { UserProps, UserActions, compId } = this.props;
                        const editingItem = (UserProps.get('editingItem')) ? UserProps.get('editingItem') : null;
                        if(editingItem !== undefined) {
                            // user expire date
                            let userExpireDate = '';
                            if(editingItem.get("isUseExpire") !== undefined && editingItem.get("isUseExpire") === '1') {
                                userExpireDate = editingItem.get('expireDate')
                            }
                            // password expire date
                            let passwordExpireDate = '';
                            if(editingItem.get("isUsePasswordExpire") !== undefined && editingItem.get("isUsePasswordExpire") === '1') {
                                passwordExpireDate = editingItem.get('passwordExpireDate')
                            }
                            
                            UserActions.editUserData({
                                userId: UserProps.getIn(['editingItem', 'userId']),
                                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                                userNm: UserProps.getIn(['editingItem', 'userNm']),
                                expireDate: userExpireDate,
                                passwordExpireDate: passwordExpireDate
                            }).then((res) => {
                                UserActions.readUserListPaged(UserProps, compId);
                                this.handleClose();
                            });

                        }
                    }
                },
                confirmObject: UserProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleDateChange = (date, name) => {
        this.props.UserActions.setEditingItemValue({
          name: name, 
          value: date.format('YYYY-MM-DD')
        });
    };

    render() {
        const { classes } = this.props;
        const { UserProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = UserProps.get('dialogType');
        const editingItem = (UserProps.get('editingItem')) ? UserProps.get('editingItem') : null;

        // default date
        const initDate = moment().add(7, 'days');

        let title = "";
        if(dialogType === UserBasicDialog.TYPE_ADD) {
            title = t("dtAddUser");
        } else if(dialogType === UserBasicDialog.TYPE_VIEW) {
            title = t("dtViewUser");
        } else if(dialogType === UserBasicDialog.TYPE_EDIT) {
            title = t("dtEditUser");
        }

        const isUseUserExpireDate = (editingItem && editingItem.get('isUseExpire') === '1');
        const isUsePasswordExpireDate = (editingItem && editingItem.get('isUsePasswordExpire') === '1');

        return (
            <div>
            {(UserProps.get('dialogOpen') && editingItem) &&
                <Dialog open={UserProps.get('dialogOpen')}>
                    <ValidatorForm ref="form">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>

                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                            <Grid item xs={6}>
                                <TextValidator
                                    label={t("lbUserId")} value={(editingItem.get('userId')) ? editingItem.get('userId') : ''}
                                    name="userId" validators={['required', 'matchRegexp:^[a-z][-a-z0-9_]*$']}
                                    errorMessages={[t("msgEnterUserId"), t("msgUserIdValid")]}
                                    onChange={this.handleValueChange("userId")}
                                    className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    disabled={(dialogType == UserBasicDialog.TYPE_EDIT) ? true : false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextValidator
                                    label={t("lbUserName")} value={(editingItem.get('userNm')) ? editingItem.get('userNm') : ''}
                                    name="userNm" validators={['required']} errorMessages={[t("msgEnterUserName")]}
                                    onChange={this.handleValueChange("userNm")}
                                    className={classes.fullWidth}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                            <Grid item xs={6}>
                                <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={12} style={{paddingBottom:0}}><FormLabel component="legend" style={{fontSize:'0.8rem'}}>{t("lbUseUserExpire")}</FormLabel></Grid>
                                    <Grid item >
                                        <FormControlLabel value="true" control={
                                            <Radio color="primary" value="1" onChange={this.handleValueChange("isUseExpire")} checked={isUseUserExpireDate} />
                                        } label={t("optUse")} labelPlacement="end" />
                                    </Grid>
                                    <Grid item >
                                        <FormControlLabel value="false" control={
                                            <Radio color="primary" value="0" onChange={this.handleValueChange("isUseExpire")} checked={!isUseUserExpireDate} />
                                        } label={t("optNoUse")} labelPlacement="end" />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={12}>
                                    <InlineDatePicker label={t('lbUserExpireDate')} format='YYYY-MM-DD'
                                    value={(editingItem && editingItem.get('expireDate')) ? editingItem.get('expireDate') : initDate.toJSON().slice(0,10)}
                                    onChange={(date) => {this.handleDateChange(date, 'expireDate');}} 
                                    className={classes.fullWidth} 
                                    disabled={!isUseUserExpireDate} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <FormControl className={classNames(classes.fullWidth, classes.dialogItemRow)}>
                            <TextValidator
                                label={t("lbPassword")}
                                type={(editingItem && editingItem.get('showPasswd')) ? 'text' : 'password'}
                                value={(editingItem.get('userPasswd')) ? editingItem.get('userPasswd') : ''}
                                name="userPasswd" validators={[]} errorMessages={[t("msgEnterPassword")]}
                                onChange={this.handleValueChange('userPasswd')}
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                        onMouseDown={this.handleMouseDownPassword}
                                        >
                                        {(editingItem && editingItem.get('showPasswd')) ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                                }}
                            />
                        </FormControl>

                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                            <Grid item xs={6}>
                                <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={12} style={{paddingBottom:0}}><FormLabel component="legend" style={{fontSize:'0.8rem'}}>{t("lbUsePasswordExpire")}</FormLabel></Grid>
                                    <Grid item >
                                        <FormControlLabel value="true" control={
                                            <Radio color="primary" value="1" onChange={this.handleValueChange("isUsePasswordExpire")} checked={isUsePasswordExpireDate} />
                                        } label={t("optUse")} labelPlacement="end" />
                                    </Grid>
                                    <Grid item >
                                        <FormControlLabel value="false" control={
                                            <Radio color="primary" value="0" onChange={this.handleValueChange("isUsePasswordExpire")} checked={!isUsePasswordExpireDate} />
                                        } label={t("optNoUse")} labelPlacement="end" />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={12}>
                                    <InlineDatePicker label={t('lbPasswordExpireDate')} format='YYYY-MM-DD'
                                    value={(editingItem && editingItem.get('passwordExpireDate')) ? editingItem.get('passwordExpireDate') : initDate.toJSON().slice(0,10)}
                                    onChange={(date) => {this.handleDateChange(date, 'passwordExpireDate');}} 
                                    className={classes.fullWidth} 
                                    disabled={!isUsePasswordExpireDate} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        {(dialogType === UserBasicDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                        }
                        {(dialogType === UserBasicDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                        }
                        <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                    </ValidatorForm>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
    UserActions: bindActionCreators(UserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserBasicDialog)));


