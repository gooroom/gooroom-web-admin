import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import SecurityRuleNetwork from './SecurityRuleNetwork';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';
import SecurityRuleSpec from './SecurityRuleSpec';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class SecurityRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT_DEPT = 'INHERIT_DEPT';
    static TYPE_INHERIT_GROUP = 'INHERIT_GROUP';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.SecurityRuleActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.SecurityRuleActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleChangeNetworkOption = (count, event) => {
        this.props.SecurityRuleActions.setEditingNetworkValue({
            count: count,
            name: event.target.name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { SecurityRuleProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddSecuRule"),
                confirmMsg: t("msgAddSecuRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { SecurityRuleProps, SecurityRuleActions } = this.props;
                        SecurityRuleActions.createSecurityRule(SecurityRuleProps.get('editingItem'))
                            .then((res) => {
                                refreshDataListInComps(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
                                this.handleClose();
                            }, (res) => {
                        })
                    }
                },
                confirmObject: SecurityRuleProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleEditData = (event, id) => {
        const { SecurityRuleProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditSecuRule"),
                confirmMsg: t("msgEditSecuRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { SecurityRuleProps, SecurityRuleActions } = this.props;
                        SecurityRuleActions.editSecurityRule(SecurityRuleProps.get('editingItem'), this.props.compId)
                            .then((res) => {
                                refreshDataListInComps(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: SecurityRuleProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleInheritSaveDataForDept = (event, id) => {
        const { SecurityRuleProps, DeptProps, SecurityRuleActions, compId } = this.props;
        const { t, i18n } = this.props;
        const deptCd = DeptProps.getIn(['viewItems', compId, 'viewItem', 'deptCd']);

        SecurityRuleActions.inheritSecurityRuleDataForDept({
            'objId': SecurityRuleProps.getIn(['editingItem', 'objId']),
            'deptCd': deptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplySecuRuleChild")
            });
            this.handleClose();
        });
    }

    handleInheritSaveDataForGroup = (event, id) => {
        const { SecurityRuleProps, ClientGroupProps, SecurityRuleActions, compId } = this.props;
        const { t, i18n } = this.props;
        const grpId = ClientGroupProps.getIn(['viewItems', compId, 'viewItem', 'grpId']);

        SecurityRuleActions.inheritSecurityRuleDataForGroup({
            'objId': SecurityRuleProps.getIn(['editingItem', 'objId']),
            'grpId': grpId
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplySecuRuleChild")
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { SecurityRuleProps, SecurityRuleActions } = this.props;
        const { t, i18n } = this.props;

        SecurityRuleActions.cloneSecurityRuleData({
            'objId': SecurityRuleProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopySecuRule")
            });
            refreshDataListInComps(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
            this.handleClose();
        });
    }

    render() {
        const { classes } = this.props;
        const { t, i18n } = this.props;

        const screenTimeListAll = [[1,'1' + t('optMinutes')], [2,'2' + t('optMinutes')], [3,'3' + t('optMinutes')], [5,'5' + t('optMinutes')], 
        [10,'10' + t('optMinutes')], [15,'15' + t('optMinutes')], [20,'20' + t('optMinutes')], [25,'25' + t('optMinutes')], 
        [30,'30' + t('optMinutes')], [45,'45' + t('optMinutes')], 
        [60,'1' + t('optHours')], [120,'2' + t('optHours')], [180,'3' + t('optHours')], [240,'4' + t('optHours')], [300,'5' + t('optHours')]];

        const screenTimeList = [[1,'1' + t('optMinutes')], [2,'2' + t('optMinutes')], [3,'3' + t('optMinutes')], [5,'5' + t('optMinutes')], 
        [10,'10' + t('optMinutes')], [15,'15' + t('optMinutes')], [20,'20' + t('optMinutes')], [25,'25' + t('optMinutes')], 
        [30,'30' + t('optMinutes')], [45,'45' + t('optMinutes')], 
        [60,'1' + t('optHours')]];

        const { SecurityRuleProps } = this.props;
        const dialogType = SecurityRuleProps.get('dialogType');
        const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;

        let title = "";
        if(dialogType === SecurityRuleDialog.TYPE_ADD) {
            title = t("dtAddSecuRule");
            if(window.gpmsain === Constants.SUPER_RULECODE) {
                title += " - " + t("selStandard");
            }
        } else if(dialogType === SecurityRuleDialog.TYPE_VIEW) {
            title = t("dtViewSecuRule");
        } else if(dialogType === SecurityRuleDialog.TYPE_EDIT) {
            title = t("dtEditSecuRule");
        } else if(dialogType === SecurityRuleDialog.TYPE_INHERIT_DEPT || dialogType === SecurityRuleDialog.TYPE_INHERIT_GROUP) {
            title = t("dtInheritSecuRule");
        } else if(dialogType === SecurityRuleDialog.TYPE_COPY) {
            title = t("dtCopySecuRule");
        }

        return (
            <div>
            {(SecurityRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={SecurityRuleProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === SecurityRuleDialog.TYPE_EDIT || dialogType === SecurityRuleDialog.TYPE_ADD) &&
                    <div>
                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                        <Grid item xs={12} sm={4} md={4}>
                        <TextValidator label={t("lbName")} value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            name="objNm" validators={['required']} errorMessages={[t("msgInputName")]}
                            onChange={this.handleValueChange("objNm")}
                            className={classes.fullWidth}
                        />
                        </Grid>
                        <Grid item xs={12} sm={8} md={8}>
                        <TextField label={t("lbDesc")} value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")}
                            className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        />
                        </Grid>
                    </Grid>
                    {(dialogType === SecurityRuleDialog.TYPE_EDIT || dialogType === SecurityRuleDialog.TYPE_ADD) &&
                        <div>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                                <Grid item xs={12} sm={4} md={4}>
                                <FormControl style={{width:'100%'}} >
                                    <InputLabel htmlFor="screenTime">{t("lbScreenSaverTime")}</InputLabel>
                                    <Select 
                                        value={(editingItem.get('screenTime')) ? editingItem.get('screenTime') : ''}
                                        inputProps={{
                                            name: t("lbScreenSaverTime"),
                                            id: 'screenTime',
                                        }}
                                        onChange={this.handleValueChange("screenTime")}
                                    >
                                        {screenTimeList.map(n => (<MenuItem key={n[0]} value={n[0]}>{n[1]}</MenuItem>))}
                                    </Select>
                                </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <TextField
                                        label={t("lbPasswordChangeCycle")}
                                        multiline
                                        value={(editingItem.get('passwordTime')) ? editingItem.get('passwordTime') : ''}
                                        onChange={this.handleValueChange("passwordTime")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('packageHandle')} color="primary"
                                            checked={(editingItem.get('packageHandle')) ? editingItem.get('packageHandle') : false} />
                                        }
                                        label={(editingItem.get('packageHandle')) ? t("selPackageEditStopOn") : t("selPackageEditStopOff")}
                                    />
                                </Grid>
                            </Grid>

                            <SecurityRuleNetwork dialogType={dialogType} editingItem={editingItem} />

                        </div>
                    }
                    </div>
                    }
                    {(dialogType === SecurityRuleDialog.TYPE_INHERIT_DEPT || dialogType === SecurityRuleDialog.TYPE_INHERIT_GROUP) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <SecurityRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === SecurityRuleDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <SecurityRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === SecurityRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_INHERIT_DEPT) &&
                    <Button onClick={this.handleInheritSaveDataForDept} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_INHERIT_GROUP) &&
                    <Button onClick={this.handleInheritSaveDataForGroup} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("dtCopy")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            {/*<GRAlert /> */}
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    SecurityRuleProps: state.SecurityRuleModule,
    DeptProps: state.DeptModule,
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityRuleDialog)));

