import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import { css } from "glamor";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '/modules/ClientGroupModule';
import * as GrConfirmActions from '/modules/GrConfirmModule';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//
//  ## Style ########## ########## ########## ########## ##########
//
const containerClass = css({
    margin: "0px 30px !important",
    minHeight: 300,
    minWidth: 500
}).toString();

const fullWidthClass = css({
    width: "100%"
}).toString();



//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientGroupDialog extends Component {
    
    static TYPE_ADD = 'ADD';
    static TYPE_VIEW = 'VIEW';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientGroupActions.closeDialog();
    }

    handleValueChange = name => event => {
        this.props.ClientGroupActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { ClientGroupProps, ClientGroupActions } = this.props;
        ClientGroupActions.createClientGroupData(ClientGroupProps.editingItem)
            .then(() => {
                ClientGroupActions.readClientGroupList(ClientGroupProps.listParam);
                this.handleClose();
        }, (res) => {

        })
    }

    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말그룹 수정',
            confirmMsg: '단말그룹을 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
          });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions } = this.props;
            ClientGroupActions.editClientGroupData(ClientGroupProps.editingItem)
                .then((res) => {
                    ClientGroupActions.readClientGroupList(ClientGroupProps.listParam);
                    this.handleClose();
            }, (res) => {

            })
        }
    }

    render() {

        const { ClientGroupProps } = this.props;
        const { dialogType, editingItem } = ClientGroupProps;

        let title = "";
        if(dialogType === ClientGroupDialog.TYPE_ADD) {
            title = "단말 그룹 등록";
        } else if(dialogType === ClientGroupDialog.TYPE_VIEW) {
            title = "단말 그룹 정보";
        } else if(dialogType === ClientGroupDialog.TYPE_EDIT) {
            title = "단말 그룹 수정";
        } 

        return (
            <Dialog open={ClientGroupProps.dialogOpen}>
                <DialogTitle >{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        id="grpNm"
                        label="단말그룹이름"
                        value={(editingItem) ? editingItem.grpNm : ''}
                        onChange={this.handleValueChange('grpNm')}
                        margin="normal"
                        className={fullWidthClass}
                    />

                    <TextField
                        id="comment"
                        label="단말그룹설명"
                        value={(editingItem) ? editingItem.comment : ''}
                        onChange={this.handleValueChange('comment')}
                        margin="normal"
                        className={fullWidthClass}
                    />
                </form>

                <DialogActions>
                {(dialogType === ClientGroupDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientGroupDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupDialog);



