import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import DesktopConfSpec from './DesktopConfSpec';
import DesktopAppSelector from './DesktopAppSelector';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";

import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DesktopConfDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT = 'INHERIT';
    static TYPE_COPY = 'COPY';

    componentDidMount() {
        this.props.DesktopConfActions.readThemeInfoList();
    }

    handleClose = (event) => {
        this.props.DesktopConfActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.DesktopConfActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.DesktopConfActions.setBluetoothMac({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { DesktopConfProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtAddDesktopConf"),
                confirmMsg: t("msgAddDesktopConf"),
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: DesktopConfProps.get('editingItem')
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
            const { DesktopConfProps, DesktopConfActions } = this.props;
            DesktopConfActions.createDesktopConfData(DesktopConfProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(DesktopConfProps, DesktopConfActions.readDesktopConfListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { DesktopConfProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtEditDesktopConf"),
                confirmMsg: t("msgEditDesktopConf"),
                handleConfirmResult: this.handleEditConfirmResult,
                confirmObject: DesktopConfProps.get('editingItem')
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
            const { DesktopConfProps, DesktopConfActions } = this.props;
            DesktopConfActions.editDesktopConfData(DesktopConfProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(DesktopConfProps, DesktopConfActions.readDesktopConfListPaged);
                    this.handleClose();
                });
        }
    }

    handleInheritSaveData = (event, id) => {
        const { DesktopConfProps, DeptProps, DesktopConfActions, compId } = this.props;
        const { t, i18n } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        DesktopConfActions.inheritDesktopConfData({
            'confId': DesktopConfProps.getIn(['editingItem', 'confId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyDesktopConfToChild")
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { DesktopConfProps, DesktopConfActions } = this.props;
        const { t, i18n } = this.props;
        DesktopConfActions.cloneDesktopConfData({
            'confId': DesktopConfProps.getIn(['editingItem', 'confId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyDesktopConf")
            });
            refreshDataListInComps(DesktopConfProps, DesktopConfActions.readDesktopConfListPaged);
            this.handleClose();
        });
    }

    render() {
        const { classes } = this.props;
        const { DesktopConfProps, DesktopAppProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = DesktopConfProps.get('dialogType');
        const editingItem = (DesktopConfProps.get('editingItem')) ? DesktopConfProps.get('editingItem') : null;
        const selectedThemeId = (editingItem && editingItem.get('themeId')) ? editingItem.get('themeId') : '';
        const themeListData = DesktopConfProps.get('themeListData');

        let title = "";
        if(dialogType === DesktopConfDialog.TYPE_ADD) {
            title = t("dtAddDesktopConf");
        } else if(dialogType === DesktopConfDialog.TYPE_VIEW) {
            title = t("dtViewDesktopConf");
        } else if(dialogType === DesktopConfDialog.TYPE_EDIT) {
            title = t("dtEditDesktopConf");
        } else if(dialogType === DesktopConfDialog.TYPE_INHERIT) {
            title = t("dtInheritDesktopConf");
        } else if(dialogType === DesktopConfDialog.TYPE_COPY) {
            title = t("dtCopyDesktopConf");
        }

        return (
            <div>
            {(DesktopConfProps.get('dialogOpen') && editingItem) &&
            <Dialog open={DesktopConfProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === DesktopConfDialog.TYPE_EDIT || dialogType === DesktopConfDialog.TYPE_ADD) &&
                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                            <Grid item xs={8} >
                                <TextValidator label={t("lbName")} value={(editingItem.get('confNm')) ? editingItem.get('confNm') : ''}
                                    onChange={this.handleValueChange("confNm")}
                                    name="confNm" validators={['required']} errorMessages={[t("msgInputName")]}
                                    className={classes.fullWidth}
                                    disabled={(dialogType === DesktopConfDialog.TYPE_VIEW)}
                                />
                            </Grid>
                            <Grid item xs={4} >
                                <InputLabel>{t("lbTheme")}</InputLabel>
                                <Select
                                    value={selectedThemeId} style={{width:'100%'}}
                                    onChange={this.handleValueChange('themeId')}
                                >
                                    {themeListData && themeListData.map(x => (
                                    <MenuItem value={x.get('themeId')} key={x.get('themeId')}>
                                        {x.get('themeNm')}
                                    </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} >
                                <DesktopAppSelector 
                                    selectedApps={editingItem.get('apps') ? editingItem.get('apps') : List([])}
                                    isEnableDelete={this.props.isEnableDelete}
                                />
                            </Grid>
                            
                        </Grid>
                    }
                    {(dialogType === DesktopConfDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <DesktopConfSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === DesktopConfDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <DesktopConfSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === DesktopConfDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === DesktopConfDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === DesktopConfDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === DesktopConfDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("dtCopy")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
                <GRConfirm />
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    DesktopConfProps: state.DesktopConfModule,
    DesktopAppProps: state.DesktopAppModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopConfDialog)));

