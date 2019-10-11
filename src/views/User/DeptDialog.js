import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import * as DeptActions from 'modules/DeptModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { InlineDatePicker } from 'material-ui-pickers';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCheckConfirm from 'components/GRComponents/GRCheckConfirm';
import UserRuleSelector from 'components/GROptions/UserRuleSelector';

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Radio from "@material-ui/core/Radio";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DeptDialog extends Component {
    
    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        
        this.props.DeptActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.DeptActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { DeptProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddDeptInfo"),
                confirmMsg: t("msgAddDeptInfo"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { DeptProps, DeptActions, compId, resetCallback } = this.props;
                        const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, CtrlCenterItemProps, PolicyKitRuleProps, DesktopConfProps } = this.props;
                        const selectedObjectIdName = ['viewItems', compId, 'DEPT', 'selectedOptionItemId'];
                        DeptActions.createDeptInfo({
                            deptCd: DeptProps.getIn(['editingItem', 'deptCd']),
                            deptNm: DeptProps.getIn(['editingItem', 'deptNm']),
                            uprDeptCd: DeptProps.getIn(['editingItem', 'parentDeptCd']),
            
                            browserRuleId: BrowserRuleProps.getIn(selectedObjectIdName),
                            mediaRuleId: MediaRuleProps.getIn(selectedObjectIdName),
                            securityRuleId: SecurityRuleProps.getIn(selectedObjectIdName),
                            filteredSoftwareRuleId: SoftwareFilterProps.getIn(selectedObjectIdName),
                            ctrlCenterItemRuleId: CtrlCenterItemProps.getIn(selectedObjectIdName),
                            policyKitRuleId: PolicyKitRuleProps.getIn(selectedObjectIdName),
                            desktopConfId: DesktopConfProps.getIn(selectedObjectIdName)
                        }).then((res) => {
                            if(res.status && res.status && res.status.message) {
                                this.props.GRAlertActions.showAlert({
                                  alertTitle: t("dtSystemNotice"),
                                  alertMsg: res.status.message
                                });
                            }
                            if(res.status && res.status && res.status.result === 'success') {
                                // tree refresh
                                const index = DeptProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).findIndex(n => (n.get('key') === DeptProps.getIn(['editingItem', 'parentDeptCd'])));
                                resetCallback(index);
                                this.handleClose();
                            }
                        }).catch((err) => {
                            console.log('handleCreateData - err :::: ', err);
                        });
                    }
                },
                confirmObject: DeptProps.get('editingItem')
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
        const { GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showCheckConfirm({
                confirmTitle: t("lbEditDeptInfo"),
                confirmMsg: t("msgEditDeptInfo"),
                confirmCheckMsg: t("lbEditChildDeptInfo"),
                handleConfirmResult: (confirmValue, confirmObject, isChecked) => {
                    if(confirmValue) {
                        const isInherit = isChecked;
                        const { DeptProps, DeptActions, compId, resetCallback } = this.props;
                        const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, CtrlCenterItemProps, PolicyKitRuleProps, DesktopConfProps } = this.props;
                        const selectedObjectIdName = ['viewItems', compId, 'DEPT', 'selectedOptionItemId'];
                        DeptActions.editDeptInfo({
                            deptCd: DeptProps.getIn(['editingItem', 'deptCd']),
                            deptNm: DeptProps.getIn(['editingItem', 'deptNm']),
                
                            paramIsInherit: (isInherit) ? 'Y' : 'N',
                
                            browserRuleId: BrowserRuleProps.getIn(selectedObjectIdName),
                            mediaRuleId: MediaRuleProps.getIn(selectedObjectIdName),
                            securityRuleId: SecurityRuleProps.getIn(selectedObjectIdName),
                            filteredSoftwareRuleId: SoftwareFilterProps.getIn(selectedObjectIdName),
                            ctrlCenterItemRuleId: CtrlCenterItemProps.getIn(selectedObjectIdName),
                            policyKitRuleId: PolicyKitRuleProps.getIn(selectedObjectIdName),
                            desktopConfId: DesktopConfProps.getIn(selectedObjectIdName)
                        }).then((res) => {

                            if(res.status && res.status && res.status.message) {
                                this.props.GRAlertActions.showAlert({
                                  alertTitle: t("dtSystemNotice"),
                                  alertMsg: res.status.message
                                });
                            }
                            if(res.status && res.status && res.status.result === 'success') {
                                // tree refresh for edit
                                const listItem = DeptProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(n => (n.get('key') === DeptProps.getIn(['editingItem', 'deptCd'])));
                                resetCallback((listItem.get('parentIndex')) ? listItem.get('parentIndex') : 0);
                                this.handleClose();
                            }
                        });
                    }
                },
                confirmObject: null
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
        this.props.DeptActions.setEditingItemValue({
          name: name, 
          value: date.format('YYYY-MM-DD')
        });
    };

    render() {
        const { classes } = this.props;
        const { DeptProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = DeptProps.get('dialogType');
        const editingItem = (DeptProps.get('editingItem')) ? DeptProps.get('editingItem') : null;

        // default date
        const initDate = moment().add(7, 'days');

        let title = "";
        let editObject = null;
        if(dialogType === DeptDialog.TYPE_ADD) {
            title = t("dtAddDept");
        } else if(dialogType === DeptDialog.TYPE_VIEW) {
            title = t("dtViewDept");
            editObject = DeptProps.get('editingItem').toJS();
        } else if(dialogType === DeptDialog.TYPE_EDIT) {
            title = t("dtEditDept");
            editObject = DeptProps.get('editingItem').toJS();
        }

        const checkedDeptCd = DeptProps.getIn(['viewItems', compId, 'treeComp', 'checked']);
        let upperDeptInfo = '';
        if(checkedDeptCd !== undefined && checkedDeptCd.length > 0) {
            const upperItem = DeptProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(e => (e.get('key') === checkedDeptCd[0]));
            if(upperItem) {
                upperDeptInfo = `${upperItem.get('title')} (${checkedDeptCd[0]})`;
            }
        }
        const isUseDeptExpireDate = (editingItem && editingItem.get('isUseExpire') === '1');
        
        return (
            <div>
            {(DeptProps.get('dialogOpen') && editingItem) &&
                <Dialog open={DeptProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent style={{minHeight:567}}>
                        <Grid container spacing={24}>
                            {(dialogType === DeptDialog.TYPE_ADD) &&
                            <Grid item xs={4}>
                                <TextField
                                    label={t("lbParentDept")}
                                    value={upperDeptInfo}
                                    className={classes.fullWidth}
                                />
                            </Grid>
                            }
                            <Grid item xs={4}>
                                <TextValidator label={t("lbDeptId")}
                                    name="deptCd"
                                    validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
                                    errorMessages={[t("msgEnterDeptId"), t("msgDeptIdValid")]}
                                    value={(editingItem.get('deptCd')) ? editingItem.get('deptCd') : ''}
                                    onChange={this.handleValueChange("deptCd")}
                                    className={classes.fullWidth}
                                    disabled={(dialogType == DeptDialog.TYPE_EDIT) ? true : false}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextValidator label={t("lbDeptName")}
                                    name="deptNm"
                                    validators={['required']}
                                    errorMessages={[t("msgEnterDeptName")]}
                                    value={(editingItem.get('deptNm')) ? editingItem.get('deptNm') : ''}
                                    onChange={this.handleValueChange("deptNm")}
                                    className={classes.fullWidth}
                                />
                            </Grid>
                            {(dialogType !== DeptDialog.TYPE_ADD) &&
                            <Grid item xs={4}>
                            </Grid>
                            }
                            <Grid item xs={4}>
                                <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={12} style={{paddingBottom:0}}><FormLabel component="legend" style={{fontSize:'0.8rem'}}>{t("lbUseDeptExpire")}</FormLabel></Grid>
                                    <Grid item >
                                        <FormControlLabel value="true" control={
                                            <Radio color="primary" value="1" onChange={this.handleValueChange("isUseExpire")} checked={isUseDeptExpireDate} />
                                        } label={t("optUse")} labelPlacement="end" />
                                    </Grid>
                                    <Grid item >
                                        <FormControlLabel value="false" control={
                                            <Radio color="primary" value="0" onChange={this.handleValueChange("isUseExpire")} checked={!isUseDeptExpireDate} />
                                        } label={t("optNoUse")} labelPlacement="end" />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={12}>
                                    <InlineDatePicker label={t('lbDeptExpireDate')} format='YYYY-MM-DD'
                                    value={(editingItem && editingItem.get('expireDate')) ? editingItem.get('expireDate') : initDate.toJSON().slice(0,10)}
                                    onChange={(date) => {this.handleDateChange(date, 'expireDate');}} 
                                    className={classes.fullWidth} 
                                    disabled={!isUseDeptExpireDate} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider style={{marginBottom: 10}} />
                        <UserRuleSelector compId={compId} module={(dialogType === DeptDialog.TYPE_ADD) ? 'new' : 'edit'} targetType="DEPT" />
                    </DialogContent>
                    <DialogActions>
                        {(dialogType === DeptDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                        }
                        {(dialogType === DeptDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                        }
                        <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                </ValidatorForm>
                <GRConfirm />
                <GRCheckConfirm />
                </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    DeptProps: state.DeptModule,
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule,
    SoftwareFilterProps: state.SoftwareFilterModule,
    CtrlCenterItemProps: state.CtrlCenterItemModule,
    PolicyKitRuleProps: state.PolicyKitRuleModule,
    DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
    DeptActions: bindActionCreators(DeptActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptDialog)));
