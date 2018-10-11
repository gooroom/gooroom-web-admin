import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';
import { refreshDataListInComp } from 'components/GrUtils/GrTableListUtils'; 

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientUpdateServerManageDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientUpdateServerActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.ClientUpdateServerActions.setEditingItemValue({
                name: name,
                value: event.target.checked
            });
        } else {
            this.props.ClientUpdateServerActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleCreateData = (event) => {
        const { ClientUpdateServerProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '업데이트서버 정보 등록',
            confirmMsg: '업데이트서버 정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: ClientUpdateServerProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
            ClientUpdateServerActions.createClientUpdateServerData(ClientUpdateServerProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComp(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event) => {
        const { ClientUpdateServerProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '업데이트서버 정보 수정',
            confirmMsg: '업데이트서버 정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: ClientUpdateServerProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
            ClientUpdateServerActions.editClientUpdateServerData(ClientUpdateServerProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComp(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
                    this.handleClose();
                });
        }
    }

    render() {
        const { classes } = this.props;
        const { ClientUpdateServerProps } = this.props;
        const dialogType = ClientUpdateServerProps.get('dialogType');
        const editingItem = (ClientUpdateServerProps.get('editingItem')) ? ClientUpdateServerProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientUpdateServerManageDialog.TYPE_ADD) {
            title = "업데이트서버정책 등록";
        } else if(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW) {
            title = "업데이트서버정책 정보";
        } else if(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT) {
            title = "업데이트서버정책 수정";
        }

        return (
            <div>
            {(ClientUpdateServerProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientUpdateServerProps.get('dialogOpen')}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW) &&
                        <div>
                            <TextField
                                label="주 OS 정보"
                                multiline
                                value={(editingItem.get('mainos')) ? editingItem.get('mainos') : ''}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                disabled
                            />
                            <TextField
                                label="기반 OS 정보"
                                multiline
                                value={(editingItem.get('extos')) ? editingItem.get('extos') : ''}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                disabled
                            />
                            <TextField
                                label="gooroom.pref"
                                multiline
                                value={(editingItem.get('priorities')) ? editingItem.get('priorities') : ''}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                disabled
                            />
                        </div>                        
                    }
                    {(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT || dialogType === ClientUpdateServerManageDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                label="주 OS 정보"
                                multiline
                                value={(editingItem.get('mainos')) ? editingItem.get('mainos') : ''}
                                onChange={this.handleValueChange("mainos")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                            <TextField
                                label="기반 OS 정보"
                                multiline
                                value={(editingItem.get('extos')) ? editingItem.get('extos') : ''}
                                onChange={this.handleValueChange("extos")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                            <TextField
                                label="gooroom.pref"
                                multiline
                                value={(editingItem.get('priorities')) ? editingItem.get('priorities') : ''}
                                onChange={this.handleValueChange("priorities")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === ClientUpdateServerManageDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                <GrConfirm />
            </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientUpdateServerProps: state.ClientUpdateServerModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientUpdateServerManageDialog));

