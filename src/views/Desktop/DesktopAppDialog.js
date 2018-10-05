import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as appIdActions from 'modules/appIdModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';
import { refreshDataListInComp } from 'components/GrUtils/GrTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import AddIcon from '@material-ui/icons/Add';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class appIdDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.appIdActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.appIdActions.setEditingItemValue({
                name: name,
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.appIdActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleWhiteListValueChange = index => event => {
        this.props.appIdActions.setWhiteList({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { appIdProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '데스크톱앱 등록',
            confirmMsg: '데스크톱앱을 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: appIdProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { appIdProps, appIdActions } = this.props;
            appIdActions.createappIdData(appIdProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComp(appIdProps, appIdActions.readDesktopAppListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { appIdProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '데스크톱앱 수정',
            confirmMsg: '데스크톱앱을 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: appIdProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { appIdProps, appIdActions } = this.props;
            appIdActions.editappIdData(appIdProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComp(appIdProps, appIdActions.readDesktopAppListPaged);
                    this.handleClose();
                });
        }
    }

    handleAddWhiteList = () => {
        const { appIdActions } = this.props;
        appIdActions.addWhiteList();
    }

    handleDeleteWhiteList = index => event => {
        const { appIdActions } = this.props;
        appIdActions.deleteWhiteList(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { appIdProps } = this.props;
        const dialogType = appIdProps.get('dialogType');
        const editingItem = (appIdProps.get('editingItem')) ? appIdProps.get('editingItem') : null;

        let title = "";
        if(dialogType === appIdDialog.TYPE_ADD) {
            title = "데스크톱앱 등록";
        } else if(dialogType === appIdDialog.TYPE_VIEW) {
            title = "데스크톱앱 정보";
        } else if(dialogType === appIdDialog.TYPE_EDIT) {
            title = "데스크톱앱 수정";
        }

        return (
            <div>
            {(appIdProps.get('dialogOpen') && editingItem) &&
            <Dialog open={appIdProps.get('dialogOpen')}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        label="이름"
                        value={(editingItem.get('appNm')) ? editingItem.get('appNm') : ''}
                        onChange={this.handleValueChange("appNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === appIdDialog.TYPE_VIEW)}
                    />
                    <TextField
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === appIdDialog.TYPE_VIEW)}
                    />
                    {(dialogType === appIdDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} className={classes.grNormalTableRow}>
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
                        </div>                        
                    }
                    {(dialogType === appIdDialog.TYPE_EDIT || dialogType === appIdDialog.TYPE_ADD) &&
                        <div className={classes.dialogItemRowBig}>
                            <Grid item xs={12} container 
                                alignItems="flex-end" direction="row" justify="space-between" 
                                className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
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
                </form>

                <DialogActions>
                {(dialogType === appIdDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === appIdDialog.TYPE_EDIT) &&
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
    appIdProps: state.appIdModule
});

const mapDispatchToProps = (dispatch) => ({
    appIdActions: bindActionCreators(appIdActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(appIdDialog));

