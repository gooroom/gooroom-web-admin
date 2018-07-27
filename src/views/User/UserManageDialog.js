import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from "glamor";

import { withStyles } from '@material-ui/core/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'modules/UserModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withTheme } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Typography from '@material-ui/core/Typography';

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
class UserManageDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.UserActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.UserActions.setEditingItemValue({
                name: name,
                value: event.target.checked
            });
        } else {
            this.props.UserActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }




    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { UserProps, UserActions } = this.props;
        const { editingItem } = UserProps;
        UserActions.setEditingItemValue({
            name: 'showPassword',
            value: !editingItem.showPassword
        });
    };

    // 데이타 생성
    handleCreateData = (event) => {
        const { UserProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '사용자정보 등록',
            confirmMsg: '사용자정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: UserProps.editingItem
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { UserProps, UserActions } = this.props;
            UserActions.createUserData(UserProps.editingItem)
                .then((res) => {
                    const { viewItems } = UserProps;
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.listParam) {
                                UserActions.readUserList(getMergedObject(element.listParam, {
                                    compId: element._COMPID_
                                }));
                            }
                        });
                    }
                    this.handleClose();
                }, (res) => {
            })
        }
    }

    // 데이타 수정
    handleEditData = (event, id) => {
        const { UserProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '사용자정보 수정',
            confirmMsg: '사용자정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: UserProps.editingItem
          });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { UserProps, UserActions } = this.props;

            UserActions.editUserData(UserProps.editingItem)
                .then((res) => {

                    const { editingCompId, viewItems } = UserProps;
                    viewItems.forEach((element) => {
                        if(element && element.listParam) {
                            UserActions.readUserList(getMergedObject(element.listParam, {
                                compId: element._COMPID_
                            }));
                        }
                    });

                    UserActions.getUserData({
                        compId: editingCompId,
                        userId: paramObject.userId
                    });

                this.handleClose();
            }, (res) => {

            })
        }
    }



    render() {

        const { UserProps } = this.props;
        const { dialogType, editingItem } = UserProps;

        const editingViewItem = editingItem;

        let title = "";
        const bull = <span className={bullet}>•</span>;

        if(dialogType === UserManageDialog.TYPE_ADD) {
            title = "사용자 등록";
        } else if(dialogType === UserManageDialog.TYPE_VIEW) {
            title = "사용자 정보";
        } else if(dialogType === UserManageDialog.TYPE_EDIT) {
            title = "사용자 수정";
        }

        return (
            <Dialog open={UserProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        id="userName"
                        label="사용자이름"
                        value={(editingViewItem) ? editingViewItem.userName : ''}
                        onChange={this.handleValueChange("userName")}
                        className={fullWidthClass}
                        disabled={(dialogType === UserManageDialog.TYPE_VIEW)}
                    />

                    <TextField
                        id="userId"
                        label="사용자아이디"
                        value={(editingViewItem) ? editingViewItem.userId : ''}
                        onChange={this.handleValueChange("userId")}
                        className={classNames(fullWidthClass, itemRowClass)}
                        disabled={(dialogType === UserManageDialog.TYPE_VIEW || dialogType === UserManageDialog.TYPE_EDIT)}
                    />

                    <FormControl className={classNames(fullWidthClass, itemRowClass)}>
          <InputLabel htmlFor="adornment-password">Password</InputLabel>
          <Input
            id="userPassword"
            type={(editingViewItem && editingViewItem.showPassword) ? 'text' : 'password'}
            value={(editingViewItem) ? editingViewItem.userPassword : ''}
            onChange={this.handleValueChange('userPassword')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {(editingViewItem && editingViewItem.showPassword) ? <VisibilityOff /> : <Visibility />}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserManageDialog));


