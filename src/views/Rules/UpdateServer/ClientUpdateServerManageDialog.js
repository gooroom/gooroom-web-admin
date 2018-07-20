import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from "glamor";

import { withStyles } from '@material-ui/core/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//
//  ## Style ########## ########## ########## ########## ##########
//
const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  });

const containerClass = css({
    margin: "0px 30px !important",
    minHeight: 300,
    minWidth: 500
}).toString();

const fullWidthClass = css({
    width: "100%"
}).toString();

const keyCreateBtnClass = css({
    paddingTop: 24 + " !important"
}).toString();  

const labelClass = css({
    height: "25px",
    marginTop: "10px"
}).toString();

const itemRowClass = css({
    marginTop: "10px !important"
}).toString();

const bullet = css({
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  }).toString();

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

    handleNtpValueChange = index => event => {
        this.props.ClientUpdateServerActions.setSelectedNtpValue({
            index: index,
            value: event.target.value
        });
    }

    handleChangeSelectedNtp = (name, index) => event => {
        this.props.ClientUpdateServerActions.setEditingItemValue({
            name: name,
            value: index
        });
    }

    handleCreateData = (event) => {
        const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
        ClientUpdateServerActions.createClientUpdateServerData(ClientUpdateServerProps.editingItem)
        .then(() => {
                ClientUpdateServerActions.readClientUpdateServerList(ClientUpdateServerProps.listParam);
                this.handleClose();
        }, (res) => {

        })
    }

    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '업데이트서버 정보 수정',
            confirmMsg: '업데이트서버 정보를 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
          });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
            ClientUpdateServerActions.editClientUpdateServerData(ClientUpdateServerProps.editingItem)
                .then((res) => {
                ClientUpdateServerActions.readClientUpdateServerList(ClientUpdateServerProps.listParam);
                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleAddNtp = () => {
        const { ClientUpdateServerActions } = this.props;
        ClientUpdateServerActions.addNtpAddress();
    }

    handleDeleteNtp = index => event => {
        const { ClientUpdateServerActions } = this.props;
        ClientUpdateServerActions.deleteNtpAddress(index);
    }

    render() {

        const { ClientUpdateServerProps } = this.props;
        const { dialogType, editingItem } = ClientUpdateServerProps;

        let title = "";
        const bull = <span className={bullet}>•</span>;

        if(dialogType === ClientUpdateServerManageDialog.TYPE_ADD) {
            title = "업데이트서버정책 등록";
        } else if(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW) {
            title = "업데이트서버정책 정보";
        } else if(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT) {
            title = "업데이트서버정책 수정";
        }

        return (
            <Dialog open={ClientUpdateServerProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        label="이름"
                        value={(editingItem) ? editingItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW)}
                    />
                    <TextField
                        label="설명"
                        value={(editingItem) ? editingItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(fullWidthClass, itemRowClass)}
                        disabled={(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW) &&
                        <div>
                            <TextField
                                label="주 OS 정보"
                                multiline
                                value={(editingItem.mainos) ? editingItem.mainos : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                            <TextField
                                label="기반 OS 정보"
                                multiline
                                value={(editingItem.extos) ? editingItem.extos : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                            <TextField
                                label="gooroom.pref"
                                multiline
                                value={(editingItem.priorities) ? editingItem.priorities : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                        </div>                        
                    }
                    {(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT || dialogType === ClientUpdateServerManageDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                label="주 OS 정보"
                                multiline
                                value={(editingItem.mainos) ? editingItem.mainos : ''}
                                onChange={this.handleValueChange("mainos")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                            <TextField
                                label="기반 OS 정보"
                                multiline
                                value={(editingItem.extos) ? editingItem.extos : ''}
                                onChange={this.handleValueChange("extos")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                            <TextField
                                label="gooroom.pref"
                                multiline
                                value={(editingItem.priorities) ? editingItem.priorities : ''}
                                onChange={this.handleValueChange("priorities")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === ClientUpdateServerManageDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
                </DialogActions>
            </Dialog>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ClientUpdateServerManageDialog));

