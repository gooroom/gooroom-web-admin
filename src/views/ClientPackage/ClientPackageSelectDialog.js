import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

import ClientPackageTotalListForSelect from 'views/ClientPackage/ClientPackageTotalListForSelect';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientPackageSelectDialog extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            stateData: Map({
                selectedPackage: List([])
            })
        };
    }

    handleSelectPackage = (newSelectedIds) => {
        this.setState(({stateData}) => ({
            stateData: stateData.set('selectedPackage', List(newSelectedIds))
        }));
    }

    handleInstallButton = (event) => {
        const { t, i18n } = this.props;
        const selectedPackage = this.state.stateData.get('selectedPackage');
        if(selectedPackage && selectedPackage.size > 0) {
            if(this.props.onInstallHandle) {
                this.props.onInstallHandle(selectedPackage);
            }
        } else {
            this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgNoSelectPackage"));
        }
    }

    handleUpdatePackageList = (event) => {
        const { t, i18n } = this.props;
        event.stopPropagation();
        this.props.GRConfirmActions.showConfirm({
            confirmTitle: t("dtPackageListUpdate"),
            confirmMsg: t("msgPackageListUpdate"),
            handleConfirmResult: (confirmValue, confirmObject) => {
                if(confirmValue) {
                const { ClientManageProps, ClientPackageActions, compId } = this.props;
                ClientPackageActions.updateTotalPackage({
                    compId: compId
                }).then((response) => {
                    if(response && response.response.data && response.response.data.status && response.response.data.status.result == 'success') {
                        this.props.GRAlertActions.showAlert({
                        alertTitle: t("dtCompUpdate"),
                        alertMsg: t("msgCompUpdateAndJob")
                        });
                    } else {
                        this.props.GRAlertActions.showAlert({
                        alertTitle: t("dtSystemError"),
                        alertMsg: t("msgFailCompUpdate")
                    });
                    }
                });
                }
            },
        });
    }

    render() {
        const { isOpen } = this.props;
        const { t, i18n } = this.props;

        return (
            <React.Fragment>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{t("dtSelectPackage")}</DialogTitle>
                    <DialogContent>
                        <ClientPackageTotalListForSelect name='ClientPackageTotalListForSelect' 
                            onSelectPackage={this.handleSelectPackage}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Grid container >
                            <Grid item xs={6}>
                            <Button onClick={this.handleUpdatePackageList} variant='contained' color="secondary">{t("dtAllPackageListUpdate")}</Button>
                            </Grid>
                            <Grid item xs={6} style={{flex:'1 0',display:'flex',justifyContent:'flex-end'}}>
                            <Button onClick={this.handleInstallButton} variant='contained' color="secondary">{t("btnInstall")}</Button>
                            <Button onClick={this.props.onClose} variant='contained' color="primary" style={{marginLeft:10}}>{t("btnClose")}</Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            <GRAlert />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageSelectDialog)));
