import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import UserRuleSelector from 'components/GROptions/UserRuleSelector';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class UserDialog extends Component {

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
        const { UserProps, GRConfirmActions } = this.props;

        GRConfirmActions.showConfirm({
            confirmTitle: '사용자정보 등록',
            confirmMsg: '사용자정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: UserProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { UserProps, UserActions, compId } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps } = this.props;

            UserActions.createUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                userNm: UserProps.getIn(['editingItem', 'userNm']),

                browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'USER', 'selectedOptionItemId']),
                mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'USER', 'selectedOptionItemId']),
                clientSecuRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'USER', 'selectedOptionItemId'])
            }).then((res) => {
                UserActions.readUserListPaged(UserProps, compId);
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { UserProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '사용자정보 수정',
            confirmMsg: '사용자정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: UserProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { UserProps, UserActions, compId } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps } = this.props;

            UserActions.editUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userNm: UserProps.getIn(['editingItem', 'userNm']),
                browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'USER', 'selectedOptionItemId']),
                mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'USER', 'selectedOptionItemId']),
                securityRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'USER', 'selectedOptionItemId'])
            }).then((res) => {
                UserActions.readUserListPaged(UserProps, compId);
                this.handleClose();
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { UserProps, compId } = this.props;

        const ruleDialogType = UserProps.get('ruleDialogType');
        const editingItem = (UserProps.get('editingItem')) ? UserProps.get('editingItem') : null;

        let title = "";
        if(ruleDialogType === UserDialog.TYPE_ADD) {
            title = "사용자 등록";
        } else if(ruleDialogType === UserDialog.TYPE_VIEW) {
            title = "사용자 정보";
        } else if(ruleDialogType === UserDialog.TYPE_EDIT) {
            title = "사용자 수정";
        }

        return (
            <div>
            {(UserProps.get('ruleDialogOpen') && editingItem) &&
                <Dialog open={UserProps.get('ruleDialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <TextField
                                    label="사용자아이디"
                                    value={(editingItem.get('userId')) ? editingItem.get('userId') : ''}
                                    onChange={this.handleValueChange("userId")}
                                    className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    disabled={(ruleDialogType == UserDialog.TYPE_EDIT) ? true : false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="사용자이름"
                                    value={(editingItem.get('userNm')) ? editingItem.get('userNm') : ''}
                                    onChange={this.handleValueChange("userNm")}
                                    className={classes.fullWidth}
                                />
                            </Grid>
                        </Grid>
                        <Divider style={{marginBottom: 10}} /> 
                        <UserRuleSelector compId={compId} module={UserProps.get('editingItem').toJS()} targetType="USER" />
                    </DialogContent>

                    <DialogActions>
                        {(ruleDialogType === UserDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                        }
                        {(ruleDialogType === UserDialog.TYPE_EDIT) &&
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
    UserProps: state.UserModule,
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
    UserActions: bindActionCreators(UserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserDialog));


