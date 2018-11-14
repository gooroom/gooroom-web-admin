import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import ClientConfSettingSpec from './ClientConfSettingSpec';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import FormLabel from '@material-ui/core/FormLabel';
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
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientConfSettingDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.ClientConfSettingActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.ClientConfSettingActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleNtpValueChange = index => event => {
        this.props.ClientConfSettingActions.setNtpValue({
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
        const { ClientConfSettingProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말정책정보 등록',
            confirmMsg: '단말정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: ClientConfSettingProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
            ClientConfSettingActions.createClientConfSettingData(ClientConfSettingProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { ClientConfSettingProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말정책정보 수정',
            confirmMsg: '단말정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: ClientConfSettingProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
            ClientConfSettingActions.editClientConfSettingData(ClientConfSettingProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
                    this.handleClose();
                });
        }
    }

    handleCopyCreateData = (event, id) => {
        const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
        ClientConfSettingActions.cloneClientConfSettingData({
            'objId': ClientConfSettingProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '단말정책정보를 복사하였습니다.'
            });
            refreshDataListInComps(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
            this.handleClose();
        });
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
        const bull = <span className={classes.bullet}>•</span>;

        const { ClientConfSettingProps } = this.props;
        const dialogType = ClientConfSettingProps.get('dialogType');
        const editingItem = (ClientConfSettingProps.get('editingItem')) ? ClientConfSettingProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientConfSettingDialog.TYPE_ADD) {
            title = "단말정책설정 등록";
        } else if(dialogType === ClientConfSettingDialog.TYPE_VIEW) {
            title = "단말정책설정 정보";
        } else if(dialogType === ClientConfSettingDialog.TYPE_EDIT) {
            title = "단말정책설정 수정";
        } else if(dialogType === ClientConfSettingDialog.TYPE_COPY) {
            title = "단말정책설정 복사";
        }

        return (
            <div>
            {(ClientConfSettingProps.get('dialogOpen') && editingItem) &&
            <Dialog open={ClientConfSettingProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientConfSettingDialog.TYPE_EDIT || dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                    <div>
                        <TextField label="이름" className={classes.fullWidth}
                            value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            onChange={this.handleValueChange("objNm")} />
                        <TextField label="설명" className={classes.fullWidth}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")} />

                        <div style={{marginTop:"10px"}}>
                            <FormLabel style={{marginRight:"50px"}}>{bull} 운영체제 보호</FormLabel>
                            <FormControlLabel
                                control={
                                <Switch onChange={this.handleValueChange('useHypervisor')} 
                                    checked={(editingItem.get('useHypervisor')) ? editingItem.get('useHypervisor') : false}
                                    color="primary" />
                                }
                                label={(editingItem.get('useHypervisor')) ? '구동' : '중단'}
                            />
                        </div>
                        <div style={{marginTop:"10px"}}>
                            <FormLabel style={{marginRight:"50px"}}>{bull} 홈폴더 초기화</FormLabel>
                            <FormControlLabel
                                control={
                                <Switch onChange={this.handleValueChange('useHomeReset')} 
                                    checked={(editingItem.get('useHomeReset')) ? editingItem.get('useHomeReset') : false}
                                    color="primary" />
                                }
                                label={(editingItem.get('useHomeReset')) ? '실행' : '중단'}
                            />
                        </div>
                        <div style={{marginTop:"10px"}}>
                            <FormLabel style={{marginRight:"20px"}}>{bull} NTP 서버로 사용할 주소정보</FormLabel>
                            <Button onClick={this.handleAddNtp} variant="contained" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">추가</Button>
                            <List>
                            {editingItem.get('ntpAddress') && editingItem.get('ntpAddress').size > 0 && editingItem.get('ntpAddress').map((value, index) => (
                                <ListItem style={{paddingTop:"0px", paddingBottom:"0px"}} key={index} >
                                    <Radio value={index.toString()} name="radio-button-demo" 
                                        checked={editingItem.get('selectedNtpIndex') != -1 && editingItem.get('selectedNtpIndex') === index}
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
                    {(dialogType === ClientConfSettingDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <ClientConfSettingSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === ClientConfSettingDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                {(dialogType === ClientConfSettingDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">복사</Button>
                }

                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                <GRConfirm />
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientConfSettingDialog));

