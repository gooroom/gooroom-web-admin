import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
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


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Radio from '@material-ui/core/Radio';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientConfSettingDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientConfSettingActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.ClientConfSettingActions.setEditingItemValue({
                name: name,
                value: event.target.checked
            });
        } else {
            this.props.ClientConfSettingActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleNtpValueChange = index => event => {
        this.props.ClientConfSettingActions.setSelectedNtpValue({
            index: index,
            value: event.target.value
        });
    }

    handleChangeSelectedNtp = (name, index) => event => {
        this.props.ClientConfSettingActions.setEditingItemValue({
            name: name,
            value: index
        });
    }

    handleCreateData = (event) => {
        const { ClientConfSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말정책정보 등록',
            confirmMsg: '단말정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: ClientConfSettingProps.editingItem
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
            ClientConfSettingActions.createClientConfSettingData(ClientConfSettingProps.editingItem)
                .then((res) => {
                    const { viewItems } = ClientConfSettingProps;
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.listParam) {
                                ClientConfSettingActions.readClientConfSettingList(getMergedObject(element.listParam, {
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
        const { ClientConfSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말정책정보 수정',
            confirmMsg: '단말정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: ClientConfSettingProps.editingItem
          });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientConfSettingProps, ClientConfSettingActions } = this.props;

            ClientConfSettingActions.editClientConfSettingData(ClientConfSettingProps.editingItem)
                .then((res) => {

                    const { editingCompId, viewItems } = ClientConfSettingProps;
                    viewItems.forEach((element) => {
                        if(element && element.listParam) {
                            ClientConfSettingActions.readClientConfSettingList(getMergedObject(element.listParam, {
                                compId: element._COMPID_
                            }));
                        }
                    });

                    ClientConfSettingActions.getClientConfSetting({
                        compId: editingCompId,
                        objId: paramObject.objId
                    });

                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleAddNtp = () => {
        const { ClientConfSettingActions } = this.props;
        ClientConfSettingActions.addNtpAddress();
    }

    handleDeleteNtp = index => event => {
        const { ClientConfSettingActions } = this.props;
        ClientConfSettingActions.deleteNtpAddress(index);
    }

    render() {
        const { classes } = this.props;
        const { ClientConfSettingProps } = this.props;
        const { dialogType, editingItem } = ClientConfSettingProps;

        const editingViewItem = editingItem;

        let title = "";
        const bull = <span className={classes.bullet}>•</span>;

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
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingViewItem) ? editingViewItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingViewItem) ? editingViewItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientConfSettingDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24}>
                                <Grid item xs={6} sm={6}>
                                    <TextField
                                        label="에이전트폴링주기(초)"
                                        value={(editingViewItem) ? editingViewItem.pollingTime : ''}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <TextField
                                        label="운영체제 보호"
                                        value={(editingViewItem.useHypervisor) ? '구동' : '중단'}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                        disabled
                                    />
                                </Grid> 
                            </Grid>
                            <TextField
                                label="선택된 NTP 서버 주소"
                                value={(editingViewItem.selectedNtpIndex > -1) ? editingViewItem.ntpAddress[editingViewItem.selectedNtpIndex] : ''}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                disabled
                            />
                            <TextField
                                label="NTP 서버로 사용할 주소정보"
                                multiline
                                value={(editingViewItem.ntpAddress.length > 0) ? editingViewItem.ntpAddress.join('\n') : ''}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                disabled
                            />
                        </div>                        
                    }
                    {(dialogType === ClientConfSettingDialog.TYPE_EDIT || dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                id="pollingTime"
                                label="에이전트폴링주기(초)"
                                value={(editingViewItem) ? editingViewItem.pollingTime : ''}
                                onChange={this.handleValueChange("pollingTime")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                            <div style={{marginTop:"10px"}}>
                                <FormLabel style={{marginRight:"50px"}}>{bull} 운영체제 보호</FormLabel>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('useHypervisor')} 
                                        checked={(editingViewItem) ? editingViewItem.useHypervisor : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.useHypervisor) ? '구동' : '중단'}
                                />
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <FormLabel style={{marginRight:"20px"}}>{bull} NTP 서버로 사용할 주소정보</FormLabel>
                                <Button onClick={this.handleAddNtp} variant="outlined" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">추가</Button>
                                <List>
                                {editingViewItem.ntpAddress && editingViewItem.ntpAddress.length > 0 && editingViewItem.ntpAddress.map((value, index) => (
                                    <ListItem style={{paddingTop:"0px", paddingBottom:"0px"}} key={index} >
                                        <Radio value={index.toString()} name="radio-button-demo" 
                                            checked={editingViewItem.selectedNtpIndex != -1 && editingViewItem.selectedNtpIndex === index}
                                            onChange={this.handleChangeSelectedNtp('selectedNtpIndex', index)}
                                        />
                                        <Input value={value} onChange={this.handleNtpValueChange(index)} style={{width:"100%"}} />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.handleDeleteNtp(index)} aria-label="NtpDelete">
                                            <DeleteForeverIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                </List>
                            </div>
                        </div>
                    }
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
                <GrConfirm />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientConfSettingDialog));

