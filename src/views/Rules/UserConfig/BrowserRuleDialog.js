import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

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
import { translate, Trans } from "react-i18next";


class BrowserRuleDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT_DEPT = 'INHERIT_DEPT';
    static TYPE_INHERIT_GROUP = 'INHERIT_GROUP';
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
        this.setState({
            selectedTab: 0
        });
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
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddBrowserRule"),
                confirmMsg: t("msgAddBrowserRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { BrowserRuleProps, BrowserRuleActions } = this.props;
                        BrowserRuleActions.createBrowserRuleData(BrowserRuleProps.get('editingItem'))
                            .then((res) => {
                                refreshDataListInComps(BrowserRuleProps, BrowserRuleActions.readBrowserRuleListPaged);
                                this.handleClose();
                            });
                    }
                },
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

    handleEditData = (event, id) => {
        const { BrowserRuleProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditBrowserRule"),
                confirmMsg: t("msgEditBrowserRule"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { BrowserRuleProps, BrowserRuleActions, compId } = this.props;
                        BrowserRuleActions.editBrowserRuleData(paramObject, compId)
                            .then((res) => {
                                refreshDataListInComps(BrowserRuleProps, BrowserRuleActions.readBrowserRuleListPaged);
                                this.handleClose();
                            });
                    }
                },
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

    handleInheritSaveDataForDept = (event, id) => {
        const { BrowserRuleProps, DeptProps, BrowserRuleActions, compId } = this.props;
        const { t, i18n } = this.props;
        const deptCd = DeptProps.getIn(['viewItems', compId, 'viewItem', 'deptCd']);

        BrowserRuleActions.inheritBrowserRuleDataForDept({
            'objId': BrowserRuleProps.getIn(['editingItem', 'objId']),
            'deptCd': deptCd
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyBrowserRuleChild")
            });
            this.handleClose();
        });
    }

    handleInheritSaveDataForGroup = (event, id) => {
        const { BrowserRuleProps, ClientGroupProps, BrowserRuleActions, compId } = this.props;
        const { t, i18n } = this.props;
        const grpId = ClientGroupProps.getIn(['viewItems', compId, 'viewItem', 'grpId']);

        BrowserRuleActions.inheritBrowserRuleDataForGroup({
            'objId': BrowserRuleProps.getIn(['editingItem', 'objId']),
            'grpId': grpId
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyBrowserRuleChild")
            });
            this.handleClose();
        });
    }


    handleCopyCreateData = (event, id) => {
        const { BrowserRuleProps, BrowserRuleActions } = this.props;
        const { t, i18n } = this.props;

        BrowserRuleActions.cloneBrowserRuleData({
            'objId': BrowserRuleProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyBrowserRule")
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
        const { t, i18n } = this.props;

        const { BrowserRuleProps } = this.props;
        const dialogType = BrowserRuleProps.get('dialogType');
        const editingItem = (BrowserRuleProps.get('editingItem')) ? BrowserRuleProps.get('editingItem') : null;

        let title = "";
        if(dialogType === BrowserRuleDialog.TYPE_ADD) {
            title = t("dtAddBrowserRule");
            if(window.gpmsain === Constants.SUPER_RULECODE) {
                title += " - " + t("selStandard");
            }
        } else if(dialogType === BrowserRuleDialog.TYPE_VIEW) {
            title = t("dtViewBrowserRule");
        } else if(dialogType === BrowserRuleDialog.TYPE_EDIT) {
            title = t("dtEditBrowserRule");
        } else if(dialogType === BrowserRuleDialog.TYPE_INHERIT_DEPT || dialogType === BrowserRuleDialog.TYPE_INHERIT_GROUP) {
            title = t("dtInheritBrowserRule");
        } else if(dialogType === BrowserRuleDialog.TYPE_COPY) {
            title = t("dtCopyBrowserRule");
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
                        <AppBar elevation={0} position="static" color="default" style={{marginTop:20}} >
                            <Tabs value={selectedTab} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabs} >
                                <Tab label={t("lbSetupTrustSite")} value={0} />
                                <Tab label={t("lbSetupUntrustSite")} value={1} />
                            </Tabs>
                        </AppBar>
                        <Paper elevation={0} style={{ maxHeight: 420 }} >
                        {selectedTab === 0 && 
                            <div style={{border:'1px solid lightGray',padding:'0px 20px 20px 20px'}}>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:0}}>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbDevToolUseStop")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="1" control={
                                                <Radio color="primary" value="1" onChange={this.handleValueChange("devToolRule__trust")} checked={editingItem.get('devToolRule__trust') === '1'} />
                                            } label={t("selEnableDevTool")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="2" control={
                                                <Radio color="primary" value="2" onChange={this.handleValueChange("devToolRule__trust")} checked={editingItem.get('devToolRule__trust') === '2'} />
                                            } label={t("selDisableDevTool")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" style={{marginTop:10}}>
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbLimitDownload")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="0" control={
                                                <Radio color="primary" value="0" onChange={this.handleValueChange("downloadRule__trust")} checked={editingItem.get('downloadRule__trust') === '0'} />
                                            } label={t("selNolimitDownload")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="3" control={
                                                <Radio color="primary" value="3" onChange={this.handleValueChange("downloadRule__trust")} checked={editingItem.get('downloadRule__trust') === '3'} />
                                            } label={t("selLimitAllDownload")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbControlPrint")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("printRule__trust")} checked={editingItem.get('printRule__trust') === 'true'} />
                                            } label={t("selPermitRule")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("printRule__trust")} checked={editingItem.get('printRule__trust') === 'false'} />
                                            } label={t("selNoPermitRule")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbControlShowSource")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("viewSourceRule__trust")} checked={editingItem.get('viewSourceRule__trust') === 'true'} />
                                            } label={t("selPermitRule")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("viewSourceRule__trust")} checked={editingItem.get('viewSourceRule__trust') === 'false'} />
                                            } label={t("selNoPermitRule")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <TextField label={t("lbSetupTrustSite")} className={classes.fullWidth} multiline rowsMax={6}
                                style={{marginTop:10}}
                                value={(editingItem.get('trustSetup')) ? editingItem.get('trustSetup') : ''}
                                onChange={this.handleValueChange("trustSetup")} />
                            <div style={{marginTop:5,textAlign:'right'}}>
                                <input style={{display:'none'}} id="trust-btn-file" type="file" onChange={event => this.handleChangeSetupFileInput(event, 'trustSetup')} />
                                <label htmlFor="trust-btn-file">
                                    <Button variant="contained" size='small' component="span" style={{width:270}}>{t("btUploadTrustSetup")}</Button>
                                </label>
                            </div>
                            </div>
                        }
                        {selectedTab === 1 && 
                            <div style={{border:'1px solid lightGray',padding:20}}>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                                <Grid item xs={6}>
                                    <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={6}><FormLabel component="legend">{t("lbUseWebSocket")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="allow" control={
                                                <Radio color="primary" value="allow" onChange={this.handleValueChange("webSocket")} checked={editingItem.get('webSocket') === 'allow'} />
                                            } label={t("selPermitRule")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="disallow" control={
                                                <Radio color="primary" value="disallow" onChange={this.handleValueChange("webSocket")} checked={editingItem.get('webSocket') === 'disallow'} />
                                            } label={t("selNoPermitRule")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={6}><FormLabel component="legend">{t("lbUseWebWorker")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="allow" control={
                                                <Radio color="primary" value="allow" onChange={this.handleValueChange("webWorker")} checked={editingItem.get('webWorker') === 'allow'} />
                                            } label={t("selPermitRule")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="disallow" control={
                                                <Radio color="primary" value="disallow" onChange={this.handleValueChange("webWorker")} checked={editingItem.get('webWorker') === 'disallow'} />
                                            } label={t("selNoPermitRule")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:0}}>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbDevToolUseStop")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="1" control={
                                                <Radio color="primary" value="1" onChange={this.handleValueChange("devToolRule__untrust")} checked={editingItem.get('devToolRule__untrust') === '1'} />
                                            } label={t("selEnableDevTool")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="2" control={
                                                <Radio color="primary" value="2" onChange={this.handleValueChange("devToolRule__untrust")} checked={editingItem.get('devToolRule__untrust') === '2'} />
                                            } label={t("selDisableDevTool")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" style={{marginTop:10}}>
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbLimitDownload")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="0" control={
                                                <Radio color="primary" value="0" onChange={this.handleValueChange("downloadRule__untrust")} checked={editingItem.get('downloadRule__untrust') === '0'} />
                                            } label={t("selNolimitDownload")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="3" control={
                                                <Radio color="primary" value="3" onChange={this.handleValueChange("downloadRule__untrust")} checked={editingItem.get('downloadRule__untrust') === '3'} />
                                            } label={t("selLimitAllDownload")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" style={{marginTop:10}}>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbControlPrint")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("printRule__untrust")} checked={editingItem.get('printRule__untrust') === 'true'} />
                                            } label={t("selPermitRule")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("printRule__untrust")} checked={editingItem.get('printRule__untrust') === 'false'} />
                                            } label={t("selNoPermitRule")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" >
                                        <Grid item xs={12}><FormLabel component="legend">{t("lbControlShowSource")}</FormLabel></Grid>
                                        <Grid item >
                                            <FormControlLabel value="true" control={
                                                <Radio color="primary" value="true" onChange={this.handleValueChange("viewSourceRule__untrust")} checked={editingItem.get('viewSourceRule__untrust') === 'true'} />
                                            } label={t("selPermitRule")} labelPlacement="end" />
                                        </Grid>
                                        <Grid item >
                                            <FormControlLabel value="false" control={
                                                <Radio color="primary" value="false" onChange={this.handleValueChange("viewSourceRule__untrust")} checked={editingItem.get('viewSourceRule__untrust') === 'false'} />
                                            } label={t("selNoPermitRule")} labelPlacement="end" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <TextField label={t("lbSetupUntrustSite")} className={classes.fullWidth} multiline rowsMax={6}
                                style={{marginTop:10}}
                                value={(editingItem.get('untrustSetup')) ? editingItem.get('untrustSetup') : ''}
                                onChange={this.handleValueChange("untrustSetup")} />

                            <div style={{marginTop:5,textAlign:'right'}}>
                                <input style={{display:'none'}} id="untrust-btn-file" type="file" onChange={event => this.handleChangeSetupFileInput(event, 'untrustSetup')} />
                                <label htmlFor="untrust-btn-file">
                                    <Button variant="contained" size='small' component="span" style={{width:270}}>{t("btUploadUntrustSetup")}</Button>
                                </label>
                            </div>
                            </div>}
                        </Paper>
    
                        <div style={{marginTop:20}}>
                            <FormLabel style={{paddingTop:5,marginTop:10}}>{t("lbWhiteAddressList")}</FormLabel>
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
                    {(dialogType === BrowserRuleDialog.TYPE_INHERIT_DEPT || dialogType === BrowserRuleDialog.TYPE_INHERIT_GROUP) &&
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
                {(dialogType === BrowserRuleDialog.TYPE_INHERIT_DEPT) &&
                    <Button onClick={this.handleInheritSaveDataForDept} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_INHERIT_GROUP) &&
                    <Button onClick={this.handleInheritSaveDataForGroup} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === BrowserRuleDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("dtCopy")}</Button>
                }
                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            {/*<GRAlert /> */}
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    BrowserRuleProps: state.BrowserRuleModule,
    DeptProps: state.DeptModule,
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleDialog)));

