import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
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
import Divider from '@material-ui/core/Divider';
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
class SecurityRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.SecurityRuleActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.SecurityRuleActions.setEditingItemValue({
                name: name,
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.SecurityRuleActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleCreateData = (event) => {
        const { SecurityRuleProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '단말보안정책정보 등록',
            confirmMsg: '단말보안정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: SecurityRuleProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { SecurityRuleProps, SecurityRuleActions } = this.props;
            SecurityRuleActions.createSecurityRule(SecurityRuleProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComp(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
                    this.handleClose();
                }, (res) => {
            })
        }
    }

    handleEditData = (event, id) => {
        const { SecurityRuleProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
            confirmTitle: '단말보안정책정보 수정',
            confirmMsg: '단말보안정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: SecurityRuleProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { SecurityRuleProps, SecurityRuleActions } = this.props;

            SecurityRuleActions.editSecurityRule(SecurityRuleProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComp(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
                    this.handleClose();
                });
        }
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { SecurityRuleProps } = this.props;
        const dialogType = SecurityRuleProps.get('dialogType');
        const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;

        let title = "";
        if(dialogType === SecurityRuleDialog.TYPE_ADD) {
            title = "단말보안정책설정 등록";
        } else if(dialogType === SecurityRuleDialog.TYPE_VIEW) {
            title = "단말보안정책설정 정보";
        } else if(dialogType === SecurityRuleDialog.TYPE_EDIT) {
            title = "단말보안정책설정 수정";
        }

        return (
            <div>
            {(SecurityRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={SecurityRuleProps.get('dialogOpen')}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === SecurityRuleDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === SecurityRuleDialog.TYPE_VIEW)}
                    />
                    {(dialogType === SecurityRuleDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} className={classes.grNormalTableRow}>
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
                        </div>                        
                    }
                    {(dialogType === SecurityRuleDialog.TYPE_EDIT || dialogType === SecurityRuleDialog.TYPE_ADD) &&
                        <div className={classes.dialogItemRowBig}>

                            <Grid item xs={12} container 
                                alignItems="flex-end" direction="row" justify="space-between" 
                                className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                                <Grid item xs={5}>
                                    <TextField
                                        label="화면보호기 설정시간(분)"
                                        multiline
                                        value={(editingItem.get('screenTime')) ? editingItem.get('screenTime') : ''}
                                        onChange={this.handleValueChange("screenTime")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={5} >
                                    <TextField
                                        label="패스워드 변경주기(일)"
                                        multiline
                                        value={(editingItem.get('passwordTime')) ? editingItem.get('passwordTime') : ''}
                                        onChange={this.handleValueChange("passwordTime")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    />
                                </Grid>
                            </Grid>
                            
                            <div className={classes.dialogItemRow}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('packageHandle')} 
                                        checked={this.checkAllow(editingItem.get('packageHandle'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('packageHandle') == 'allow') ? '패키지추가/삭제 기능차단' : '패키지추가/삭제 기능사용'}
                                />
                            </div>
                            <Divider />
                            <div className={classes.dialogItemRow}>
                                <FormControlLabel
                                    control={
                                    <Switch onChange={this.handleValueChange('state')} 
                                        checked={this.checkAllow(editingItem.get('state'))}
                                        color="primary" />
                                    }
                                    label={(editingItem.get('state') == 'allow') ? '전체네트워크허용' : '전체네트워크차단'}
                                />
                            </div>
                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === SecurityRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_EDIT) &&
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
    SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
    SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(SecurityRuleDialog));

