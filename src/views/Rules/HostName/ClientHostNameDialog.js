import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import ClientHostNameViewer from './ClientHostNameViewer';

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
class ClientHostNameDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_COPY = 'COPY';

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
                    refreshDataListInComps(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
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
                    refreshDataListInComps(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
                    this.handleClose();
                });
        }
    }

    handleCopyCreateData = (event, id) => {
        const { ClientHostNameProps, ClientHostNameActions } = this.props;
        ClientHostNameActions.cloneClientHostNameData({
            'objId': ClientHostNameProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: 'Hosts 정보를 복사하였습니다.'
            });
            refreshDataListInComps(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
            this.handleClose();
        });
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
        } else if(dialogType === ClientHostNameDialog.TYPE_COPY) {
            title = "Hosts정책 복사";
        }

        return (
            <div>
            {(ClientHostNameProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientHostNameProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientHostNameDialog.TYPE_EDIT || dialogType === ClientHostNameDialog.TYPE_ADD) &&
                    <div>
                        <TextField label="이름" className={classes.fullWidth}
                            value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            onChange={this.handleValueChange("objNm")} />
                        <TextField label="설명" className={classes.fullWidth}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")} />
                        <TextField label="Hosts 정보" multiline className={classes.fullWidth}
                            value={(editingItem.get('hosts')) ? editingItem.get('hosts') : ''}
                            onChange={this.handleValueChange("hosts")} />
                    </div>
                    }
                    {(dialogType === ClientHostNameDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <ClientHostNameViewer viewItem={editingItem} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientHostNameDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === ClientHostNameDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                {(dialogType === ClientHostNameDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">복사</Button>
                }

                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                <GRConfirm />
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientHostNameProps: state.ClientHostNameModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientHostNameDialog));

