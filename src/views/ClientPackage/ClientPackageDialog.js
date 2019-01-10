import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Divider from '@material-ui/core/Divider';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientPackageDialog extends Component {
    
    static TYPE_ADD = 'ADD';
    static TYPE_VIEW = 'VIEW';
    static TYPE_EDIT = 'EDIT';
    
    handleClose = (event) => {
        const { ClientPackageActions, compId } = this.props;

        ClientPackageActions.closeDialog(compId);
    }

    handleValueChange = name => event => {
        this.props.ClientPackageActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { ClientPackageProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: t("dtAddClientPackage"),
            confirmMsg: t("msgAddClientPackage"),
            handleConfirmResult: this.handleCreateDataConfirmResult,
            confirmObject: ClientPackageProps.get('editingItem')
        });
    }
    handleCreateDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientPackageProps, ClientPackageActions, compId } = this.props;

            ClientPackageActions.createClientPackageData({
                groupName: ClientPackageProps.getIn(['editingItem', 'grpNm']),
                groupComment: ClientPackageProps.getIn(['editingItem', 'comment']),
            }).then((res) => {
                ClientPackageActions.readClientPackageListPaged(ClientPackageProps, compId);
                this.handleClose();
            });
        }
    }
    
    handleEditData = (event) => {
        const { GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: t("dtEditClientPackage"),
            confirmMsg: t("msgEditClientPackage"),
            handleConfirmResult: this.handleEditConfirmResult
        });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientPackageProps, ClientPackageActions, compId } = this.props;

            ClientPackageActions.editClientPackageData({
                groupId: ClientPackageProps.getIn(['editingItem', 'grpId']),
                groupName: ClientPackageProps.getIn(['editingItem', 'grpNm']),
                groupComment: ClientPackageProps.getIn(['editingItem', 'comment']),
            }).then((res) => {
                ClientPackageActions.readClientPackageListPaged(ClientPackageProps, compId);
                this.handleClose();
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { ClientPackageProps, compId } = this.props;
        const { t, i18n } = this.props;
        
        const dialogType = ClientPackageProps.get('dialogType');
        const editingItem = (ClientPackageProps.get('editingItem')) ? ClientPackageProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientPackageDialog.TYPE_ADD) {
            title = t("dtAddClientPackage");
        } else if(dialogType === ClientPackageDialog.TYPE_VIEW) {
            title = t("dtViewClientPackage");
        } else if(dialogType === ClientPackageDialog.TYPE_EDIT) {
            title = t("dtEditClientPackage");
        } 

        return (
            <div>
            {(ClientPackageProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientPackageProps.get('dialogOpen')} >
                <DialogTitle >{title}</DialogTitle>
                <DialogContent style={{height:600,minHeight:600,padding:0}}>

                    <form noValidate autoComplete="off" className={classes.dialogContainer}>
                        <TextField
                            id="grpNm"
                            label={t("lbPackageName")}
                            value={(editingItem.get('grpNm')) ? editingItem.get('grpNm') : ''}
                            onChange={this.handleValueChange('grpNm')}
                            className={classes.fullWidth}
                        />
                        <TextField
                            id="comment"
                            label={t("lbPackageDesc")}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange('comment')}
                            className={classes.fullWidth}
                        />
                        <Divider style={{marginBottom: 10}} />
                    </form>

                </DialogContent>
                <DialogActions>
                    {(dialogType === ClientPackageDialog.TYPE_ADD) &&
                        <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                    }
                    {(dialogType === ClientPackageDialog.TYPE_EDIT) &&
                        <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                    }
                    <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
            </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientPackageProps: state.ClientPackageModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});


export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageDialog)));


