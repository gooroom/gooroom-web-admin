import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CtrlCenterItemActions from 'modules/CtrlCenterItemModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import CtrlCenterItemSpec from './CtrlCenterItemSpec';
import GRConfirm from 'components/GRComponents/GRConfirm';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class CtrlCenterItemDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT_DEPT = 'INHERIT_DEPT';
    static TYPE_INHERIT_GROUP = 'INHERIT_GROUP';
    static TYPE_COPY = 'COPY';

    static ITEM_LIST = [
        {no:1, tag:'bluetooth', name:'bluetooth', name_kr:'블루투스'},
        {no:2, tag:'background', name:'background', name_kr:'배경'},
        {no:3, tag:'notifications', name:'notifications', name_kr:'알림'},
        {no:4, tag:'search', name:'search', name_kr:'검색'},
        {no:5, tag:'region', name:'region', name_kr:'지역 및 언어'},
        {no:6, tag:'font', name:'font', name_kr:'글꼴'},
        {no:7, tag:'online-accounts', name:'online-accounts', name_kr:'온라인 계정'},
        {no:8, tag:'privacy', name:'privacy', name_kr:'개인 정보'},
        {no:9, tag:'sharing', name:'sharing', name_kr:'공유'},
        {no:10, tag:'sound', name:'sound', name_kr:'소리'},
        {no:11, tag:'power', name:'power', name_kr:'전원'},
        {no:12, tag:'network', name:'network', name_kr:'네트워크'},
        {no:13, tag:'wifi', name:'wifi', name_kr:'와이파이'},
        {no:14, tag:'wacom', name:'wacom', name_kr:'와콤'},
        {no:15, tag:'display', name:'display', name_kr:'디스플레이'},
        {no:16, tag:'keyboard', name:'keyboard', name_kr:'키보드'},
        {no:17, tag:'mouse', name:'mouse', name_kr:'마우스 및 터치패드'},
        {no:18, tag:'printers', name:'printers', name_kr:'프린터'},
        {no:19, tag:'removable-media', name:'removable-media', name_kr:'이동식 미디어'},
        {no:20, tag:'thunderbolt', name:'thunderbolt', name_kr:'썬더볼트'},
        {no:21, tag:'color', name:'color', name_kr:'색'},
        {no:22, tag:'info-overview', name:'info-overview', name_kr:'정보'},
        {no:23, tag:'datetime', name:'datetime', name_kr:'날짜 및 시각'},
        {no:24, tag:'user-accounts', name:'user-accounts', name_kr:'사용자'},
        {no:25, tag:'default-apps', name:'default-apps', name_kr:'기본 프로그램'},
        {no:26, tag:'themes', name:'themes', name_kr:'테마'}
    ];

    constructor(props) {
        super(props);
    
        this.state = {
          selectAll: false
        };
    }

    handleClose = (event) => {
        this.props.CtrlCenterItemActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.CtrlCenterItemActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleSelectAll = () => event => {
        this.setState({ selectAll: event.target.checked });
        if(CtrlCenterItemDialog.ITEM_LIST) {
            CtrlCenterItemDialog.ITEM_LIST.map(n => {
                this.props.CtrlCenterItemActions.setEditingCtrlCenterItemValue({
                    name: n.tag,
                    value: (event.target.checked) ? 'allow' : 'disallow'
                });
            });
        }
    }

    handleCtrlCenterValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;

        if(this.state.selectAll && value === 'disallow') {
            this.setState({ selectAll: false });
        }

        this.props.CtrlCenterItemActions.setEditingCtrlCenterItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { CtrlCenterItemProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddCTIRule"),
                confirmMsg: t("msgAddCTIRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { CtrlCenterItemProps, CtrlCenterItemActions } = this.props;
                        CtrlCenterItemActions.createCtrlCenterItemData(CtrlCenterItemProps.get('editingItem'))
                            .then((res) => {
                                refreshDataListInComps(CtrlCenterItemProps, CtrlCenterItemActions.readCtrlCenterItemListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: CtrlCenterItemProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleEditData = (event, id) => {
        const { CtrlCenterItemProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditCTIRule"),
                confirmMsg: t("msgEditCTIRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { CtrlCenterItemProps, CtrlCenterItemActions } = this.props;
                        CtrlCenterItemActions.editCtrlCenterItemData(CtrlCenterItemProps.get('editingItem'), this.props.compId)
                            .then((res) => {
                                refreshDataListInComps(CtrlCenterItemProps, CtrlCenterItemActions.readCtrlCenterItemListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: CtrlCenterItemProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleInheritSaveDataForDept = (event, id) => {
        const { CtrlCenterItemProps, DeptProps, CtrlCenterItemActions, compId } = this.props;
        const { t, i18n } = this.props;
        const deptCd = DeptProps.getIn(['viewItems', compId, 'viewItem', 'deptCd']);

        CtrlCenterItemActions.inheritCtrlCenterItemDataForDept({
            'objId': CtrlCenterItemProps.getIn(['editingItem', 'objId']),
            'deptCd': deptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyCTIRuleChild")
            });
            this.handleClose();
        });
    }

    handleInheritSaveDataForGroup = (event, id) => {
        const { CtrlCenterItemProps, ClientGroupProps, CtrlCenterItemActions, compId } = this.props;
        const { t, i18n } = this.props;
        const grpId = ClientGroupProps.getIn(['viewItems', compId, 'viewItem', 'grpId']);

        CtrlCenterItemActions.inheritCtrlCenterItemDataForGroup({
            'objId': CtrlCenterItemProps.getIn(['editingItem', 'objId']),
            'grpId': grpId
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyCTIRuleChild")
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { CtrlCenterItemProps, CtrlCenterItemActions } = this.props;
        const { t, i18n } = this.props;

        CtrlCenterItemActions.cloneCtrlCenterItemData({
            'objId': CtrlCenterItemProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyCTIRule")
            });
            refreshDataListInComps(CtrlCenterItemProps, CtrlCenterItemActions.readCtrlCenterItemListPaged);
            this.handleClose();
        });
    }

    handleAddBluetoothMac = () => {
        const { CtrlCenterItemActions } = this.props;
        CtrlCenterItemActions.addBluetoothMac();
    }

    handleDeleteBluetoothMac = index => event => {
        const { CtrlCenterItemActions } = this.props;
        CtrlCenterItemActions.deleteBluetoothMac(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const { t, i18n } = this.props;

        const { CtrlCenterItemProps } = this.props;
        const dialogType = CtrlCenterItemProps.get('dialogType');
        const editingItem = (CtrlCenterItemProps.get('editingItem')) ? CtrlCenterItemProps.get('editingItem') : null;

        let title = "";
        if(dialogType === CtrlCenterItemDialog.TYPE_ADD) {
            title = t("dtAddCTIRule");
            if(window.gpmsain === Constants.SUPER_RULECODE) {
                title += " - " + t("selStandard");
            }
        } else if(dialogType === CtrlCenterItemDialog.TYPE_VIEW) {
            title = t("dtViewCTIRule");
        } else if(dialogType === CtrlCenterItemDialog.TYPE_EDIT) {
            title = t("dtEditCTIRule");
        } else if(dialogType === CtrlCenterItemDialog.TYPE_INHERIT_DEPT || dialogType === CtrlCenterItemDialog.TYPE_INHERIT_GROUP) {
            title = t("dtInheritCTIRule");
        } else if(dialogType === CtrlCenterItemDialog.TYPE_COPY) {
            title = t("dtCopyCTIRule");
        }

        return (
            <div>
            {(CtrlCenterItemProps.get('dialogOpen') && editingItem) &&
            <Dialog open={CtrlCenterItemProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === CtrlCenterItemDialog.TYPE_EDIT || dialogType === CtrlCenterItemDialog.TYPE_ADD) &&
                    <div>
                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                        <Grid item xs={12} sm={4} md={4}>
                        <TextValidator label={t("lbName")} value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            name="objNm" validators={['required']} errorMessages={[t("msgInputName")]}
                            onChange={this.handleValueChange("objNm")}
                            className={classes.fullWidth}
                        />
                        </Grid>
                        <Grid item xs={12} sm={8} md={8}>
                        <TextField label={t("lbDesc")} value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")}
                            className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        />
                        </Grid>
                    </Grid>
                    {(dialogType === CtrlCenterItemDialog.TYPE_EDIT || dialogType === CtrlCenterItemDialog.TYPE_ADD) &&
                        <Grid container alignItems="center" direction="row" justify="space-between" style={{marginTop:30}}>
                        <Grid item xs={6} style={{marginBottom:30}}>
                            <InputLabel >{t("msgSelectCTIItem")}</InputLabel>
                        </Grid>
                        <Grid item xs={6} style={{marginBottom:30}}>
                            <FormControlLabel label={t('lbSelectAll')} 
                                control={<Checkbox onChange={this.handleSelectAll()} color="primary"
                                    checked={this.state.selectAll}
                                />}                                
                            />
                        </Grid>
                        {CtrlCenterItemDialog.ITEM_LIST && CtrlCenterItemDialog.ITEM_LIST.map(n => {
                                return (
                                    <Grid item xs={6} key={n.no}>
                                    <FormControlLabel label={n.name}
                                        control={<Checkbox onChange={this.handleCtrlCenterValueChange(n.tag)} color="primary"
                                            checked={this.checkAllow(editingItem.getIn(['CTRLITEM', n.tag]))}
                                        />}                                
                                    />
                                    </Grid>
                                );
                            })
                        }
                        </Grid>
                    }
                    </div>
                    }
                    {(dialogType === CtrlCenterItemDialog.TYPE_INHERIT_DEPT || dialogType === CtrlCenterItemDialog.TYPE_INHERIT_GROUP) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <CtrlCenterItemSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === CtrlCenterItemDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <CtrlCenterItemSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === CtrlCenterItemDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === CtrlCenterItemDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === CtrlCenterItemDialog.TYPE_INHERIT_DEPT) &&
                    <Button onClick={this.handleInheritSaveDataForDept} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === CtrlCenterItemDialog.TYPE_INHERIT_GROUP) &&
                    <Button onClick={this.handleInheritSaveDataForGroup} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === CtrlCenterItemDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("dtCopy")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    CtrlCenterItemProps: state.CtrlCenterItemModule,
    DeptProps: state.DeptModule,
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    CtrlCenterItemActions: bindActionCreators(CtrlCenterItemActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(CtrlCenterItemDialog)));

