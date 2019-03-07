import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import ClientRuleSelector from 'components/GROptions/ClientRuleSelector';

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
        this.props.ClientGroupActions.closeMultiDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.ClientGroupActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCheckedClientGroup = (checked, imperfect) => {
        // Check selectedDeptCd
        const { ClientGroupActions, compId } = this.props;
        ClientGroupActions.changeCompVariableObject({
            compId: compId,
            valueObj: {checkedGrpId: checked}
        });
    }

    handleEditData = (event) => {
        const { ClientGroupProps, GRConfirmActions, compId } = this.props;
        const { t, i18n } = this.props;

        const checkedGrpId = ClientGroupProps.getIn(['viewItems', compId, 'checkedGrpId']);

        if(checkedGrpId && checkedGrpId.size > 0) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("ttChangMultiDeptRule"),
                confirmMsg: t("msgChangeDeptRuleSelected"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientGroupActions, compId } = this.props;
                        const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps } = this.props;
                        const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;
                        const checkedGrpId = paramObject.checkedGrpId;
                        ClientGroupActions.editMultiGroupRule({
                            grpIds: (checkedGrpId) ? checkedGrpId.join(',') : '',
                            
                            clientConfigId: ClientConfSettingProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId']),
                            hostNameConfigId: ClientHostNameProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId']),
                            updateServerConfigId: ClientUpdateServerProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId']),
                            
                            browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId']),
                            mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId']),
                            securityRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId']),
                            filteredSoftwareRuleId: SoftwareFilterProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId']),
                            desktopConfId: DesktopConfProps.getIn(['viewItems', compId, 'GROUP', 'selectedOptionItemId'])
                        }).then((res) => {
                            // ClientGroupActions.readDeptListPaged(ClientGroupProps, compId);
                            // tree refresh
                            // resetCallback(ClientGroupProps.getIn(['editingItem', 'grpId']));
                            this.handleClose();
                        });
                    }
                },
                confirmObject: {
                    checkedGrpId: checkedGrpId
                }
            });
        } else {
            this.props.GlobalActions.showElementMsg(event.currentTarget, t("msgSelectClientGroup"));
        }
    }

    render() {
        const { classes } = this.props;
        const { ClientGroupProps, compId } = this.props;
        const { t, i18n } = this.props;

        return (
            <div>
            {(ClientGroupProps.get('multiDialogOpen')) &&
                <Dialog open={ClientGroupProps.get('multiDialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                    <DialogTitle>{t("dtChangDeptMultiple")}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={24}>
                            <Grid item xs={4}>
                                <GRTreeList
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
                                    compId={compId}
                                    onCheckedNode={this.handleCheckedClientGroup}
                                    onRef={ref => (this.grTreeList = ref)}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <ClientRuleSelector compId={compId} module="new" targetType="GROUP" />
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
    ClientGroupProps: state.ClientGroupModule,

    ClientConfSettingProps: state.ClientConfSettingModule,
    ClientHostNameProps: state.ClientHostNameModule,
    ClientUpdateServerProps: state.ClientUpdateServerModule,

    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule,
    SoftwareFilterProps: state.SoftwareFilterModule,
    DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptMultiDialog)));
