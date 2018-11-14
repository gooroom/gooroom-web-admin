import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import DesktopConfSpec from './DesktopConfSpec';
import DesktopAppSelector from './DesktopAppSelector';

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

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import AddIcon from '@material-ui/icons/Add';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class DesktopConfDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT = 'INHERIT';
    static TYPE_COPY = 'COPY';

    componentDidMount() {
        this.props.DesktopConfActions.readThemeInfoList();
    }

    handleClose = (event) => {
        this.props.DesktopConfActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.DesktopConfActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleBluetoothMacValueChange = index => event => {
        this.props.DesktopConfActions.setBluetoothMac({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { DesktopConfProps, GRConfirmActions } = this.props;
        const re = GRConfirmActions.showConfirm({
            confirmTitle: '데스크톱정보 등록',
            confirmMsg: '데스크톱정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: DesktopConfProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DesktopConfProps, DesktopConfActions } = this.props;
            DesktopConfActions.createDesktopConfData(DesktopConfProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(DesktopConfProps, DesktopConfActions.readDesktopConfListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { DesktopConfProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '데스크톱정보 수정',
            confirmMsg: '데스크톱정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: DesktopConfProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DesktopConfProps, DesktopConfActions } = this.props;
            DesktopConfActions.editDesktopConfData(DesktopConfProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(DesktopConfProps, DesktopConfActions.readDesktopConfListPaged);
                    this.handleClose();
                });
        }
    }

    handleInheritSaveData = (event, id) => {
        const { DesktopConfProps, DeptProps, DesktopConfActions, compId } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        DesktopConfActions.inheritDesktopConfData({
            'confId': DesktopConfProps.getIn(['editingItem', 'confId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '데스크톱정보가 하위 조직에 적용되었습니다.'
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { DesktopConfProps, DesktopConfActions } = this.props;
        DesktopConfActions.cloneDesktopConfData({
            'confId': DesktopConfProps.getIn(['editingItem', 'confId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '데스크톱정보를 복사하였습니다.'
            });
            refreshDataListInComps(DesktopConfProps, DesktopConfActions.readDesktopConfListPaged);
            this.handleClose();
        });
    }

    render() {
        const { classes } = this.props;

        const { DesktopConfProps, DesktopAppProps, compId } = this.props;
        const dialogType = DesktopConfProps.get('dialogType');
        const editingItem = (DesktopConfProps.get('editingItem')) ? DesktopConfProps.get('editingItem') : null;
        const selectedThemeId = (editingItem && editingItem.get('themeId')) ? editingItem.get('themeId') : '';
        const themeListData = DesktopConfProps.get('themeListData');

        // const appListAllData = DesktopAppProps.getIn(['viewItems', compId, 'listAllData']);
        // const appListAllData = DesktopAppProps.get('listAllData');
        // let allAppPaneWidth = 0;
        // if(appListAllData && appListAllData.size > 0) {
        //     allAppPaneWidth = appListAllData.size * (120 + 16) + 40;
        // }

        let title = "";
        if(dialogType === DesktopConfDialog.TYPE_ADD) {
            title = "데스크톱정보 등록";
        } else if(dialogType === DesktopConfDialog.TYPE_VIEW) {
            title = "데스크톱정보 정보";
        } else if(dialogType === DesktopConfDialog.TYPE_EDIT) {
            title = "데스크톱정보 수정";
        } else if(dialogType === DesktopConfDialog.TYPE_INHERIT) {
            title = "데스크톱정보 상속";
        } else if(dialogType === DesktopConfDialog.TYPE_COPY) {
            title = "데스크톱정보 복사";
        }

        return (
            <div>
            {(DesktopConfProps.get('dialogOpen') && editingItem) &&
            <Dialog open={DesktopConfProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === DesktopConfDialog.TYPE_EDIT || dialogType === DesktopConfDialog.TYPE_ADD) &&
                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                            <Grid item xs={8} >
                                <TextField label="이름" value={(editingItem.get('confNm')) ? editingItem.get('confNm') : ''}
                                    onChange={this.handleValueChange("confNm")}
                                    className={classes.fullWidth}
                                    disabled={(dialogType === DesktopConfDialog.TYPE_VIEW)}
                                />
                            </Grid>
                            <Grid item xs={4} >
                                <InputLabel>테마</InputLabel>
                                <Select
                                    value={selectedThemeId} style={{width:'100%'}}
                                    onChange={this.handleValueChange('themeId')}
                                >
                                    {themeListData && themeListData.map(x => (
                                    <MenuItem value={x.get('themeId')} key={x.get('themeId')}>
                                        {x.get('themeNm')}
                                    </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} >
                                <DesktopAppSelector 
                                    selectedApp__Ids={List(['DEAP000005', 'DEAP000007'])} 
                                    selectedApps={editingItem.get('apps') ? editingItem.get('apps') : List([])} />
                            </Grid>
                            
                        </Grid>
                    }
                    {(dialogType === DesktopConfDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 하위 조직에 적용 하시겠습니까?
                        </Typography>
                        <DesktopConfSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === DesktopConfDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <DesktopConfSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === DesktopConfDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === DesktopConfDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                {(dialogType === DesktopConfDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">적용</Button>
                }
                {(dialogType === DesktopConfDialog.TYPE_COPY) &&
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
    DesktopConfProps: state.DesktopConfModule,
    DesktopAppProps: state.DesktopAppModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopConfDialog));

