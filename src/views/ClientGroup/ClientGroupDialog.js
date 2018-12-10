import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

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

import ClientRuleSelector from 'components/GROptions/ClientRuleSelector';


class ClientGroupDialog extends Component {
    
    static TYPE_ADD = 'ADD';
    static TYPE_VIEW = 'VIEW';
    static TYPE_EDIT = 'EDIT';
    
    handleClose = (event) => {
        this.props.ClientGroupActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.ClientGroupActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { ClientGroupProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말그룹 등록',
            confirmMsg: '단말그룹을 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateDataConfirmResult,
            confirmObject: ClientGroupProps.get('editingItem')
        });
    }
    handleCreateDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions, compId } = this.props;
            const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;

            const selecteObjectIdName = ['viewItems', compId, 'GROUP', 'selectedOptionItemId'];
            ClientGroupActions.createClientGroupData({
                groupName: ClientGroupProps.getIn(['editingItem', 'grpNm']),
                groupComment: ClientGroupProps.getIn(['editingItem', 'comment']),
                isDefault: ClientGroupProps.getIn(['editingItem', 'isDefault']),
                
                clientConfigId: ClientConfSettingProps.getIn(selecteObjectIdName),
                hostNameConfigId: ClientHostNameProps.getIn(selecteObjectIdName),
                updateServerConfigId: ClientUpdateServerProps.getIn(selecteObjectIdName),
                browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)

            }).then((res) => {
                ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
                this.handleClose();
            });
        }
    }
    
    handleEditData = (event) => {
        const { GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말그룹 수정',
            confirmMsg: '단말그룹을 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult
        });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions, compId } = this.props;
            const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps, SoftwareFilterProps, DesktopConfProps } = this.props;

            const selecteObjectIdName = ['viewItems', compId, 'GROUP', 'selectedOptionItemId'];
            ClientGroupActions.editClientGroupData({
                groupId: ClientGroupProps.getIn(['editingItem', 'grpId']),
                groupName: ClientGroupProps.getIn(['editingItem', 'grpNm']),
                groupComment: ClientGroupProps.getIn(['editingItem', 'comment']),
                isDefault: ClientGroupProps.getIn(['editingItem', 'isDefault']),

                clientConfigId: ClientConfSettingProps.getIn(selecteObjectIdName),
                hostNameConfigId: ClientHostNameProps.getIn(selecteObjectIdName),
                updateServerConfigId: ClientUpdateServerProps.getIn(selecteObjectIdName),
                browserRuleId: BrowserRuleProps.getIn(selecteObjectIdName),
                mediaRuleId: MediaRuleProps.getIn(selecteObjectIdName),
                securityRuleId: SecurityRuleProps.getIn(selecteObjectIdName),
                filteredSoftwareRuleId: SoftwareFilterProps.getIn(selecteObjectIdName),
                desktopConfId: DesktopConfProps.getIn(selecteObjectIdName)
                
            }).then((res) => {
                ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
                this.handleClose();
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { ClientGroupProps, compId } = this.props;
        
        const dialogType = ClientGroupProps.get('dialogType');
        const editingItem = (ClientGroupProps.get('editingItem')) ? ClientGroupProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientGroupDialog.TYPE_ADD) {
            title = "단말 그룹 등록";
        } else if(dialogType === ClientGroupDialog.TYPE_VIEW) {
            title = "단말 그룹 정보";
        } else if(dialogType === ClientGroupDialog.TYPE_EDIT) {
            title = "단말 그룹 수정";
        } 

        return (
            <div>
            {(ClientGroupProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientGroupProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <DialogTitle >{title}</DialogTitle>
                <DialogContent style={{minHeight:567}}>
                    <Grid container spacing={24}>
                        <Grid item xs={3}>
                            <TextField label="단말그룹이름" className={classes.fullWidth}
                                value={(editingItem.get('grpNm')) ? editingItem.get('grpNm') : ''}
                                onChange={this.handleValueChange('grpNm')}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField label="단말그룹설명" className={classes.fullWidth}
                                value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                                onChange={this.handleValueChange('comment')}
                            />
                        </Grid>
                    </Grid>
                    <Divider style={{marginBottom: 10}} />
                    <ClientRuleSelector compId={compId} module={ClientGroupProps.get('editingItem').toJS()} targetType="GROUP" />
                </DialogContent>
                <DialogActions>
                    {(dialogType === ClientGroupDialog.TYPE_ADD) &&
                        <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                    }
                    {(dialogType === ClientGroupDialog.TYPE_EDIT) &&
                        <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                    }
                    <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
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
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupDialog));


