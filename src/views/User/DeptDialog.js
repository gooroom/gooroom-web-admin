import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DeptActions from 'modules/DeptModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCheckConfirm from 'components/GRComponents/GRCheckConfirm';
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
import { translate, Trans } from "react-i18next";


class DeptDialog extends Component {
    
    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        
        this.props.DeptActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.DeptActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { DeptProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddDeptInfo"),
                confirmMsg: t("msgAddDeptInfo"),
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: DeptProps.get('editingItem')
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
            const { DeptProps, DeptActions, compId, resetCallback } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;
            const selecteObjectIdName = ['viewItems', compId, 'DEPT', 'selectedOptionItemId'];
            DeptActions.createDeptInfo({
                deptCd: DeptProps.getIn(['editingItem', 'deptCd']),
                deptNm: DeptProps.getIn(['editingItem', 'deptNm']),
                uprDeptCd: DeptProps.getIn(['editingItem', 'selectedDeptCd']),

                browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)
            }).then((res) => {
                // DeptActions.readDeptListPaged(DeptProps, compId);
                // tree refresh
                resetCallback(DeptProps.getIn(['editingItem', 'selectedDeptCd']));
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { DeptProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showCheckConfirm({
                confirmTitle: t("lbEditDeptInfo"),
                confirmMsg: t("msgEditDeptInfo"),
                confirmCheckMsg: t("lbEditChildDeptInfo"),
                handleConfirmResult: (confirmValue, confirmObject, isChecked) => {
                    if(confirmValue) {
                        const isInherit = isChecked;
                        const { DeptProps, DeptActions, compId, resetCallback } = this.props;
                        const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;
                        const selecteObjectIdName = ['viewItems', compId, 'DEPT', 'selectedOptionItemId'];
                        DeptActions.editDeptInfo({
                            deptCd: DeptProps.getIn(['editingItem', 'deptCd']),
                            deptNm: DeptProps.getIn(['editingItem', 'deptNm']),
                
                            paramIsInherit: (isInherit) ? 'Y' : 'N',
                
                            browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                            mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                            securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                            filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                            
                            desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)
                        }).then((res) => {
                            // DeptActions.readDeptListPaged(DeptProps, compId);
                            // tree refresh
                            resetCallback(DeptProps.getIn(['editingItem', 'deptCd']));
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

    render() {
        const { classes } = this.props;
        const { DeptProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = DeptProps.get('dialogType');
        const editingItem = (DeptProps.get('editingItem')) ? DeptProps.get('editingItem') : null;

        let title = "";
        let editObject = null;
        if(dialogType === DeptDialog.TYPE_ADD) {
            title = t("dtAddDept");
        } else if(dialogType === DeptDialog.TYPE_VIEW) {
            title = t("dtViewDept");
            editObject = DeptProps.get('editingItem').toJS();
        } else if(dialogType === DeptDialog.TYPE_EDIT) {
            title = t("dtEditDept");
            editObject = DeptProps.get('editingItem').toJS();
        }

        const upperDeptInfo = DeptProps.getIn(['viewItems', compId, 'selectedDeptNm']) +
            ' (' + DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']) + ')';

        return (
            <div>
            {(DeptProps.get('dialogOpen') && editingItem) &&
                <Dialog open={DeptProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent style={{minHeight:567}}>
                        {(dialogType === DeptDialog.TYPE_ADD) &&
                        <TextField
                            label={t("lbParentDept")}
                            value={upperDeptInfo}
                            className={classes.fullWidth}
                        />
                        }
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <TextValidator label={t("lbDeptId")}
                                    name="deptCd"
                                    validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
                                    errorMessages={[t("msgEnterDeptId"), t("msgDeptIdValid")]}
                                    value={(editingItem.get('deptCd')) ? editingItem.get('deptCd') : ''}
                                    onChange={this.handleValueChange("deptCd")}
                                    className={classes.fullWidth}
                                    disabled={(dialogType == DeptDialog.TYPE_EDIT) ? true : false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextValidator label={t("lbDeptName")}
                                    name="deptNm"
                                    validators={['required']}
                                    errorMessages={[t("msgEnterDeptName")]}
                                    value={(editingItem.get('deptNm')) ? editingItem.get('deptNm') : ''}
                                    onChange={this.handleValueChange("deptNm")}
                                    className={classes.fullWidth}
                                />
                            </Grid>
                        </Grid>
                        <Divider style={{marginBottom: 10}} />
                        <UserRuleSelector compId={compId} module={(dialogType === DeptDialog.TYPE_ADD) ? 'new' : 'edit'} targetType="DEPT" />
                    </DialogContent>
                    <DialogActions>
                        {(dialogType === DeptDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                        }
                        {(dialogType === DeptDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                        }
                        <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                </ValidatorForm>
                <GRConfirm />
                <GRCheckConfirm />
                </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    DeptProps: state.DeptModule,
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule,
    SoftwareFilterProps: state.SoftwareFilterModule,
    DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
    DeptActions: bindActionCreators(DeptActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptDialog)));
