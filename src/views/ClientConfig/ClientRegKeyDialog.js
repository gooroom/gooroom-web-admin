import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientRegKeyActions from 'modules/ClientRegKeyModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


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
        ClientRegKeyActions.createClientRegKeyData(ClientRegKeyProps.selectedViewItem)
            .then(() => {
                ClientRegKeyActions.readClientRegkeyList(ClientRegKeyProps.listParam);
                this.handleClose();
        }, (res) => {

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
            ClientRegKeyActions.editClientRegKeyData(ClientRegKeyProps.selectedViewItem)
                .then((res) => {
                ClientRegKeyActions.readClientRegkeyList(ClientRegKeyProps.listParam);
                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleKeyGenerate = () => {
        this.props.ClientRegKeyActions.generateClientRegkey();
    }

    render() {
        const { classes } = this.props;
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
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextField
                                id="regKeyNo"
                                label="등록키"
                                value={(ClientRegKeyProps.selectedViewItem) ? ClientRegKeyProps.selectedViewItem.regKeyNo: ''}
                                onChange={this.handleChange("regKeyNo")}
                                margin="normal"
                                className={classes.fullWidth}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4} className={classes.createButton}>
                        {(dialogType === ClientRegKeyDialog.TYPE_ADD) && 
                           <Button size="small"
                           variant="contained"
                            color="secondary"
                            onClick={() => {
                                this.handleKeyGenerate();
                            }}
                            ><Add />키생성
                            </Button>
                        }
                        </Grid>
                  </Grid>

                    <Grid container spacing={16}>
                        <Grid item xs={6}>
                        <TextField
                            id="validDate"
                            label="유효날짜"
                            type="date"
                            margin="normal"
                            value={(ClientRegKeyProps.selectedViewItem) ? formatDateToSimple(ClientRegKeyProps.selectedViewItem.validDate, 'YYYY-MM-DD') : ''}
                            onChange={this.handleChange("validDate")}
                            className={classes.fullWidth}
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
                            value={(ClientRegKeyProps.selectedViewItem) ? formatDateToSimple(ClientRegKeyProps.selectedViewItem.expireDate, 'YYYY-MM-DD') : ''}
                            onChange={this.handleChange("expireDate")}
                            className={classes.fullWidth}
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
                        value={(ClientRegKeyProps.selectedViewItem) ? ClientRegKeyProps.selectedViewItem.ipRange : ''}
                        onChange={this.handleChange("ipRange")}
                        margin="normal"
                        className={classes.fullWidth}
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
                        value={(ClientRegKeyProps.selectedViewItem) ? ClientRegKeyProps.selectedViewItem.comment : ''}
                        onChange={this.handleChange("comment")}
                        className={classes.fullWidth}
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
    ClientRegKeyProps: state.ClientRegKeyModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientRegKeyDialog));

