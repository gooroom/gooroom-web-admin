import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import { getConfigIdsInComp } from 'components/GrUtils/GrTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

import ClientRuleSelector from 'components/GrOptions/ClientRuleSelector';

import ClientConfSettingSelector from 'views/Rules/ClientConfig/ClientConfSettingSelector'
import ClientHostNameSelector from 'views/Rules/HostName/ClientHostNameSelector'
import ClientUpdateServerSelector from 'views/Rules/UpdateServer/ClientUpdateServerSelector'
import BrowserRuleSelector from 'views/Rules/UserConfig/BrowserRuleSelector';
import MediaRuleSelector from 'views/Rules/UserConfig/MediaRuleSelector';
import SecurityRuleSelector from 'views/Rules/UserConfig/SecurityRuleSelector';

function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientGroupDialog extends Component {
    
    static TYPE_ADD = 'ADD';
    static TYPE_VIEW = 'VIEW';
    static TYPE_EDIT = 'EDIT';
    
    handleClose = (event) => {
        const { ClientGroupActions, compId } = this.props;
        const { ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props; 
        ClientConfSettingActions.deleteCompData({compId: compId});
        ClientHostNameActions.deleteCompData({compId: compId});
        ClientUpdateServerActions.deleteCompData({compId: compId});
        BrowserRuleActions.deleteCompData({compId: compId});
        MediaRuleActions.deleteCompData({compId: compId});
        SecurityRuleActions.deleteCompData({compId: compId});

        ClientGroupActions.closeDialog(compId);
    }

    handleValueChange = name => event => {
        this.props.ClientGroupActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { ClientGroupProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '단말그룹 등록',
            confirmMsg: '단말그룹을 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: ClientGroupProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions, compId } = this.props;
            const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps } = this.props;

            ClientGroupActions.createClientGroupData({
                groupName: ClientGroupProps.getIn(['editingItem', 'grpNm']),
                groupComment: ClientGroupProps.getIn(['editingItem', 'comment']),
                isDefault: ClientGroupProps.getIn(['editingItem', 'isDefault']),
                
                clientConfigId: ClientConfSettingProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                hostNameConfigId: ClientHostNameProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                updateServerConfigId: ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                securityRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId'])

            }).then((res) => {
                ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
                this.handleClose();
            });
        }
    }
    
    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '단말그룹 수정',
            confirmMsg: '단말그룹을 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
        });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions, compId } = this.props;
            const { ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps } = this.props;

            ClientGroupActions.editClientGroupData({
                groupId: ClientGroupProps.getIn(['editingItem', 'grpId']),
                groupName: ClientGroupProps.getIn(['editingItem', 'grpNm']),
                groupComment: ClientGroupProps.getIn(['editingItem', 'comment']),
                isDefault: ClientGroupProps.getIn(['editingItem', 'isDefault']),

                clientConfigId: ClientConfSettingProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                hostNameConfigId: ClientHostNameProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                updateServerConfigId: ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                securityRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId'])
                
            }).then((res) => {
                ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
                this.handleClose();
            });
        }
    }

    handleChangeTabs = (event, value) => {
        this.props.ClientGroupActions.changeStoreData({
            name: 'dialogTabValue',
            value: value
        });
    };

    render() {
        const { classes } = this.props;
        const { ClientGroupProps, compId } = this.props;
        
        const dialogType = ClientGroupProps.get('dialogType');
        const editingItem = (ClientGroupProps.get('editingItem')) ? ClientGroupProps.get('editingItem') : null;

        const tabValue = ClientGroupProps.get('dialogTabValue');
const tempLabel = <div><InputLabel>단말정책</InputLabel><Divider /><InputLabel>'없음'</InputLabel></div>;

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
            <Dialog open={ClientGroupProps.get('dialogOpen')} >
                <DialogTitle >{title}</DialogTitle>
                <DialogContent style={{height:600,minHeight:600,padding:0}}>

                    <form noValidate autoComplete="off" className={classes.dialogContainer}>
                        <TextField
                            id="grpNm"
                            label="단말그룹이름"
                            value={(editingItem.get('grpNm')) ? editingItem.get('grpNm') : ''}
                            onChange={this.handleValueChange('grpNm')}
                            className={classes.fullWidth}
                        />
                        <TextField
                            id="comment"
                            label="단말그룹설명"
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange('comment')}
                            className={classes.fullWidth}
                        />
                        <Divider style={{marginBottom: 10}} />
                        <ClientRuleSelector compId={compId} module={ClientGroupProps.get('editingItem').toJS()} />
                    </form>

                </DialogContent>
                <DialogActions>
                    {(dialogType === ClientGroupDialog.TYPE_ADD) &&
                        <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                    }
                    {(dialogType === ClientGroupDialog.TYPE_EDIT) &&
                        <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                    }
                    <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
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
    SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch),

    ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
    ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
    ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

    BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
    MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
    SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientGroupDialog));


