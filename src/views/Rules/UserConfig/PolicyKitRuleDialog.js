import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PolicyKitRuleActions from 'modules/PolicyKitRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import PolicyKitRuleSpec from './PolicyKitRuleSpec';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import Typography from "@material-ui/core/Typography";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class PolicyKitRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT_DEPT = 'INHERIT_DEPT';
    static TYPE_INHERIT_GROUP = 'INHERIT_GROUP';
    static TYPE_COPY = 'COPY';

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    handleChangeTabs = (event, value) => {
        this.setState({
            selectedTab: value
        });
    }

    handleClose = (event) => {
        this.setState({
            selectedTab: 0
        });
        this.props.BrowserRuleActions.closeDialog();
    }

    handleClose = (event) => {
        this.props.PolicyKitRuleActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.PolicyKitRuleActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { PolicyKitRuleProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddPolicyKitRule"),
                confirmMsg: t("msgAddPolicyKitRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { PolicyKitRuleProps, PolicyKitRuleActions } = this.props;
                        PolicyKitRuleActions.createPolicyKitRuleData(PolicyKitRuleProps.get('editingItem'))
                            .then((res) => {
                                refreshDataListInComps(PolicyKitRuleProps, PolicyKitRuleActions.readPolicyKitRuleListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: PolicyKitRuleProps.get('editingItem')
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
        const { PolicyKitRuleProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditPolicyKitRule"),
                confirmMsg: t("msgEditPolicyKitRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { PolicyKitRuleProps, PolicyKitRuleActions } = this.props;
                        PolicyKitRuleActions.editPolicyKitRuleData(PolicyKitRuleProps.get('editingItem'), this.props.compId)
                            .then((res) => {
                                refreshDataListInComps(PolicyKitRuleProps, PolicyKitRuleActions.readPolicyKitRuleListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: PolicyKitRuleProps.get('editingItem')
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
        const { PolicyKitRuleProps, DeptProps, PolicyKitRuleActions, compId } = this.props;
        const { t, i18n } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        PolicyKitRuleActions.inheritPolicyKitRuleDataForDept({
            'objId': PolicyKitRuleProps.getIn(['editingItem', 'objId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyPolicyKitRuleChild")
            });
            this.handleClose();
        });
    }

    handleInheritSaveDataForGroup = (event, id) => {
        const { PolicyKitRuleProps, ClientGroupProps, PolicyKitRuleActions, compId } = this.props;
        const { t, i18n } = this.props;
        const grpId = ClientGroupProps.getIn(['viewItems', compId, 'viewItem', 'grpId']);

        PolicyKitRuleActions.inheritPolicyKitRuleDataForGroup({
            'objId': PolicyKitRuleProps.getIn(['editingItem', 'objId']),
            'grpId': grpId
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyPolicyKitRuleChild")
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { PolicyKitRuleProps, PolicyKitRuleActions } = this.props;
        const { t, i18n } = this.props;

        PolicyKitRuleActions.clonePolicyKitRuleData({
            'objId': PolicyKitRuleProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyPolicyKitRule")
            });
            refreshDataListInComps(PolicyKitRuleProps, PolicyKitRuleActions.readPolicyKitRuleListPaged);
            this.handleClose();
        });
    }

    generateItem = (editingItem, title, itemName, type) => {
        const { t, i18n } = this.props;
        const { PolicyKitRuleProps } = this.props;

        if(editingItem) {

        return <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" style={{paddingTop:20}}>
        <Grid item xs={12}><FormLabel component="legend">{title}</FormLabel></Grid>
        <Grid item >
            <FormControlLabel value="yes" control={
                <Radio color="primary" value="yes" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'yes'} />
            } label={t("dtPkitAllow")} labelPlacement="end" />
        </Grid>

        <Grid item >
            <FormControlLabel value="auth_self" control={
                <Radio color="primary" value="auth_self" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'auth_self'} />
            } label={t("dtPkitUserAuth")} labelPlacement="end" />
        </Grid>

        <Grid item >
            {(type === undefined || type == 'type1') &&
            <FormControlLabel value="auth_self_keep" control={
                <Radio color="primary" value="auth_self_keep" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'auth_self_keep'} />
            } label={t("dtPkitUserAuthKeep")} labelPlacement="end" />
            }
            {(type !== undefined && type == 'type2') &&
            <FormControlLabel value="auth_self_keep" control={
                <Radio color="primary" value="auth_self_keep" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'auth_self_keep'} disabled={true} />
            } label={t("dtPkitUserAuthKeep")} labelPlacement="end" style={{textDecoration: 'line-through'}} />
            }
        </Grid>
        
        <Grid item >
            <FormControlLabel value="auth_admin" control={
                <Radio color="primary" value="auth_admin" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'auth_admin'} />
            } label={t("dtPkitAdminAuth")} labelPlacement="end" />
        </Grid>

        <Grid item >
            {(type === undefined || type == 'type1') &&
            <FormControlLabel value="auth_admin_keep" control={
                    <Radio color="primary" value="auth_admin_keep" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'auth_admin_keep'} />
            } label={t("dtPkitAdminAuthKeep")} labelPlacement="end" />
            }
            {(type !== undefined && type == 'type2') &&
            <FormControlLabel value="auth_admin_keep" control={
                <Radio color="primary" value="auth_admin_keep" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'auth_admin_keep'} disabled={true} />
            } label={t("dtPkitAdminAuthKeep")} labelPlacement="end" style={{textDecoration: 'line-through'}} />
            }
        </Grid>

        <Grid item >
            <FormControlLabel value="no" control={
                <Radio color="primary" value="no" onChange={this.handleValueChange(itemName)} checked={editingItem.get(itemName) === 'no'} />
            } label={t("dtPkitDisallow")} labelPlacement="end" />
        </Grid>
    </Grid>;
        } else {
            return "";
        }
    }


    render() {
        const { selectedTab } = this.state;
        const { classes } = this.props;
        const { t, i18n } = this.props;

        const { PolicyKitRuleProps } = this.props;
        const dialogType = PolicyKitRuleProps.get('dialogType');
        const editingItem = (PolicyKitRuleProps.get('editingItem')) ? PolicyKitRuleProps.get('editingItem') : null;

        let title = "";
        if(dialogType === PolicyKitRuleDialog.TYPE_ADD) {
            title = t("dtAddPolicyKitRule");
            if(window.gpmsain === Constants.SUPER_RULECODE) {
                title += " - " + t("selStandard");
            }
        } else if(dialogType === PolicyKitRuleDialog.TYPE_VIEW) {
            title = t("dtViewPolicyKitRule");
        } else if(dialogType === PolicyKitRuleDialog.TYPE_EDIT) {
            title = t("dtEditPolicyKitRule");
        } else if(dialogType === PolicyKitRuleDialog.TYPE_INHERIT_DEPT || dialogType === PolicyKitRuleDialog.TYPE_INHERIT_GROUP) {
            title = t("dtInheritPolicyKitRule");
        } else if(dialogType === PolicyKitRuleDialog.TYPE_COPY) {
            title = t("dtCopyPolicyKitRule");
        }

        return (
            <div>
            {(PolicyKitRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={PolicyKitRuleProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === PolicyKitRuleDialog.TYPE_EDIT || dialogType === PolicyKitRuleDialog.TYPE_ADD) &&
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
                    {(dialogType === PolicyKitRuleDialog.TYPE_EDIT || dialogType === PolicyKitRuleDialog.TYPE_ADD) &&
                        <div>
                        <AppBar elevation={0} position="static" color="default" style={{marginTop:20}} >
                            <Tabs value={selectedTab} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabs} >
                                <Tab label={t("dtPkitGooroom")} value={0} />
                                <Tab label={t("dtPkitNetwork")} value={1} />
                                <Tab label={t("dtPkitDevice")} value={2} />
                                <Tab label={t("dtPkitSystem")} value={3} />
                            </Tabs>
                        </AppBar>
                        <Paper elevation={0} style={{ maxHeight: 420 }} >
                        {selectedTab === 0 && 
                            <div style={{border:'1px solid lightGray',padding:'10px 20px 20px 20px'}}>
                                {this.generateItem(editingItem, t("dtPkitUpdate"), 'gooroomUpdate', 'type2')}
                                {this.generateItem(editingItem, t("dtPkitAgent"), 'gooroomAgent')}
                                {this.generateItem(editingItem, t("dtPkitRegister"), 'gooroomRegister')}
                                {this.generateItem(editingItem, t("dtPkitGracEdit"), 'gracEditor', 'type2')}
                            </div>
                        }
                        {selectedTab === 1 && 
                            <div style={{border:'1px solid lightGray',padding:'10px 20px 20px 20px'}}>
                                {this.generateItem(editingItem, t("dtPkitWireless"), 'wireWireless')}
                                {this.generateItem(editingItem, t("dtPkitNetworkConfig"), 'networkConfig')}
                            </div>
                        }
                        {selectedTab === 2 && 
                            <div style={{border:'1px solid lightGray',padding:'10px 20px 20px 20px'}}>
                                {this.generateItem(editingItem, t("dtPkitPrinter"), 'printer')}
                                {this.generateItem(editingItem, t("dtPkitMount"), 'diskMount')}
                            </div>
                        }
                        {selectedTab === 3 && 
                            <div style={{border:'1px solid lightGray',padding:'10px 20px 20px 20px'}}>
                                {this.generateItem(editingItem, t("dtPkitAdminExec"), 'pkexec')}
                                {this.generateItem(editingItem, t("dtPkitPackageManager"), 'packageManager', 'type2')}
                            </div>
                        }
                        </Paper>
                        </div>
                    }
                    </div>
                    }
                    {(dialogType === PolicyKitRuleDialog.TYPE_INHERIT_DEPT || dialogType === PolicyKitRuleDialog.TYPE_INHERIT_GROUP) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <PolicyKitRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === PolicyKitRuleDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <PolicyKitRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === PolicyKitRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === PolicyKitRuleDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === PolicyKitRuleDialog.TYPE_INHERIT_DEPT) &&
                    <Button onClick={this.handleInheritSaveDataForDept} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === PolicyKitRuleDialog.TYPE_INHERIT_GROUP) &&
                    <Button onClick={this.handleInheritSaveDataForGroup} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === PolicyKitRuleDialog.TYPE_COPY) &&
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
    PolicyKitRuleProps: state.PolicyKitRuleModule,
    DeptProps: state.DeptModule,
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    PolicyKitRuleActions: bindActionCreators(PolicyKitRuleActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PolicyKitRuleDialog)));

