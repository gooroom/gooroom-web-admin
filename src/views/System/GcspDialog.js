import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GcspManageActions from 'modules/GcspManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import GRAlert from 'components/GRComponents/GRAlert';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Grid from '@material-ui/core/Grid';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class GcspDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.GcspManageActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? '' : 'disallow') : event.target.value;
        this.props.GcspManageActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    // 생성
    handleCreateData = (event) => {
        const { GcspManageProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddCloudService"),
                confirmMsg: t("msgAddCloudService"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { GcspManageProps, GcspManageActions, compId } = this.props;
                        GcspManageActions.createGcspData({
                            gcspId: paramObject.get('gcspId'),
                            gcspNm: paramObject.get('gcspNm'),
                            comment: paramObject.get('comment'),
                            ipRanges: paramObject.get('ipRanges'),
                            url: paramObject.get('url'),
                            certGubun: paramObject.get('certGubun'),
                            gcspCsr: paramObject.get('gcspCsr')
                        }).then((reData) => {
                            if(reData && reData.status && reData.status.result === 'fail') {
                                this.props.GRAlertActions.showAlert({
                                    alertTitle: this.props.t("dtSystemError"),
                                    alertMsg: reData.status.message
                                });
                            } else {
                                GcspManageActions.readGcspListPaged(GcspManageProps, compId);
                                this.handleClose();
                            }
                        });
                    }
                },
                confirmObject: GcspManageProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }        
    }

    // 수정
    handleEditData = (event) => {
        const { GcspManageProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditCloudService"),
                confirmMsg: t("msgEditCloudService"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { GcspManageProps, GcspManageActions, compId } = this.props;
                        GcspManageActions.editGcspData({
                            gcspId: paramObject.get('gcspId'),
                            gcspNm: paramObject.get('gcspNm'),
                            comment: paramObject.get('comment'),
                            ipRanges: paramObject.get('ipRanges'),
                            url: paramObject.get('url')
                        }).then((res) => {
                            GcspManageActions.readGcspListPaged(GcspManageProps, compId);
                            this.handleClose();
                        });
                    }
                },
                confirmObject: GcspManageProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }        
    }

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { GcspManageProps, GcspManageActions } = this.props;
        const editingItem = GcspManageProps.get('editingItem');
        GcspManageActions.setEditingItemValue({
            name: 'showPasswd',
            value: !editingItem.get('showPasswd')
        });
    };

    render() {
        const { classes } = this.props;
        const { GcspManageProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = GcspManageProps.get('dialogType');
        const editingItem = (GcspManageProps.get('editingItem')) ? GcspManageProps.get('editingItem') : null;

        let title = "";
        if(dialogType === GcspDialog.TYPE_ADD) {
            title = t("dtAddCloudService");
        } else if(dialogType === GcspDialog.TYPE_VIEW) {
            title = t("dtViewCloudService");
        } else if(dialogType === GcspDialog.TYPE_EDIT) {
            title = t("dtEditCloudService");
        }

        return (
            <div>
            {(GcspManageProps.get('dialogOpen') && editingItem) &&
            <Dialog open={GcspManageProps.get('dialogOpen')}>
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            <TextValidator
                                label={t("lbCloudServiceId")}
                                value={(editingItem.get('gcspId')) ? editingItem.get('gcspId') : ''}
                                name="gcspId" validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']} 
                                errorMessages={[t("msgCloudServiceId"), t("msgValidCloudServiceId")]}
                                onChange={
                                    (dialogType == GcspDialog.TYPE_VIEW || dialogType == GcspDialog.TYPE_EDIT) ? null : this.handleValueChange("gcspId")
                                }
                                className={classes.fullWidth}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextValidator
                                label={t("lbCloudServiceName")}
                                value={(editingItem.get('gcspNm')) ? editingItem.get('gcspNm') : ''}
                                name="gcspNm" validators={['required']} errorMessages={[t("msgCloudServiceName")]}
                                onChange={
                                    (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("gcspNm")
                                }
                                className={classes.fullWidth}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        label={t("lbCloudServiceDesc")}
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={
                            (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("comment")
                        }
                        className={classes.fullWidth}
                    />
                    <TextValidator
                        label={t("lbCloudServiceIp")}
                        value={(editingItem.get('ipRanges')) ? editingItem.get('ipRanges') : ''}
                        name="ipRanges" validators={['matchRegexp:^[0-9A-Fa-f.:]*$']} errorMessages={[t("msgCloudServiceAccessIp")]}
                        onChange={
                            (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("ipRanges")
                        }
                        className={classes.fullWidth}
                    />
                    <TextValidator
                        label={t("lbCloudServiceDomain")}
                        value={(editingItem.get('url')) ? editingItem.get('url') : ''}
                        name="url" validators={['matchRegexp:^[0-9A-Za-z.:/]*$']} errorMessages={[t("msgCloudServiceDomain")]}
                        onChange={
                            (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("url")
                        }
                        className={classes.fullWidth}
                    />

                    {(dialogType == GcspDialog.TYPE_ADD) &&
                        <div>
                            <FormControl component="fieldset" style={{marginTop:20}}>
                                <FormLabel component="legend">{t("lbCreateCertType")}</FormLabel>
                                <RadioGroup row={true}
                                    aria-label="gender"
                                    name="gender2"
                                    style={{marginTop:20}}
                                    value={(editingItem.get('certGubun')) ? editingItem.get('certGubun') : ''}
                                    onChange={this.handleValueChange('certGubun')}
                                >
                                    <FormControlLabel value="cert1" control={<Radio />} label={t("selAutoCreateCert")} />
                                    <FormControlLabel value="cert2" control={<Radio />} label={t("selCSRCreateCert")} />
                                </RadioGroup>
                                <FormHelperText>
                                {
                                    (editingItem.get('certGubun') === 'cert1') ? t("msgAutoCreateCert") : t("msgCSRCreateCert")
                                }
                                </FormHelperText>
                            </FormControl>
                            {(editingItem.get('certGubun') === 'cert2') && 
                                <TextField label={t("lbCSRInfo")}
                                    margin="normal"
                                    multiline={true}
                                    rows={5}
                                    fullWidth={true}
                                    variant="outlined"
                                    onChange={this.handleValueChange("gcspCsr")}
                                />
                            }
                        </div>
                    }
                    {(dialogType == GcspDialog.TYPE_VIEW) && 
                        <div style={{marginTop:20}}>
                           <FormLabel component="legend">{t("lbCertInfo")}</FormLabel>
                           <TextField label={t("lbCert")}
                                margin="normal"
                                multiline={true}
                                rows={5}
                                fullWidth={true}
                                variant="outlined"
                                value={(editingItem.get('cert')) ? editingItem.get('cert') : ''}
                           />
                           <TextField label={t("lbPrivateKey")}
                                margin="normal"
                                multiline={true}
                                rows={5}
                                fullWidth={true}
                                variant="outlined"
                                value={(editingItem.get('priv')) ? editingItem.get('priv') : ''}
                           />
                       </div>
                     
                    }
                </DialogContent>
                <DialogActions>
                    {(dialogType === GcspDialog.TYPE_ADD) &&
                        <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                    }
                    {(dialogType === GcspDialog.TYPE_EDIT) &&
                        <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
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
    GcspManageProps: state.GcspManageModule
});

const mapDispatchToProps = (dispatch) => ({
    GcspManageActions: bindActionCreators(GcspManageActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GcspDialog)));

