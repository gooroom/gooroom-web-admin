import React, { Component } from "react";
import { Map, List as GRIMTList } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import DividedAdminManageRuleSelector from './DividedAdminManageRuleSelector';

import DeptMultiSelector from 'components/GROptions/DeptMultiSelector';

import GRTreeList from "components/GRTree/GRTreeList";
import GRExtendedTreeList from "components/GRTree/GRExtendedTreeList";

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import GRAlert from 'components/GRComponents/GRAlert';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import GRItemIcon from '@material-ui/icons/Adjust';
import GRAddIcon from '@material-ui/icons/AddCircleOutline';

import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import {CopyToClipboard} from 'react-copy-to-clipboard'

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class DividedAdminManageTestDialog extends Component {

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

    handleCreateData = (event) => {
        const { AdminUserProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
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
                        }).then((res) => {
                            AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
                            this.handleClose();
                        });
                    }
                },
                
            });
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

    render() {
        const { classes } = this.props;
        const { AdminUserProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = DividedAdminManageTestDialog.TYPE_ADD;
        const editingItem = Map({grpInfoList: GRIMTList([]), deptInfoList: GRIMTList([])});

        const connectableIpList = (editingItem && editingItem.get('connIps')) ? editingItem.get('connIps') : GRIMTList([]);

        const selectedDept = (editingItem && editingItem.get('deptInfoList')) ? editingItem.get('deptInfoList').map((n) => {
            return Map({deptCd: n.get('value'), deptNm: n.get('name')});
        }) : null;

        const selectedGrp = (editingItem && editingItem.get('grpInfoList')) ? editingItem.get('grpInfoList').map((n) => {
            return Map({grpId: n.get('value'), grpNm: n.get('name')});
        }) : null;

        let title = "";
        if(dialogType === DividedAdminManageTestDialog.TYPE_ADD) {
            title = t("dtAddAdminUser");
        } else if(dialogType === DividedAdminManageTestDialog.TYPE_VIEW) {
            title = t("dtViewAdminUser");
        } else if(dialogType === DividedAdminManageTestDialog.TYPE_EDIT) {
            title = t("dtEditAdminUser");
        }

        return (
            <div>
            <Dialog open={true} scroll="paper" fullWidth={true} maxWidth="md">
            <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{paddingRight:20}}>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} style={{marginTop:10}}>
                        <Grid item xs={6} style={{paddingRight:5}}>

                            <TextValidator
                                label={t("lbAdminUserId")} value={(editingItem.get('adminId')) ? editingItem.get('adminId') : ''}
                                name="adminId" validators={['required', 'matchRegexp:^[a-zA-Z0-9]*$']}
                                errorMessages={[t("msgAdminUserId"), t("msgValidAdminUserId")]}
                                onChange={this.handleValueChange("adminId")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                disabled={(dialogType == DividedAdminManageTestDialog.TYPE_EDIT) ? true : false}
                            />
                            <TextValidator
                                label={t("lbAdminPassowrd")}
                                type={(editingItem && editingItem.get('showPasswd')) ? 'text' : 'password'}
                                value={(editingItem.get('adminPw')) ? editingItem.get('adminPw') : ''}
                                name="userPasswd" validators={[]} errorMessages={[t("msgAdminPassword")]}
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
                            <TextValidator
                                label={t("lbAdminUserName")} value={(editingItem.get('adminNm')) ? editingItem.get('adminNm') : ''}
                                name="adminNm" validators={['required']} errorMessages={[t("msgAdminUserName")]}
                                onChange={this.handleValueChange("adminNm")}
                                className={classes.fullWidth}
                            />

                        </Grid>
                        <Grid item xs={6} style={{paddingLeft:5}}>
                            <Card >
                                <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} 
                                    titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'} }} 
                                    title={"접속 가능 아이피"} 
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
                                                <TextField className={classes.fullWidth} value={n} margin="none" 
                                                    onChange={this.handleValueChangeForIp(index)}
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

                    <DeptMultiSelector compId={compId} selectedDept={selectedDept} onSelectItem={this.handleSelectDept} />

                    <Grid container spacing={0} style={{marginTop:10}}>
                        <Grid item xs={6} style={{paddingRight:5}}>
                        <Card >
                            <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={"관리대상 조직"}></CardHeader>
                            <CardContent style={{padding:0,height:100,overflowY:'scroll',marginBottom:10}}>
                                <List >
                                {selectedDept && selectedDept.map((n) => (
                                    <ListItem key={n.get('deptCd')} style={{padding:'2px 32px 2px 32px'}}>
                                        <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                        <ListItemText primary={n.get('deptNm')} />
                                        <ListItemSecondaryAction>
                                            <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                                                onClick={event => this.handleDeleteSelectedData('deptInfoList', n.get('deptCd'))}>
                                                <DeleteIcon />
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                </List>
                            </CardContent>
                            <Divider style={{marginBottom:20}} />
                            <Typography variant="subtitle2">
                                아래 조직도를 이용하여 대상 조직을 선택하세요.
                            </Typography>
                            <Divider />
                            <CardContent style={{padding:0,height:200,overflowY:'auto'}}>
                            <GRExtendedTreeList
                                compId={compId}
                                useFolderIcons={true}
                                listHeight='24px'
                                url='readChildrenDeptList'
                                paramKeyName='deptCd'
                                rootKeyValue='0'
                                keyName='key'
                                title='title'
                                startingDepth='1'
                                hasSelectChild={false}
                                hasSelectParent={false}
                                isShowCheck={true}
                                isCheckMasterOnly={true}
                                isEnableEdit={false}
                                onCheckedNode={(param) => {this.handleTreeNodeCheck('deptInfoList', param);}}
                                checkedNodes={selectedDept}
                                onRef={ref => (this.grExtendedTreeListForDept = ref)}
                            />
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={6} style={{paddingLeft:5}}>
                        <Card >
                            <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={"관리대상 단말그룹"}></CardHeader>
                            <CardContent style={{padding:0,height:100,overflowY:'scroll',marginBottom:10}}>
                                <List >
                                {selectedGrp && selectedGrp.map((n) => (
                                    <ListItem key={n.get('grpId')} style={{padding:'2px 32px 2px 32px'}}>
                                        <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                        <ListItemText primary={n.get('grpNm')} />
                                        <ListItemSecondaryAction>
                                            <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                                                onClick={event => this.handleDeleteSelectedData('grpInfoList', n.get('grpId'))}>
                                                <DeleteIcon />
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                </List>
                            </CardContent>
                            <Divider style={{marginBottom:20}} />
                            <Typography variant="subtitle2">
                            아래 단말그룹 구성도를 이용하여 대상 단말그룹을 선택하세요.
                            </Typography>
                            <Divider />
                            <CardContent style={{padding:0,height:200,overflowY:'auto'}}>
                            <GRExtendedTreeList
                                compId={compId}
                                useFolderIcons={true}
                                listHeight='24px'
                                url='readChildrenClientGroupList'
                                paramKeyName='grpId'
                                rootKeyValue='0'
                                keyName='key'
                                title='title'
                                startingDepth='1'
                                hasSelectChild={false}
                                hasSelectParent={false}
                                isShowCheck={true}
                                isCheckMasterOnly={false}
                                isEnableEdit={false}
                                onCheckedNode={(param) => {this.handleTreeNodeCheck('grpInfoList', param);}}
                                checkedNodes={selectedGrp}
                                onRef={ref => (this.grExtendedTreeListForGrp = ref)}
                            />
                            </CardContent>
                        </Card>
                        </Grid>
                    </Grid>
          
                </DialogContent>
                <DialogActions>
                {(dialogType === DividedAdminManageTestDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === DividedAdminManageTestDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>

                </DialogActions>
                </ValidatorForm>
            </Dialog>
            <GRAlert />
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManageTestDialog)));

