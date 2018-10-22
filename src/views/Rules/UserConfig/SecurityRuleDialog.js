import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import SecurityRuleNetwork from './SecurityRuleNetwork';
import SecurityRuleViewer from './SecurityRuleViewer';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComp } from 'components/GRUtils/GRTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import AddIcon from '@material-ui/icons/Add';

import Radio from '@material-ui/core/Radio';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class SecurityRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT = 'INHERIT';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.SecurityRuleActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'allow' : 'disallow') : event.target.value;
        this.props.SecurityRuleActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleChangeNetworkOption = (count, event) => {
        this.props.SecurityRuleActions.setEditingNetworkValue({
            count: count,
            name: event.target.name,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { SecurityRuleProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말보안정책정보 등록',
            confirmMsg: '단말보안정책정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
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
        const { SecurityRuleProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '단말보안정책정보 수정',
            confirmMsg: '단말보안정책정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
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

    handleInheritSaveData = (event, id) => {
        const { SecurityRuleProps, DeptProps, SecurityRuleActions, compId } = this.props;
        const selectedDeptCd = DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']);

        SecurityRuleActions.inheritSecurityRuleData({
            'objId': SecurityRuleProps.getIn(['editingItem', 'objId']),
            'deptCd': selectedDeptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '단말보안정책이 하위 조직에 적용되었습니다.'
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { SecurityRuleProps, SecurityRuleActions } = this.props;
        SecurityRuleActions.cloneSecurityRuleData({
            'objId': SecurityRuleProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '단말보안정책을 복사하였습니다.'
            });
            refreshDataListInComp(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
            this.handleClose();
        });
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
        } else if(dialogType === SecurityRuleDialog.TYPE_INHERIT) {
            title = "단말보안정책설정 상속";
        } else if(dialogType === SecurityRuleDialog.TYPE_COPY) {
            title = "단말보안정책설정 복사";
        }

        return (
            <div>
            {(SecurityRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={SecurityRuleProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === SecurityRuleDialog.TYPE_EDIT || dialogType === SecurityRuleDialog.TYPE_ADD) &&
                    <div>

                    <TextField label="이름" value={(editingItem.get('objNm')) ? editingItem.get('objNm') : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === SecurityRuleDialog.TYPE_VIEW)}
                    />
                    <TextField label="설명" value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === SecurityRuleDialog.TYPE_VIEW)}
                    />
                    {(dialogType === SecurityRuleDialog.TYPE_EDIT || dialogType === SecurityRuleDialog.TYPE_ADD) &&
                        <div>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                                <Grid item xs={12} sm={4} md={4}>
                                    <TextField
                                        label="화면보호기 설정시간(분)"
                                        multiline
                                        value={(editingItem.get('screenTime')) ? editingItem.get('screenTime') : ''}
                                        onChange={this.handleValueChange("screenTime")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <TextField
                                        label="패스워드 변경주기(일)"
                                        multiline
                                        value={(editingItem.get('passwordTime')) ? editingItem.get('passwordTime') : ''}
                                        onChange={this.handleValueChange("passwordTime")}
                                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('packageHandle')} 
                                            checked={this.checkAllow(editingItem.get('packageHandle'))}
                                            color="primary" />
                                        }
                                        label={(editingItem.get('packageHandle') == 'allow') ? '패키지추가/삭제 기능차단' : '패키지추가/삭제 기능사용'}
                                    />
                                </Grid>
                            </Grid>

                            <SecurityRuleNetwork />

                        </div>
                    }
                    </div>
                    }
                    {(dialogType === SecurityRuleDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 하위 조직에 적용 하시겠습니까?
                        </Typography>
                        <SecurityRuleViewer viewItem={editingItem} />
                        </div>
                    }
                    {(dialogType === SecurityRuleDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            이 정책을 복사하여 새로운 정책을 생성 하시겠습니까?
                        </Typography>
                        <SecurityRuleViewer viewItem={editingItem} />
                        </div>
                    }
                </DialogContent>

                <DialogActions>
                {(dialogType === SecurityRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">적용</Button>
                }
                {(dialogType === SecurityRuleDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">복사</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
                <GRConfirm />
            </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    SecurityRuleProps: state.SecurityRuleModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityRuleDialog));

