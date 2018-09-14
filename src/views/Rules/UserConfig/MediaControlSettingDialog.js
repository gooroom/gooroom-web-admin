import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MediaControlSettingActions from 'modules/MediaControlSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

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
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.MediaControlSettingActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.MediaControlSettingActions.setBluetoothMac({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { MediaControlSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '매체제어정책정보 등록',
            confirmMsg: '매체제어정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: MediaControlSettingProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { MediaControlSettingProps, MediaControlSettingActions } = this.props;
            MediaControlSettingActions.createMediaControlSettingData(MediaControlSettingProps.get('editingItem'))
                .then((res) => {
                    const viewItems = MediaControlSettingProps.get('viewItems');
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.get('listParam')) {
                                MediaControlSettingActions.readMediaControlSettingList(MediaControlSettingProps, element.get('_COMPID_'), {});
                            }
                        });
                    }
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { MediaControlSettingProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '매체제어정책정보 수정',
            confirmMsg: '매체제어정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: MediaControlSettingProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { MediaControlSettingProps, MediaControlSettingActions } = this.props;
            MediaControlSettingActions.editMediaControlSettingData(MediaControlSettingProps.get('editingItem'))
                .then((res) => {
                    const viewItems = MediaControlSettingProps.get('viewItems');
                    viewItems.forEach((element) => {
                        if(element && element.get('listParam')) {
                            MediaControlSettingActions.readMediaControlSettingList(MediaControlSettingProps, element.get('_COMPID_'), {});
                        }
                    });
                    this.handleClose();
                });
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

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { MediaControlSettingProps } = this.props;
        const dialogType = MediaControlSettingProps.get('dialogType');
        const editingItem = (MediaControlSettingProps.get('editingItem')) ? MediaControlSettingProps.get('editingItem') : null;

        let title = "";
        if(dialogType === MediaControlSettingDialog.TYPE_ADD) {
            title = "매체제어정책설정 등록";
        } else if(dialogType === MediaControlSettingDialog.TYPE_VIEW) {
            title = "매체제어정책설정 정보";
        } else if(dialogType === MediaControlSettingDialog.TYPE_EDIT) {
            title = "매체제어정책설정 수정";
        }

        return (
            <div>
            {(MediaControlSettingProps.get('dialogOpen') && editingItem) &&
            <Dialog open={MediaControlSettingProps.get('dialogOpen')} scroll="paper">
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === MediaControlSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === MediaControlSettingDialog.TYPE_VIEW)}
                    />
                    {(dialogType === MediaControlSettingDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} className={classes.grNormalTableRow}>
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
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
                                    checked={this.checkAllow(editingItem.get('usbMemory'))}
                                    color="primary" />
                                }
                                label={(editingItem.get('usbMemory')) ? 'USB 메모리 허가' : 'USB 메모리 금지'}
                            />
                            </Grid>
                            <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                <Checkbox onChange={this.handleValueChange('usbReadonly')}
                                    checked={this.checkAllow(editingItem.get('usbReadonly'))}
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
                                        checked={this.checkAllow(editingItem.get('cdAndDvd'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('cdAndDvd') == 'allow') ? 'CD/DVD 허가' : 'CD/DVD 금지'}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('printer')} 
                                        checked={this.checkAllow(editingItem.get('printer'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('printer') == 'allow') ? '프린터 허가' : '프린터 금지'}
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
                                        checked={this.checkAllow(editingItem.get('screenCapture'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('screenCapture') == 'allow') ? '화면캡쳐 허가' : '화면캡쳐 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('camera')} 
                                        checked={this.checkAllow(editingItem.get('camera'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('camera') == 'allow') ? '카메라 허가' : '카메라 금지'}
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
                                        checked={this.checkAllow(editingItem.get('sound'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('sound') == 'allow') ? '사운드(소리, 마이크) 허가' : '사운드(소리, 마이크) 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('wireless')} 
                                        checked={this.checkAllow(editingItem.get('wireless'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('wireless') == 'allow') ? '무선랜 허가' : '무선랜 금지'}
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
                                        checked={this.checkAllow(editingItem.get('keyboard'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('keyboard') == 'allow') ? 'USB키보드 허가' : 'USB키보드 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('mouse')} 
                                        checked={this.checkAllow(editingItem.get('mouse'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('mouse') == 'allow') ? 'USB마우스 허가' : 'USB마우스 금지'}
                                />
                            </Grid>
                        </Grid>
                        
                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('bluetoothState')} 
                                        checked={this.checkAllow(editingItem.get('bluetoothState'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('bluetoothState') == 'allow') ? '블루투스 허가' : '블루투스 금지'}
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
                                <div>
                                    <List>
                                    {editingItem.get('macAddress') && editingItem.get('macAddress').size > 0 && editingItem.get('macAddress').map((value, index) => (
                                        <ListItem key={index} >
                                            <Input value={value} onChange={this.handleBluetoothMacValueChange(index)}/>
                                            <ListItemSecondaryAction>
                                                <IconButton onClick={this.handleDeleteBluetoothMac(index)}>
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                    </List>
                                </div>
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
            }
            </div>
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

