import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientRegKeyActions from '../../modules/ClientRegKeyModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { css } from "glamor";

import { formatDateToSimple, formatSimpleStringToStartTime, formatSimpleStringToEndTime } from '../../components/GrUtils/GrDates';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";

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
class ClientRegKeyDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientRegKeyActions.closeDialog({
            dialogOpen: false
        });
    }

    handleChange = name => event => {
        this.props.ClientRegKeyActions.changeParamValue({
            name: name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { ClientRegKeyProps, ClientRegKeyActions } = this.props;

        ClientRegKeyActions.createClientRegKeyData(ClientRegKeyProps.selectedItem)
            .then(() => {
                ClientRegKeyActions.readClientRegkeyList(ClientRegKeyProps.listParam);
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
            const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
            ClientRegKeyActions.editClientRegKeyData(ClientRegKeyProps.selectedItem).then((res) => {
                ClientRegKeyActions.readClientRegkeyList(ClientRegKeyProps.listParam);
                this.handleClose();
            }, (res) => {
                //console.log('error...', res);
            })
        }
    }

    handleKeyGenerate = () => {
        this.props.ClientRegKeyActions.generateClientRegkey();
    }

    render() {

        const { ClientRegKeyProps } = this.props;
        const { dialogType } = ClientRegKeyProps;
        let title = "";

        if(dialogType === ClientRegKeyDialog.TYPE_ADD) {
            title = "단말 등록키 등록";
        } else if(dialogType === ClientRegKeyDialog.TYPE_VIEW) {
            title = "단말 등록키 정보";
        } else if(dialogType === ClientRegKeyDialog.TYPE_EDIT) {
            title = "단말 등록키 수정";
        }

        return (
            <Dialog open={ClientRegKeyProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextField
                                id="regKeyNo"
                                label="등록키"
                                value={(ClientRegKeyProps.selectedItem) ? ClientRegKeyProps.selectedItem.regKeyNo: ''}
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
                            style={{display: dialogType === ClientRegKeyDialog.TYPE_ADD ? 'block' : 'none' }}
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
                            value={(ClientRegKeyProps.selectedItem) ? formatDateToSimple(ClientRegKeyProps.selectedItem.validDate, 'YYYY-MM-DD') : ''}
                            onChange={this.handleChange("validDate")}
                            className={fullWidthClass}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            id="date"
                            label="인증서만료날짜"
                            type="date"
                            margin="normal"
                            value={(ClientRegKeyProps.selectedItem) ? formatDateToSimple(ClientRegKeyProps.selectedItem.expireDate, 'YYYY-MM-DD') : ''}
                            onChange={this.handleChange("expireDate")}
                            className={fullWidthClass}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                        />
                        </Grid>
                    </Grid>

                    <TextField
                        id="ipRange"
                        label="유효 IP 범위"
                        value={(ClientRegKeyProps.selectedItem) ? ClientRegKeyProps.selectedItem.ipRange : ''}
                        onChange={this.handleChange("ipRange")}
                        margin="normal"
                        className={fullWidthClass}
                        disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
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
                        value={(ClientRegKeyProps.selectedItem) ? ClientRegKeyProps.selectedItem.comment : ''}
                        onChange={this.handleChange("comment")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                    />

                </form>

                <DialogActions>
                    
                {(dialogType === ClientRegKeyDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientRegKeyDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>

                </DialogActions>
            </Dialog>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientRegKeyProps: state.ClientRegKeyModule,
    grConfirmModule: state.GrConfirmModule,
});

const mapDispatchToProps = (dispatch) => ({
    ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientRegKeyDialog);

