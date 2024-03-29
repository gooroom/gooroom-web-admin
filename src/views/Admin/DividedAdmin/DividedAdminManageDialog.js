import React, { Component } from "react";
import { Map, List as GRIMTList } from 'immutable';

import * as Constants from "components/GRComponents/GRConstants";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import DividedAdminManageRuleSelector from './DividedAdminManageRuleSelector';

import DeptMultiSelector from 'components/GROptions/DeptMultiSelector';
import GroupMultiSelector from 'components/GROptions/GroupMultiSelector';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import GRItemIcon from '@material-ui/icons/Adjust';
import GRAddIcon from '@material-ui/icons/AddCircleOutline';

import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class DividedAdminManageDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.AdminUserActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.AdminUserActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleValueChangeForIp = (index) => event => {
        const { AdminUserProps, AdminUserActions } = this.props;
        const oldIps = AdminUserProps.getIn(['editingItem', 'connIps']).set(index, event.target.value);
        //oldIps = oldIps.set(index, event.target.value);
        AdminUserActions.setEditingItemValue({ name: 'connIps', value: oldIps });
    }

    isSelectedPart = () => {
        const editObj = this.props.AdminUserProps.get('editingItem');
        if(editObj.get('isClientAdmin') !== undefined && editObj.get('isClientAdmin') === '1') {
            return true;
        } else if(editObj.get('isUserAdmin') !== undefined && editObj.get('isUserAdmin') === '1') {
            return true;
        } else if(editObj.get('isDesktopAdmin') !== undefined && editObj.get('isDesktopAdmin') === '1') {
            return true;
        } else if(editObj.get('isNoticeAdmin') !== undefined && editObj.get('isNoticeAdmin') === '1') {
            return true;
        } else if(editObj.get('isPortableAdmin') !== undefined && editObj.get('isPortableAdmin') === '1') {
            return true;
        }
        return false;
    }

    handleCreateData = (event) => {
        const { AdminUserProps, GRConfirmActions, t } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            let isOk = true;
            if(AdminUserProps.getIn(['editingItem', 'adminTp']) === 'P') {
                isOk = this.isSelectedPart();
            }
            if(isOk) {
                GRConfirmActions.showConfirm({
                    confirmTitle: t("lbAddAdminUser"),
                    confirmMsg: t("msgAddAdminUser"),
                    confirmObject: AdminUserProps.get('editingItem'),
                    handleConfirmResult: (confirmValue, paramObject) => {
                        if(confirmValue) {
                            const { AdminUserProps, AdminUserActions, compId } = this.props;
                            AdminUserActions.createAdminUserData({
                                itemObj: paramObject,
                                compId: this.props.compId
                            }).then((reData) => {
                                if(reData && reData.status && reData.status.result === 'fail') {
                                    this.props.GRAlertActions.showAlert({
                                        alertTitle: this.props.t("dtSystemError"),
                                        alertMsg: reData.status.message
                                    });
                                } else {
                                    AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
                                    this.handleClose();
                                }
                            });
                        }
                    },
                });
            } else {
                this.props.GRAlertActions.showAlert({
                    alertTitle: t("dtSystemNotice"),
                    alertMsg: t("msgNeedPartItem")
                });
            }
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleEditData = (event) => {
        const { AdminUserProps, GRConfirmActions, t } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            let isOk = true;
            if(AdminUserProps.getIn(['editingItem', 'adminTp']) === 'P') {
                isOk = this.isSelectedPart();
            }
            if(isOk) {
                GRConfirmActions.showConfirm({
                    confirmTitle: t("lbEditAdminUser"),
                    confirmMsg: t("msgEditAdminUser"),
                    confirmObject: AdminUserProps.get('editingItem'),
                    handleConfirmResult: (confirmValue, paramObject) => {
                        if(confirmValue) {
                            const { AdminUserProps, AdminUserActions, compId } = this.props;
                            AdminUserActions.editAdminUserData({
                                itemObj: paramObject,
                                compId: this.props.compId
                            }).then((res) => {
                                AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
                                this.handleClose();
                            });
                        }
                    }
                });
            } else {
                this.props.GRAlertActions.showAlert({
                    alertTitle: t("dtSystemNotice"),
                    alertMsg: t("msgNeedPartItem")
                });
            }
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { AdminUserProps, AdminUserActions } = this.props;
        const editingItem = AdminUserProps.get('editingItem');
        AdminUserActions.setEditingItemValue({
            name: 'showPasswd',
            value: !editingItem.get('showPasswd')
        });
    };

    handleTreeNodeCheck = (name, param) => {
        const { AdminUserProps, AdminUserActions } = this.props;
        let newInfoList = [];
        if(param.isChecked) {
            // add
            newInfoList = AdminUserProps.getIn(['editingItem', name]).push(Map({name: param.name, value: param.value}));
        } else {
            // delete
            newInfoList = (AdminUserProps.getIn(['editingItem', name])).filter(n => (n.get('value') != param.value));
        }
        AdminUserActions.setEditingItemValue({ name: name, value: GRIMTList(newInfoList) });
    };

    handleAddConnectIp = () => {
        const { AdminUserProps, AdminUserActions } = this.props;
        // add
        if(AdminUserProps.getIn(['editingItem', 'connIps'])) {
            const newIps = AdminUserProps.getIn(['editingItem', 'connIps']).push('');
            AdminUserActions.setEditingItemValue({ name: 'connIps', value: GRIMTList(newIps) });
        } else {
            AdminUserActions.setEditingItemValue({ name: 'connIps', value: GRIMTList(['']) });
        }
    }

    handleDeleteConnectIp = (index) => {
        const { AdminUserProps, AdminUserActions } = this.props;
        // delete
        const newIps = (AdminUserProps.getIn(['editingItem', 'connIps'])).filter((n, i) => (i != index));
        AdminUserActions.setEditingItemValue({ name: 'connIps', value: GRIMTList(newIps) });
    }

    handleDeleteSelectedData = (name, data) => {
        const { AdminUserProps, AdminUserActions } = this.props;
        // delete
        const newInfoList = (AdminUserProps.getIn(['editingItem', name])).filter(n => (n.get('value') != data));
        AdminUserActions.setEditingItemValue({ name: name, value: GRIMTList(newInfoList) });

        const ids = newInfoList.map(n => (n.get('value')));
        if(name == 'deptInfoList') {
            this.grExtendedTreeListForDept.resetTreeCheckedNode((ids) ? ids.toJS(): []);
        } else if(name == 'grpInfoList') {
            this.grExtendedTreeListForGrp.resetTreeCheckedNode((ids) ? ids.toJS(): []);
        }
    }

    handleSelectDept = (selectedItems) => {

        this.props.AdminUserActions.setEditingItemValue({ name: 'deptInfoList', value: selectedItems });
    }

    handleSelectUser = (selectedItems) => {

        this.props.AdminUserActions.setEditingItemValue({ name: 'userInfoList', value: selectedItems });
    }

    handleSelectGroup = (selectedItems) => {
        
        this.props.AdminUserActions.setEditingItemValue({ name: 'grpInfoList', value: selectedItems });
    }

    handleSelectClient = (selectedItems) => {

        this.props.AdminUserActions.setEditingItemValue({ name: 'clientInfoList', value: selectedItems });
    }

    render() {
        const { classes } = this.props;
        const { AdminUserProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = AdminUserProps.get('dialogType');
        const editingItem = (AdminUserProps.get('editingItem')) ? AdminUserProps.get('editingItem') : null;

        const connectableIpList = (editingItem && editingItem.get('connIps')) ? editingItem.get('connIps') : GRIMTList([]);

        // const selectedDept = (editingItem && editingItem.get('deptInfoList')) ? editingItem.get('deptInfoList').map((n) => {
        //     return Map({deptCd: n.get('value'), deptNm: n.get('name')});
        // }) : null;
        const selectedDept = (editingItem && editingItem.get('deptInfoList')) ? editingItem.get('deptInfoList') : null;
        const selectedUser = (editingItem && editingItem.get('userInfoList')) ? editingItem.get('userInfoList') : null;

        // const selectedGroup = (editingItem && editingItem.get('grpInfoList')) ? editingItem.get('grpInfoList').map((n) => {
        //     return Map({grpId: n.get('value'), grpNm: n.get('name')});
        // }) : null;
        const selectedGroup = (editingItem && editingItem.get('grpInfoList')) ? editingItem.get('grpInfoList') : null;
        // const selectedClient = (editingItem && editingItem.get('clientInfoList')) ? editingItem.get('clientInfoList') : null;

        let title = "";
        let passwordCheck = [];
        if(dialogType === DividedAdminManageDialog.TYPE_ADD) {
            title = t("dtAddAdminUser");
            passwordCheck = ['required'];
        } else if(dialogType === DividedAdminManageDialog.TYPE_VIEW) {
            title = t("dtViewAdminUser");
        } else if(dialogType === DividedAdminManageDialog.TYPE_EDIT) {
            title = t("dtEditAdminUser");
        }

        return (
            <div>
            {(AdminUserProps.get('dialogOpen') && editingItem) &&
            <Dialog open={AdminUserProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
            <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{paddingRight:20}}>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} style={{marginTop:10}}>
                        <Grid item xs={6} style={{paddingRight:5}}>

                            <Grid container spacing={0} style={{marginTop:0}}>
                                <Grid item xs={6} style={{paddingRight:5}}>
                                    <TextValidator
                                        label={t("lbAdminUserName")} value={(editingItem.get('adminNm')) ? editingItem.get('adminNm') : ''}
                                        name="adminNm" validators={['required']} errorMessages={[t("msgAdminUserName")]}
                                        onChange={this.handleValueChange("adminNm")}
                                        className={classes.fullWidth}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{paddingRight:5}}>
                                    <FormControl style={{width:'100%'}}>
                                        <InputLabel>{t("lbAdminType")}</InputLabel>
                                        {(window.gpmsain === Constants.SUPER_RULECODE) &&
                                            <Select
                                                value={(editingItem.get('adminTp')) ? editingItem.get('adminTp') : ''} style={{width:'100%'}}
                                                onChange={this.handleValueChange('adminTp')}
                                            >
                                            <MenuItem value='S' key='SUPER'>{t("lbTotalAdmin")}</MenuItem>
                                            <MenuItem value='A' key='ADMIN'>{t("lbSiteAdmin")}</MenuItem>
                                            <MenuItem value='P' key='PART'>{t("lbPartAdmin")}</MenuItem>
                                            </Select>
                                        }
                                        {(window.gpmsain !== Constants.SUPER_RULECODE) &&
                                            <Select
                                                value={(editingItem.get('adminTp')) ? editingItem.get('adminTp') : ''} style={{width:'100%'}}
                                                onChange={this.handleValueChange('adminTp')}
                                            >
                                            <MenuItem value='A' key='ADMIN'>{t("lbSiteAdmin")}</MenuItem>
                                            <MenuItem value='P' key='PART'>{t("lbPartAdmin")}</MenuItem>
                                            </Select>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} style={{paddingRight:5}}>
                                    <TextValidator
                                        label={t("lbAdminUserId")} value={(editingItem.get('adminId')) ? editingItem.get('adminId') : ''}
                                        name="adminId" validators={['required', 'matchRegexp:^[a-zA-Z0-9]*$']}
                                        errorMessages={[t("msgAdminUserId"), t("msgValidAdminUserId")]}
                                        onChange={this.handleValueChange("adminId")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                        disabled={(dialogType == DividedAdminManageDialog.TYPE_EDIT) ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{paddingRight:5}}>
                                    <TextValidator
                                        label={t("lbAdminPassowrd")}
                                        type={(editingItem && editingItem.get('showPasswd')) ? 'text' : 'password'}
                                        value={(editingItem.get('adminPw')) ? editingItem.get('adminPw') : ''}
                                        name="userPasswd" validators={passwordCheck} errorMessages={[t("msgAdminPassword")]}
                                        onChange={this.handleValueChange('adminPw')}
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="Toggle password visibility"
                                                onClick={this.handleClickShowPassword}
                                                onMouseDown={this.handleMouseDownPassword}
                                                >
                                                {(editingItem && editingItem.get('showPasswd')) ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                        }}
                                        className={classes.fullWidth}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={6} style={{paddingLeft:5}}>
                            <Card >
                                <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} 
                                    titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'} }} 
                                    title={t('lbAdminConnIp')} 
                                    action={
                                        <Button size="small" color="primary" onClick={event => this.handleAddConnectIp()} style={{marginTop:8}}>
                                            <GRAddIcon />
                                        </Button>
                                    }
                                />
                                <CardContent style={{padding:0,height:116,overflowY:'scroll',marginBottom:0}}>
                                    <List >
                                    {connectableIpList && connectableIpList.map((n, index) => (
                                        <ListItem key={index} style={{padding:'2px 32px 2px 16px'}}>
                                            <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                                            <ListItemText primary={
                                                <TextValidator value={n} name={`ip_${index}`}
                                                    validators={['required', 'matchRegexp:^[0-9.*]+$']}
                                                    errorMessages={[t("lbIp"), t("msgWrongIpString")]}
                                                    onChange={this.handleValueChangeForIp(index)}
                                                    className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                                />
                                            } />
                                            <ListItemSecondaryAction>
                                                <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                                                    onClick={event => this.handleDeleteConnectIp(index)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} >
                            <DividedAdminManageRuleSelector compId={compId} editingItem={editingItem} />
                        </Grid>
                    </Grid>
                    {/*(editingItem.get('isPortableAdmin') === '1') &&
                      <div style={{color: "red"}}>{t("msgCreatePortableBuildServerBefore")}</div>
                    */}
                    {(editingItem.get('adminTp') !== Constants.SUPER_TYPECODE) &&
                        <GroupMultiSelector compId={compId} title={t('lbManagedClientGroup')} 
                            isCheckMasterOnly={true}
                            selectedGroup={selectedGroup} 
                            onSelectGroup={this.handleSelectGroup}
                        />
                    }

                    {(editingItem.get('adminTp') !== Constants.SUPER_TYPECODE) &&
                        <DeptMultiSelector compId={compId} title={t('lbManagedDept')} 
                            isCheckMasterOnly={true}
                            selectedDept={selectedDept} 
                            onSelectDept={this.handleSelectDept}
                            selectedUser={selectedUser} 
                            onSelectUser={this.handleSelectUser}
                        />
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === DividedAdminManageDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === DividedAdminManageDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>

                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            {/*<GRAlert /> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
    AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManageDialog)));

