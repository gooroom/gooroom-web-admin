import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import UserRuleSelector from 'components/GROptions/UserRuleSelector';
import DeptSelectDialog from "views/User/DeptSelectDialog";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class UserDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    constructor(props) {
        super(props);

        this.state = {
            isOpenDeptSelect: false,
            selectedDept: {deptCd:'', deptNm:''}
        };
    }

    handleClose = (event) => {
        this.props.UserActions.closeDialog(true);
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
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;
            const selecteObjectIdName = ['viewItems', compId, 'USER', 'selectedOptionItemId'];
            UserActions.createUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                userNm: UserProps.getIn(['editingItem', 'userNm']),
                deptCd: UserProps.getIn(['editingItem', 'deptCd']),

                browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)
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
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;
            const selecteObjectIdName = ['viewItems', compId, 'USER', 'selectedOptionItemId'];
            UserActions.editUserData({
                userId: UserProps.getIn(['editingItem', 'userId']),
                userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
                userNm: UserProps.getIn(['editingItem', 'userNm']),
                deptCd: UserProps.getIn(['editingItem', 'deptCd']),

                browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)
            }).then((res) => {
                UserActions.readUserListPaged(UserProps, compId);
                this.handleClose();
            });
        }
    }



    handleShowDeptSelector = () => {
        this.setState({ isOpenDeptSelect: true });
    }
    handleDeptSelectionClose = () => {
        this.setState({ isOpenDeptSelect: false });
    }
    handleDeptSelectSave = (selectedDept) => {
        this.props.UserActions.setEditingItemValues({ 'deptNm': selectedDept.deptNm, 'deptCd': selectedDept.deptCd });
        this.setState({ isOpenDeptSelect: false });
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
            <React.Fragment>
            {(UserProps.get('ruleDialogOpen') && editingItem) &&
                <Dialog open={UserProps.get('ruleDialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                    <ValidatorForm ref="form">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent style={{minHeight:567}}>
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <TextValidator
                                    label="사용자아이디"
                                    value={(editingItem.get('userId')) ? editingItem.get('userId') : ''}
                                    name="userId"
                                    validators={['required', 'matchRegexp:^[a-zA-Z0-9]*$']}
                                    errorMessages={['사용자아이디를 입력하세요.', '알파벳 또는 숫자만 입력하세요.']}
                                    onChange={this.handleValueChange("userId")}
                                    className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    disabled={(ruleDialogType == UserDialog.TYPE_EDIT) ? true : false}
                                />
                            </Grid>
                            <Grid item xs={6}>
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
                            </Grid>
                        </Grid>

                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <TextValidator
                                    label="사용자이름"
                                    value={(editingItem.get('userNm')) ? editingItem.get('userNm') : ''}
                                    name="userNm" validators={['required']} errorMessages={['사용자이름을 입력하세요.']}
                                    onChange={this.handleValueChange("userNm")}
                                    className={classes.fullWidth}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextValidator
                                    label="조직"
                                    value={(editingItem.get('deptNm')) ? editingItem.get('deptNm') : ''}
                                    name="deptNm" validators={['required']} errorMessages={['조직을 선택하세요.']}
                                    onClick={() => this.handleShowDeptSelector()}
                                    className={classes.fullWidth}
                                />
                            </Grid>
                        </Grid>
                        <Divider style={{marginBottom: 10}} />
                        <UserRuleSelector compId={compId} module={UserProps.get('editingItem').toJS()} targetType="USER" />
                    </DialogContent>
                    <DialogActions>
                        {(ruleDialogType === UserDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                        }
                        {(ruleDialogType === UserDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                        }
                        <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                    </ValidatorForm>
                    <GRConfirm />
                </Dialog>
            }

            <DeptSelectDialog isOpen={this.state.isOpenDeptSelect}
                isShowCheck={false}
                onSaveHandle={this.handleDeptSelectSave} 
                onClose={this.handleDeptSelectionClose} />
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state) => ({
    UserProps: state.UserModule,
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule,
    SoftwareFilterProps: state.SoftwareFilterModule,
    DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
    UserActions: bindActionCreators(UserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserDialog));


