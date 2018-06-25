import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import { css } from "glamor";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import GrConfirm from '../../components/GrComponents/GrConfirm';

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
    static TYPE_PROFILE = 'PROFILE';

    handleClose = (event) => {
        this.props.ClientGroupActions.toggleCreateDialog({
            dialogOpen: false
        });
    }

    handleChange = name => event => {
        this.props.ClientGroupActions.changeParamValue({
            name: name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { clientGroupModule, ClientGroupActions } = this.props;
        ClientGroupActions.createClientGroupData({
            groupName: clientGroupModule.groupName,
            groupComment: clientGroupModule.groupComment,
            clientConfigId: clientGroupModule.clientConfigId,
            isDefault: clientGroupModule.isDefault
        }).then(() => {
            this.props.ClientGroupActions.readClientGroupList(clientGroupModule.listParam);
            this.handleClose();
        }, (res) => {
            // console.log('error...', res);
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
            const { clientGroupModule, ClientGroupActions } = this.props;
            ClientGroupActions.editClientGroupData({
                groupId: clientGroupModule.selectedItem.grpId,
                groupName: clientGroupModule.groupName,
                groupComment: clientGroupModule.groupComment,
                clientConfigId: clientGroupModule.clientConfigId
            }).then((res) => {
                ClientGroupActions.readClientGroupList(clientGroupModule.listParam);
                this.handleClose();
            }, (res) => {
                //console.log('error...', res);
            })
        }
    }

    render() {

        const { clientGroupModule, dialogType, grConfirmModule } = this.props;

        let title = "";
        if(dialogType === ClientGroupDialog.TYPE_ADD) {
            title = "단말 프로파일 등록";
        } else if(dialogType === ClientGroupDialog.TYPE_VIEW) {
            title = "단말 프로파일 정보";
        } else if(dialogType === ClientGroupDialog.TYPE_EDIT) {
            title = "단말 프로파일 수정";
        } else if(dialogType === ClientGroupDialog.TYPE_PROFILE) {
            title = "단말 프로파일 실행";
        }

        return (
            <Dialog
                onClose={this.handleClose}
                open={this.props.open}
            >
                <DialogTitle >{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        id="groupName"
                        label="단말그룹이름"
                        value={clientGroupModule.groupName}
                        onChange={this.handleChange('groupName')}
                        margin="normal"
                        className={fullWidthClass}
                    />

                    <TextField
                        id="groupComment"
                        label="단말그룹설명"
                        value={clientGroupModule.groupComment}
                        onChange={this.handleChange('groupComment')}
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
                <GrConfirm />
            </Dialog>
        );
    }

}

const mapStateToProps = (state) => ({
    clientGroupModule: state.ClientGroupModule,
    dialogType: state.ClientGroupModule.dialogType,
    grConfirmModule: state.GrConfirmModule,
});

const mapDispatchToProps = (dispatch) => ({
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupDialog);



