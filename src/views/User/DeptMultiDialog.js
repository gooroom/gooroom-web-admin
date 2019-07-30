import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as DeptActions from 'modules/DeptModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import UserRuleSelector from 'components/GROptions/UserRuleSelector';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import GRTreeDeptList from "components/GRTree/GRTreeDeptList";

import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DeptMultiDialog extends Component {
    
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        const { DeptActions, compId } = this.props;
        DeptActions.closeMultiDialog({ compId: `${compId}_MRDIALOG` });
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
        DeptActions.changeTreeDataVariable({ compId: `${compId}_MRDIALOG`, name: 'checked', value: checked });
    }

    handleEditData = (event) => {
        const { DeptProps, GRConfirmActions, compId } = this.props;
        const { t, i18n } = this.props;

        const checkedDeptCd = DeptProps.getIn(['viewItems', `${compId}_MRDIALOG`, 'treeComp', 'checked']);

        if(checkedDeptCd && checkedDeptCd.length > 0) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("ttChangMultiDeptRule"),
                confirmMsg: t("msgChangeDeptRuleSelected"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { DeptActions, compId } = this.props;
                        const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, CtrlCenterItemProps, PolicyKitRuleProps, DesktopConfProps } = this.props;
                        const checkedDeptCd = paramObject.checkedDeptCd;
                        DeptActions.editMultiDeptRule({
                            deptCds: (checkedDeptCd) ? checkedDeptCd.join(',') : '',

                            browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                            mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                            securityRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                            filteredSoftwareRuleId: SoftwareFilterProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                            ctrlCenterItemRuleId: CtrlCenterItemProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                            policyKitRuleId: PolicyKitRuleProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId']),
                            desktopConfId: DesktopConfProps.getIn(['viewItems', compId, 'DEPT', 'selectedOptionItemId'])
                        }).then((res) => {
                            // DeptActions.readDeptListPaged(DeptProps, compId);
                            // tree refresh
                            // resetCallback(DeptProps.getIn(['editingItem', 'selectedDeptCd']));
                            if(res.status && res.status && res.status.message) {
                                this.props.GRAlertActions.showAlert({
                                  alertTitle: t("dtSystemNotice"),
                                  alertMsg: res.status.message
                                });
                            }
                            this.handleClose();
                        });
                    }
                },
                confirmObject: {
                    checkedDeptCd: checkedDeptCd
                }
            });
        } else {
            this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectDept"));
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
                                <GRTreeDeptList
                                    useFolderIcons={true}
                                    listHeight='24px'
                                    compId={`${compId}_MRDIALOG`}
                                    hasSelectChild={false}
                                    hasSelectParent={false}
                                    isEnableEdit={false}
                                    isActivable={false}
                                    isShowMemberCnt={true}
                                    onCheckedNode={this.handleCheckedDept}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <UserRuleSelector compId={compId} module="new" targetType="DEPT" />
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
    CtrlCenterItemProps: state.CtrlCenterItemModule,
    PolicyKitRuleProps: state.PolicyKitRuleModule,
    DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    DeptActions: bindActionCreators(DeptActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptMultiDialog)));
