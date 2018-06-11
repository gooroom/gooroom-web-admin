import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as clientProfileSetActions from '../../modules/clientProfileSetModule';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withTheme } from "@material-ui/core/styles";

import { css } from "glamor";

import { grRequestPromise } from "../../components/GrUtils/GrRequester";
import { formatDateToSimple, formatSimpleStringToStartTime, formatSimpleStringToEndTime } from '../../components/GrUtils/GrDates';
import GrClientSelector from '../../components/GrComponents/GrClientSelector';


import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Divider from "@material-ui/core/Divider";

import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";

//
//  ## Style ########## ########## ########## ########## ##########
//
const theme = createMuiTheme();
const containerClass = css({
    margin: "0px 30px !important",
    minHeight: 300,
    minWidth: 500
}).toString();

const titleClass = css({
    backgroundColor: theme.palette.primary
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

const buttonClass = css({
    margin: theme.spacing.unit + " !important"
}).toString();

const leftIconClass = css({
    marginRight: theme.spacing.unit + " !important"
}).toString();

const keyCreateBtnClass = css({
    paddingTop: 24 + " !important"
}).toString();



const labelClass = css({
    height: "25px",
    marginTop: "10px"
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
        
        this.props.ClientProfileSetActions.createClientProfileSetData({
            client_id: this.props.clientId,
            profile_nm: this.props.profileName,
            profile_cmt: this.props.profileComment
        }).then((res) => {
            this.props.ClientProfileSetActions.readClientProfileSetList(
                {
                    keyword: this.props.keyword,
                    page: this.props.page,
                    rowsPerPage: this.props.rowsPerPage,
                    length: this.props.rowsPerPage,
                    orderColumn: this.props.orderColumn,
                    orderDir: this.props.orderDir
                }
            );
            this.handleClose();
        }, (res) => {
            //console.log('error...', res);
        })
    }

    handleEditData = (event) => {

        this.props.ClientProfileSetActions.editClientProfileSetData({
            profile_no: this.props.selectedItem.profileNo,
            client_id: this.props.clientId,
            profile_nm: this.props.profileName,
            profile_cmt: this.props.profileComment
        }).then((res) => {
            this.props.ClientProfileSetActions.readClientProfileSetList(
                {
                    keyword: this.props.keyword,
                    page: this.props.page,
                    rowsPerPage: this.props.rowsPerPage,
                    length: this.props.rowsPerPage,
                    orderColumn: this.props.orderColumn,
                    orderDir: this.props.orderDir
                }
            );
            this.handleClose();
        }, (res) => {
            //console.log('error...', res);
        })
    }

    handleChange = name => event => {
        if(name == 'validDate' || name == 'expireDate') {
            //this.state.handleProfileSetChangeData(name, formatSimpleStringToEndTime(event.target.value));
        } else {
            this.props.ClientProfileSetActions.changeParamValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleSelectClient = (value) => {
        this.props.ClientProfileSetActions.changeParamValue({
            name: 'clientId',
            value: value.clientId
        });
    }

    handleSelectTargetClient = (value) => {

        const { targetClient } = this.props;
        const currentIndex = targetClient.indexOf(value);
        const newChecked = [...targetClient];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        this.props.GrClientSelectorActions.changeParamValue({
          name: 'targetClient',
          value: newChecked
        });
    }

    handleSelectTargetGroup = (value) => {
        
    }

    render() {

        const { profileName, profileComment, clientId, targetClient, dialogType, handleProfileSetChangeData } = this.props;
        //const { bindActions } = this.props;
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
                <DialogTitle className={titleClass}>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        id="profileName2"
                        label="프로파일 이름"
                        value={profileName}
                        onChange={this.handleChange("profileName")}
                        className={fullWidthClass}
                        disabled={[ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)}
                    />
                    <TextField
                        id="profileComment"
                        label="프로파일 설명"
                        value={profileComment}
                        onChange={this.handleChange("profileComment")}
                        className={fullWidthClass}
                        disabled={[ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)}
                    />
                    <TextField
                        id="clientId"
                        label="단말아이디 (레퍼런스)"
                        value={clientId}
                        onChange={this.handleChange("clientId")}
                        className={fullWidthClass}
                        disabled={[ClientProfileSetDialog.TYPE_VIEW, ClientProfileSetDialog.TYPE_PROFILE].includes(dialogType)}
                    />
                    {(dialogType === ClientProfileSetDialog.TYPE_PROFILE) &&
                        <div>
                            <div className={labelClass}>
                                <InputLabel >대상 단말</InputLabel>
                            </div>
                            <GrClientSelector selectorType='multiple' handleSelect={this.handleSelectTargetClient} handleGroupSelect={this.handleSelectTargetGroup}/>
                        </div>
                    }
    
                </form>

                <Divider />
                {(dialogType === ClientProfileSetDialog.TYPE_ADD) &&
                    <GrClientSelector selectorType='single' handleSelect={this.handleSelectClient}/>
                }
                {(dialogType === ClientProfileSetDialog.TYPE_EDIT) &&
                    <GrClientSelector selectorType='single' handleSelect={this.handleSelectClient}/>
                }
                <Divider />

                <DialogActions>
                    
                <Button onClick={this.handleCreateData} color="secondary" style={{display: dialogType === ClientProfileSetDialog.TYPE_ADD ? 'block' : 'none' }}>등록</Button>
                <Button onClick={this.handleEditData} color="secondary" style={{display: dialogType === ClientProfileSetDialog.TYPE_EDIT ? 'block' : 'none' }}>저장</Button>
                <Button onClick={this.handleClose} color="primary">닫기</Button>

                </DialogActions>
            </Dialog>
        );
    }
}

//export default withTheme()(ClientProfileSetDialog);
const mapStateToProps = (state) => ({

    selectedItem: state.clientProfileSetModule.selectedItem, 
    
    profileName: state.clientProfileSetModule.profileName,
    profileComment: state.clientProfileSetModule.profileComment,
    clientId: state.clientProfileSetModule.clientId,
    targetClient: state.clientProfileSetModule.targetClient,

    dialogType: state.clientProfileSetModule.dialogType,

    keyword: state.clientProfileSetModule.keyword,
    page: state.clientProfileSetModule.page,
    rowsPerPage: state.clientProfileSetModule.rowsPerPage,
    length: state.clientProfileSetModule.length,
    orderColumn: state.clientProfileSetModule.orderColumn,
    orderDir: state.clientProfileSetModule.orderDir,

});

const mapDispatchToProps = (dispatch) => ({
    ClientProfileSetActions: bindActionCreators(clientProfileSetActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientProfileSetDialog);



