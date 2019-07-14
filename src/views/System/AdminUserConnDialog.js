import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";

import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class AdminUserConnDialog extends Component {

    handleClickClose = (event) => {
        this.props.AdminUserActions.closeConnDialog();
    }

    // 수정
    handleClickSaveData = (event) => {
        const { AdminUserProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbSaveAdminConnIp"),
                confirmMsg: t("msgSaveAdminConnIp"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        this.props.AdminUserActions.updateAdminAddress({
                            adminAddresses: (paramObject) ? paramObject.toArray() : []
                        }).then((res) => {
                            this.handleClickClose();
                        });
                    }
                },
                confirmObject: AdminUserProps.get('gpmsAllowIps')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }        
    }

    handleIpValueChange = index => event => {
        this.props.AdminUserActions.setAdminConnIpValue({
            index: index,
            value: event.target.value
        });
    }
    handleDeleteIp = index => event => {
        this.props.AdminUserActions.deleteAdminConnIp(index);
    }
    handleAddIp = () => {
        this.props.AdminUserActions.addAdminConnIp();
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        const { AdminUserProps, compId } = this.props;
        const { t, i18n } = this.props;

        const gpmsAllowIps = AdminUserProps.get('gpmsAllowIps');

        return (
            <div>
            {(AdminUserProps.get('connDialogOpen')) &&
            <Dialog open={AdminUserProps.get('connDialogOpen')}>
                <ValidatorForm ref="form">
                <DialogTitle>{t("lbAdminConnIp")}</DialogTitle>
                <DialogContent>
                    <FormLabel style={{marginRight:"20px"}}>{bull} 아이피 목록</FormLabel>
                    <Button onClick={this.handleAddIp} variant="contained" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">{t("btnAdd")}</Button>
                    <div style={{maxHeight:140,overflow:'auto',marginTop:20,padding:'10px 0px 10px 0px'}}>
                        {gpmsAllowIps && gpmsAllowIps.map((value, index) => (
                        <div key={index}>
                            <TextValidator value={value} 
                            name={"adminIp"+index} validators={['required', 'matchRegexp:^[a-zA-Z0-9.*]*$']}
                            errorMessages={[t("msgAdminConnIp"), t("msgValidAdminConnIp")]}
                            onChange={this.handleIpValueChange(index)} style={{width:'80%'}} 
                            />
                            <IconButton onClick={this.handleDeleteIp(index)} style={{marginTop:10}}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClickSaveData} variant='contained' color="secondary">{t("btnSave")}</Button>
                    <Button onClick={this.handleClickClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
    AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminUserConnDialog)));

