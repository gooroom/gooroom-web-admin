import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AdminUserActions from 'modules/AdminUserModule';
import DividedAdminHistList from './DividedAdminHistList';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class DividedAdminHistDialog extends Component {

    handleClose = (event) => {
        this.props.AdminUserActions.closeHistDialog(this.props.compId);
    }

    render() {
        const { AdminUserProps } = this.props;
        const { t, i18n } = this.props;
        const { classes } = this.props;
        const isOpen = AdminUserProps.get('histDialogOpen');

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} maxWidth="md">
                    <DialogTitle>{`${t("lbAdminActHistory")} - ${AdminUserProps.getIn(['editingItem', 'adminId'])}`}</DialogTitle>
                    <DialogContent>
                        <Card className={classes.deptUserCard}>
                            <CardContent style={{paddingTop:0,paddingBottom:0}}>
                                <DividedAdminHistList adminId={AdminUserProps.getIn(['editingItem', 'adminId'])} />
                            </CardContent>
                        </Card>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
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
    AdminUserActions: bindActionCreators(AdminUserActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminHistDialog)));

