import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import { refreshDataListInComp } from 'components/GRUtils/GRTableListUtils'; 

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientHostNameDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

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
        GRConfirmActions.showConfirm({
            confirmTitle: 'Hosts 정보 등록',
            confirmMsg: 'Hosts 정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: ClientHostNameProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientHostNameProps, ClientHostNameActions } = this.props;
            ClientHostNameActions.createClientHostNameData(ClientHostNameProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComp(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { ClientHostNameProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: 'Hosts 정보 수정',
            confirmMsg: 'Hosts 정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: ClientHostNameProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientHostNameProps, ClientHostNameActions } = this.props;
            ClientHostNameActions.editClientHostNameData(ClientHostNameProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComp(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
                    this.handleClose();
                });
        }
    }

    render() {
        const { classes } = this.props;
        const { ClientHostNameProps } = this.props;
        const dialogType = ClientHostNameProps.get('dialogType');
        const editingItem = (ClientHostNameProps.get('editingItem')) ? ClientHostNameProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientHostNameDialog.TYPE_ADD) {
            title = "Hosts정책 등록";
        } else if(dialogType === ClientHostNameDialog.TYPE_VIEW) {
            title = "Hosts정책 정보";
        } else if(dialogType === ClientHostNameDialog.TYPE_EDIT) {
            title = "Hosts정책 수정";
        }

        return (
            <div>
            {(ClientHostNameProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientHostNameProps.get('dialogOpen')}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>
                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === ClientHostNameDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === ClientHostNameDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientHostNameDialog.TYPE_VIEW) &&
                        <div>
                            <TextField
                                label="Hosts 정보"
                                multiline
                                value={(editingItem.get('hosts')) ? editingItem.get('hosts') : ''}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                disabled
                            />
                        </div>                        
                    }
                    {(dialogType === ClientHostNameDialog.TYPE_EDIT || dialogType === ClientHostNameDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                label="Hosts 정보"
                                multiline
                                value={editingItem.get('hosts')}
                                onChange={this.handleValueChange("hosts")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === ClientHostNameDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === ClientHostNameDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                <GRConfirm />
            </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientHostNameProps: state.ClientHostNameModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientHostNameDialog));

