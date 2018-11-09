import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import SoftwareFilterViewer from './SoftwareFilterViewer';
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
import InputLabel from '@material-ui/core/InputLabel';
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

class SoftwareFilterDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT = 'INHERIT';
    static TYPE_COPY = 'COPY';

    static SW_LIST = [
        {no:1, tag:'chromium.desktop', name:'Chromium Web Browser', name_kr:'Chromium 웹 브라우저'},
        {no:2, tag:'galculator.desktop', name:'Galculator', name_kr:'계산기'},
        {no:3, tag:'gooroom-browser.desktop', name:'Gooroom Web Browser', name_kr:'Gooroom 웹 브라우저'},
        {no:4, tag:'gooroom-control-center.desktop', name:'Gooroom Control Center', name_kr:'제어판'},
        {no:5, tag:'gooroom-security-status-settings.desktop', name:'Gooroom Management Settings', name_kr:'구름 관리 설정'},
        {no:6, tag:'gooroom-security-status-view.desktop', name:'Gooroom Security Status View', name_kr:'구름 보안 상태 보기'},
        {no:7, tag:'gooroom-toolkit.desktop', name:'Gooroom Toolkit', name_kr:'구름 도구모음'},
        {no:8, tag:'gooroomupdate.desktop', name:'Update Manager', name_kr:'업데이트 관리자'},
        {no:9, tag:'grac-editor.desktop', name:'Grac Editor', name_kr:'매체제어 편집기'},
        {no:10, tag:'hwpviewer.desktop', name:'Hancom Office Hwp 2014 Viewer', name_kr:'한컴오피스 한글 2014 뷰어'},
        {no:11, tag:'org.gnome.FileRoller.desktop', name:'Archive Manager', name_kr:'압축 관리자'},
        {no:12, tag:'org.gnome.Nautilus.desktop', name:'Files', name_kr:'파일 관리자'},
        {no:13, tag:'org.gnome.Totem.desktop', name:'Videos', name_kr:'동영상'},
        {no:14, tag:'scratch.desktop', name:'scratch-3.0', name_kr:'스크래치 3.0'},
        {no:15, tag:'synaptic.desktop', name:'Synaptic Package Manager', name_kr:'시냅틱 패키지 관리자'},
        {no:16, tag:'xfce4-screenshooter.desktop', name:'Screenshot', name_kr:'스크린샷'},
        {no:17, tag:'xfce4-terminal.desktop', name:'Xfce Terminal', name_kr:'터미널'},
        {no:18, tag:'veyon-master.desktop', name:'Veyon Master', name_kr:'Veyon Master'}
    ];

    handleClose = (event) => {
        this.props.SoftwareFilterActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.SoftwareFilterActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleSoftwareValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.SoftwareFilterActions.setEditingSoftwareItemValue({
            name: name,
            value: value
        });
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.SoftwareFilterActions.setBluetoothMac({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { SoftwareFilterProps, GRConfirmActions } = this.props;
        const re = GRConfirmActions.showConfirm({
            confirmTitle: 'Software제한정책정보 등록',
            confirmMsg: 'Software제한정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: SoftwareFilterProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { SoftwareFilterProps, SoftwareFilterActions } = this.props;
            SoftwareFilterActions.createSoftwareFilterData(SoftwareFilterProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(SoftwareFilterProps, SoftwareFilterActions.readSoftwareFilterListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { SoftwareFilterProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: 'Software제한정책정보 수정',
            confirmMsg: 'Software제한정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: SoftwareFilterProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { SoftwareFilterProps, SoftwareFilterActions } = this.props;
            SoftwareFilterActions.editSoftwareFilterData(SoftwareFilterProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(SoftwareFilterProps, SoftwareFilterActions.readSoftwareFilterListPaged);
                    this.handleClose();
                });
        }
    }

    handleInheritSaveData = (event, id) => {
        const { SoftwareFilterProps, DeptProps, SoftwareFilterActions, compId } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        SoftwareFilterActions.inheritSoftwareFilterData({
            'objId': SoftwareFilterProps.getIn(['editingItem', 'objId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: 'Software제한정책이 하위 조직에 적용되었습니다.'
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { SoftwareFilterProps, SoftwareFilterActions } = this.props;
        SoftwareFilterActions.cloneSoftwareFilterData({
            'objId': SoftwareFilterProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: 'Software제한정책을 복사하였습니다.'
            });
            refreshDataListInComps(SoftwareFilterProps, SoftwareFilterActions.readSoftwareFilterListPaged);
            this.handleClose();
        });
    }

    handleAddBluetoothMac = () => {
        const { SoftwareFilterActions } = this.props;
        SoftwareFilterActions.addBluetoothMac();
    }

    handleDeleteBluetoothMac = index => event => {
        const { SoftwareFilterActions } = this.props;
        SoftwareFilterActions.deleteBluetoothMac(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { SoftwareFilterProps } = this.props;
        const dialogType = SoftwareFilterProps.get('dialogType');
        const editingItem = (SoftwareFilterProps.get('editingItem')) ? SoftwareFilterProps.get('editingItem') : null;

        let title = "";
        if(dialogType === SoftwareFilterDialog.TYPE_ADD) {
            title = "Software제한정책설정 등록";
        } else if(dialogType === SoftwareFilterDialog.TYPE_VIEW) {
            title = "Software제한정책설정 정보";
        } else if(dialogType === SoftwareFilterDialog.TYPE_EDIT) {
            title = "Software제한정책설정 수정";
        } else if(dialogType === SoftwareFilterDialog.TYPE_INHERIT) {
            title = "Software제한정책설정 상속";
        } else if(dialogType === SoftwareFilterDialog.TYPE_COPY) {
            title = "Software제한정책설정 복사";
        }

        return (
            <div>
            {(SoftwareFilterProps.get('dialogOpen') && editingItem) &&
            <Dialog open={SoftwareFilterProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === SoftwareFilterDialog.TYPE_EDIT || dialogType === SoftwareFilterDialog.TYPE_ADD) &&
                    <div>

                    <TextField label="이름" value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === SoftwareFilterDialog.TYPE_VIEW)}
                    />
                    <TextField label="설명" value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === SoftwareFilterDialog.TYPE_VIEW)}
                    />
                    {(dialogType === SoftwareFilterDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} >
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
                        </div>                        
                    }
                    {(dialogType === SoftwareFilterDialog.TYPE_EDIT || dialogType === SoftwareFilterDialog.TYPE_ADD) &&
                        <div style={{marginTop:20}}>
                        <InputLabel>설치불가(설치금지)로 지정할 소프트웨어를 선택하세요.</InputLabel>
                        <Grid container alignItems="center" direction="row" justify="space-between" style={{marginTop:10}}>
                        {SoftwareFilterDialog.SW_LIST && SoftwareFilterDialog.SW_LIST.map(n => {
                                return (
                                    <Grid item xs={6} key={n.no}>
                                    <FormControlLabel label={n.name}
                                        control={<Checkbox onChange={this.handleSoftwareValueChange(n.tag)} color="primary"
                                            checked={this.checkAllow(editingItem.getIn(['SWITEM', n.tag]))}
                                        />}                                
                                    />
                                    </Grid>
                                );
                            })
                        }
                        </Grid>
                        </div>
                    }
                    </div>
                    }
                    {(dialogType === SoftwareFilterDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            이 설정을 하위 조직에 적용 하시겠습니까?
                        </Typography>
                        <SoftwareFilterViewer viewItem={editingItem} />
                        </div>
                    }
                    {(dialogType === SoftwareFilterDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <SoftwareFilterViewer viewItem={editingItem} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === SoftwareFilterDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === SoftwareFilterDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                {(dialogType === SoftwareFilterDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">적용</Button>
                }
                {(dialogType === SoftwareFilterDialog.TYPE_COPY) &&
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
    SoftwareFilterProps: state.SoftwareFilterModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SoftwareFilterDialog));

