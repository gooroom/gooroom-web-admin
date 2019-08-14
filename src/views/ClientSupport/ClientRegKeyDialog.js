import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientRegKeyActions from 'modules/ClientRegKeyModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import GRAlert from 'components/GRComponents/GRAlert';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { InlineDatePicker } from 'material-ui-pickers';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";

import {CopyToClipboard} from 'react-copy-to-clipboard'

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientRegKeyDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientRegKeyActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.ClientRegKeyActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleDateChange = (date, name) => {
        this.props.ClientRegKeyActions.setEditingItemValue({
          name: name, 
          value: date.format('YYYY-MM-DD')
        });
    }    

    handleCreateData = (event) => {
        const { ClientRegKeyProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtAddClientKey"),
                confirmMsg: t("msgAddClientKey"),
                handleConfirmResult: this.handleCreateDataConfirmResult,
                confirmObject: ClientRegKeyProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleCreateDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientRegKeyProps, ClientRegKeyActions, compId } = this.props;
            ClientRegKeyActions.createClientRegKeyData({
                comment: paramObject.get('comment'),
                ipRange: paramObject.get('ipRange'),
                regKeyNo: paramObject.get('regKeyNo'),
                validDate: (new Date(paramObject.get('validDate'))).getTime(),
                expireDate: (new Date(paramObject.get('expireDate'))).getTime()
            }).then((res) => {
                ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, compId);
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { ClientRegKeyProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtEditClientKey"),
                confirmMsg: t("msgEditClientKey"),
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: ClientRegKeyProps.get('editingItem')
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
            const { ClientRegKeyProps, ClientRegKeyActions, compId } = this.props;
            ClientRegKeyActions.editClientRegKeyData({
                comment: paramObject.get('comment'),
                ipRange: paramObject.get('ipRange'),
                regKeyNo: paramObject.get('regKeyNo'),
                validDate: (new Date(paramObject.get('validDate'))).getTime(),
                expireDate: (new Date(paramObject.get('expireDate'))).getTime()
            }).then((res) => {
                ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, compId);
                this.handleClose();
            });
        }
    }

    handleKeyGenerate = () => {
        this.props.ClientRegKeyActions.generateClientRegkey();
    }

    handleClickCopyKey = () => {
        const { t, i18n } = this.props;
        this.props.GRAlertActions.showAlert({
            alertTitle: t("dtCopy"),
            alertMsg: t("msgCopyedIntoClipboard")
        });
    }

    render() {
        const { classes } = this.props;
        const { ClientRegKeyProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = ClientRegKeyProps.get('dialogType');
        const editingItem = (ClientRegKeyProps.get('editingItem')) ? ClientRegKeyProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientRegKeyDialog.TYPE_ADD) {
            title = t("dtAddClientKey");
        } else if(dialogType === ClientRegKeyDialog.TYPE_VIEW) {
            title = t("dtViewClientKey");
        } else if(dialogType === ClientRegKeyDialog.TYPE_EDIT) {
            title = t("dtEditClientKey");
        }

        return (
            <div>
            {(ClientRegKeyProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientRegKeyProps.get('dialogOpen')}>
            <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextValidator label={t("spClientRegKey")} name="regKeyNo"
                                value={(editingItem.get('regKeyNo')) ? editingItem.get('regKeyNo'): ''}
                                onChange={this.handleValueChange("regKeyNo")}
                                validators={['required']}
                                errorMessages={[t("msgCreateClientRegKey")]}
                                className={classes.fullWidth} disabled
                            />
                        </Grid>
                        <Grid item xs={4} className={classes.createButton}>
                        {(dialogType === ClientRegKeyDialog.TYPE_ADD) && 
                          <Button className={classes.GRIconSmallButton} variant="contained" color="secondary"
                            style={{marginTop:20}}
                            onClick={() => { this.handleKeyGenerate(); }}
                            ><Add />{t("btnCreateClientRegKey")}
                          </Button>
                        }
                        {(dialogType === ClientRegKeyDialog.TYPE_VIEW) &&
                        <CopyToClipboard text={(editingItem.get('regKeyNo')) ? editingItem.get('regKeyNo'): ''}
                            onCopy={this.handleClickCopyKey}
                        >
                            <Button className={classes.GRIconSmallButton} style={{padding:'0px 5px 0px 5px'}}
                                variant='contained' color="secondary">{t("btnCopyToClipboard")}</Button>
                        </CopyToClipboard>
                        }
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={6}>
                            <InlineDatePicker label={t('lbKeyValidDate')} format='YYYY-MM-DD'
                                value={(editingItem.get('validDate')) ? formatDateToSimple(editingItem.get('validDate'), 'YYYY-MM-DD') : ''}
                                onChange={(date) => {this.handleDateChange(date, 'validDate');}} 
                                className={classes.fullWidth} disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)} />
                        </Grid>
                        <Grid item xs={6}>
                            <InlineDatePicker label={t('lbCertExpireDate')} format='YYYY-MM-DD'
                                value={(editingItem.get('expireDate')) ? formatDateToSimple(editingItem.get('expireDate'), 'YYYY-MM-DD') : ''}
                                onChange={(date) => {this.handleDateChange(date, 'expireDate');}} 
                                className={classes.fullWidth} disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)} />
                        </Grid>
                    </Grid>

                    <TextValidator
                        label={t("lbValidRegIp")} name="ipRange"
                        value={(editingItem.get('ipRange')) ? editingItem.get('ipRange') : ''}
                        onChange={this.handleValueChange("ipRange")}
                        validators={['required']} errorMessages={[t("msgInputValidIp")]}
                        className={classes.fullWidth}
                        disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                    />
                    <FormLabel disabled={true}>
                        <i>{t("msgHelpInputIp")}</i>
                    </FormLabel><br />
                    <FormLabel disabled={true}>
                        <i>{t("msgSampleIputIp")}</i>
                    </FormLabel>
                    <TextField
                        label={t("lbDesc")}
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classes.fullWidth}
                        disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                    />
                </DialogContent>
                <DialogActions>
                    
                {(dialogType === ClientRegKeyDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === ClientRegKeyDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>

                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientRegKeyProps: state.ClientRegKeyModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientRegKeyDialog)));

