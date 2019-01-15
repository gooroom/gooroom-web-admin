import React, { Component } from "react";
import { Redirect, Switch, Router } from 'react-router';
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AdminActions from 'modules/AdminModule';
import * as SecurityLogActions from 'modules/SecurityLogModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import ClientListForViolated from 'views/Client/ClientListForViolated';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ViolatedClientDialog extends Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { AdminProps, AdminActions } = this.props;
        if (AdminProps.get('isNeedRedirect')) {
            AdminActions.setEditingItemValue({name:'isNeedRedirect',value:false});
        }
    }

    handleClickLink = (type, clientId) => {
        const { AdminActions, SecurityLogActions, SecurityLogProps } = this.props;
        if(SecurityLogProps.getIn(['viewItems', 'GRM0935'])) {
            SecurityLogActions.readSecurityLogListPaged(SecurityLogProps, 'GRM0935', {logItem:type,keyword:clientId,page:0});
        }
        AdminActions.redirectPage({address:'/log/secretlog/GRM0935/menuSecurityLog?logItem=' + type + '&keyword=' + clientId});
    }
    
    render() {
        const { AdminProps } = this.props;
        if (AdminProps.get('isNeedRedirect')) {
            return <Redirect push to = {AdminProps.get('redirectAddress')} />;
        }
        const { classes } = this.props;
        const isOpen = AdminProps.get('dialogOpen');

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} maxWidth="md">
                    <DialogTitle>침해 단말 목록</DialogTitle>
                    <DialogContent>
                        <Card className={classes.deptUserCard}>
                            <CardContent style={{paddingTop:0,paddingBottom:0}}>
                                <ClientListForViolated onClickItem={this.handleClickLink} />
                            </CardContent>
                        </Card>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AdminProps: state.AdminModule,
    SecurityLogProps: state.SecurityLogModule
});

const mapDispatchToProps = (dispatch) => ({
    AdminActions: bindActionCreators(AdminActions, dispatch),
    SecurityLogActions: bindActionCreators(SecurityLogActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ViolatedClientDialog));
