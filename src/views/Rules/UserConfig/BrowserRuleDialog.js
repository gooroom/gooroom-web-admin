import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComp } from 'components/GRUtils/GRTableListUtils';

import BrowserRuleViewer from './BrowserRuleViewer';

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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class BrowserRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT = 'INHERIT';

    handleClose = (event) => {
        this.props.BrowserRuleActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.BrowserRuleActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleWhiteListValueChange = index => event => {
        this.props.BrowserRuleActions.setWhiteList({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { BrowserRuleProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '브라우저제어정보 등록',
            confirmMsg: '브라우저제어정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: BrowserRuleProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { BrowserRuleProps, BrowserRuleActions } = this.props;
            BrowserRuleActions.createBrowserRuleData(BrowserRuleProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComp(BrowserRuleProps, BrowserRuleActions.readBrowserRuleListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { BrowserRuleProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '브라우저제어정보 수정',
            confirmMsg: '브라우저제어정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: BrowserRuleProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { BrowserRuleProps, BrowserRuleActions } = this.props;
            BrowserRuleActions.editBrowserRuleData(BrowserRuleProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComp(BrowserRuleProps, BrowserRuleActions.readBrowserRuleListPaged);
                    this.handleClose();
                });
        }
    }

    handleInheritSaveData = (event, id) => {
        const { BrowserRuleProps, DeptProps, BrowserRuleActions, compId } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        BrowserRuleActions.inheritBrowserRuleData({
            'objId': BrowserRuleProps.getIn(['editingItem', 'objId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '브라우저제어설정이 하위 조직에 적용되었습니다.'
            });
            this.handleClose();
        });
    }

    handleAddWhiteList = () => {
        const { BrowserRuleActions } = this.props;
        BrowserRuleActions.addWhiteList();
    }

    handleDeleteWhiteList = index => event => {
        const { BrowserRuleActions } = this.props;
        BrowserRuleActions.deleteWhiteList(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { BrowserRuleProps } = this.props;
        const dialogType = BrowserRuleProps.get('dialogType');
        const editingItem = (BrowserRuleProps.get('editingItem')) ? BrowserRuleProps.get('editingItem') : null;

        let title = "";
        if(dialogType === BrowserRuleDialog.TYPE_ADD) {
            title = "브라우저제어설정 등록";
        } else if(dialogType === BrowserRuleDialog.TYPE_VIEW) {
            title = "브라우저제어설정 정보";
        } else if(dialogType === BrowserRuleDialog.TYPE_EDIT) {
            title = "브라우저제어설정 수정";
        } else if(dialogType === BrowserRuleDialog.TYPE_INHERIT) {
            title = "브라우저제어설정 상속";
        }

        return (
            <div>
            {(BrowserRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={BrowserRuleProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === BrowserRuleDialog.TYPE_EDIT || dialogType === BrowserRuleDialog.TYPE_ADD) &&
                    <div>
                        <TextField label="이름" className={classes.fullWidth}
                            value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                            onChange={this.handleValueChange("objNm")} />
                        <TextField label="설명" className={classes.fullWidth}
                            value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                            onChange={this.handleValueChange("comment")} />

                        <Grid item xs={12} container 
                            alignItems="flex-end" direction="row" justify="space-between" 
                            className={classes.dialogItemRow}>
                            <Grid item xs={5}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('webSocket')} 
                                        checked={this.checkAllow(editingItem.get('webSocket'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('webSocket') == 'allow') ? 'Web Socket 사용' : 'Web Socket 미사용'}
                                />                                
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                            <Grid item xs={5} >
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('webWorker')} 
                                        checked={this.checkAllow(editingItem.get('webWorker'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('webWorker') == 'allow') ? 'Web Worker 사용' : 'Web Worker 미사용'}
                                />                                
                            </Grid>
                        </Grid>
                        
                        <div className={classes.dialogItemRow}>
                            <TextField
                                label="신뢰사이트 설정 (파일로 변경필요~!!!!)"
                                multiline
                                value={(editingItem.get('trustSetupId')) ? editingItem.get('trustSetupId') : ''}
                                onChange={this.handleValueChange("trustSetupId")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                        </div>

                        <div className={classes.dialogItemRow}>
                            <TextField
                                label="비신뢰사이트 설정 (파일로 변경필요~!!!!)"
                                multiline
                                value={(editingItem.get('untrustSetupId')) ? editingItem.get('untrustSetupId') : ''}
                                onChange={this.handleValueChange("untrustSetupId")}
                                className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            />
                        </div>
                        <div className={classes.dialogItemRow}>

                            <FormLabel >{bull} White Address List</FormLabel>
                            <Button size="small" variant="contained" color="primary" 
                                className={classes.smallIconButton}
                                onClick={this.handleAddWhiteList}
                            >
                                <AddIcon />
                            </Button>
                            <div>
                                <List>
                                {editingItem.get('trustUrlList') && editingItem.get('trustUrlList').size > 0 && editingItem.get('trustUrlList').map((value, index) => (
                                    <ListItem key={index}>
                                        <Input value={value} style={{width:"100%"}} onChange={this.handleWhiteListValueChange(index)}/>
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={this.handleDeleteWhiteList(index)}>
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
                    {(dialogType === BrowserRuleDialog.TYPE_VIEW || dialogType === BrowserRuleDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 하위 조직에 적용 하시겠습니까?
                        </Typography>
                        <BrowserRuleViewer viewItem={editingItem} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === BrowserRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">적용</Button>
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
    BrowserRuleProps: state.BrowserRuleModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleDialog));

