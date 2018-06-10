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

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

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
    minHeight: 500,
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




//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientProfileSetDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    constructor(props) {

        super(props);

        this.state = {
            profileNo: "",
            profileName: "",
            profileComment: "",

            handleProfileSetChangeData: props.handleProfileSetChangeData,
            handleRefreshList: props.handleRefreshList
        }

        // this.handleClose = this.handleClose.bind(this);
        // this.handleAddData = this.handleAddData.bind(this);
        // this.handleSaveData = this.handleSaveData.bind(this);
    }

    handleClose = (event) => {
        this.props.ClientProfileSetActions.closeDialog({
            dialogType: ClientProfileSetDialog.TYPE_VIEW,
            dialogOpen: false
        });
    }

    handleAddData = (event) => {
        const re = this.props.ClientProfileSetActions.setClientProfileSetData({
            client_id: this.props.clientId,
            profile_nm: this.props.profileName,
            profile_cmt: this.props.profileComment
        });

        console.log(re);

        re.then((res) => {
            console.log('11111111111', res);
            this.props.ClientProfileSetActions.readClientProfileSetList();
            this.handleClose();
        }, (res) => {
            console.log('2222222222', res);
        })

        // grRequestPromise("/gpms/createProfileSet", 
        //     this.props.selectedItem
        //   ).then(res => {
        //       this.state.handleRefreshList();
        //       this.handleClose();
        //   }, res => {
        //     this.handleClose();
        // });        
    }

    handleSaveData() {
        grRequestPromise("/gpms/editProfileSetData", 
            this.props.selectedItem
          ).then(res => {
              this.handleClose();
          }, res => {
            this.handleClose();
        });        
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

    render() {

        const { profileName, profileComment, clientId, dialogType, handleProfileSetChangeData, handleRefreshList } = this.props;
        //const { bindActions } = this.props;
        let title = "";
        let buttons = {};

        if(dialogType === ClientProfileSetDialog.TYPE_ADD) {
            title = "단말 프로파일 등록";
            // editData = {
            //     comment: '',
            //     expireDate: (new Date()).setMonth((new Date()).getMonth() + 1),
            //     ipRange: '',
            //     profileNo: '',
            //     validDate: (new Date()).setMonth((new Date()).getMonth() + 1),
            //     comment: ''
            // }
        } else if(dialogType === ClientProfileSetDialog.TYPE_VIEW) {
            title = "단말 프로파일 정보";
        } else if(dialogType === ClientProfileSetDialog.TYPE_EDIT) {
            title = "단말 프로파일 수정";
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
                        disabled={(dialogType === ClientProfileSetDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="profileComment"
                        label="프로파일 설명"
                        value={profileComment}
                        onChange={this.handleChange("profileComment")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientProfileSetDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="clientId"
                        label="단말아이디 (임시)"
                        value={clientId}
                        onChange={this.handleChange("clientId")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientProfileSetDialog.TYPE_VIEW)}
                    />

                </form>

                <DialogActions>
                    
                <Button onClick={this.handleAddData} color="secondary" style={{display: dialogType === ClientProfileSetDialog.TYPE_ADD ? 'block' : 'none' }}>등록</Button>
                <Button onClick={this.handleSaveData} color="secondary" style={{display: dialogType === ClientProfileSetDialog.TYPE_EDIT ? 'block' : 'none' }}>저장</Button>
                <Button onClick={this.handleClose} color="primary">닫기</Button>

                </DialogActions>
            </Dialog>
        );
    }
}

//export default withTheme()(ClientProfileSetDialog);
const mapStateToProps = (state) => ({
    profileName: state.clientProfileSetModule.profileName,
    profileComment: state.clientProfileSetModule.profileComment,
    clientId: state.clientProfileSetModule.clientId,
    dialogType: state.clientProfileSetModule.dialogType
});

const mapDispatchToProps = (dispatch) => ({
    ClientProfileSetActions: bindActionCreators(clientProfileSetActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientProfileSetDialog);



