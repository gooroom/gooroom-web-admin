import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';

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
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class UserBasicDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.UserActions.closeDialog(false);
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.UserActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { UserProps, UserActions } = this.props;
        const editingItem = UserProps.get('editingItem');
        UserActions.setEditingItemValue({
            name: 'showPasswd',
            value: !editingItem.get('showPasswd')
        });
    };

    // 데이타 생성
    handleCreateData = (event) => {
        const { UserProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '사용자정보 등록',
                confirmMsg: '사용자정보를 등록하시겠습니까?',
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: UserProps.get('editingItem')
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
            const { UserProps, UserActions, compId } = this.props;
            UserActions.createUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                userNm: UserProps.getIn(['editingItem', 'userNm'])
            }).then((res) => {
                UserActions.readUserListPaged(UserProps, compId);
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { UserProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '사용자정보 수정',
                confirmMsg: '사용자정보를 수정하시겠습니까?',
                handleConfirmResult: this.handleEditConfirmResult,
                confirmObject: UserProps.get('editingItem')
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
            const { UserProps, UserActions, compId } = this.props;

            UserActions.editUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                userNm: UserProps.getIn(['editingItem', 'userNm'])
            }).then((res) => {
                UserActions.readUserListPaged(UserProps, compId);
                this.handleClose();
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { UserProps, compId } = this.props;

        const dialogType = UserProps.get('dialogType');
        const editingItem = (UserProps.get('editingItem')) ? UserProps.get('editingItem') : null;

        let title = "";
        if(dialogType === UserBasicDialog.TYPE_ADD) {
            title = "사용자 등록";
        } else if(dialogType === UserBasicDialog.TYPE_VIEW) {
            title = "사용자 정보";
        } else if(dialogType === UserBasicDialog.TYPE_EDIT) {
            title = "사용자 수정";
        }

        return (
            <div>
            {(UserProps.get('dialogOpen') && editingItem) &&
                <Dialog open={UserProps.get('dialogOpen')}>
                    <ValidatorForm ref="form">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <TextValidator
                            label="사용자아이디" value={(editingItem.get('userId')) ? editingItem.get('userId') : ''}
                            name="userId" validators={['required', 'matchRegexp:^[a-zA-Z0-9]*$']}
                            errorMessages={['사용자아이디를 입력하세요.', '알파벳 또는 숫자만 입력하세요.']}
                            onChange={this.handleValueChange("userId")}
                            className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            disabled={(dialogType == UserBasicDialog.TYPE_EDIT) ? true : false}
                        />
                        <TextValidator
                            label="사용자이름" value={(editingItem.get('userNm')) ? editingItem.get('userNm') : ''}
                            name="userNm" validators={['required']} errorMessages={['사용자이름을 입력하세요.']}
                            onChange={this.handleValueChange("userNm")}
                            className={classes.fullWidth}
                        />
                        <FormControl className={classNames(classes.fullWidth, classes.dialogItemRow)}>
                            <TextValidator
                                label="Password"
                                type={(editingItem && editingItem.get('showPasswd')) ? 'text' : 'password'}
                                value={(editingItem.get('userPasswd')) ? editingItem.get('userPasswd') : ''}
                                name="userPasswd" validators={['required']} errorMessages={['password를 입력하세요.']}
                                onChange={this.handleValueChange('userPasswd')}
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                        onMouseDown={this.handleMouseDownPassword}
                                        >
                                        {(editingItem && editingItem.get('showPasswd')) ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                                }}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        {(dialogType === UserBasicDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                        }
                        {(dialogType === UserBasicDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                        }
                        <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                    </DialogActions>
                    </ValidatorForm>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
    UserActions: bindActionCreators(UserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserBasicDialog));


