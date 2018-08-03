import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MediaControlSettingActions from 'modules/MediaControlSettingModule';
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
class MediaControlSettingDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.MediaControlSettingActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.MediaControlSettingActions.setEditingItemValue({
                name: name,
                value: event.target.checked
            });
        } else {
            this.props.MediaControlSettingActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.MediaControlSettingActions.setSelectedNtpValue({
            index: index,
            value: event.target.value
        });
    }

    handleChangeSelectedNtp = (name, index) => event => {
        this.props.MediaControlSettingActions.setEditingItemValue({
            name: name,
            value: index
        });
    }

    handleCreateData = (event) => {
        const { MediaControlSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말정책정보 등록',
            confirmMsg: '단말정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: MediaControlSettingProps.editingItem
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { MediaControlSettingProps, MediaControlSettingActions } = this.props;
            MediaControlSettingActions.createMediaControlSettingData(MediaControlSettingProps.editingItem)
                .then((res) => {
                    const { viewItems } = MediaControlSettingProps;
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.listParam) {
                                MediaControlSettingActions.readMediaControlSettingList(getMergedObject(element.listParam, {
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
        const { MediaControlSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '단말정책정보 수정',
            confirmMsg: '단말정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: MediaControlSettingProps.editingItem
          });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { MediaControlSettingProps, MediaControlSettingActions } = this.props;

            MediaControlSettingActions.editMediaControlSettingData(MediaControlSettingProps.editingItem)
                .then((res) => {

                    const { editingCompId, viewItems } = MediaControlSettingProps;
                    viewItems.forEach((element) => {
                        if(element && element.listParam) {
                            MediaControlSettingActions.readMediaControlSettingList(getMergedObject(element.listParam, {
                                compId: element._COMPID_
                            }));
                        }
                    });

                    MediaControlSettingActions.getMediaControlSetting({
                        compId: editingCompId,
                        objId: paramObject.objId
                    });

                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleAddBluetoothMac = () => {
        const { MediaControlSettingActions } = this.props;
        MediaControlSettingActions.addBluetoothMac();
    }

    handleDeleteBluetoothMac = index => event => {
        const { MediaControlSettingActions } = this.props;
        MediaControlSettingActions.deleteBluetoothMac(index);
    }

    render() {
        const { classes } = this.props;
        const { MediaControlSettingProps } = this.props;
        const { dialogType, editingItem } = MediaControlSettingProps;

        const editingViewItem = editingItem;

        let title = "";
        const bull = <span className={classes.bullet}>•</span>;

        if(dialogType === MediaControlSettingDialog.TYPE_ADD) {
            title = "매체제어정책설정 등록";
        } else if(dialogType === MediaControlSettingDialog.TYPE_VIEW) {
            title = "매체제어정책설정 정보";
        } else if(dialogType === MediaControlSettingDialog.TYPE_EDIT) {
            title = "매체제어정책설정 수정";
        }

        return (
            <Dialog open={MediaControlSettingProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingViewItem) ? editingViewItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === MediaControlSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingViewItem) ? editingViewItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === MediaControlSettingDialog.TYPE_VIEW)}
                    />
                    {(dialogType === MediaControlSettingDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} className={classes.grNormalTableRow}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="USB메모리"
                                        value={(editingViewItem.useHypervisor) ? '허가' : '금지'}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                        disabled
                                    />
                                    <Checkbox
                                        checked={editingViewItem.usbReadonly}
                                        value="checkedA"
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
                    {(dialogType === MediaControlSettingDialog.TYPE_EDIT || dialogType === MediaControlSettingDialog.TYPE_ADD) &&
                        <div className={classes.dialogItemRowBig}>
                        
                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                            <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                <Switch onChange={this.handleValueChange('usbMemory')} 
                                    checked={(editingViewItem) ? editingViewItem.usbMemory : false}
                                    color="primary" />
                                }
                                label={(editingViewItem.usbMemory) ? 'USB 메모리 허가' : 'USB 메모리 금지'}
                            />
                            </Grid>
                            <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={editingViewItem.usbReadonly}
                                    onChange={this.handleValueChange('usbReadonly')}
                                    value="1"
                                />
                                }
                                label="Readonly"
                            />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('cdAndDvd')} 
                                        checked={(editingViewItem) ? editingViewItem.cdAndDvd : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.cdAndDvd) ? 'CD/DVD 허가' : 'CD/DVD 금지'}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('printer')} 
                                        checked={(editingViewItem) ? editingViewItem.printer : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.printer) ? '프린터 허가' : '프린터 금지'}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('screenCapture')} 
                                        checked={(editingViewItem) ? editingViewItem.screenCapture : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.screenCapture) ? '화면캡쳐 허가' : '화면캡쳐 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('camera')} 
                                        checked={(editingViewItem) ? editingViewItem.camera : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.camera) ? '카메라 허가' : '카메라 금지'}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('sound')} 
                                        checked={(editingViewItem) ? editingViewItem.sound : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.sound) ? '사운드(소리, 마이크) 허가' : '사운드(소리, 마이크) 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('wireless')} 
                                        checked={(editingViewItem) ? editingViewItem.wireless : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.wireless) ? '무선랜 허가' : '무선랜 금지'}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('keyboard')} 
                                        checked={(editingViewItem) ? editingViewItem.keyboard : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.keyboard) ? 'USB키보드 허가' : 'USB키보드 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('mouse')} 
                                        checked={(editingViewItem) ? editingViewItem.mouse : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.mouse) ? 'USB마우스 허가' : 'USB마우스 금지'}
                                />
                            </Grid>
                        </Grid>
                        
                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('bluetooth')} 
                                        checked={(editingViewItem) ? editingViewItem.bluetooth : false}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.bluetooth) ? '블루투스 허가' : '블루투스 금지'}
                                />
                            </Grid>
                            <Grid item xs={8} >

                            <FormLabel >{bull} 연결가능 블루투스 Mac 주소</FormLabel>
                            <Button size="small" variant="contained" color="primary" 
                                className={classes.smallIconButton}
                                onClick={this.handleAddBluetoothMac}
                            >
                                <AddIcon />
                            </Button>
                            <List>
                            {editingViewItem.bluetoothMac && editingViewItem.bluetoothMac.length > 0 && editingViewItem.bluetoothMac.map((value, index) => (
                                <ListItem key={index} >
                                    <Input value={value} onChange={this.handleBluetoothMacValueChange(index)}/>
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={this.handleDeleteBluetoothMac(index)} aria-label="NtpDelete">
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            </List>


                            </Grid>
                        </Grid>

                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === MediaControlSettingDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === MediaControlSettingDialog.TYPE_EDIT) &&
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
    MediaControlSettingProps: state.MediaControlSettingModule
});

const mapDispatchToProps = (dispatch) => ({
    MediaControlSettingActions: bindActionCreators(MediaControlSettingActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(MediaControlSettingDialog));

