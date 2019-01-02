import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils'; 

import ClientUpdateServerSpec from './ClientUpdateServerSpec';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

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
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '업데이트서버 정보 등록',
                confirmMsg: '업데이트서버 정보를 등록하시겠습니까?',
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: ClientUpdateServerProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
            ClientUpdateServerActions.createClientUpdateServerData(ClientUpdateServerProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event) => {
        const { ClientUpdateServerProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '업데이트서버 정보 수정',
                confirmMsg: '업데이트서버 정보를 수정하시겠습니까?',
                handleConfirmResult: this.handleEditConfirmResult,
                confirmObject: ClientUpdateServerProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
            ClientUpdateServerActions.editClientUpdateServerData(ClientUpdateServerProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
                    this.handleClose();
                });
        }
    }

    handleCopyCreateData = (event, id) => {
        const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
        ClientUpdateServerActions.cloneClientUpdateServerData({
            'objId': ClientUpdateServerProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '업데이트서버 정보를 복사하였습니다.'
            });
            refreshDataListInComps(ClientUpdateServerProps, ClientUpdateServerActions.readClientUpdateServerListPaged);
            this.handleClose();
        });
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
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientUpdateServerDialog.TYPE_EDIT || dialogType === ClientUpdateServerDialog.TYPE_ADD) &&
                    <div>
                        <TextValidator label="이름" className={classes.fullWidth}
                            value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            name="objNm" validators={['required']} errorMessages={['이름을 입력하세요.']}
                            onChange={this.handleValueChange("objNm")} />
                        <TextField label="설명" className={classes.fullWidth}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")} />
                        <TextValidator label="주 OS 정보" multiline className={classes.fullWidth}
                            value={(editingItem.get('mainos')) ? editingItem.get('mainos') : ''}
                            name="mainos" validators={['required']} errorMessages={['주 OS 정보를 입력하세요.']}
                            onChange={this.handleValueChange("mainos")} />
                        <TextValidator label="기반 OS 정보" multiline className={classes.fullWidth}
                            value={(editingItem.get('extos')) ? editingItem.get('extos') : ''}
                            name="extos" validators={['required']} errorMessages={['기반 OS 정보를 입력하세요.']}
                            onChange={this.handleValueChange("extos")} />
                        <TextValidator label="gooroom.pref" multiline className={classes.fullWidth}
                            value={(editingItem.get('priorities')) ? editingItem.get('priorities') : ''}
                            name="priorities" validators={['required']} errorMessages={['gooroom.pref 정보를 입력하세요.']}
                            onChange={this.handleValueChange("priorities")} />
                    </div>
                    }
                    {(dialogType === ClientUpdateServerDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <ClientUpdateServerSpec selectedItem={editingItem} hasAction={false} />
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
                {(dialogType === ClientUpdateServerDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">복사</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                </ValidatorForm>
                <GRConfirm />
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientUpdateServerProps: state.ClientUpdateServerModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientUpdateServerDialog));

