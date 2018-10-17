import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientRegKeyActions from 'modules/ClientRegKeyModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Add from "@material-ui/icons/Add";

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
        GRConfirmActions.showConfirm({
            confirmTitle: '단말등록키 등록',
            confirmMsg: '단말등록키를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateDataConfirmResult,
            confirmObject: ClientRegKeyProps.get('editingItem')
        });
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
        GRConfirmActions.showConfirm({
            confirmTitle: '단말등록키 수정',
            confirmMsg: '단말등록키를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditDataConfirmResult,
            confirmObject: ClientRegKeyProps.get('editingItem')
        });
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
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                
                    <form noValidate autoComplete="off" className={classes.dialogContainer}>
                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextField label="등록키"
                                value={(editingItem.get('regKeyNo')) ? editingItem.get('regKeyNo'): ''}
                                onChange={this.handleValueChange("regKeyNo")}
                                className={classes.fullWidth} disabled
                            />
                        </Grid>
                        <Grid item xs={4} className={classes.createButton}>
                        {(dialogType === ClientRegKeyDialog.TYPE_ADD) && 
                          <Button className={classes.GRIconSmallButton} variant="contained" color="secondary"
                            onClick={() => { this.handleKeyGenerate(); }}
                            ><Add />키생성
                          </Button>
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

                    <TextField
                        label="유효 IP 범위"
                        value={(editingItem.get('ipRange')) ? editingItem.get('ipRange') : ''}
                        onChange={this.handleValueChange("ipRange")}
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
                </form>
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
            </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientRegKeyProps: state.ClientRegKeyModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientRegKeyDialog));

