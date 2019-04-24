import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Divider from '@material-ui/core/Divider';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

import ClientRuleSelector from 'components/GROptions/ClientRuleSelector';


class ClientGroupDialog extends Component {
    
    static TYPE_ADD = 'ADD';
    static TYPE_VIEW = 'VIEW';
    static TYPE_EDIT = 'EDIT';
    
    handleClose = (event) => {
        this.props.ClientGroupActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.ClientGroupActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { ClientGroupProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtAddGroup"),
                confirmMsg: t("msgAddGroup"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientGroupProps, ClientGroupActions, compId, resetCallback } = this.props;
                        const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps } = this.props;
                        const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;
            
                        const selecteObjectIdName = ['viewItems', compId, 'GROUP', 'selectedOptionItemId'];
                        ClientGroupActions.createClientGroupData({
                            groupName: ClientGroupProps.getIn(['editingItem', 'grpNm']),
                            groupComment: ClientGroupProps.getIn(['editingItem', 'comment']),
                            uprGrpId: ClientGroupProps.getIn(['editingItem', 'grpId']),
                            isDefault: ClientGroupProps.getIn(['editingItem', 'isDefault']),
                            
                            clientConfigId: ClientConfSettingProps.getIn(selecteObjectIdName),
                            hostNameConfigId: ClientHostNameProps.getIn(selecteObjectIdName),
                            updateServerConfigId: ClientUpdateServerProps.getIn(selecteObjectIdName),
                            browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                            mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                            securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                            filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                            desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)
            
                        }).then((res) => {
                            // tree refresh
                            const listItem = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(n => (n.get('key') === ClientGroupProps.getIn(['editingItem', 'grpId'])));
                            resetCallback((listItem.get('parentIndex')) ? listItem.get('parentIndex') : 0);
                            this.handleClose();
                        }).catch((err) => {
                            console.log('handleCreateData - err :::: ', err);
                        });
                    }
                },
                confirmObject: ClientGroupProps.get('editingItem')
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
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtEditGroup"),
                confirmMsg: t("msgEditGroup"),
                handleConfirmResult: (confirmValue) => {
                    if(confirmValue) {
                        const { ClientGroupProps, ClientGroupActions, compId, resetCallback } = this.props;
                        const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps } = this.props;
                        const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;
            
                        const selecteObjectIdName = ['viewItems', compId, 'GROUP', 'selectedOptionItemId'];
                        ClientGroupActions.editClientGroupData({
                            groupId: ClientGroupProps.getIn(['editingItem', 'grpId']),
                            groupName: ClientGroupProps.getIn(['editingItem', 'grpNm']),
                            groupComment: ClientGroupProps.getIn(['editingItem', 'comment']),
                            isDefault: ClientGroupProps.getIn(['editingItem', 'isDefault']),
            
                            clientConfigId: ClientConfSettingProps.getIn(selecteObjectIdName),
                            hostNameConfigId: ClientHostNameProps.getIn(selecteObjectIdName),
                            updateServerConfigId: ClientUpdateServerProps.getIn(selecteObjectIdName),
                            browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                            mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                            securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                            filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                            desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)
                            
                        }).then((res) => {
                            // tree refresh
                            const listItem = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(n => (n.get('key') === ClientGroupProps.getIn(['editingItem', 'grpId'])));
                            resetCallback(listItem.get('parentIndex'));
                            this.handleClose();
                        });
                    }
                }
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
        const { ClientGroupProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = ClientGroupProps.get('dialogType');
        const editingItem = (ClientGroupProps.get('editingItem')) ? ClientGroupProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientGroupDialog.TYPE_ADD) {
            title = t("dtAddGroup");
        } else if(dialogType === ClientGroupDialog.TYPE_VIEW) {
            title = t("dtViewGroup");
        } else if(dialogType === ClientGroupDialog.TYPE_EDIT) {
            title = t("dtEditGroup");
        }

        let checkedGrpId = getDataObjectVariableInComp(this.props.ClientGroupProps, compId, 'checkedGrpId');
        let upperGroupInfo = '';
        if(checkedGrpId != undefined && checkedGrpId.size > 0) {
            upperGroupInfo = ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(e => (e.get('key') === checkedGrpId.get(0))).get('title') + ' (' + checkedGrpId.get(0) + ')';
        }

        return (
            <div>
            {(ClientGroupProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientGroupProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle >{title}</DialogTitle>
                <DialogContent style={{minHeight:567}}>
                {(dialogType === ClientGroupDialog.TYPE_ADD) &&
                    <TextField
                        label={t("lbParentGroup")}
                        value={upperGroupInfo}
                        className={classes.fullWidth}
                    />
                    }
                    <Grid container spacing={24}>
                        <Grid item xs={3}>
                            <TextValidator label={t("spClientGroupName")} className={classes.fullWidth}
                                name="grpNm"
                                validators={['required']}
                                errorMessages={[t("msgInputGroupName")]}
                                value={(editingItem.get('grpNm')) ? editingItem.get('grpNm') : ''}
                                onChange={this.handleValueChange('grpNm')}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField label={t("spClientGroupDesc")} className={classes.fullWidth}
                                value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                                onChange={this.handleValueChange('comment')}
                            />
                        </Grid>
                    </Grid>
                    <Divider style={{marginBottom: 10}} />
                    
                    <ClientRuleSelector compId={compId} module={(dialogType === ClientGroupDialog.TYPE_ADD) ? 'new' : 'edit'} targetType="GROUP" />

                </DialogContent>
                <DialogActions>
                    {(dialogType === ClientGroupDialog.TYPE_ADD) &&
                        <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                    }
                    {(dialogType === ClientGroupDialog.TYPE_EDIT) &&
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
    ClientGroupProps: state.ClientGroupModule,
    
    ClientConfSettingProps: state.ClientConfSettingModule,
    ClientHostNameProps: state.ClientHostNameModule,
    ClientUpdateServerProps: state.ClientUpdateServerModule,
    
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule,
    SoftwareFilterProps: state.SoftwareFilterModule,
    DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
});


export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupDialog)));


