import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from "glamor";

import { withStyles } from '@material-ui/core/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from '/modules/ClientConfSettingModule';
import * as GrConfirmActions from '/modules/GrConfirmModule';

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

//
//  ## Style ########## ########## ########## ########## ##########
//
const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  });

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

const bullet = css({
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  }).toString();

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
        const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
        ClientConfSettingActions.createClientConfSettingData(ClientConfSettingProps.editingItem)
        .then(() => {
                ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps.listParam);
                this.handleClose();
        }, (res) => {

        })
    }

    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말정책정보 수정',
            confirmMsg: '단말정책정보를 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
          });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
            ClientConfSettingActions.editClientConfSettingData(ClientConfSettingProps.editingItem)
                .then((res) => {
                ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps.listParam);
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

        const { ClientConfSettingProps } = this.props;
        const { dialogType, editingItem } = ClientConfSettingProps;

        let title = "";
        const bull = <span className={bullet}>•</span>;

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
                        value={(editingItem) ? editingItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingItem) ? editingItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(fullWidthClass, itemRowClass)}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientConfSettingDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24}>
                                <Grid item xs={6} sm={6}>
                                    <TextField
                                        label="에이전트폴링주기(초)"
                                        value={(editingItem) ? editingItem.pollingTime : ''}
                                        className={classNames(fullWidthClass, itemRowClass)}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <TextField
                                        label="운영체제 보호"
                                        value={(editingItem.useHypervisor) ? '구동' : '중단'}
                                        className={classNames(fullWidthClass, itemRowClass)}
                                        disabled
                                    />
                                </Grid> 
                            </Grid>
                            <TextField
                                label="선택된 NTP 서버 주소"
                                value={(editingItem.selectedNtpIndex > -1) ? editingItem.ntpAddress[editingItem.selectedNtpIndex] : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                            <TextField
                                label="NTP 서버로 사용할 주소정보"
                                multiline
                                value={(editingItem.ntpAddress.length > 0) ? editingItem.ntpAddress.join('\n') : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                        </div>                        
                    }
                    {(dialogType === ClientConfSettingDialog.TYPE_EDIT || dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                id="pollingTime"
                                label="에이전트폴링주기(초)"
                                value={(editingItem) ? editingItem.pollingTime : ''}
                                onChange={this.handleValueChange("pollingTime")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                            <div style={{marginTop:"10px"}}>
                                <FormLabel style={{marginRight:"50px"}}>{bull} 운영체제 보호</FormLabel>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('useHypervisor')} 
                                        checked={(editingItem) ? editingItem.useHypervisor : false}
                                        color="primary" />
                                    }
                                    label={(editingItem.useHypervisor) ? '구동' : '중단'}
                                />
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <FormLabel style={{marginRight:"20px"}}>{bull} NTP 서버로 사용할 주소정보</FormLabel>
                                <Button onClick={this.handleAddNtp} variant="outlined" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">추가</Button>
                                <List>
                                {editingItem.ntpAddress && editingItem.ntpAddress.length > 0 && editingItem.ntpAddress.map((value, index) => (
                                    <ListItem style={{paddingTop:"0px", paddingBottom:"0px"}} key={index} >
                                        <Radio value={index.toString()} name="radio-button-demo" 
                                            checked={editingItem.selectedNtpIndex != -1 && editingItem.selectedNtpIndex === index}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ClientConfSettingDialog));

