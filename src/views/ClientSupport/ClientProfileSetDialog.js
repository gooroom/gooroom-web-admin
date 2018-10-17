import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from 'modules/ClientProfileSetModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRClientSelector from 'components/GRComponents/GRClientSelector';
import { getMergedObject } from 'components/GRUtils/GRCommonUtils';

import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientProfileSetDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_PROFILE = 'PROFILE';
    
    handleClose = (event) => {
        this.props.ClientProfileSetActions.closeDialog(this.props.compId);
    }

    handleCreateData = (event) => {
        const { ClientProfileSetProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말 프로파일 등록',
            confirmMsg: '단말 프로파일을 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateDataConfirmResult,
            confirmObject: ClientProfileSetProps.get('editingItem')
        });
    }
    handleCreateDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientProfileSetProps, ClientProfileSetActions, compId } = this.props;
            ClientProfileSetActions.createClientProfileSetData({
                clientId: paramObject.get('clientId'),
                profileNm: paramObject.get('profileNm'),
                profileCmt: paramObject.get('profileCmt')
            }).then((res) => {
                ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { ClientProfileSetProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말 프로파일 수정',
            confirmMsg: '단말 프로파일을 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: ClientProfileSetProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientProfileSetProps, ClientProfileSetActions, compId } = this.props;
            ClientProfileSetActions.editClientProfileSetData({
                profileNo: paramObject.get('profileNo'),
                clientId: paramObject.get('clientId'),
                profileNm: paramObject.get('profileNm'),
                profileCmt: paramObject.get('profileCmt')
            }).then((res) => {
                ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
                this.handleClose();
            });
        }
    }

    handleProfileJob = (event) => {
        const { ClientProfileSetProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말 프로파일 실행',
            confirmMsg: '단말 프로파일을 실행하시겠습니까?',
            handleConfirmResult: this.handleProfileJobConfirmResult,
            confirmObject: ClientProfileSetProps.get('editingItem')
        });
    }
    handleProfileJobConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientProfileSetProps, ClientProfileSetActions, compId } = this.props;
            const targetClientIds = (paramObject.get('targetClientIdArray')).map((v) => (v.get('clientId'))).join(',');
            const targetGroupIds = (paramObject.get('targetGroupIdArray')).map((v) => (v.get('grpId'))).join(',');

            ClientProfileSetActions.createClientProfileSetJob({
                profileNo: paramObject.get('profileNo'),
                targetClientIds: targetClientIds,
                targetClientGroupIds: targetGroupIds,
                isRemoval: paramObject.get('isRemoval')
            }).then((res) => {
                ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
                this.handleClose();
            });
        }
    }

    handleValueChange = name => event => {
        this.props.ClientProfileSetActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleSelectClient = (clientObj) => {
        this.props.ClientProfileSetActions.setEditingItemValue({ name: 'clientId', value: clientObj.get('clientId') });
        this.props.ClientProfileSetActions.setEditingItemValue({ name: 'clientNm', value: clientObj.get('clientName') });
    }

    handleSelectClientArray = (value) => {
        this.props.ClientProfileSetActions.setEditingItemValue({
          name: 'targetClientIdArray',
          value: value
        });
    }

    handleSelectGroupArray = (value) => {
        this.props.ClientProfileSetActions.setEditingItemValue({
          name: 'targetGroupIdArray',
          value: value
        });
    }

    handleChangeRemoval = key => (event, value) => {
        this.props.ClientProfileSetActions.setEditingItemValue({
            name: 'isRemoval',
            value: value
        });
    };
    

    render() {
        const { classes } = this.props;
        const { ClientProfileSetProps } = this.props;
        const dialogType = ClientProfileSetProps.get('dialogType');
        const editingItem = (ClientProfileSetProps.get('editingItem')) ? ClientProfileSetProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientProfileSetDialog.TYPE_ADD) {
            title = "단말 프로파일 등록";
        } else if(dialogType === ClientProfileSetDialog.TYPE_VIEW) {
            title = "단말 프로파일 정보";
        } else if(dialogType === ClientProfileSetDialog.TYPE_EDIT) {
            title = "단말 프로파일 수정";
        } else if(dialogType === ClientProfileSetDialog.TYPE_PROFILE) {
            title = "단말 프로파일 실행";
        }

        return (
            <div>
            {(ClientProfileSetProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientProfileSetProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <DialogTitle >{title}</DialogTitle>
                <DialogContent>
                    <TextField  
                        label="프로파일 이름"
                        value={(editingItem.get('profileNm')) ? editingItem.get('profileNm') : ''}
                        onChange={([ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)) ? null : this.handleValueChange("profileNm")}
                        className={classNames(classes.fullWidth)}
                    />
                    <TextField
                        label="프로파일 설명"
                        value={(editingItem.get('profileCmt')) ? editingItem.get('profileCmt') : ''}
                        onChange={([ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)) ? null : this.handleValueChange("profileCmt")}
                        className={classNames(classes.fullWidth, classes.profileItemRow)}
                    />
                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <div className={classNames(classes.fullWidth, classes.profileItemRow)}>
                            <FormLabel>기타 패키지 처리방식</FormLabel>
                            <RadioGroup name="is_removal" onChange={this.handleChangeRemoval('isRemoval')} value={editingItem.get('isRemoval')} row>
                                <FormControlLabel value="true" control={<Radio />} label="삭제함" />
                                <FormControlLabel value="false" control={<Radio />} label="삭제안함" />
                            </RadioGroup>
                        </div>
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_VIEW || dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <TextField
                            label="레퍼런스 단말"
                            value={(editingItem.get('clientNm')) ? editingItem.get('clientNm') + ' (' + editingItem.get('clientId') + ')' : ''}
                            className={classNames(classes.fullWidth, classes.profileItemRow)}
                        />
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_ADD || dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
                        <div>
                            <TextField
                                id="clientId"
                                label="레퍼런스 단말"
                                value={(editingItem.get('clientId') && editingItem.get('clientId') != '') ? editingItem.get('clientNm') + ' (' + editingItem.get('clientId') + ')' : ''}
                                placeholder="아래 목록에서 단말을 선택하세요."
                                className={classNames(classes.fullWidth, classes.profileItemRow)}
                            />
                            <div className={classes.profileItemRow}>
                                <GRClientSelector selectorType='single' 
                                    handleClientSelect={this.handleSelectClient} 
                                    height='220' />
                            </div>
                        </div>
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <div>
                            <div className={classes.profileLabel}>
                                <InputLabel >대상 단말</InputLabel>
                            </div>
                            <GRClientSelector selectorType='multiple' 
                                handleClientSelect={this.handleSelectClientArray} 
                                handleGroupSelect={this.handleSelectGroupArray} 
                                height='220' />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                    <Button onClick={this.handleProfileJob} variant='contained' color="secondary">생성</Button>
                }
                {(dialogType === ClientProfileSetDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
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
    ClientProfileSetProps: state.ClientProfileSetModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientProfileSetDialog));

