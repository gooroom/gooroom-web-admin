import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from 'modules/ClientProfileSetModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRClientSelector from 'components/GRComponents/GRClientSelector';
import ClientSingleSelectDialog from 'components/GROptions/ClientSingleSelectDialog';
import GroupAndClientMultiSelector from 'components/GROptions/GroupAndClientMultiSelector';

import { getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientProfileSetDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_PROFILE = 'PROFILE';

    constructor(props) {
        super(props);
    
        this.state = {
            isSelectorOpen: false
        };
    }

    closeClientSelectDialog = (event) => {
        this.setState({
            isSelectorOpen: false
        });
    }

    openClientSelectDialog = (event) => {
        this.setState({
            isSelectorOpen: true
        });
    }
    
    handleClose = (event) => {
        this.props.ClientProfileSetActions.closeDialog(this.props.compId);
    }

    handleCreateData = (event) => {
        const { ClientProfileSetProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtAddClientProfile"),
                confirmMsg: t("msgAddClientProfile"),
                handleConfirmResult: this.handleCreateDataConfirmResult,
                confirmObject: ClientProfileSetProps.get('editingItem')
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
            const { ClientProfileSetProps, ClientProfileSetActions, compId } = this.props;
            ClientProfileSetActions.createClientProfileSetData({
                clientId: paramObject.get('clientId'),
                profileNm: paramObject.get('profileNm'),
                profileCmt: paramObject.get('profileCmt')
            }).then((res) => {
                ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { ClientProfileSetProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtEditClientProfile"),
                confirmMsg: t("msgEditClientProfile"),
                handleConfirmResult: this.handleEditConfirmResult,
                confirmObject: ClientProfileSetProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientProfileSetProps, ClientProfileSetActions, compId } = this.props;
            ClientProfileSetActions.editClientProfileSetData({
                profileNo: paramObject.get('profileNo'),
                clientId: paramObject.get('clientId'),
                profileNm: paramObject.get('profileNm'),
                profileCmt: paramObject.get('profileCmt')
            }).then((res) => {
                ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
                this.handleClose();
            });
        }
    }

    handleProfileJob = (event) => {
        const { ClientProfileSetProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: t("dtExecuteClientProfile"),
            confirmMsg: t("msgExecuteClientProfile"),
            handleConfirmResult: (confirmValue, paramObject) => {
                if(confirmValue) {
                    const { ClientProfileSetProps, ClientProfileSetActions, compId } = this.props;
                    const selectedClientGroupIds = paramObject.get('grpInfoList').map(n => n.get('value'));
                    const checkedClientIds = paramObject.get('clientInfoList').map(n => n.get('value'));
        
                    ClientProfileSetActions.createClientProfileSetJob({
                        profileNo: paramObject.get('profileNo'),
                        targetClientIds: (checkedClientIds) ? checkedClientIds.join() : '',
                        targetClientGroupIds: (selectedClientGroupIds) ? selectedClientGroupIds.join() : '',
                        isRemoval: (paramObject.get('isRemoval') && paramObject.get('isRemoval') == 'true') ? 'true' : 'false'
                    }).then((res) => {
                        ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
                        this.handleClose();
                    });
                }
            },
            confirmObject: ClientProfileSetProps.get('editingItem')
        });
    }

    handleValueChange = name => event => {
        this.props.ClientProfileSetActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleSelectRefClient = (clientObj) => {
        this.props.ClientProfileSetActions.setEditingItemValue({ name: 'clientId', value: clientObj.get('clientId') });
        this.props.ClientProfileSetActions.setEditingItemValue({ name: 'clientNm', value: clientObj.get('clientName') });
    }

    handleSelectClient = (selectedItems) => {
        this.props.ClientProfileSetActions.setEditingItemValue({ name: 'clientInfoList', value: selectedItems });
    }

    handleSelectClientArray = (selectedObj, checkedIds) => {
        // this.props.ClientProfileSetActions.setEditingItemValue({
        //   name: 'targetClientIdArray',
        //   value: checkedIds
        // });
    }

    handleSelectGroup = (selectedItems) => {

        this.props.ClientProfileSetActions.setEditingItemValue({ name: 'grpInfoList', value: selectedItems });
    }

    handleSelectGroupArray = (selectedObj, checkedIds) => {
        // this.props.ClientProfileSetActions.setEditingItemValue({
        //   name: 'targetGroupIdArray',
        //   value: checkedIds
        // });
    }

    handleChangeRemoval = key => (event, value) => {
        this.props.ClientProfileSetActions.setEditingItemValue({
            name: 'isRemoval',
            value: value
        });
    };
    

    render() {
        const { classes } = this.props;
        const { ClientProfileSetProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = ClientProfileSetProps.get('dialogType');
        const editingItem = (ClientProfileSetProps.get('editingItem')) ? ClientProfileSetProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientProfileSetDialog.TYPE_ADD) {
            title = t("dtAddClientProfile");
        } else if(dialogType === ClientProfileSetDialog.TYPE_VIEW) {
            title = t("dtViewClientProfile");
        } else if(dialogType === ClientProfileSetDialog.TYPE_EDIT) {
            title = t("dtEditClientProfile");
        } else if(dialogType === ClientProfileSetDialog.TYPE_PROFILE) {
            title = t("dtExecuteClientProfile");
        }

        const selectedGroup = (editingItem && editingItem.get('grpInfoList')) ? editingItem.get('grpInfoList') : null;
        const selectedClient = (editingItem && editingItem.get('clientInfoList')) ? editingItem.get('clientInfoList') : null;

        return (
            <React.Fragment>
            {(ClientProfileSetProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientProfileSetProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle >{title}</DialogTitle>
                <DialogContent>

                    <Grid container spacing={16} alignItems="center" direction="row" justify="space-between" >
                        <Grid item xs={12} sm={4} lg={4} >
                            <TextValidator label={t("lbProfileName")} className={classes.fullWidth}
                                value={(editingItem.get('profileNm')) ? editingItem.get('profileNm') : ''}
                                name="profileNm" validators={['required']} errorMessages={[t("msgInputProfileName")]}
                                onChange={([ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)) ? null : this.handleValueChange("profileNm")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} lg={8} >
                            <TextField label={t("lbProfileDesc")} className={classes.fullWidth}
                                value={(editingItem.get('profileCmt')) ? editingItem.get('profileCmt') : ''}
                                onChange={([ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)) ? null : this.handleValueChange("profileCmt")}
                            />
                        </Grid>
                    </Grid>

                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE || dialogType === ClientProfileSetDialog.TYPE_VIEW) &&
                    <Grid container spacing={16} alignItems="center" direction="row" justify="space-between" >
                        <Grid item xs={12} sm={4} lg={4} >
                            <div className={classes.fullWidth}>
                            {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                                <div>
                                    <FormLabel>{t("lbProfileEtcHandle")}</FormLabel>
                                    <RadioGroup name="is_removal" onChange={this.handleChangeRemoval('isRemoval')} value={(editingItem.get('isRemoval') == 'true') ? 'true': 'false'} row>
                                        <FormControlLabel value="true" control={<Radio />} label={t("selDelete")} />
                                        <FormControlLabel value="false" control={<Radio />} label={t("selNoDelete")} />
                                    </RadioGroup>
                                </div>
                            }
                            {(dialogType === ClientProfileSetDialog.TYPE_VIEW) &&
                                <TextValidator label={t("lbReferenceClient")} className={classes.fullWidth}
                                    name="clientNm" validators={['required']} errorMessages={[t("msgSelectRefClient")]}
                                    value={(editingItem.get('clientNm')) ? editingItem.get('clientNm') + ' (' + editingItem.get('clientId') + ')' : ''}
                                />
                            }
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={8} lg={8} >
                            {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                                <TextField label={t("lbReferenceClient")} className={classes.fullWidth}
                                    value={(editingItem.get('clientNm')) ? editingItem.get('clientNm') + ' (' + editingItem.get('clientId') + ')' : ''}
                                />
                            }
                        </Grid>
                    </Grid>
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_ADD || dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
                        <Grid container spacing={16} alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={12} sm={4} lg={4} >
                                <TextValidator label={t("lbReferenceClient")} className={classes.fullWidth}
                                    name="clientId" validators={['required']} errorMessages={[t("msgSelectRefClient")]}
                                    value={(editingItem.get('clientId') && editingItem.get('clientId') != '') ? editingItem.get('clientNm') + ' (' + editingItem.get('clientId') + ')' : ''}
                                    placeholder={t("msgSelectClientInRight")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8} lg={8} >
                                <Button onClick={this.openClientSelectDialog} variant='contained' color="secondary">{t('lbClientSelect')}</Button>
                            </Grid>
                        </Grid>
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <div style={{paddingTop:20}}>
                            <GroupAndClientMultiSelector compId={compId} title={t('lbTargetClient')} 
                                isCheckMasterOnly={false}
                                selectedGroup={selectedGroup} 
                                onSelectGroup={this.handleSelectGroup}
                                selectedClient={selectedClient} 
                                onSelectClient={this.handleSelectClient}
                            />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                    <Button onClick={this.handleProfileJob} variant='contained' color="secondary">{t("btnCreate")}</Button>
                }
                {(dialogType === ClientProfileSetDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>

                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            <ClientSingleSelectDialog compId={compId} 
                isSelectorOpen={this.state.isSelectorOpen} 
                onHandleClose={this.closeClientSelectDialog}
                onSelectClient={this.handleSelectRefClient}
            />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientProfileSetProps: state.ClientProfileSetModule,
    ClientGroupProps: state.ClientGroupModule,
    ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientProfileSetDialog)));

