import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientRegKeyActions from 'modules/ClientRegKeyModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import GRAlert from 'components/GRComponents/GRAlert';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";

import {CopyToClipboard} from 'react-copy-to-clipboard'

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientRegKeyDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientRegKeyActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.ClientRegKeyActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { ClientRegKeyProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '단말등록키 등록',
                confirmMsg: '단말등록키를 등록하시겠습니까?',
                handleConfirmResult: this.handleCreateDataConfirmResult,
                confirmObject: ClientRegKeyProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleCreateDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientRegKeyProps, ClientRegKeyActions, compId } = this.props;
            ClientRegKeyActions.createClientRegKeyData({
                comment: paramObject.get('comment'),
                ipRange: paramObject.get('ipRange'),
                regKeyNo: paramObject.get('regKeyNo'),
                validDate: (new Date(paramObject.get('validDate'))).getTime(),
                expireDate: (new Date(paramObject.get('expireDate'))).getTime()
            }).then((res) => {
                ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, compId);
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { ClientRegKeyProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '단말등록키 수정',
                confirmMsg: '단말등록키를 수정하시겠습니까?',
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: ClientRegKeyProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleEditDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientRegKeyProps, ClientRegKeyActions, compId } = this.props;
            ClientRegKeyActions.editClientRegKeyData({
                comment: paramObject.get('comment'),
                ipRange: paramObject.get('ipRange'),
                regKeyNo: paramObject.get('regKeyNo'),
                validDate: (new Date(paramObject.get('validDate'))).getTime(),
                expireDate: (new Date(paramObject.get('expireDate'))).getTime()
            }).then((res) => {
                ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, compId);
                this.handleClose();
            });
        }
    }

    handleKeyGenerate = () => {
        this.props.ClientRegKeyActions.generateClientRegkey();
    }

    handleClickCopyKey = () => {
        this.props.GRAlertActions.showAlert({
            alertTitle: '복사',
            alertMsg: '단말등록키가 클립보드에 복사되었습니다. 붙여넣기 하실 수 있습니다.'
        });
    }

    render() {
        const { classes } = this.props;
        const { ClientRegKeyProps, compId } = this.props;
        const dialogType = ClientRegKeyProps.get('dialogType');
        const editingItem = (ClientRegKeyProps.get('editingItem')) ? ClientRegKeyProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientRegKeyDialog.TYPE_ADD) {
            title = "단말 등록키 등록";
        } else if(dialogType === ClientRegKeyDialog.TYPE_VIEW) {
            title = "단말 등록키 정보";
        } else if(dialogType === ClientRegKeyDialog.TYPE_EDIT) {
            title = "단말 등록키 수정";
        }

        return (
            <div>
            {(ClientRegKeyProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientRegKeyProps.get('dialogOpen')}>
            <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextValidator label="등록키" name="regKeyNo"
                                value={(editingItem.get('regKeyNo')) ? editingItem.get('regKeyNo'): ''}
                                onChange={this.handleValueChange("regKeyNo")}
                                validators={['required']}
                                errorMessages={['단말 등록키를 생성하세요.']}
                                className={classes.fullWidth} disabled
                            />
                        </Grid>
                        <Grid item xs={4} className={classes.createButton}>
                        {(dialogType === ClientRegKeyDialog.TYPE_ADD) && 
                          <Button className={classes.GRIconSmallButton} variant="contained" color="secondary"
                            style={{marginTop:20}}
                            onClick={() => { this.handleKeyGenerate(); }}
                            ><Add />키생성
                          </Button>
                        }
                        {(dialogType === ClientRegKeyDialog.TYPE_VIEW) &&
                        <CopyToClipboard text={(editingItem.get('regKeyNo')) ? editingItem.get('regKeyNo'): ''}
                            onCopy={this.handleClickCopyKey}
                        >
                            <Button className={classes.GRIconSmallButton} style={{padding:'0px 5px 0px 5px'}}
                                variant='contained' color="secondary">복사하기</Button>
                        </CopyToClipboard>
                        }
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={6}>
                        <TextField
                            label="유효날짜" type="date"
                            value={(editingItem.get('validDate')) ? formatDateToSimple(editingItem.get('validDate'), 'YYYY-MM-DD') : ''}
                            onChange={this.handleValueChange("validDate")}
                            className={classes.fullWidth}
                            disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            label="인증서만료날짜" type="date"
                            value={(editingItem.get('expireDate')) ? formatDateToSimple(editingItem.get('expireDate'), 'YYYY-MM-DD') : ''}
                            onChange={this.handleValueChange("expireDate")}
                            className={classes.fullWidth}
                            InputLabelProps={{ shrink: true }}
                            disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                        />
                        </Grid>
                    </Grid>

                    <TextValidator
                        label="유효 IP 범위" name="ipRange"
                        value={(editingItem.get('ipRange')) ? editingItem.get('ipRange') : ''}
                        onChange={this.handleValueChange("ipRange")}
                        validators={['required']} errorMessages={['유효 아이피를 입력하세요.']}
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
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classes.fullWidth}
                        disabled={(dialogType === ClientRegKeyDialog.TYPE_VIEW)}
                    />
                </DialogContent>
                <DialogActions>
                    
                {(dialogType === ClientRegKeyDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === ClientRegKeyDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>

                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientRegKeyProps: state.ClientRegKeyModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientRegKeyDialog));

