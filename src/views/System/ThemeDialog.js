import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ThemeManageActions from 'modules/ThemeManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormLabel from '@material-ui/core/FormLabel';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ThemeDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    static APP_LIST = [
        {no:1, title:'cloud storage', name:'cloud_storage'},
        {no:2, title:'web office', name:'web_office'},
        {no:3, title:'office SNS', name:'office_sns'},
        {no:4, title:'team', name:'team'},
        {no:5, title:'video conferencing system', name:'video_conferencing_system'},
        {no:6, title:'groupware', name:'groupware'},
        {no:7, title:'memo', name:'memo'},
        {no:8, title:'KMS', name:'kms'},
        {no:9, title:'ERP', name:'erp'},
        {no:10, title:'accounting management', name:'accounting_management'},
        {no:11, title:'personnel management', name:'personnel_management'},
        {no:12, title:'etc applications', name:'etc_applications'},
        {no:13, title:'security status', name:'security_status'},
        {no:14, title:'screenshot', name:'screenshot'},
        {no:15, title:'smartcard register', name:'smartcard_register'},
        {no:16, title:'gooroom terminal server', name:'gooroom_terminal_server'},
        {no:17, title:'package management', name:'package_management'},
        {no:18, title:'updater', name:'updater'},
        {no:19, title:'archiver', name:'archiver'},
        {no:20, title:'multimedia', name:'multimedia'},
        {no:21, title:'calculator', name:'calculator'},
        {no:22, title:'network management', name:'network_management'},
        {no:23, title:'file manager', name:'file_manager'},
        {no:24, title:'gooroom browser', name:'gooroom_browser'}
    ];

    handleClose = (event) => {
        this.props.ThemeManageActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.ThemeManageActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleValuePasswordChange = name => event => {
        this.props.ThemeManageActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    makeParameter = (paramObject) => {

        let dataParam = Map({
            themeId: paramObject.get('themeId'),
            themeNm: paramObject.get('themeNm'),
            themeCmt: paramObject.get('themeCmt')
        });
        ThemeDialog.APP_LIST.map(n => {
            dataParam = dataParam.set(n.name, paramObject.get(n.name));
        });
        return dataParam.toJS();
    }

    // 생성
    handleCreateData = (event) => {
        const { ThemeManageProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddTheme"),
                confirmMsg: t("msgAddTheme"),
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: ThemeManageProps.get('editingItem')
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
            const { ThemeManageProps, ThemeManageActions, compId } = this.props;
            ThemeManageActions.createThemeData(this.makeParameter(paramObject)).then((res) => {
                ThemeManageActions.readThemeListPaged(ThemeManageProps, compId);
                this.handleClose();
            });
        }
    }

    // 수정
    handleEditData = (event) => {
        const { ThemeManageProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditTheme"),
                confirmMsg: t("msgEditTheme"),
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: ThemeManageProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleEditDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ThemeManageProps, ThemeManageActions, compId } = this.props;
            ThemeManageActions.editThemeData(this.makeParameter(paramObject)).then((res) => {
                ThemeManageActions.readThemeListPaged(ThemeManageProps, compId);
                this.handleClose();
            });
        }
    }

    ___handleImageFileChange = (event, gubunName) => {
        if(event.target.files && event.target.files.length > 0) {
            this.props.ThemeManageActions.setEditingItemValue({
                name: gubunName,
                value: event.target.files[0]
            });
        }
    }
    // file select
    handleImageFileChange = (event, gubunName) => {
        const selectedFile = event.target.files[0];
        const viewFileName = gubunName + '_GRFILE';
        this.readFileContent(event.target.files[0]).then(content => {
            if(content) {
                this.props.ThemeManageActions.setEditingItemObject({
                    [gubunName]: selectedFile,
                    [viewFileName]: content
                });
            }
        }).catch(error => console.log(error));
    }
    readFileContent(file) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result)
            reader.onerror = error => reject(error)
            reader.readAsDataURL(file)
        });
    }
    

    render() {
        const { classes } = this.props;
        const { ThemeManageProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = ThemeManageProps.get('dialogType');
        const editingItem = (ThemeManageProps.get('editingItem')) ? ThemeManageProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ThemeDialog.TYPE_ADD) {
            title = t("dtAddTheme");
        } else if(dialogType === ThemeDialog.TYPE_VIEW) {
            title = t("dtViewTheme");
        } else if(dialogType === ThemeDialog.TYPE_EDIT) {
            title = t("dtEditTheme");
        }

        return (
            <div>
            {(ThemeManageProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ThemeManageProps.get('dialogOpen')} fullWidth={true} maxWidth="sm">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                {(dialogType === ThemeDialog.TYPE_EDIT) &&
                    <TextField label={t("lbThemeId")} className={classes.fullWidth}
                        value={(editingItem.get('themeId')) ? editingItem.get('themeId') : ''}
                    />
                }
                    <TextValidator label={t("lbThemeName")} className={classes.fullWidth}
                        value={(editingItem.get('themeNm')) ? editingItem.get('themeNm') : ''}
                        name="themeNm" validators={['required']} errorMessages={[t("msgThemeName")]}
                        onChange={this.handleValueChange("themeNm")}
                    />
                    <TextField label={t("lbThemeDesc")} className={classes.fullWidth}
                        value={(editingItem.get('themeCmt')) ? editingItem.get('themeCmt') : ''}
                        onChange={this.handleValueChange("themeCmt")}
                    />
                    <div style={{marginTop:20}}></div>
                    <FormLabel>{t("lbIconSetting")}</FormLabel>
                    <div style={{maxHeight:270,overflowY:'auto'}}>
                    <Table>
                        <TableBody>
                            {ThemeDialog.APP_LIST && ThemeDialog.APP_LIST.map(n => {
                                let beforeImg = '';
                                if(dialogType == ThemeDialog.TYPE_EDIT) {
                                    const iconItem = editingItem.get('themeIcons').find(icon => {
                                        return icon.get('fileEtcInfo') == n.name;
                                    });
                                    if(iconItem && iconItem.get('fileName') && iconItem.get('fileName') !== '') {
                                        beforeImg = iconItem.get('imgUrl') + iconItem.get('fileName');
                                    }                                    
                                }

                                return (
                                    <TableRow hover key={n.no}>
                                        <TableCell style={{width:230}}>{n.no}. {n.title}</TableCell>
                                        {(dialogType === ThemeDialog.TYPE_EDIT) &&
                                            <TableCell style={{width:50}}>
                                            {(beforeImg && beforeImg !== '') && 
                                                <img src={beforeImg} height="50" style={{border:'solid 1 red'}} />
                                            }
                                            </TableCell>
                                        }
                                        <TableCell style={{width:80}}>
                                            <input style={{display:'none'}} id={n.name + '-file'} type="file" onChange={event => this.handleImageFileChange(event, n.name)} />
                                            <label htmlFor={n.name + '-file'}>
                                                <Button variant="contained" size='small' component="span" className={classes.button}>{t("btnSelectFile")}</Button>
                                            </label>
                                        </TableCell>
                                        <TableCell>
                                            <img src={editingItem.get(n.name + '_GRFILE')} height="50" />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    </div>
                </DialogContent>
                <DialogActions>
                {(dialogType === ThemeDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === ThemeDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
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
  ThemeManageProps: state.ThemeManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ThemeManageActions: bindActionCreators(ThemeManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ThemeDialog)));

