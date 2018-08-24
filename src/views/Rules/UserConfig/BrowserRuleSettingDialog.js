import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as BrowserRuleSettingActions from 'modules/BrowserRuleSettingModule';
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
class BrowserRuleSettingDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.BrowserRuleSettingActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.BrowserRuleSettingActions.setEditingItemValue({
                name: name,
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.BrowserRuleSettingActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleWhiteListValueChange = index => event => {
        this.props.BrowserRuleSettingActions.setWhiteList({
            index: index,
            value: event.target.value
        });
    }

    handleChangeSelectedNtp = (name, index) => event => {
        this.props.BrowserRuleSettingActions.setEditingItemValue({
            name: name,
            value: index
        });
    }

    handleCreateData = (event) => {
        const { BrowserRuleSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '브라우저제어정보 등록',
            confirmMsg: '브라우저제어정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: BrowserRuleSettingProps.editingItem
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { BrowserRuleSettingProps, BrowserRuleSettingActions } = this.props;
            BrowserRuleSettingActions.createBrowserRuleSettingData(BrowserRuleSettingProps.editingItem)
                .then((res) => {
                    const { viewItems } = BrowserRuleSettingProps;
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.listParam) {
                                BrowserRuleSettingActions.readBrowserRuleSettingList(getMergedObject(element.listParam, {
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
        const { BrowserRuleSettingProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '브라우저제어정보 수정',
            confirmMsg: '브라우저제어정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: BrowserRuleSettingProps.editingItem
          });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { BrowserRuleSettingProps, BrowserRuleSettingActions } = this.props;

            BrowserRuleSettingActions.editBrowserRuleSettingData(BrowserRuleSettingProps.editingItem)
                .then((res) => {

                    const { editingCompId, viewItems } = BrowserRuleSettingProps;
                    viewItems.forEach((element) => {
                        if(element && element.listParam) {
                            BrowserRuleSettingActions.readBrowserRuleSettingList(getMergedObject(element.listParam, {
                                compId: element._COMPID_
                            }));
                        }
                    });

                    // 아래 정보 조회는 효과 없음. - 보여줄 인폼 객체가 안보이는 상태임.
                    // BrowserRuleSettingActions.getBrowserRuleSetting({
                    //     compId: editingCompId,
                    //     objId: paramObject.objId
                    // });

                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleAddWhiteList = () => {
        const { BrowserRuleSettingActions } = this.props;
        BrowserRuleSettingActions.addWhiteList();
    }

    handleDeleteWhiteList = index => event => {
        const { BrowserRuleSettingActions } = this.props;
        BrowserRuleSettingActions.deleteWhiteList(index);
    }

    checkAllow = value => {
        return (value == 'allow');
    }

    render() {
        const { classes } = this.props;
        const { BrowserRuleSettingProps } = this.props;
        const { dialogType, editingItem } = BrowserRuleSettingProps;

        const editingViewItem = editingItem;

        let title = "";
        const bull = <span className={classes.bullet}>•</span>;

        if(dialogType === BrowserRuleSettingDialog.TYPE_ADD) {
            title = "브라우저제어설정 등록";
        } else if(dialogType === BrowserRuleSettingDialog.TYPE_VIEW) {
            title = "브라우저제어설정 정보";
        } else if(dialogType === BrowserRuleSettingDialog.TYPE_EDIT) {
            title = "브라우저제어설정 수정";
        }

        return (
            <Dialog open={BrowserRuleSettingProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={classes.dialogContainer}>

                    <TextField
                        id="objNm"
                        label="이름"
                        value={(editingViewItem) ? editingViewItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={classes.fullWidth}
                        disabled={(dialogType === BrowserRuleSettingDialog.TYPE_VIEW)}
                    />
                    <TextField
                        id="comment"
                        label="설명"
                        value={(editingViewItem) ? editingViewItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(classes.fullWidth, classes.dialogItemRow)}
                        disabled={(dialogType === BrowserRuleSettingDialog.TYPE_VIEW)}
                    />
                    {(dialogType === BrowserRuleSettingDialog.TYPE_VIEW) &&
                        <div>
                            <Grid container spacing={24} className={classes.grNormalTableRow}>
                                <Grid item xs={12}>
                                </Grid> 
                            </Grid>
                        </div>                        
                    }
                    {(dialogType === BrowserRuleSettingDialog.TYPE_EDIT || dialogType === BrowserRuleSettingDialog.TYPE_ADD) &&
                        <div className={classes.dialogItemRowBig}>

                            <Grid item xs={12} container 
                                alignItems="flex-end" direction="row" justify="space-between" 
                                className={classNames(classes.grNormalTableRow, classes.dialogItemRow)}>
                                <Grid item xs={5}>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('webSocket')} 
                                            checked={this.checkAllow(editingViewItem.webSocket)}
                                            color="primary" />
                                        }
                                        label={(editingViewItem.webSocket == 'allow') ? 'Web Socket 사용' : 'Web Socket 미사용'}
                                    />                                
                                </Grid>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={5} >

                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('webWorker')} 
                                            checked={this.checkAllow(editingViewItem.webWorker)}
                                            color="primary" />
                                        }
                                        label={(editingViewItem.webWorker == 'allow') ? 'Web Worker 사용' : 'Web Worker 미사용'}
                                    />                                
                                </Grid>
                            </Grid>
                            
                            <div className={classes.dialogItemRow}>
                                <TextField
                                    label="신뢰사이트 설정 (파일로 변경필요~!!!!)"
                                    multiline
                                    value={(editingViewItem.trustSetupId) ? editingViewItem.trustSetupId : ''}
                                    onChange={this.handleValueChange("trustSetupId")}
                                    className={classNames(classes.fullWidth, classes.dialogItemRow)}
                                />
                            </div>

                            <div className={classes.dialogItemRow}>
                                <TextField
                                    label="비신뢰사이트 설정 (파일로 변경필요~!!!!)"
                                    multiline
                                    value={(editingViewItem.untrustSetupId) ? editingViewItem.untrustSetupId : ''}
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
                                    {editingViewItem.trustUrlList && editingViewItem.trustUrlList.length > 0 && editingViewItem.trustUrlList.map((value, index) => (
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
                {(dialogType === BrowserRuleSettingDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === BrowserRuleSettingDialog.TYPE_EDIT) &&
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
    BrowserRuleSettingProps: state.BrowserRuleSettingModule
});

const mapDispatchToProps = (dispatch) => ({
    BrowserRuleSettingActions: bindActionCreators(BrowserRuleSettingActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(BrowserRuleSettingDialog));

