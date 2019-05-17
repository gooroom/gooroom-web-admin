import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import ClientHostNameSpec from './ClientHostNameSpec';

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


class ClientHostNameDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT_DEPT = 'INHERIT_DEPT';
    static TYPE_INHERIT_GROUP = 'INHERIT_GROUP';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.ClientHostNameActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.ClientHostNameActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { ClientHostNameProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddHosts"),
                confirmMsg: t("msgAddHosts"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientHostNameProps, ClientHostNameActions } = this.props;
                        ClientHostNameActions.createClientHostNameData(paramObject)
                            .then((res) => {
                                refreshDataListInComps(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: ClientHostNameProps.get('editingItem')
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
        const { ClientHostNameProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditHosts"),
                confirmMsg: t("msgEditHosts"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientHostNameProps, ClientHostNameActions } = this.props;
                        ClientHostNameActions.editClientHostNameData(paramObject, this.props.compId)
                            .then((res) => {
                                refreshDataListInComps(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: ClientHostNameProps.get('editingItem')
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
        const { ClientHostNameProps, ClientGroupProps, ClientHostNameActions, compId } = this.props;
        const { t, i18n } = this.props;
        const grpId = ClientGroupProps.getIn(['viewItems', compId, 'viewItem', 'grpId']);

        ClientHostNameActions.inheritClientHostNameDataForGroup({
            'objId': ClientHostNameProps.getIn(['editingItem', 'objId']),
            'grpId': grpId
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyHostsChild")
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { ClientHostNameProps, ClientHostNameActions } = this.props;
        const { t, i18n } = this.props;

        ClientHostNameActions.cloneClientHostNameData({
            'objId': ClientHostNameProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyHosts")
            });
            refreshDataListInComps(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
            this.handleClose();
        });
    }

    render() {
        const { classes } = this.props;
        const { ClientHostNameProps } = this.props;
        const { t, i18n } = this.props;

        const dialogType = ClientHostNameProps.get('dialogType');
        const editingItem = (ClientHostNameProps.get('editingItem')) ? ClientHostNameProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientHostNameDialog.TYPE_ADD) {
            title = t("dtAddHosts");
        } else if(dialogType === ClientHostNameDialog.TYPE_VIEW) {
            title = t("dtViewHosts");
        } else if(dialogType === ClientHostNameDialog.TYPE_EDIT) {
            title = t("dtEditHosts");
        } else if(dialogType === ClientHostNameDialog.TYPE_INHERIT_DEPT || dialogType === ClientHostNameDialog.TYPE_INHERIT_GROUP) {
            title = t("dtInheritHosts");
        } else if(dialogType === ClientHostNameDialog.TYPE_COPY) {
            title = t("dtCopyHosts");
        }

        return (
            <div>
            {(ClientHostNameProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientHostNameProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientHostNameDialog.TYPE_EDIT || dialogType === ClientHostNameDialog.TYPE_ADD) &&
                    <div>
                        <TextValidator label={t("lbName")} className={classes.fullWidth}
                            value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            name="objNm" validators={['required']}
                            errorMessages={[t("msgInputName")]}
                            onChange={this.handleValueChange("objNm")} />
                        <TextField label={t("lbDesc")} className={classes.fullWidth}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")} />
                        <TextValidator label={t("lbHostsInfo")} multiline className={classes.fullWidth}
                            value={(editingItem.get('hosts')) ? editingItem.get('hosts') : ''}
                            name="hosts" validators={['required']}
                            errorMessages={[t("msgHostsInfo")]}
                            onChange={this.handleValueChange("hosts")} />
                    </div>
                    }
                    {(dialogType === ClientHostNameDialog.TYPE_INHERIT_DEPT || dialogType === ClientHostNameDialog.TYPE_INHERIT_GROUP) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <ClientHostNameSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === ClientHostNameDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <ClientHostNameSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientHostNameDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === ClientHostNameDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === ClientHostNameDialog.TYPE_INHERIT_DEPT) &&
                    <Button onClick={this.handleInheritSaveDataForDept} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === ClientHostNameDialog.TYPE_INHERIT_GROUP) &&
                    <Button onClick={this.handleInheritSaveDataForGroup} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === ClientHostNameDialog.TYPE_COPY) &&
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
    ClientHostNameProps: state.ClientHostNameModule,
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientHostNameDialog)));

