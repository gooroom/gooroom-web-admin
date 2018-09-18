import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from 'modules/ClientProfileSetModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrClientSelector from 'components/GrComponents/GrClientSelector';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientProfileSetDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_PROFILE = 'PROFILE';
    
    handleClose = (event) => {
        this.props.ClientProfileSetActions.closeDialog({
            dialogOpen: false
        });
    }

    handleCreateData = (event) => {
        const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
        ClientProfileSetActions.createClientProfileSetData(ClientProfileSetProps.selectedViewItem)
        .then(() => {
            ClientProfileSetActions.readClientProfileSetList(ClientProfileSetProps.listParam);
            this.handleClose();
        }, (res) => {

        })
    }

    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말 프로파일 수정',
            confirmMsg: '단말 프로파일을 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
        });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
            ClientProfileSetActions.editClientProfileSetData(ClientProfileSetProps.selectedViewItem)
                .then((res) => {
                ClientProfileSetActions.readClientProfileSetList(ClientProfileSetProps.listParam);
                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleProfileJob = (event) => {

        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말 프로파일 실행',
            confirmMsg: '단말 프로파일을 실행하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleProfileJobConfirmResult
        });
    }
    handleProfileJobConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientProfileSetProps } = this.props;
            const targetClientIds = (ClientProfileSetProps.selectedViewItem.targetClientIdArray).map((v) => (v.clientId)).join(',');
            const targetGroupIds = (ClientProfileSetProps.selectedViewItem.targetGroupIdArray).map((v) => (v.grpId)).join(',');
            const newSelectedItem = getMergedObject(ClientProfileSetProps.selectedViewItem, {targetClientIds: targetClientIds, targetGroupIds: targetGroupIds});
            this.props.ClientProfileSetActions.createClientProfileSetJob(newSelectedItem)
                .then((res) => {
                this.props.ClientProfileSetActions.readClientProfileSetList(ClientProfileSetProps.listParam);
                this.handleClose();
            }, (res) => {

            });
        }
    }

    handleChange = name => event => {
        this.props.ClientProfileSetActions.changeParamValue({
            name: name,
            value: event.target.value
        });
    }

    handleSelectClient = (value) => {
        this.props.ClientProfileSetActions.changeParamValue({
            name: 'clientId',
            value: value.clientId
        });
        this.props.ClientProfileSetActions.changeParamValue({
            name: 'clientNm',
            value: value.clientName
        });
    }

    handleSelectClientArray = (value) => {
        this.props.ClientProfileSetActions.changeParamValue({
          name: 'targetClientIdArray',
          value: value
        });
    }

    handleSelectGroupArray = (value) => {
        this.props.ClientProfileSetActions.changeParamValue({
          name: 'targetGroupIdArray',
          value: value
        });
    }

    handleChangeRemoval = key => (event, value) => {
        this.props.ClientProfileSetActions.changeParamValue({
            name: 'isRemoval',
            value: value
        });
    };
    

    render() {
        const { classes } = this.props;

        const { ClientProfileSetProps } = this.props;
        const { dialogType } = ClientProfileSetProps;

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
            <Dialog open={ClientProfileSetProps.dialogOpen}>
                <DialogTitle >{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField  
                        id="profileNm"
                        label="프로파일 이름"
                        value={(ClientProfileSetProps.selectedViewItem) ? ClientProfileSetProps.selectedViewItem.profileNm : ''}
                        onChange={this.handleChange("profileNm")}
                        className={classNames(classes.fullWidthfullWidth)}
                        disabled={[ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)}
                    />
                    <TextField
                        id="profileCmt"
                        label="프로파일 설명"
                        value={(ClientProfileSetProps.selectedViewItem) ? ClientProfileSetProps.selectedViewItem.profileCmt : ''}
                        onChange={this.handleChange("profileCmt")}
                        className={classNames(classes.fullWidthfullWidth, classes.profileItemRow)}
                        disabled={[ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)}
                    />
                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <div className={classNames(classes.fullWidthfullWidth, classes.profileItemRow)}>
                            <FormLabel>기타 패키지 처리방식</FormLabel>
                            <RadioGroup name="is_removal" onChange={this.handleChangeRemoval('isRemoval')} value={ClientProfileSetProps.selectedViewItem.isRemoval} row>
                                <FormControlLabel value="true" control={<Radio />} label="삭제함" />
                                <FormControlLabel value="false" control={<Radio />} label="삭제안함" />
                            </RadioGroup>
                        </div>
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_VIEW || dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <TextField
                            id="clientId"
                            label="레퍼런스 단말"
                            value={(ClientProfileSetProps.selectedViewItem) ? ClientProfileSetProps.selectedViewItem.clientNm + ' (' + ClientProfileSetProps.selectedViewItem.clientId + ')' : ''}
                            onChange={this.handleChange("clientId")}
                            className={classNames(classes.fullWidthfullWidth, classes.profileItemRow)}
                            disabled
                        />
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_ADD || dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
                        <div>
                            <TextField
                                id="clientId"
                                label="레퍼런스 단말"
                                value={(ClientProfileSetProps.selectedViewItem && ClientProfileSetProps.selectedViewItem.clientNm) ? ClientProfileSetProps.selectedViewItem.clientNm + ' (' + ClientProfileSetProps.selectedViewItem.clientId + ')' : ''}
                                placeholder="아래 목록에서 단말을 선택하세요."
                                onChange={this.handleChange("clientId")}
                                className={classNames(classes.fullWidthfullWidth, classes.profileItemRow)}
                            />
                            <div className={classes.profileItemRow}>
                                <GrClientSelector selectorType='single' 
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
                            <GrClientSelector selectorType='multiple' 
                                handleClientSelect={this.handleSelectClientArray} 
                                handleGroupSelect={this.handleSelectGroupArray} 
                                height='220' />
                        </div>
                    }
    
                </form>
                <DialogActions>
                {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                    <Button onClick={this.handleProfileJob} variant='raised' color="secondary">생성</Button>
                }
                {(dialogType === ClientProfileSetDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>

                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientProfileSetProps: state.ClientProfileSetModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientProfileSetDialog));

