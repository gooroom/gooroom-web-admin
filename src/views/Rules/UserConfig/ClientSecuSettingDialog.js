import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientSecuSettingActions from 'modules/ClientSecuSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import AddIcon from '@material-ui/icons/Add';

import Radio from '@material-ui/core/Radio';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientSecuSettingDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientSecuSettingActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.ClientSecuSettingActions.setEditingItemValue({
                name: name,
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.ClientSecuSettingActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.ClientSecuSettingActions.setBluetoothMac({
            index: index,
            value: event.target.value
        });
    }

    handleChangeSelectedNtp = (name, index) => event => {
        this.props.ClientSecuSettingActions.setEditingItemValue({
            name: name,
            value: index
        });
    }

    handleCreateData = (event) => {
        const { ClientSecuSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말보안정책정보 등록',
            confirmMsg: '단말보안정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: ClientSecuSettingProps.editingItem
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientSecuSettingProps, ClientSecuSettingActions } = this.props;
            ClientSecuSettingActions.createClientSecuSettingData(ClientSecuSettingProps.editingItem)
                .then((res) => {
                    const { viewItems } = ClientSecuSettingProps;
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.listParam) {
                                ClientSecuSettingActions.readClientSecuSettingList(getMergedObject(element.listParam, {
                                    compId: element._COMPID_
                                }));
                            }
                        });
                    }
                    this.handleClose();
                }, (res) => {
            })
        }
    }

    handleEditData = (event, id) => {
        const { ClientSecuSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말보안정책정보 수정',
            confirmMsg: '단말보안정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: ClientSecuSettingProps.editingItem
          });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientSecuSettingProps, ClientSecuSettingActions } = this.props;

            ClientSecuSettingActions.editClientSecuSettingData(ClientSecuSettingProps.editingItem)
                .then((res) => {

                    const { editingCompId, viewItems } = ClientSecuSettingProps;
                    viewItems.forEach((element) => {
                        if(element && element.listParam) {
                            ClientSecuSettingActions.readClientSecuSettingList(getMergedObject(element.listParam, {
                                compId: element._COMPID_
                            }));
                        }
                    });

                    // 아래 정보 조회는 효과 없음. - 보여줄 인폼 객체가 안보이는 상태임.
                    // ClientSecuSettingActions.getClientSecuSetting({
                    //     compId: editingCompId,
                    //     objId: paramObject.objId
                    // });

                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleAddBluetoothMac = () => {
        const { ClientSecuSettingActions } = this.props;
        ClientSecuSettingActions.addBluetoothMac();
    }

    handleDeleteBluetoothMac = index => event => {
        const { ClientSecuSettingActions } = this.props;
        ClientSecuSettingActions.deleteBluetoothMac(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const { ClientSecuSettingProps } = this.props;
        const { dialogType, editingItem } = ClientSecuSettingProps;

        const editingViewItem = editingItem;

        let title = "";
        const bull = <span className={classes.bullet}>•</span>;

        if(dialogType === ClientSecuSettingDialog.TYPE_ADD) {
            title = "단말보안정책설정 등록";
        } else if(dialogType === ClientSecuSettingDialog.TYPE_VIEW) {
            title = "단말보안정책설정 정보";
        } else if(dialogType === ClientSecuSettingDialog.TYPE_EDIT) {
            title = "단말보안정책설정 수정";
        }

        return (
            <Dialog open={ClientSecuSettingProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingViewItem) ? editingViewItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === ClientSecuSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingViewItem) ? editingViewItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === ClientSecuSettingDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientSecuSettingDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} className={classes.grNormalTableRow}>
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
                        </div>                        
                    }
                    {(dialogType === ClientSecuSettingDialog.TYPE_EDIT || dialogType === ClientSecuSettingDialog.TYPE_ADD) &&
                        <div className={classes.dialogItemRowBig}>

                            <Grid item xs={12} container 
                                alignItems="flex-end" direction="row" justify="space-between" 
                                className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                                <Grid item xs={5}>
                                    <TextField
                                        label="화면보호기 설정시간(분)"
                                        multiline
                                        value={(editingViewItem.screenTime) ? editingViewItem.screenTime : ''}
                                        onChange={this.handleValueChange("screenTime")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={5} >
                                    <TextField
                                        label="패스워드 변경주기(일)"
                                        multiline
                                        value={(editingViewItem.passwordTime) ? editingViewItem.passwordTime : ''}
                                        onChange={this.handleValueChange("passwordTime")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    />
                                </Grid>
                            </Grid>
                            
                            <div className={classes.dialogItemRow}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('packageHandle')} 
                                        checked={this.checkAllow(editingViewItem.packageHandle)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.packageHandle == 'allow') ? '패키지추가/삭제 기능차단' : '패키지추가/삭제 기능사용'}
                                />
                            </div>
                            <Divider />
                            <div className={classes.dialogItemRow}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('state')} 
                                        checked={this.checkAllow(editingViewItem.state)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.state == 'allow') ? '전체네트워크허용' : '전체네트워크차단'}
                                />
                            </div>

                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === ClientSecuSettingDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientSecuSettingDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
                </DialogActions>
                <GrConfirm />
            </Dialog>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientSecuSettingProps: state.ClientSecuSettingModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientSecuSettingActions: bindActionCreators(ClientSecuSettingActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientSecuSettingDialog));
