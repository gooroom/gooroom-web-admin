import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

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
class ClientHostNameManageDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientHostNameActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.ClientHostNameActions.setEditingItemValue({
                name: name,
                value: event.target.checked
            });
        } else {
            this.props.ClientHostNameActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleCreateData = (event) => {
        const { ClientHostNameProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: 'Hosts 정보 등록',
            confirmMsg: 'Hosts 정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: ClientHostNameProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientHostNameProps, ClientHostNameActions } = this.props;
            ClientHostNameActions.createClientHostNameData(ClientHostNameProps.get('editingItem'))
                .then((res) => {
                    const viewItems = ClientHostNameProps.get('viewItems');
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.get('listParam')) {
                                ClientHostNameActions.readClientHostNameList(ClientHostNameProps, element.get('_COMPID_'), {});
                            }
                        });
                    }
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { ClientHostNameProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: 'Hosts 정보 수정',
            confirmMsg: 'Hosts 정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: ClientHostNameProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientHostNameProps, ClientHostNameActions } = this.props;
            ClientHostNameActions.editClientHostNameData(ClientHostNameProps.get('editingItem'))
                .then((res) => {
                    const viewItems = ClientHostNameProps.get('viewItems');
                    viewItems.forEach((element) => {
                        if(element && element.get('listParam')) {
                            ClientHostNameActions.readClientHostNameList(ClientHostNameProps, element.get('_COMPID_'), {});
                        }
                    });
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
        if(dialogType === ClientHostNameManageDialog.TYPE_ADD) {
            title = "Hosts정책 등록";
        } else if(dialogType === ClientHostNameManageDialog.TYPE_VIEW) {
            title = "Hosts정책 정보";
        } else if(dialogType === ClientHostNameManageDialog.TYPE_EDIT) {
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
                        disabled={(dialogType === ClientHostNameManageDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === ClientHostNameManageDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientHostNameManageDialog.TYPE_VIEW) &&
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
                    {(dialogType === ClientHostNameManageDialog.TYPE_EDIT || dialogType === ClientHostNameManageDialog.TYPE_ADD) &&
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
                {(dialogType === ClientHostNameManageDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientHostNameManageDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
                </DialogActions>
                <GrConfirm />
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
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientHostNameManageDialog));

