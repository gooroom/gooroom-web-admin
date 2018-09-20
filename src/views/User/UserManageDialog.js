import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'modules/UserModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
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
class UserManageDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.UserActions.closeDialog();
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
            name: 'showPassword',
            value: !editingItem.get('showPassword')
        });
    };

    // 데이타 생성
    handleCreateData = (event) => {
        const { UserProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '사용자정보 등록',
            confirmMsg: '사용자정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: UserProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { UserProps, UserActions, compId } = this.props;
            UserActions.createUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                userNm: UserProps.getIn(['editingItem', 'userName'])
            }).then((res) => {
                UserActions.readUserListPaged(UserProps. compId);
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { UserProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '사용자정보 수정',
            confirmMsg: '사용자정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: UserProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { UserProps, UserActions } = this.props;

            UserActions.editUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                userNm: UserProps.getIn(['editingItem', 'userName'])
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
        if(dialogType === UserManageDialog.TYPE_ADD) {
            title = "사용자 등록";
        } else if(dialogType === UserManageDialog.TYPE_VIEW) {
            title = "사용자 정보";
        } else if(dialogType === UserManageDialog.TYPE_EDIT) {
            title = "사용자 수정";
        }

        return (
            <div>
            {(UserProps.get('dialogOpen') && editingItem) &&
            <Dialog open={UserProps.get('dialogOpen')}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="userName"
                        label="사용자이름"
                        value={(editingItem.get('userName')) ? editingItem.get('userName') : ''}
                        onChange={this.handleValueChange("userName")}
                        className={classes.fullWidth}
                    />

                    <TextField
                        id="userId"
                        label="사용자아이디"
                        value={(editingItem.get('userId')) ? editingItem.get('userId') : ''}
                        onChange={this.handleValueChange("userId")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                    />

                    <FormControl className={classNames(classes.fullWidth, classes.dialogItemRow)}>
          <InputLabel htmlFor="adornment-password">Password</InputLabel>
          <Input
            id="userPassword"
            type={(editingItem && editingItem.get('showPassword')) ? 'text' : 'password'}
            value={(editingItem.get('userPassword')) ? editingItem.get('userPassword') : ''}
            onChange={this.handleValueChange('userPassword')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {(editingItem && editingItem.get('showPassword')) ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          </FormControl>
          </form>

                <DialogActions>
                {(dialogType === UserManageDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === UserManageDialog.TYPE_EDIT) &&
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
    UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
    UserActions: bindActionCreators(UserActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(UserManageDialog));


