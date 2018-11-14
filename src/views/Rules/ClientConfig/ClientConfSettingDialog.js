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
import LogLevelSelect from 'views/Options/LogLevelSelect';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Divider from "@material-ui/core/Divider";

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

    handleChangeLogLevelSelect = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.props.ClientConfSettingActions.setEditingItemValue({
            name: name,
            value: value
        });
    };


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
            <Dialog open={ClientConfSettingProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientConfSettingDialog.TYPE_EDIT || dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                    <div>
                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                            <Grid item xs={12} sm={4} md={4}>
                            <TextField label={"이름"} value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                                onChange={this.handleValueChange("objNm")}
                                className={classes.fullWidth}
                            />
                            </Grid>
                            <Grid item xs={12} sm={8} md={8}>
                            <TextField label="설명" value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                                onChange={this.handleValueChange("comment")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:0}}>
                            <Grid item xs={6}>
                                <div style={{marginTop:"10px"}}>
                                    <FormLabel style={{marginRight:"50px"}}>{bull} 운영체제 보호</FormLabel>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('useHypervisor')} color="primary"
                                            checked={(editingItem.get('useHypervisor')) ? editingItem.get('useHypervisor') : false} />
                                        }
                                        label={(editingItem.get('useHypervisor')) ? '구동' : '중단'}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{marginTop:"10px"}}>
                                    <FormLabel style={{marginRight:"50px"}}>{bull} 홈폴더 초기화</FormLabel>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('useHomeReset')} color="primary"
                                            checked={(editingItem.get('useHomeReset')) ? editingItem.get('useHomeReset') : false} />
                                        }
                                        label={(editingItem.get('useHomeReset')) ? '실행' : '중단'}
                                    />
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={0} alignItems="flex-end" direction="row" justify="space-between" style={{margin:'0 0 16 0'}}>
                            <Grid item xs={12} sm={3} md={3}>
                            <TextField label={"단말로그 보관일수"} value={(editingItem.get('logRemainDate')) ? editingItem.get('logRemainDate') : ''}
                                onChange={this.handleValueChange("logRemainDate")}
                                className={classes.fullWidth}
                            />
                            <Typography variant="caption">'0' 으로 설정시 삭제하지 않음</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3}>
                            <TextField label="로그파일 최대크기(MB)" value={(editingItem.get('logMaxSize')) ? editingItem.get('logMaxSize') : ''}
                                onChange={this.handleValueChange("logMaxSize")}
                                className={classNames(classes.fullWidth)}
                            />
                            <Typography variant="caption">최대크기에 도달하면 새로운 파일을 생성</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3}>
                            <TextField label="보관할 로그파일 갯수" value={(editingItem.get('logMaxCount')) ? editingItem.get('logMaxCount') : ''}
                                onChange={this.handleValueChange("logMaxCount")}
                                className={classNames(classes.fullWidth)}
                            />
                            <Typography variant="caption">갯수가 초과되면 오래된 파일을 삭제</Typography>
                            </Grid>
                        </Grid>

                        <FormLabel >{bull} 서버 전송 로그 레벨(수준)</FormLabel>
                        <Table style={{margin:'4 0 16 0'}}>
                            <TableBody>
                                <TableRow>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">BOOT</InputLabel>
                                    <LogLevelSelect name="transmit_boot" 
                                        value={(editingItem.get('transmit_boot')) ? editingItem.get('transmit_boot') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">OS</InputLabel>
                                    <LogLevelSelect name="transmit_os" 
                                        value={(editingItem.get('transmit_os')) ? editingItem.get('transmit_os') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">EXE(IMA)</InputLabel>
                                    <LogLevelSelect name="transmit_exe" 
                                        value={(editingItem.get('transmit_exe')) ? editingItem.get('transmit_exe') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">MEDIA</InputLabel>
                                    <LogLevelSelect name="transmit_media" 
                                        value={(editingItem.get('transmit_media')) ? editingItem.get('transmit_media') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">AGENT</InputLabel>
                                    <LogLevelSelect name="transmit_agent" 
                                        value={(editingItem.get('transmit_agent')) ? editingItem.get('transmit_agent') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <FormLabel >{bull} 단말 알림 로그 레벨(수준)</FormLabel>
                        <Table style={{margin:'4 0 16 0'}}>
                            <TableBody>
                                <TableRow>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">BOOT</InputLabel>
                                    <LogLevelSelect name="notify_boot" 
                                        value={(editingItem.get('notify_boot')) ? editingItem.get('notify_boot') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">OS</InputLabel>
                                    <LogLevelSelect name="notify_os" 
                                        value={(editingItem.get('notify_os')) ? editingItem.get('notify_os') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">EXE(IMA)</InputLabel>
                                    <LogLevelSelect name="notify_exe" 
                                        value={(editingItem.get('notify_exe')) ? editingItem.get('notify_exe') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">MEDIA</InputLabel>
                                    <LogLevelSelect name="notify_media" 
                                        value={(editingItem.get('notify_media')) ? editingItem.get('notify_media') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">AGENT</InputLabel>
                                    <LogLevelSelect name="notify_agent" 
                                        value={(editingItem.get('notify_agent')) ? editingItem.get('notify_agent') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <FormLabel >{bull} 서버 경고 표시 레벨(수준)</FormLabel>
                        <Table style={{margin:'4 0 8 0'}}>
                            <TableBody>
                                <TableRow>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">BOOT</InputLabel>
                                    <LogLevelSelect name="show_boot" 
                                        value={(editingItem.get('show_boot')) ? editingItem.get('show_boot') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">OS</InputLabel>
                                    <LogLevelSelect name="show_os" 
                                        value={(editingItem.get('show_os')) ? editingItem.get('show_os') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">EXE(IMA)</InputLabel>
                                    <LogLevelSelect name="show_exe" 
                                        value={(editingItem.get('show_exe')) ? editingItem.get('show_exe') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">MEDIA</InputLabel>
                                    <LogLevelSelect name="show_media" 
                                        value={(editingItem.get('show_media')) ? editingItem.get('show_media') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                <TableCell style={{width:'20%'}} component="th" scope="row">
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="client-status">AGENT</InputLabel>
                                    <LogLevelSelect name="show_agent" 
                                        value={(editingItem.get('show_agent')) ? editingItem.get('show_agent') : ""}
                                        onChangeSelect={this.handleChangeLogLevelSelect}
                                    />
                                </FormControl>
                                </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <div style={{marginTop:"10px"}}>
                            <FormLabel style={{marginRight:"20px"}}>{bull} NTP 서버로 사용할 주소정보</FormLabel>
                            <Button onClick={this.handleAddNtp} variant="contained" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">추가</Button>
                            <div style={{maxHeight:200,overflow:'auto'}}>
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

