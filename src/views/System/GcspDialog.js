import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GcspManageActions from 'modules/GcspManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class GcspDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.GcspManageActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.GcspManageActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    // 생성
    handleCreateData = (event) => {
        const { GcspManageProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '클라우드서비스 등록',
            confirmMsg: '클라우드서비스를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: GcspManageProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { GcspManageProps, GcspManageActions, compId } = this.props;
            GcspManageActions.createGcspData({
                gcspId: paramObject.get('gcspId'),
                gcspNm: paramObject.get('gcspNm'),
                comment: paramObject.get('comment'),
                ipRanges: paramObject.get('ipRanges'),
                url: paramObject.get('url'),
                certGubun: paramObject.get('certGubun'),
                gcspCsr: paramObject.get('gcspCsr')
            }).then((res) => {
                GcspManageActions.readGcspListPaged(GcspManageProps, compId);
                this.handleClose();
            });
        }
    }

    // 수정
    handleEditData = (event) => {
        const { GcspManageProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '관리자계정 수정',
            confirmMsg: '관리자계정을 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditDataConfirmResult,
            confirmObject: GcspManageProps.get('editingItem')
        });
    }
    handleEditDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { GcspManageProps, GcspManageActions, compId } = this.props;
            GcspManageActions.editAdminUserData({
                gcspId: paramObject.get('gcspId'),
                adminPw: paramObject.get('adminPw'),
                gcspNm: paramObject.get('gcspNm')
            }).then((res) => {
                GcspManageActions.readAdminUserListPaged(GcspManageProps, compId);
                this.handleClose();
            });
        }
    }

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { GcspManageProps, GcspManageActions } = this.props;
        const editingItem = GcspManageProps.get('editingItem');
        GcspManageActions.setEditingItemValue({
            name: 'showPassword',
            value: !editingItem.get('showPassword')
        });
    };

    render() {
        const { classes } = this.props;
        const { GcspManageProps, compId } = this.props;

        const dialogType = GcspManageProps.get('dialogType');
        const editingItem = (GcspManageProps.get('editingItem')) ? GcspManageProps.get('editingItem') : null;

        let title = "";
        if(dialogType === GcspDialog.TYPE_ADD) {
            title = "관리자계정 등록";
        } else if(dialogType === GcspDialog.TYPE_VIEW) {
            title = "관리자계정 정보";
        } else if(dialogType === GcspDialog.TYPE_EDIT) {
            title = "관리자계정 수정";
        }

        return (
            <div>
            {(GcspManageProps.get('dialogOpen') && editingItem) &&
            <Dialog open={GcspManageProps.get('dialogOpen')}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>

                    <TextField
                        label="서비스아이디"
                        value={(editingItem.get('gcspId')) ? editingItem.get('gcspId') : ''}
                        onChange={this.handleValueChange("gcspId")}
                        className={classes.fullWidth}
                        disabled={(dialogType == GcspDialog.TYPE_EDIT) ? true : false}
                    />
                    <TextField
                        label="서비스이름"
                        value={(editingItem.get('gcspNm')) ? editingItem.get('gcspNm') : ''}
                        onChange={this.handleValueChange("gcspNm")}
                        className={classes.fullWidth}
                    />
                    <TextField
                        label="서비스설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classes.fullWidth}
                    />
                    <TextField
                        label="접근가능 IP"
                        value={(editingItem.get('ipRanges')) ? editingItem.get('ipRanges') : ''}
                        onChange={this.handleValueChange("ipRanges")}
                        className={classes.fullWidth}
                    />
                    <TextField
                        label="서비스 도메인"
                        value={(editingItem.get('url')) ? editingItem.get('url') : ''}
                        onChange={this.handleValueChange("url")}
                        className={classes.fullWidth}
                    />

                </DialogContent>
                <DialogActions>
                    
                {(dialogType === GcspDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === GcspDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>

                </DialogActions>
            </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    GcspManageProps: state.GcspManageModule
});

const mapDispatchToProps = (dispatch) => ({
    GcspManageActions: bindActionCreators(GcspManageActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(GcspDialog));

