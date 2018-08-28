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

    handleChangeSelectedNtp = (name, index) => event => {
        this.props.MediaControlSettingActions.setEditingItemValue({
            name: name,
            value: index
        });
    }

    handleCreateData = (event) => {
        const { MediaControlSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '매체제어정책정보 등록',
            confirmMsg: '매체제어정책정보를 등록하시겠습니까?',
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
            confirmTitle: '매체제어정책정보 수정',
            confirmMsg: '매체제어정책정보를 수정하시겠습니까?',
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

                    // 아래 정보 조회는 효과 없음. - 보여줄 인폼 객체가 안보이는 상태임.
                    // MediaControlSettingActions.getMediaControlSetting({
                    //     compId: editingCompId,
                    //     objId: paramObject.objId
                    // });

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

    checkAllow = value => {
        return (value == 'allow');
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
                                    checked={this.checkAllow(editingViewItem.usbMemory)}
                                    color="primary" />
                                }
                                label={(editingViewItem.usbMemory) ? 'USB 메모리 허가' : 'USB 메모리 금지'}
                            />
                            </Grid>
                            <Grid item xs={6}>


                            <FormControlLabel
                                control={
                                <Checkbox onChange={this.handleValueChange('usbReadonly')}
                                    checked={this.checkAllow(editingViewItem.usbReadonly)}
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
                                        checked={this.checkAllow(editingViewItem.cdAndDvd)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.cdAndDvd == 'allow') ? 'CD/DVD 허가' : 'CD/DVD 금지'}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('printer')} 
                                        checked={this.checkAllow(editingViewItem.printer)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.printer == 'allow') ? '프린터 허가' : '프린터 금지'}
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
                                        checked={this.checkAllow(editingViewItem.screenCapture)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.screenCapture == 'allow') ? '화면캡쳐 허가' : '화면캡쳐 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('camera')} 
                                        checked={this.checkAllow(editingViewItem.camera)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.camera == 'allow') ? '카메라 허가' : '카메라 금지'}
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
                                        checked={this.checkAllow(editingViewItem.sound)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.sound == 'allow') ? '사운드(소리, 마이크) 허가' : '사운드(소리, 마이크) 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('wireless')} 
                                        checked={this.checkAllow(editingViewItem.wireless)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.wireless == 'allow') ? '무선랜 허가' : '무선랜 금지'}
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
                                        checked={this.checkAllow(editingViewItem.keyboard)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.keyboard == 'allow') ? 'USB키보드 허가' : 'USB키보드 금지'}
                                />
                            </Grid>

                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('mouse')} 
                                        checked={this.checkAllow(editingViewItem.mouse)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.mouse == 'allow') ? 'USB마우스 허가' : 'USB마우스 금지'}
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
                                        checked={this.checkAllow(editingViewItem.bluetoothState)}
                                        color="primary" />
                                    }
                                    label={(editingViewItem.bluetoothState == 'allow') ? '블루투스 허가' : '블루투스 금지'}
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
                                    {editingViewItem.macAddress && editingViewItem.macAddress.length > 0 && editingViewItem.macAddress.map((value, index) => (
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

