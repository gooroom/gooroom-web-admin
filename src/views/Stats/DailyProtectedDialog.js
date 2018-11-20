import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyProtectedActions from 'modules/DailyProtectedModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import DailyProtectedSpec from './DailyProtectedSpec';
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

class DailyProtectedDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT = 'INHERIT';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.DailyProtectedActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.DailyProtectedActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.DailyProtectedActions.setBluetoothMac({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { DailyProtectedProps, GRConfirmActions } = this.props;
        const re = GRConfirmActions.showConfirm({
            confirmTitle: '매체제어정책정보 등록',
            confirmMsg: '매체제어정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: DailyProtectedProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DailyProtectedProps, DailyProtectedActions } = this.props;
            DailyProtectedActions.createDailyProtectedData(DailyProtectedProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(DailyProtectedProps, DailyProtectedActions.readDailyProtectedList);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { DailyProtectedProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '매체제어정책정보 수정',
            confirmMsg: '매체제어정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: DailyProtectedProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DailyProtectedProps, DailyProtectedActions } = this.props;
            DailyProtectedActions.editDailyProtectedData(DailyProtectedProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(DailyProtectedProps, DailyProtectedActions.readDailyProtectedList);
                    this.handleClose();
                });
        }
    }

    handleInheritSaveData = (event, id) => {
        const { DailyProtectedProps, DeptProps, DailyProtectedActions, compId } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        DailyProtectedActions.inheritDailyProtectedData({
            'objId': DailyProtectedProps.getIn(['editingItem', 'objId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '매체제어정책이 하위 조직에 적용되었습니다.'
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { DailyProtectedProps, DailyProtectedActions } = this.props;
        DailyProtectedActions.cloneDailyProtectedData({
            'objId': DailyProtectedProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '매체제어정책을 복사하였습니다.'
            });
            refreshDataListInComps(DailyProtectedProps, DailyProtectedActions.readDailyProtectedList);
            this.handleClose();
        });
    }

    handleAddBluetoothMac = () => {
        const { DailyProtectedActions } = this.props;
        DailyProtectedActions.addBluetoothMac();
    }

    handleDeleteBluetoothMac = index => event => {
        const { DailyProtectedActions } = this.props;
        DailyProtectedActions.deleteBluetoothMac(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { DailyProtectedProps } = this.props;
        const dialogType = DailyProtectedProps.get('dialogType');
        const editingItem = (DailyProtectedProps.get('editingItem')) ? DailyProtectedProps.get('editingItem') : null;

        let title = "";
        if(dialogType === DailyProtectedDialog.TYPE_ADD) {
            title = "매체제어정책설정 등록";
        } else if(dialogType === DailyProtectedDialog.TYPE_VIEW) {
            title = "매체제어정책설정 정보";
        } else if(dialogType === DailyProtectedDialog.TYPE_EDIT) {
            title = "매체제어정책설정 수정";
        } else if(dialogType === DailyProtectedDialog.TYPE_INHERIT) {
            title = "매체제어정책설정 상속";
        } else if(dialogType === DailyProtectedDialog.TYPE_COPY) {
            title = "매체제어정책설정 복사";
        }

        return (
            <div>
            {(DailyProtectedProps.get('dialogOpen') && editingItem) &&
            <Dialog open={DailyProtectedProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === DailyProtectedDialog.TYPE_EDIT || dialogType === DailyProtectedDialog.TYPE_ADD) &&
                    <div>

                    <TextField label="이름" value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === DailyProtectedDialog.TYPE_VIEW)}
                    />
                    <TextField label="설명" value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === DailyProtectedDialog.TYPE_VIEW)}
                    />
                    {(dialogType === DailyProtectedDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} >
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
                        </div>                        
                    }
                    {(dialogType === DailyProtectedDialog.TYPE_EDIT || dialogType === DailyProtectedDialog.TYPE_ADD) &&
                        <div>
                        <Grid container alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={6}>
                            <FormControlLabel
                                control={<Switch onChange={this.handleValueChange('usbMemory')}
                                    checked={this.checkAllow(editingItem.get('usbMemory'))}
                                    color="primary" />}
                                label={(editingItem.get('usbMemory')) ? 'USB 메모리 허가' : 'USB 메모리 금지'}
                            />
                            </Grid>
                            <Grid item xs={6}>
                            <FormControlLabel label="Readonly"
                                control={<Checkbox onChange={this.handleValueChange('usbReadonly')} color="primary"
                                    checked={this.checkAllow(editingItem.get('usbReadonly'))}
                                />}                                
                            />
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('cdAndDvd')} 
                                        checked={this.checkAllow(editingItem.get('cdAndDvd'))}
                                        color="primary" />}
                                    label={(editingItem.get('cdAndDvd') == 'allow') ? 'CD/DVD 허가' : 'CD/DVD 금지'}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('printer')} 
                                        checked={this.checkAllow(editingItem.get('printer'))}
                                        color="primary" />}
                                    label={(editingItem.get('printer') == 'allow') ? '프린터 허가' : '프린터 금지'}
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('screenCapture')} 
                                        checked={this.checkAllow(editingItem.get('screenCapture'))}
                                        color="primary" />}
                                    label={(editingItem.get('screenCapture') == 'allow') ? '화면캡쳐 허가' : '화면캡쳐 금지'}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('camera')} 
                                        checked={this.checkAllow(editingItem.get('camera'))}
                                        color="primary" />}
                                    label={(editingItem.get('camera') == 'allow') ? '카메라 허가' : '카메라 금지'}
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('sound')} 
                                        checked={this.checkAllow(editingItem.get('sound'))}
                                        color="primary" />}
                                    label={(editingItem.get('sound') == 'allow') ? '사운드(소리, 마이크) 허가' : '사운드(소리, 마이크) 금지'}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('wireless')} 
                                        checked={this.checkAllow(editingItem.get('wireless'))}
                                        color="primary" />}
                                    label={(editingItem.get('wireless') == 'allow') ? '무선랜 허가' : '무선랜 금지'}
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center" direction="row" justify="space-between" >
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('keyboard')} 
                                        checked={this.checkAllow(editingItem.get('keyboard'))}
                                        color="primary" />}
                                    label={(editingItem.get('keyboard') == 'allow') ? 'USB키보드 허가' : 'USB키보드 금지'}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <FormControlLabel
                                    control={<Switch onChange={this.handleValueChange('mouse')} 
                                        checked={this.checkAllow(editingItem.get('mouse'))}
                                        color="primary" />}
                                    label={(editingItem.get('mouse') == 'allow') ? 'USB마우스 허가' : 'USB마우스 금지'}
                                />
                            </Grid>
                        </Grid>

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
                    }
                    </div>
                    }
                    {(dialogType === DailyProtectedDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            이 설정을 하위 조직에 적용 하시겠습니까?
                        </Typography>
                        <DailyProtectedSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === DailyProtectedDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <DailyProtectedSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === DailyProtectedDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === DailyProtectedDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                {(dialogType === DailyProtectedDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">적용</Button>
                }
                {(dialogType === DailyProtectedDialog.TYPE_COPY) &&
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
    DailyProtectedProps: state.DailyProtectedModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    DailyProtectedActions: bindActionCreators(DailyProtectedActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyProtectedDialog));

