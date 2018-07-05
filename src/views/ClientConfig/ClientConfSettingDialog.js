import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from '../../modules/ClientConfSettingModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { css } from "glamor";

import { formatDateToSimple } from '../../components/GrUtils/GrDates';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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
class ClientConfSettingDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientConfSettingActions.closeDialog({
            dialogOpen: false
        });
    }

    handleChange = name => event => {
        this.props.ClientConfSettingActions.changeParamValue({
            name: name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
        ClientConfSettingActions.createClientConfSettingData(ClientConfSettingProps.selectedItem)
            .then(() => {
                ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps.listParam);
                this.handleClose();
        }, (res) => {
            // console.log('error...', res);
        })
    }

    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말등록키 수정',
            confirmMsg: '단말등록키를 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
          });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
            ClientConfSettingActions.editClientConfSettingData(ClientConfSettingProps.selectedItem)
                .then((res) => {
                ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps.listParam);
                this.handleClose();
            }, (res) => {
                //console.log('error...', res);
            })
        }
    }

    handleKeyGenerate = () => {
        this.props.ClientConfSettingActions.generateClientConfSetting();
    }

    render() {

        const { ClientConfSettingProps } = this.props;
        const { dialogType } = ClientConfSettingProps;
        let title = "";

        if(dialogType === ClientConfSettingDialog.TYPE_ADD) {
            title = "단말정책설정 등록";
        } else if(dialogType === ClientConfSettingDialog.TYPE_VIEW) {
            title = "단말정책설정 정보";
        } else if(dialogType === ClientConfSettingDialog.TYPE_EDIT) {
            title = "단말정책설정 수정";
        }

        return (
            <Dialog open={ClientConfSettingProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        id="objNm"
                        label="이름"
                        margin="normal"
                        value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.objNm : ''}
                        onChange={this.handleChange("objNm")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        margin="normal"
                        value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.comment : ''}
                        onChange={this.handleChange("comment")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="mrPollingTime"
                        label="에이전트폴링주기(초)"
                        margin="normal"
                        value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.mrPollingTime : ''}
                        onChange={this.handleChange("mrPollingTime")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    <FormControlLabel
                        control={<Switch
                            checked={ClientConfSettingProps.selectedItem.osProtect}
                            onChange={this.handleChange('osProtect')}
                            value="osProtect"
                        />}
                        label="Antoine Llorca"
                    />

                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextField
                                id="regKeyNo"
                                label="등록키"
                                value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.regKeyNo: ''}
                                onChange={this.handleChange("regKeyNo")}
                                margin="normal"
                                className={fullWidthClass}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4} className={keyCreateBtnClass}>
                           <Button
                            variant="raised"
                            color="secondary"
                            onClick={() => {
                                this.handleKeyGenerate();
                            }}
                            style={{display: dialogType === ClientConfSettingDialog.TYPE_ADD ? 'block' : 'none' }}
                            ><Add />키생성
                            </Button>
                        </Grid>
                  </Grid>

                    <Grid container spacing={16}>
                        <Grid item xs={6}>
                        <TextField
                            id="validDate"
                            label="유효날짜"
                            type="date"
                            margin="normal"
                            value={(ClientConfSettingProps.selectedItem) ? formatDateToSimple(ClientConfSettingProps.selectedItem.validDate, 'YYYY-MM-DD') : ''}
                            onChange={this.handleChange("validDate")}
                            className={fullWidthClass}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            id="date"
                            label="인증서만료날짜"
                            type="date"
                            margin="normal"
                            value={(ClientConfSettingProps.selectedItem) ? formatDateToSimple(ClientConfSettingProps.selectedItem.expireDate, 'YYYY-MM-DD') : ''}
                            onChange={this.handleChange("expireDate")}
                            className={fullWidthClass}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                        />
                        </Grid>
                    </Grid>

                    <TextField
                        id="ipRange"
                        label="유효 IP 범위"
                        value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.ipRange : ''}
                        onChange={this.handleChange("ipRange")}
                        margin="normal"
                        className={fullWidthClass}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    <FormLabel disabled={true}>
                        <i>여러개인 경우 콤마(.) 로 구분, 또는 "-" 로 영역 설정 가능합니다.</i>
                    </FormLabel><br />
                    <FormLabel disabled={true}>
                        <i>(샘플) "127.0.0.1, 169.0.0.1" 또는 "127.0.0.1 - 127.0.0.10"</i>
                    </FormLabel>
                    <TextField
                        id="comment"
                        label="설명"
                        margin="normal"
                        value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.comment : ''}
                        onChange={this.handleChange("comment")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />

                </form>

                <DialogActions>
                    
                {(dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientConfSettingDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>

                </DialogActions>
            </Dialog>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientConfSettingDialog);

