import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
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
class BrowserRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.BrowserRuleActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.BrowserRuleActions.setEditingItemValue({
                name: name,
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.BrowserRuleActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleWhiteListValueChange = index => event => {
        this.props.BrowserRuleActions.setWhiteList({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { BrowserRuleProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '브라우저제어정보 등록',
            confirmMsg: '브라우저제어정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
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
        const { BrowserRuleProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '브라우저제어정보 수정',
            confirmMsg: '브라우저제어정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
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
        }

        return (
            <div>
            {(BrowserRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={BrowserRuleProps.get('dialogOpen')}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === BrowserRuleDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === BrowserRuleDialog.TYPE_VIEW)}
                    />
                    {(dialogType === BrowserRuleDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} className={classes.grNormalTableRow}>
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
                        </div>                        
                    }
                    {(dialogType === BrowserRuleDialog.TYPE_EDIT || dialogType === BrowserRuleDialog.TYPE_ADD) &&
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
                {(dialogType === BrowserRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_EDIT) &&
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
    BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
    BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(BrowserRuleDialog));

