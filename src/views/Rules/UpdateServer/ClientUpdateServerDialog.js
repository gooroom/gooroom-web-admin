import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils'; 

import ClientUpdateServerSpec from './ClientUpdateServerSpec';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientUpdateServerDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT_DEPT = 'INHERIT_DEPT';
    static TYPE_INHERIT_GROUP = 'INHERIT_GROUP';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.ClientUpdateServerActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.ClientUpdateServerActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { ClientUpdateServerProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddUpdateServer"),
                confirmMsg: t("msgAddUpdateServer"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
                        ClientUpdateServerActions.createClientUpdateServerData(ClientUpdateServerProps.get('editingItem'))
                            .then((res) => {
                                refreshDataListInComps(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: ClientUpdateServerProps.get('editingItem')
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
        const { ClientUpdateServerProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditUpdateServer"),
                confirmMsg: t("msgEditUpdateServer"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
                        ClientUpdateServerActions.editClientUpdateServerData(ClientUpdateServerProps.get('editingItem'), this.props.compId)
                            .then((res) => {
                                refreshDataListInComps(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: ClientUpdateServerProps.get('editingItem')
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
    }

    handleInheritSaveDataForGroup = (event, id) => {
        const { ClientUpdateServerProps, ClientGroupProps, ClientUpdateServerActions, compId } = this.props;
        const { t, i18n } = this.props;
        const grpId = ClientGroupProps.getIn(['viewItems', compId, 'viewItem', 'grpId']);

        ClientUpdateServerActions.inheritClientUpdateServerDataForGroup({
            'objId': ClientUpdateServerProps.getIn(['editingItem', 'objId']),
            'grpId': grpId
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyUpdateServerChild")
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
        const { t, i18n } = this.props;
        ClientUpdateServerActions.cloneClientUpdateServerData({
            'objId': ClientUpdateServerProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyUpdateServer")
            });
            refreshDataListInComps(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
            this.handleClose();
        });
    }


    render() {
        const { classes } = this.props;
        const { ClientUpdateServerProps } = this.props;
        const { t, i18n } = this.props;

        const dialogType = ClientUpdateServerProps.get('dialogType');
        const editingItem = (ClientUpdateServerProps.get('editingItem')) ? ClientUpdateServerProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientUpdateServerDialog.TYPE_ADD) {
            title = t("dtAddUpdateServer");
            if(window.gpmsain === Constants.SUPER_RULECODE) {
                title += " - " + t("selStandard");
            }
        } else if(dialogType === ClientUpdateServerDialog.TYPE_VIEW) {
            title = t("dtViewUpdateServer");
        } else if(dialogType === ClientUpdateServerDialog.TYPE_EDIT) {
            title = t("dtEditUpdateServer");
        } else if(dialogType === ClientUpdateServerDialog.TYPE_INHERIT_DEPT || dialogType === ClientUpdateServerDialog.TYPE_INHERIT_GROUP) {
            title = t("dtInheritUpdateServer");
        } else if(dialogType === ClientUpdateServerDialog.TYPE_COPY) {
            title = t("dtCopyUpdateServer");
        }

        return (
            <div>
            {(ClientUpdateServerProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientUpdateServerProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientUpdateServerDialog.TYPE_EDIT || dialogType === ClientUpdateServerDialog.TYPE_ADD) &&
                    <div>
                        <TextValidator label={t("lbName")} className={classes.fullWidth}
                            value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            name="objNm" validators={['required']} errorMessages={[t("msgInputName")]}
                            onChange={this.handleValueChange("objNm")} />
                        <TextField label={t("lbDesc")} className={classes.fullWidth}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")} />
                        <TextValidator label={t("lbMainOSInfo")} multiline className={classes.fullWidth}
                            value={(editingItem.get('mainos')) ? editingItem.get('mainos') : ''}
                            name="mainos" validators={['required']} errorMessages={[t("msgMainOSInfo")]}
                            onChange={this.handleValueChange("mainos")} />
                        <TextValidator label={t("lbBasicOSInfo")} multiline className={classes.fullWidth}
                            value={(editingItem.get('extos')) ? editingItem.get('extos') : ''}
                            name="extos" validators={['required']} errorMessages={[t("msgBasicOSInfo")]}
                            onChange={this.handleValueChange("extos")} />
                        <TextValidator label={t("lbGooroomPrefInfo")} multiline className={classes.fullWidth}
                            value={(editingItem.get('priorities')) ? editingItem.get('priorities') : ''}
                            name="priorities" validators={['required']} errorMessages={[t("msgGooroomPrefInfo")]}
                            onChange={this.handleValueChange("priorities")} />
                    </div>
                    }
                    {(dialogType === ClientUpdateServerDialog.TYPE_INHERIT_DEPT || dialogType === ClientUpdateServerDialog.TYPE_INHERIT_GROUP) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <ClientUpdateServerSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === ClientUpdateServerDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <ClientUpdateServerSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientUpdateServerDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === ClientUpdateServerDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === ClientUpdateServerDialog.TYPE_INHERIT_DEPT) &&
                    <Button onClick={this.handleInheritSaveDataForDept} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === ClientUpdateServerDialog.TYPE_INHERIT_GROUP) &&
                    <Button onClick={this.handleInheritSaveDataForGroup} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === ClientUpdateServerDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("dtCopy")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
                <GRConfirm />
            </Dialog>
            }
            {/*<GRAlert /> */}
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientUpdateServerProps: state.ClientUpdateServerModule,
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientUpdateServerDialog)));

