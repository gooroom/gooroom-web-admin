import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from '../../modules/ClientProfileSetModule';

import { css } from "glamor";

import GrClientSelector from '../../components/GrComponents/GrClientSelector';

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

//
//  ## Style ########## ########## ########## ########## ##########
//
const containerClass = css({
    margin: "0px 30px !important",
    minHeight: 300,
    minWidth: 500
}).toString();

const fullWidthClass = css({
    width: "100%"
}).toString();

const ruleContainerClass = css({
    height: "346px",
    overflowY: "auto",
    boxShadow: "none !important"
}).toString();

const ruleContentClass = css({
    padding: "5px 5px 24px 0px !important",
}).toString();


const formControlClass = css({
    minWidth: "100px !important",
      marginRight: "15px !important",
      flexGrow: 1
}).toString();

const keyCreateBtnClass = css({
    paddingTop: 24 + " !important"
}).toString();



const labelClass = css({
    height: "25px",
    marginTop: "10px"
}).toString();

const itemRowClass = css({
    marginTop: "10px !important"
}).toString();



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
            dialogType: ClientProfileSetDialog.TYPE_VIEW,
            dialogOpen: false
        });
    }

    handleCreateData = (event) => {
        const { profileSetModule } = this.props;
        this.props.ClientProfileSetActions.createClientProfileSetData({
            client_id: profileSetModule.clientId,
            profile_nm: profileSetModule.profileName,
            profile_cmt: profileSetModule.profileComment
        }).then(() => {
            this.props.ClientProfileSetActions.readClientProfileSetList(
                {
                    keyword: profileSetModule.keyword,
                    page: profileSetModule.page,
                    rowsPerPage: profileSetModule.rowsPerPage,
                    length: profileSetModule.rowsPerPage,
                    orderColumn: profileSetModule.orderColumn,
                    orderDir: profileSetModule.orderDir
                }
            );
            this.handleClose();
        }, (res) => {
            // console.log('error...', res);
        })
    }

    handleEditData = (event) => {
        const { profileSetModule } = this.props;
        this.props.ClientProfileSetActions.editClientProfileSetData({
            profile_no: profileSetModule.selectedItem.profileNo,
            client_id: profileSetModule.clientId,
            profile_nm: profileSetModule.profileName,
            profile_cmt: profileSetModule.profileComment
        }).then((res) => {
            this.props.ClientProfileSetActions.readClientProfileSetList(
                {
                    keyword: profileSetModule.keyword,
                    page: profileSetModule.page,
                    rowsPerPage: profileSetModule.rowsPerPage,
                    length: profileSetModule.rowsPerPage,
                    orderColumn: profileSetModule.orderColumn,
                    orderDir: profileSetModule.orderDir
                }
            );
            this.handleClose();
        }, (res) => {
            //console.log('error...', res);
        })
    }

    handleProfileJob = (event) => {

        const { profileSetModule } = this.props;
        const tc = (profileSetModule.targetClient).map((v) => (v.clientId)).join(',');
        const tcg = (profileSetModule.targetClientGroup).map((v) => (v.grpId)).join(',');

        this.props.ClientProfileSetActions.createClientProfileSetJob({
            profile_no: profileSetModule.selectedItem.profileNo, 
            client_id: tc,
            group_id: tcg,
            is_removal: profileSetModule.isRemoval
        }).then((res) => {
            this.props.ClientProfileSetActions.readClientProfileSetList(
                {
                    keyword: profileSetModule.keyword,
                    page: profileSetModule.page,
                    rowsPerPage: profileSetModule.rowsPerPage,
                    length: profileSetModule.rowsPerPage,
                    orderColumn: profileSetModule.orderColumn,
                    orderDir: profileSetModule.orderDir
                }
            );
            this.handleClose();
        }, (res) => {
            //console.log('error...', res);
        })

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
    }

    handleSelectClientArray = (value) => {
        this.props.ClientProfileSetActions.changeParamValue({
          name: 'targetClient',
          value: value
        });
    }

    handleSelectGroupArray = (value) => {
        this.props.ClientProfileSetActions.changeParamValue({
          name: 'targetClientGroup',
          value: value
        });
    }

    handleChangeRemoval = key => (event, value) => {
        this.props.ClientProfileSetActions.changeParamValue({
            name: key,
            value: value
        });
    };
    

    render() {

        const { profileSetModule, dialogType } = this.props;

        let title = "";
        let buttons = {};

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
            <Dialog
                open={this.props.open}
            >
                <DialogTitle >{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        id="profileName"
                        label="프로파일 이름"
                        color="secondary"
                        value={profileSetModule.profileName}
                        onChange={this.handleChange("profileName")}
                        className={classNames(fullWidthClass)}
                        disabled={[ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)}
                    />
                    <TextField
                        id="profileComment"
                        label="프로파일 설명"
                        value={profileSetModule.profileComment}
                        onChange={this.handleChange("profileComment")}
                        className={classNames(fullWidthClass, itemRowClass)}
                        disabled={[ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)}
                    />
                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <div className={classNames(fullWidthClass, itemRowClass)}>
                            <FormLabel>기타 패키지 처리방식</FormLabel>
                            <RadioGroup name="is_removal" onChange={this.handleChangeRemoval('isRemoval')} value={profileSetModule.isRemoval} row>
                                <FormControlLabel value="true" control={<Radio />} label="삭제함" />
                                <FormControlLabel value="false" control={<Radio />} label="삭제안함" />
                            </RadioGroup>
                        </div>
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_VIEW || dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <TextField
                            id="clientId"
                            label="레퍼런스 단말"
                            value={profileSetModule.clientId}
                            onChange={this.handleChange("clientId")}
                            className={classNames(fullWidthClass, itemRowClass)}
                            disabled
                        />
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_ADD || dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
                        <div>
                            <TextField
                                id="clientId"
                                label="레퍼런스 단말"
                                value={profileSetModule.clientId}
                                placeholder="아래 목록에서 단말을 선택하세요."
                                onChange={this.handleChange("clientId")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                            <div className={itemRowClass}>
                                <GrClientSelector selectorType='single' 
                                    handleClientSelect={this.handleSelectClient} 
                                    height='220' />
                            </div>
                        </div>
                    }
                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <div>
                            <div className={labelClass}>
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

    profileSetModule: state.ClientProfileSetModule,
    dialogType: state.ClientProfileSetModule.dialogType,

});

const mapDispatchToProps = (dispatch) => ({

    ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(ClientProfileSetDialog);



