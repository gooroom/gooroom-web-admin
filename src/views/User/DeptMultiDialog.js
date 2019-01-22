import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DeptActions from 'modules/DeptModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import UserRuleSelector from 'components/GROptions/UserRuleSelector';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import GRTreeList from "components/GRTree/GRTreeList";

import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DeptMultiDialog extends Component {
    
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.DeptActions.closeMultiDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.DeptActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCheckedDept = (checked, imperfect) => {
        // Check selectedDeptCd
        const { DeptActions, compId } = this.props;
        DeptActions.changeCompVariableObject({
            compId: compId,
            valueObj: {checkedDeptCd: checked}
        });
    }

    handleEditData = (event) => {
        const { DeptProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: t("ttChangMultiDeptRule"),
            confirmMsg: t("msgChangeDeptRuleSelected"),
            handleConfirmResult: this.handleEditConfirmResult,
        });
    }
    handleEditConfirmResult = (confirmValue) => {

        if(confirmValue) {
            const { DeptProps, DeptActions, compId } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;

            const checkedDeptCd = DeptProps.getIn(['viewItems', compId, 'checkedDeptCd']);

            DeptActions.editMultiDeptRule({
                deptCds: (checkedDeptCd) ? checkedDeptCd.join(',') : '',
                browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                securityRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                filteredSoftwareRuleId: SoftwareFilterProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                desktopConfId: DesktopConfProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId'])
            }).then((res) => {
                // DeptActions.readDeptListPaged(DeptProps, compId);
                // tree refresh
                // resetCallback(DeptProps.getIn(['editingItem', 'selectedDeptCd']));
                this.handleClose();
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { DeptProps, compId } = this.props;
        const { t, i18n } = this.props;

        return (
            <div>
            {(DeptProps.get('multiDialogOpen')) &&
                <Dialog open={DeptProps.get('multiDialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                    <DialogTitle>{t("dtChangDeptMultiple")}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={24}>
                            <Grid item xs={4}>
                                <GRTreeList
                                    useFolderIcons={true}
                                    listHeight='24px'
                                    url='readChildrenDeptList'
                                    paramKeyName='deptCd'
                                    rootKeyValue='0'
                                    keyName='key'
                                    title='title'
                                    startingDepth='2'
                                    hasSelectChild={false}
                                    hasSelectParent={false}
                                    compId={compId}
                                    onInitTreeData={this.handleInitTreeData}
                                    onSelectNode={this.handleSelectDept}
                                    onCheckedNode={this.handleCheckedDept}
                                    onEditNode={this.handleEditDept}
                                    onRef={ref => (this.grTreeList = ref)}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <UserRuleSelector compId={compId} module={null} targetType="DEPT" />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                        <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                    <GRConfirm />
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptMultiDialog)));
