import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserReqActions from 'modules/UserReqModule';
import UserReqHistList from './UserReqHistList';

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
class UserReqHistDialog extends Component {

    handleClose = (event) => {
        this.props.UserReqActions.closeHistDialog(this.props.compId);
    }

    render() {
        const { UserReqProps } = this.props;
        const { t, i18n } = this.props;
        const { classes } = this.props;
        const isOpen = UserReqProps.get('histDialogOpen');

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} maxWidth="md">
                    <DialogTitle>{`${t("lbAdminActHistory")} - ${UserReqProps.getIn(['editingItem', 'reqSeq'])}`}</DialogTitle>
                    <DialogContent>
                        <Card className={classes.deptUserCard}>
                            <CardContent style={{paddingTop:0,paddingBottom:0}}>
                                <UserReqHistList reqSeq={UserReqProps.getIn(['editingItem', 'reqSeq'])} />
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
  UserReqProps: state.UserReqModule
});

const mapDispatchToProps = (dispatch) => ({
  UserReqActions: bindActionCreators(UserReqActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserReqHistDialog)));

