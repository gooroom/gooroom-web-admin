import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { withStyles } from '@material-ui/core/styles';

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


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

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

    handleValueChange = name => event => {
        this.props.ClientConfSettingActions.changeSelectedItemValue({
            name: name,
            value: event.target.checked
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

    handleAddNtp = () => {
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

        const selectedItem = ClientConfSettingProps.selectedItem;

        console.log('selectedItem : ', selectedItem);

        let pollingTime = '';
        let useHypervisor = false;
        let ntpAddrSelected = '';
        let ntpAddr = new Array();
        if(selectedItem && selectedItem.propList && selectedItem.propList.length > 0) {
            selectedItem.propList.forEach(function(e) {
                if(e.propNm == 'AGENTPOLLINGTIME') {
                    pollingTime = e.propValue;
                } else if(e.propNm == 'USEHYPERVISOR') {
                    useHypervisor = (e.propValue =="true");
                } else if(e.propNm == 'NTPSELECTADDRESS') {
                    ntpAddrSelected = e.propValue;
                } else if(e.propNm == 'NTPADDRESSES') {
                    ntpAddr.push(e.propValue);
                } 
            });
        }

        return (
            <Dialog open={ClientConfSettingProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(ClientConfSettingProps.selectedItem) ? ClientConfSettingProps.selectedItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(fullWidthClass, itemRowClass)}
                        disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientConfSettingDialog.TYPE_VIEW) &&
                        <Grid container spacing={24}>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    id="mrPollingTime"
                                    label="에이전트폴링주기(초)"
                                    value={(pollingTime !== '') ? pollingTime : ''}
                                    onChange={this.handleValueChange("mrPollingTime")}
                                    className={classNames(fullWidthClass, itemRowClass)}
                                    disabled={(dialogType === ClientConfSettingDialog.TYPE_VIEW)}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    label="운영체제 보호"
                                    value={(useHypervisor) ? '구동' : '중단'}
                                    className={classNames(fullWidthClass, itemRowClass)}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    }
                    {(dialogType === ClientConfSettingDialog.TYPE_EDIT || dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                id="mrPollingTime"
                                label="에이전트폴링주기(초)"
                                value={(pollingTime !== '') ? pollingTime : ''}
                                onChange={this.handleValueChange("mrPollingTime")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                            <div style={{marginTop:"10px"}}>
                                <FormLabel style={{marginRight:"50px"}}>운영체제 보호</FormLabel>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('osProtect')} value="osProtect" />
                                    }
                                    label={(useHypervisor) ? '구동' : '중단'}
                                />
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <FormLabel style={{marginRight:"20px"}}>NTP 서버로 사용할 주소정보</FormLabel>
                                <Button onClick={this.handleAddNtp} variant="outlined" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">추가</Button>
                                <List>
                                {ntpAddr.map(value => (
                                    <ListItem style={{paddingTop:"0px", paddingBottom:"0px"}}
                                    key={value}
                                    role={undefined}
                                    dense
                                    button
                                    
                                    
                                    >
                                    <Radio
                                        
                                        
                                        value={value}
                                        name="radio-button-demo"
                                    />
                                    <ListItemText primary={`Line item ${value + 1}`} />
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

