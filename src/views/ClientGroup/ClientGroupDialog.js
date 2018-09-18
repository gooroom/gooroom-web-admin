import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Divider from '@material-ui/core/Divider';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

import ClientConfSettingSelector from 'views/Rules/ClientConfig/ClientConfSettingSelector'


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

    componentDidMount() {
        console.log('ClientGroupDialog > componentDidMount............');
    }


    handleClose = (event) => {
        this.props.ClientGroupActions.closeDialog();
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
            ClientGroupActions.createClientGroupData(ClientGroupProps.get('editingItem'))
                .then(() => {
                    ClientGroupActions.readClientGroupList(ClientGroupProps, compId);
                    this.handleClose();
            });
        }
    }
    
    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말그룹 수정',
            confirmMsg: '단말그룹을 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
          });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientGroupProps, ClientGroupActions, compId } = this.props;
            ClientGroupActions.editClientGroupData(ClientGroupProps.get('editingItem'))
                .then((res) => {
                    ClientGroupActions.readClientGroupList(ClientGroupProps, compId);
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
            <Dialog open={ClientGroupProps.get('dialogOpen')}>
                <DialogTitle >{title}</DialogTitle>

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
                    <AppBar position="static" color="default">
                        <Tabs value={tabValue} onChange={this.handleChangeTabs}>
                            <Tab label="단말정책정보" />
                            <Tab label="Hosts정보" />
                            <Tab label="업데이트서버정보" />
                        </Tabs>
                    </AppBar>
                    {tabValue === 0 && <ClientConfSettingSelector compId={compId}>Item One</ClientConfSettingSelector>}
                    {tabValue === 1 && <ClientConfSettingSelector compId={compId}>Item Two</ClientConfSettingSelector>}
                    {tabValue === 2 && <ClientConfSettingSelector compId={compId}>Item Three</ClientConfSettingSelector>}

                </form>

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
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientGroupDialog));


