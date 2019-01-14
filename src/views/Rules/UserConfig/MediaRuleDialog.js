import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import MediaRuleSpec from './MediaRuleSpec';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Typography from "@material-ui/core/Typography";
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import AddIcon from '@material-ui/icons/Add';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class MediaRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT = 'INHERIT';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.MediaRuleActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.MediaRuleActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.MediaRuleActions.setBluetoothMac({
            index: index,
            value: event.target.value
        });
    }

    handleSerialNoValueChange = index => event => {
        this.props.MediaRuleActions.setSerialNo({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { MediaRuleProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '매체제어정책정보 등록',
                confirmMsg: '매체제어정책정보를 등록하시겠습니까?',
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: MediaRuleProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { MediaRuleProps, MediaRuleActions } = this.props;
            MediaRuleActions.createMediaRuleData(MediaRuleProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(MediaRuleProps, MediaRuleActions.readMediaRuleListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { MediaRuleProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '매체제어정책정보 수정',
                confirmMsg: '매체제어정책정보를 수정하시겠습니까?',
                handleConfirmResult: this.handleEditConfirmResult,
                confirmObject: MediaRuleProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { MediaRuleProps, MediaRuleActions } = this.props;
            MediaRuleActions.editMediaRuleData(MediaRuleProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(MediaRuleProps, MediaRuleActions.readMediaRuleListPaged);
                    this.handleClose();
                });
        }
    }

    handleInheritSaveData = (event, id) => {
        const { MediaRuleProps, DeptProps, MediaRuleActions, compId } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        MediaRuleActions.inheritMediaRuleData({
            'objId': MediaRuleProps.getIn(['editingItem', 'objId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: '매체제어정책이 하위 조직에 적용되었습니다.'
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { MediaRuleProps, MediaRuleActions } = this.props;
        MediaRuleActions.cloneMediaRuleData({
            'objId': MediaRuleProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: '매체제어정책을 복사하였습니다.'
            });
            refreshDataListInComps(MediaRuleProps, MediaRuleActions.readMediaRuleListPaged);
            this.handleClose();
        });
    }

    handleAddBluetoothMac = () => {
        const { MediaRuleActions } = this.props;
        MediaRuleActions.addBluetoothMac();
    }

    handleDeleteBluetoothMac = index => event => {
        const { MediaRuleActions } = this.props;
        MediaRuleActions.deleteBluetoothMac(index);
    }

    handleAddSerialNo = () => {
        const { MediaRuleActions } = this.props;
        MediaRuleActions.addSerialNo();
    }

    handleDeleteSerialNo = index => event => {
        const { MediaRuleActions } = this.props;
        MediaRuleActions.deleteSerialNo(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { MediaRuleProps } = this.props;
        const dialogType = MediaRuleProps.get('dialogType');
        const editingItem = (MediaRuleProps.get('editingItem')) ? MediaRuleProps.get('editingItem') : null;

        let title = "";
        if(dialogType === MediaRuleDialog.TYPE_ADD) {
            title = "매체제어정책설정 등록";
        } else if(dialogType === MediaRuleDialog.TYPE_VIEW) {
            title = "매체제어정책설정 정보";
        } else if(dialogType === MediaRuleDialog.TYPE_EDIT) {
            title = "매체제어정책설정 수정";
        } else if(dialogType === MediaRuleDialog.TYPE_INHERIT) {
            title = "매체제어정책설정 상속";
        } else if(dialogType === MediaRuleDialog.TYPE_COPY) {
            title = "매체제어정책설정 복사";
        }

        return (
            <div>
            {(MediaRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={MediaRuleProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === MediaRuleDialog.TYPE_EDIT || dialogType === MediaRuleDialog.TYPE_ADD) &&
                    <div>
                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                        <Grid item xs={12} sm={4} md={4}>
                        <TextValidator label={t("lbName")} value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            name="objNm" validators={['required']} errorMessages={[t("msgInputName")]}
                            onChange={this.handleValueChange("objNm")}
                            className={classes.fullWidth}
                        />
                        </Grid>
                        <Grid item xs={12} sm={8} md={8}>
                        <TextField label={t("lbDesc")} value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")}
                            className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        />
                        </Grid>
                    </Grid>
                    {(dialogType === MediaRuleDialog.TYPE_EDIT || dialogType === MediaRuleDialog.TYPE_ADD) &&
                        <div>
                        <Grid container alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={3}>
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('cdAndDvd')} 
                                        checked={this.checkAllow(editingItem.get('cdAndDvd'))}
                                        color="primary" />}
                                    label={(editingItem.get('cdAndDvd') == 'allow') ? 'CD/DVD 허가' : 'CD/DVD 금지'}
                                />
                            </Grid>
                            <Grid item xs={3} >
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('printer')} 
                                        checked={this.checkAllow(editingItem.get('printer'))}
                                        color="primary" />}
                                    label={(editingItem.get('printer') == 'allow') ? '프린터 허가' : '프린터 금지'}
                                />
                            </Grid>
                            <Grid item xs={3} >
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('camera')} 
                                        checked={this.checkAllow(editingItem.get('camera'))}
                                        color="primary" />}
                                    label={(editingItem.get('camera') == 'allow') ? '카메라 허가' : '카메라 금지'}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={3}>
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('sound')} 
                                        checked={this.checkAllow(editingItem.get('sound'))}
                                        color="primary" />}
                                    label={(editingItem.get('sound') == 'allow') ? '사운드(소리, 마이크) 허가' : '사운드(소리, 마이크) 금지'}
                                />
                            </Grid>
                            <Grid item xs={3} >
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('wireless')} 
                                        checked={this.checkAllow(editingItem.get('wireless'))}
                                        color="primary" />}
                                    label={(editingItem.get('wireless') == 'allow') ? '무선랜 허가' : '무선랜 금지'}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('keyboard')} 
                                        checked={this.checkAllow(editingItem.get('keyboard'))}
                                        color="primary" />}
                                    label={(editingItem.get('keyboard') == 'allow') ? 'USB키보드 허가' : 'USB키보드 금지'}
                                />
                            </Grid>
                            <Grid item xs={3} >
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('mouse')} 
                                        checked={this.checkAllow(editingItem.get('mouse'))}
                                        color="primary" />}
                                    label={(editingItem.get('mouse') == 'allow') ? 'USB마우스 허가' : 'USB마우스 금지'}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="flex-start" direction="row" justify="space-between" >
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('bluetoothState')} 
                                    checked={this.checkAllow(editingItem.get('bluetoothState'))}
                                    color="primary" />}
                                    label={(editingItem.get('bluetoothState') == 'allow') ? '블루투스 허가' : '블루투스 금지'}
                                />
                                <FormLabel component="legend">연결가능 블루투스 Mac 주소
                                    <Button size="small" variant="contained" color="primary" style={{marginLeft:30}}
                                            className={classes.smallIconButton}
                                            onClick={this.handleAddBluetoothMac}
                                    ><AddIcon /></Button>
                                </FormLabel>
                                <div style={{maxHeight:140,overflow:'auto'}}>
                                    <List>
                                    {editingItem.get('macAddress') && editingItem.get('macAddress').size > 0 && editingItem.get('macAddress').map((value, index) => (
                                        <ListItem key={index} style={{padding:0}} >
                                            <Input value={value} onChange={this.handleBluetoothMacValueChange(index)} fullWidth={true} style={{padding:0}} />
                                            <IconButton onClick={this.handleDeleteBluetoothMac(index)}>
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                    </List>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel style={{heigth:32}}
                                    control={<Switch onChange={this.handleValueChange('usbMemory')}
                                        checked={this.checkAllow(editingItem.get('usbMemory'))}
                                        color="primary" />}
                                    label={(editingItem.get('usbMemory')) ? 'USB 메모리 허가' : 'USB 메모리 금지'}
                                />
                                <FormControlLabel label="Readonly" disabled={!(editingItem.get('usbMemory'))} style={{heigth:32}}
                                    control={<Checkbox onChange={this.handleValueChange('usbReadonly')} color="primary"
                                        checked={this.checkAllow(editingItem.get('usbReadonly'))}
                                    />}                                
                                />
                                <FormLabel component="legend">연결가능 USB 시리얼 정보
                                    <Button size="small" variant="contained" color="primary" style={{marginLeft:30}}
                                            className={classes.smallIconButton}
                                            onClick={this.handleAddSerialNo}
                                    ><AddIcon /></Button>
                                </FormLabel>
                                <div style={{maxHeight:140,overflow:'auto'}}>
                                    <List>
                                    {editingItem.get('usbSerialNo') && editingItem.get('usbSerialNo').size > 0 && editingItem.get('usbSerialNo').map((value, index) => (
                                        <ListItem key={index} style={{padding:0}} >
                                            <Input value={value} onChange={this.handleSerialNoValueChange(index)} fullWidth={true} style={{padding:0}} />
                                            <IconButton onClick={this.handleDeleteSerialNo(index)}>
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                    </List>
                                </div>
                            </Grid>
                        </Grid>


                        </div>
                    }
                    </div>
                    }
                    {(dialogType === MediaRuleDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <MediaRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === MediaRuleDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <MediaRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === MediaRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === MediaRuleDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === MediaRuleDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === MediaRuleDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("dtCopy")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
                <GRConfirm />
            </Dialog>
            }
            <GRAlert />
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    MediaRuleProps: state.MediaRuleModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(MediaRuleDialog));

