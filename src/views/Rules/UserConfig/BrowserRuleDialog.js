import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import BrowserRuleSpec from './BrowserRuleSpec';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import Typography from "@material-ui/core/Typography";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from "@material-ui/core/Divider";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

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
    static TYPE_COPY = 'COPY';

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    handleChangeTabs = (event, value) => {
        this.setState({
            selectedTab: value
        });
    }

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
        event.preventDefault();
        const { BrowserRuleProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '브라우저제어정책 등록',
                confirmMsg: '브라우저제어정책을 등록하시겠습니까?',
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: BrowserRuleProps.get('editingItem')
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
            const { BrowserRuleProps, BrowserRuleActions } = this.props;
            BrowserRuleActions.createBrowserRuleData(BrowserRuleProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComps(BrowserRuleProps, BrowserRuleActions.readBrowserRuleListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { BrowserRuleProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '브라우저제어정책 수정',
                confirmMsg: '브라우저제어정책을 수정하시겠습니까?',
                handleConfirmResult: this.handleEditConfirmResult,
                confirmObject: BrowserRuleProps.get('editingItem')
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
            const { BrowserRuleProps, BrowserRuleActions } = this.props;
            BrowserRuleActions.editBrowserRuleData(BrowserRuleProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComps(BrowserRuleProps, BrowserRuleActions.readBrowserRuleListPaged);
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
                alertMsg: '브라우저제어정책이 하위 조직에 적용되었습니다.'
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { BrowserRuleProps, BrowserRuleActions } = this.props;
        BrowserRuleActions.cloneBrowserRuleData({
            'objId': BrowserRuleProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: '시스템알림',
                alertMsg: '브라우저제어정책을 복사하였습니다.'
            });
            refreshDataListInComps(BrowserRuleProps, BrowserRuleActions.readBrowserRuleListPaged);
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

    // file select
    handleChangeSetupFileInput = (event, setupName) => {
        this.readFileContent(event.target.files[0]).then(content => {
            if(content) {
                this.props.BrowserRuleActions.setEditingItemValue({
                    name: setupName,
                    value: content
                });
            }
        }).catch(error => console.log(error));
    }
    readFileContent(file) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
          reader.onload = event => resolve(event.target.result)
          reader.onerror = error => reject(error)
          reader.readAsText(file)
        });
    }

    render() {
        const { selectedTab } = this.state;

        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { BrowserRuleProps } = this.props;
        const dialogType = BrowserRuleProps.get('dialogType');
        const editingItem = (BrowserRuleProps.get('editingItem')) ? BrowserRuleProps.get('editingItem') : null;

        let title = "";
        if(dialogType === BrowserRuleDialog.TYPE_ADD) {
            title = "브라우저제어정책 등록";
        } else if(dialogType === BrowserRuleDialog.TYPE_VIEW) {
            title = "브라우저제어정책 정보";
        } else if(dialogType === BrowserRuleDialog.TYPE_EDIT) {
            title = "브라우저제어정책 수정";
        } else if(dialogType === BrowserRuleDialog.TYPE_INHERIT) {
            title = "브라우저제어정책 상속";
        } else if(dialogType === BrowserRuleDialog.TYPE_COPY) {
            title = "브라우저제어정책 복사";
        }

        return (
            <div>
            {(BrowserRuleProps.get('dialogOpen') && editingItem) &&
            <Dialog open={BrowserRuleProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === BrowserRuleDialog.TYPE_EDIT || dialogType === BrowserRuleDialog.TYPE_ADD) &&
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
                        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                            <Grid item xs={6}>
                                <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={6}><FormLabel component="legend">Web Socket 사용여부</FormLabel></Grid>
                                    <Grid item >
                                        <FormControlLabel value="allow" control={
                                            <Radio color="primary" value="allow" onChange={this.handleValueChange("webSocket")} checked={editingItem.get('webSocket') === 'allow'} />
                                        } label="허용" labelPlacement="end" />
                                    </Grid>
                                    <Grid item >
                                        <FormControlLabel value="disallow" control={
                                            <Radio color="primary" value="disallow" onChange={this.handleValueChange("webSocket")} checked={editingItem.get('webSocket') === 'disallow'} />
                                        } label="비허용" labelPlacement="end" />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-start" >
                                    <Grid item xs={6}><FormLabel component="legend">Web Worker 사용여부</FormLabel></Grid>
                                    <Grid item >
                                        <FormControlLabel value="allow" control={
                                            <Radio color="primary" value="allow" onChange={this.handleValueChange("webWorker")} checked={editingItem.get('webWorker') === 'allow'} />
                                        } label="허용" labelPlacement="end" />
                                    </Grid>
                                    <Grid item >
                                        <FormControlLabel value="disallow" control={
                                            <Radio color="primary" value="disallow" onChange={this.handleValueChange("webWorker")} checked={editingItem.get('webWorker') === 'disallow'} />
                                        } label="비허용" labelPlacement="end" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <AppBar elevation={0} position="static" color="default" style={{marginTop:20}} >
                            <Tabs value={selectedTab} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabs} >
                                <Tab label="신뢰사이트 설정" value={0} />
                                <Tab label="비신뢰사이트 설정" value={1} />
                            </Tabs>
                        </AppBar>
                        <Paper elevation={0} style={{ maxHeight: 420 }} >
                        {selectedTab === 0 && 
                            <div style={{border:'1px solid lightGray',padding:'0px 20px 20px 20px'}}>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:0}}>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">개발자도구(웹 인스펙터) 사용통제</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="1" control={
                                                <Radio color="primary" value="1" onChange={this.handleValueChange("devToolRule__trust")} checked={editingItem.get('devToolRule__trust') === '1'} />
                                            } label="개발자도구 사용가능" labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="2" control={
                                                <Radio color="primary" value="2" onChange={this.handleValueChange("devToolRule__trust")} checked={editingItem.get('devToolRule__trust') === '2'} />
                                            } label="개발자도구 사용불가" labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" style={{marginTop:10}}>
                                        <Grid item xs={12}><FormLabel component="legend">다운로드 통제</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="0" control={
                                                <Radio color="primary" value="0" onChange={this.handleValueChange("downloadRule__trust")} checked={editingItem.get('downloadRule__trust') === '0'} />
                                            } label="다운로드 제한 없음" labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="3" control={
                                                <Radio color="primary" value="3" onChange={this.handleValueChange("downloadRule__trust")} checked={editingItem.get('downloadRule__trust') === '3'} />
                                            } label="모든 다운로드 제한" labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">프린팅 통제</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("printRule__trust")} checked={editingItem.get('printRule__trust') === 'true'} />
                                            } label="허용" labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("printRule__trust")} checked={editingItem.get('printRule__trust') === 'false'} />
                                            } label="비허용" labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">페이지 소스보기 통제</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("viewSourceRule__trust")} checked={editingItem.get('viewSourceRule__trust') === 'true'} />
                                            } label="허용" labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("viewSourceRule__trust")} checked={editingItem.get('viewSourceRule__trust') === 'false'} />
                                            } label="비허용" labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <TextField label="신뢰사이트 설정" className={classes.fullWidth} multiline rowsMax={6}
                                style={{marginTop:10}}
                                value={(editingItem.get('trustSetup')) ? editingItem.get('trustSetup') : ''}
                                onChange={this.handleValueChange("trustSetup")} />
                            <div style={{marginTop:5,textAlign:'right'}}>
                                <input style={{display:'none'}} id="trust-btn-file" type="file" onChange={event => this.handleChangeSetupFileInput(event, 'trustSetup')} />
                                <label htmlFor="trust-btn-file">
                                    <Button variant="contained" size='small' component="span" style={{width:270}}>파일을 이용하여 신뢰사이트 내용 등록</Button>
                                </label>
                            </div>
                            </div>
                        }
                        {selectedTab === 1 && 
                            <div style={{border:'1px solid lightGray',padding:20}}>
                            
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                <Grid item xs={12}><FormLabel component="legend">개발자도구(웹 인스펙터) 사용통제</FormLabel></Grid>
                                <Grid item >
                                    <FormControlLabel value="1" control={
                                        <Radio color="primary" value="1" onChange={this.handleValueChange("devToolRule__untrust")} checked={editingItem.get('devToolRule__untrust') === '1'} />
                                    } label="개발자도구 사용가능" labelPlacement="end" />
                                </Grid>
                                <Grid item >
                                    <FormControlLabel value="2" control={
                                        <Radio color="primary" value="2" onChange={this.handleValueChange("devToolRule__untrust")} checked={editingItem.get('devToolRule__untrust') === '2'} />
                                    } label="개발자도구 사용불가" labelPlacement="end" />
                                </Grid>
                            </Grid>

                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" style={{marginTop:10}}>
                                <Grid item xs={12}><FormLabel component="legend">다운로드 통제</FormLabel></Grid>
                                <Grid item >
                                    <FormControlLabel value="0" control={
                                        <Radio color="primary" value="0" onChange={this.handleValueChange("downloadRule__untrust")} checked={editingItem.get('downloadRule__untrust') === '0'} />
                                    } label="다운로드 제한 없음" labelPlacement="end" />
                                </Grid>
                                <Grid item >
                                    <FormControlLabel value="3" control={
                                        <Radio color="primary" value="3" onChange={this.handleValueChange("downloadRule__untrust")} checked={editingItem.get('downloadRule__untrust') === '3'} />
                                    } label="모든 다운로드 제한" labelPlacement="end" />
                                </Grid>
                            </Grid>

                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">프린팅 통제</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("printRule__untrust")} checked={editingItem.get('printRule__untrust') === 'true'} />
                                            } label="허용" labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("printRule__untrust")} checked={editingItem.get('printRule__untrust') === 'false'} />
                                            } label="비허용" labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">페이지 소스보기 통제</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("viewSourceRule__untrust")} checked={editingItem.get('viewSourceRule__untrust') === 'true'} />
                                            } label="허용" labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("viewSourceRule__untrust")} checked={editingItem.get('viewSourceRule__untrust') === 'false'} />
                                            } label="비허용" labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <TextField label="비신뢰사이트 설정" className={classes.fullWidth} multiline rowsMax={6}
                                style={{marginTop:10}}
                                value={(editingItem.get('untrustSetup')) ? editingItem.get('untrustSetup') : ''}
                                onChange={this.handleValueChange("untrustSetup")} />

                            <div style={{marginTop:5,textAlign:'right'}}>
                                <input style={{display:'none'}} id="untrust-btn-file" type="file" onChange={event => this.handleChangeSetupFileInput(event, 'untrustSetup')} />
                                <label htmlFor="untrust-btn-file">
                                    <Button variant="contained" size='small' component="span" style={{width:270}}>파일을 이용하여 비신뢰사이트 내용 등록</Button>
                                </label>
                            </div>
                            </div>}
                        </Paper>
    
                        <div style={{marginTop:20}}>
                            <FormLabel style={{paddingTop:5,marginTop:10}}>White Address List</FormLabel>
                            <Button size="small" variant="contained" color="primary" style={{marginLeft:20}}
                                className={classes.smallIconButton} onClick={this.handleAddWhiteList}
                            ><AddIcon /></Button>
                            <div style={{maxHeight:140,overflow:'auto',marginBottom:10}}>
                                <Grid container spacing={0} alignItems="flex-end" direction="row" justify="flex-start" style={{margin:'0 0 16 0'}}>
                                {editingItem.get('trustUrlList') && editingItem.get('trustUrlList').size > 0 && editingItem.get('trustUrlList').map((value, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Input value={value} style={{width:"80%"}} onChange={this.handleWhiteListValueChange(index)}/>
                                        <IconButton onClick={this.handleDeleteWhiteList(index)}>
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Grid>
                                ))}
                                </Grid>
                            </div>
                            <Divider />
                        </div>

                    </div>
                    }
                    {(dialogType === BrowserRuleDialog.TYPE_INHERIT) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <BrowserRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === BrowserRuleDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <BrowserRuleSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === BrowserRuleDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_INHERIT) &&
                    <Button onClick={this.handleInheritSaveData} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_COPY) &&
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
    BrowserRuleProps: state.BrowserRuleModule,
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleDialog));

