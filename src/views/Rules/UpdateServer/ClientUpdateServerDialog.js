import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import { refreshDataListInComp } from 'components/GRUtils/GRTableListUtils'; 

import ClientUpdateServerViewer from './ClientUpdateServerViewer';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientUpdateServerDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.ClientUpdateServerActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.ClientUpdateServerActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { ClientUpdateServerProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '업데이트서버 정보 등록',
            confirmMsg: '업데이트서버 정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
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
        const { ClientUpdateServerProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '업데이트서버 정보 수정',
            confirmMsg: '업데이트서버 정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
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
        if(dialogType === ClientUpdateServerDialog.TYPE_ADD) {
            title = "업데이트서버정책 등록";
        } else if(dialogType === ClientUpdateServerDialog.TYPE_VIEW) {
            title = "업데이트서버정책 정보";
        } else if(dialogType === ClientUpdateServerDialog.TYPE_EDIT) {
            title = "업데이트서버정책 수정";
        } else if(dialogType === ClientUpdateServerDialog.TYPE_COPY) {
            title = "업데이트서버정책 복사";
        }

        return (
            <div>
            {(ClientUpdateServerProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientUpdateServerProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientUpdateServerDialog.TYPE_EDIT || dialogType === ClientUpdateServerDialog.TYPE_ADD) &&
                    <div>
                        <TextField label="이름" className={classes.fullWidth}
                            value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            onChange={this.handleValueChange("objNm")} />
                        <TextField label="설명" className={classes.fullWidth}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")} />
                        <TextField label="주 OS 정보" multiline className={classes.fullWidth}
                            value={(editingItem.get('mainos')) ? editingItem.get('mainos') : ''}
                            onChange={this.handleValueChange("mainos")} />
                        <TextField label="기반 OS 정보" multiline className={classes.fullWidth}
                            value={(editingItem.get('extos')) ? editingItem.get('extos') : ''}
                            onChange={this.handleValueChange("extos")} />
                        <TextField label="gooroom.pref" multiline className={classes.fullWidth}
                            value={(editingItem.get('priorities')) ? editingItem.get('priorities') : ''}
                            onChange={this.handleValueChange("priorities")} />
                    </div>
                    }
                    {(dialogType === ClientUpdateServerDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <ClientUpdateServerViewer viewItem={editingItem} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientUpdateServerDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === ClientUpdateServerDialog.TYPE_EDIT) &&
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
    ClientUpdateServerProps: state.ClientUpdateServerModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientUpdateServerDialog));

