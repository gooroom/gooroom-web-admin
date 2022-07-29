import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ThemeManageActions from 'modules/ThemeManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Grid from '@material-ui/core/Grid';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormLabel from '@material-ui/core/FormLabel';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import DeleteOutline from '@material-ui/icons/DeleteOutline';
import EditOutlined from '@material-ui/icons/EditOutlined';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class ThemeDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    static APP_LIST = [
        {no:1, title:'gooroom browser', name:'gooroom-browser', group:'lbNetwork', default:'4_gooroom-browser.svg'},
        {no:2, title:'image viewer', name:'org.gnome.eog', group:'lbGraphics', default:'4_org.gnome.eog.svg'},
        {no:3, title:'multimedia', name:'io.github.GnomeMpv', group:'lbAudioVideo', default:'4_io.github.GnomeMpv.svg'},
        {no:4, title:'updater', name:'gooroomupdater', group:'lbSystem', default:'4_gooroomupdater.svg'},
        {no:5, title:'package management', name:'synaptic', group:'lbSystem', default:'4_synaptic.svg'},
        {no:6, title:'gnome control center', name:'gnome-control-center', group:'lbSystem', default:'4_gnome-control-center.svg'},
        {no:7, title:'grac editor', name:'grac-editor', group:'lbSystem', default:'4_grac-editor.svg'},
        {no:8, title:'software', name:'kr.gooroom.Software', group:'lbSystem', default:'4_kr.gooroom.Software.svg'},
        {no:9, title:'cloud storage', name:'gooroom-cloud-storage', group:'lbUtility', default:'4_gooroom-cloud-storage.svg'},
        {no:10, title:'web office', name:'gooroom-web-office', group:'lbUtility', default:'4_gooroom-web-office.svg'},
        {no:11, title:'office SNS', name:'gooroom-sns', group:'lbUtility', default:'4_gooroom-sns.svg'},
        {no:12, title:'team', name:'gooroom-collaboration', group:'lbUtility', default:'4_gooroom-collaboration.svg'},
        {no:13, title:'video conferencing system', name:'gooroom-video-conference', group:'lbUtility', default:'4_gooroom-video-conference.svg'},
        {no:14, title:'groupware', name:'gooroom-groupware', group:'lbUtility', default:'4_gooroom-groupware.svg'},
        {no:15, title:'memo', name:'accessories-text-editor', group:'lbUtility', default:'4_accessories-text-editor.svg'},
        {no:16, title:'KMS', name:'gooroom-kms', group:'lbUtility', default:'4_gooroom-kms.svg'},
        {no:17, title:'ERP', name:'gooroom-erp', group:'lbUtility', default:'4_gooroom-erp.svg'},
        {no:18, title:'accounting management', name:'gooroom-accounting-management', group:'lbUtility', default:'4_gooroom-accounting-management.svg'},
        {no:19, title:'personnel management', name:'gooroom-personnel-management', group:'lbUtility', default:'4_gooroom-personnel-management.svg'},
        {no:20, title:'etc applications', name:'gooroom-other-applications', group:'lbUtility', default:'4_gooroom-other-applications.svg'},
        {no:21, title:'security status', name:'preferences-system-firewall', group:'lbUtility', default:'4_preferences-system-firewall.svg'},
        {no:22, title:'screenshot', name:'applets-screenshooter', group:'lbUtility', default:'4_applets-screenshooter.svg'},
        {no:23, title:'smartcard register', name:'gooroom-smartcard-register', group:'lbUtility', default:'4_gooroom-smartcard-register.svg'},
        {no:24, title:'gooroom terminal server', name:'gooroom-client-server-register', group:'lbUtility', default:'4_gooroom-client-server-register.svg'},
        {no:25, title:'archiver', name:'file-roller', group:'lbUtility', default:'4_file-roller.svg'},
        {no:26, title:'calculator', name:'galculator', group:'lbUtility', default:'4_galculator.svg'},
        {no:27, title:'network management', name:'preferences-system-network', group:'lbUtility', default:'4_preferences-system-network.svg'},
        {no:28, title:'file manager', name:'org.gnome.Nautilus', group:'lbUtility', default:'4_org.gnome.Nautilus.svg'},
        {no:29, title:'appointment', name:'appointment', group:'lbUtility', default:'4_appointment.svg'},
        {no:30, title:'calendar', name:'calendar', group:'lbUtility', default:'4_calendar.svg'}, 
        {no:31, title:'gooroom guide', name:'gooroom-guide', group:'lbUtility', default:'4_gooroom-guide.svg'},
        {no:32, title:'gooroom toolkit', name:'gooroom-toolkit', group:'lbUtility', default:'4_gooroom-toolkit.svg'},
        {no:33, title:'terminal', name:'org.gnome.Terminal', group:'lbUtility', default:'4_org.gnome.Terminal.svg'},
        {no:34, title:'yelp browser', name:'yelp-browser', group:'lbUtility', default:'4_yelp-browser.svg'}
    ];

    handleClose = (event) => {
        this.props.ThemeManageActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.ThemeManageActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleValuePasswordChange = name => event => {
        this.props.ThemeManageActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    makeParameter = (paramObject, dialogType) => {

        const imageType = "image/svg+xml";

        let dataParam = Map({
            themeId: paramObject.get('themeId'),
            themeNm: paramObject.get('themeNm'),
            themeCmt: paramObject.get('themeCmt'),
            wallpaperFile: paramObject.get('wallpaper')
        });

        if (dialogType == ThemeDialog.TYPE_ADD) {
            ThemeDialog.APP_LIST.map(n => {
                const editFile = paramObject.get(n.name);
                dataParam = dataParam.set(n.name, editFile === undefined ? new File ([], n.name, {type:imageType}) : editFile);
            });
            return dataParam.toJS();
        }

        paramObject.get('themeIcons').map (n => {
            const fileName = n.get ('fileEtcInfo');
            let editFile = paramObject.get(fileName);
            if (editFile === undefined || editFile === '') {
                const deleteFile = paramObject.get(fileName + "_DELETE");
                if (deleteFile === undefined) {
                    const imgUrl = n.get('imgUrl');
                    const defaultItem = ThemeDialog.APP_LIST.find (o => o.name === fileName);
                    const defaultImg = window.location.origin + '/gpms/images/gr_icons/' + defaultItem.default;
                    if (imgUrl === defaultImg)  {
                        editFile = new File ([],fileName, {type:imageType});
                    }
                    else {
                        fetch(imgUrl).then (res => res.blob())
                        .then (blob => {
                            this.readFileContent(blob).then(content => {
                                if(content) {
                                    editFile = new File ([content], fileName, {type:imageType});
                                }
                            }).catch(error => console.log(error));
                        });
                    }
                }
                else {
                    editFile = new File ([], fileName, {type:imageType});
                }
            }
            dataParam = dataParam.set(fileName, editFile);
        })
        return dataParam.toJS();
    }

    // 생성
    handleCreateData = (event) => {
        const { ThemeManageProps, GRConfirmActions, GRAlertActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            const wallpaler = ThemeManageProps.get('editingItem').get('wallpaper');
            if (wallpaler === undefined || wallpaler === '') {
                GRAlertActions.showAlert({
                    alertTitle: t("dtAddThemeError"),
                    alertMsg: t("msgBackgroundSettingError") 
                });
                return;
            }

            GRConfirmActions.showConfirm({
                confirmTitle: t("lbAddTheme"),
                confirmMsg: t("msgAddTheme"),
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: ThemeManageProps.get('editingItem')
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
            const { ThemeManageProps, ThemeManageActions, compId } = this.props;
            ThemeManageActions.createThemeData(this.makeParameter(paramObject, ThemeDialog.TYPE_ADD)).then((res) => {
                ThemeManageActions.readThemeListPaged(ThemeManageProps, compId);
                this.handleClose();
            });
        }
    }

    // 수정
    handleEditData = (event) => {
        const { ThemeManageProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("lbEditTheme"),
                confirmMsg: t("msgEditTheme"),
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: ThemeManageProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }
    handleEditDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ThemeManageProps, ThemeManageActions, compId } = this.props;
            ThemeManageActions.editThemeData(this.makeParameter(paramObject, ThemeDialog.TYPE_EDIT)).then((res) => {
                ThemeManageActions.readThemeListPaged(ThemeManageProps, compId);
                this.handleClose();
            });
        }
    }

    ___handleImageFileChange = (event, gubunName) => {
        if(event.target.files && event.target.files.length > 0) {
            this.props.ThemeManageActions.setEditingItemValue({
                name: gubunName,
                value: event.target.files[0]
            });
        }
    }
    handleImageFileDelete = (event, gubunName) => {
        console.log ("Delete ", gubunName);
        const viewFileName = gubunName + '_GRFILE';
        this.props.ThemeManageActions.setEditingItemObject({
            [gubunName]: '',
            [viewFileName]: ''
        });

        const deleteName = gubunName +  '_DELETE';
        this.props.ThemeManageActions.setEditingItemObject({
            [deleteName]: 'true'
        });
    }
    // file select
    handleImageFileChange = (event, gubunName) => {
        const selectedFile = event.target.files[0];
        const viewFileName = gubunName + '_GRFILE';
        this.readFileContent(event.target.files[0]).then(content => {
            if(content) {
                this.props.ThemeManageActions.setEditingItemObject({
                    [gubunName]: selectedFile,
                    [viewFileName]: content
                });
            }
        }).catch(error => console.log(error));
    }

    readFileContent(file) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result)
            reader.onerror = error => reject(error)
            reader.readAsDataURL(file)
        });
    }

    render() {
        const { classes } = this.props;
        const { ThemeManageProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = ThemeManageProps.get('dialogType');
        const editingItem = (ThemeManageProps.get('editingItem')) ? ThemeManageProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ThemeDialog.TYPE_ADD) {
            title = t("dtAddTheme");
        } else if(dialogType === ThemeDialog.TYPE_VIEW) {
            title = t("dtViewTheme");
        } else if(dialogType === ThemeDialog.TYPE_EDIT) {
            title = t("dtEditTheme");
        }

        return (
            <div>
            {(ThemeManageProps.get('dialogOpen') && editingItem) &&
                <Dialog open={ThemeManageProps.get('dialogOpen')} fullWidth={true} maxWidth="md">
                    <ValidatorForm ref="form">
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                                {/* 테마이름 */}
                                <Grid item xs={8} >
                                    {(dialogType === ThemeDialog.TYPE_EDIT) &&
                                        <TextField label={t("lbThemeId")} className={classes.fullWidth}
                                            value={(editingItem.get('themeId')) ? editingItem.get('themeId') : ''}
                                        />
                                    }
                                     <TextValidator label={t("lbThemeName")} className={classes.fullWidth}
                                        value={(editingItem.get('themeNm')) ? editingItem.get('themeNm') : ''}
                                        name="themeNm" validators={['required']} errorMessages={[t("msgThemeName")]}
                                        onChange={this.handleValueChange("themeNm")}
                                    />
                                </Grid>
                                {/* 테마설명 */}
                                <Grid item xs={4}>
                                    <TextField label={t("lbThemeDesc")} className={classes.fullWidth}
                                        value={(editingItem.get('themeCmt')) ? editingItem.get('themeCmt') : ''}
                                        onChange={this.handleValueChange("themeCmt")}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    {/* 배경화면 */}
                                    <Grid container spacing={12} direction="row" justify="flex-start" 
                                        alignItems="flex-start" style={{width:'auto',margin:(20, 0)}}
                                    >
                                       <div><span style={{verticalAlign: 'middle'}}>{t("lbBackgroundSetting")}</span>
                                            <input style={{display:'none'}} id={'background-file'} type="file" accept=".png" onChange={event => this.handleImageFileChange(event, 'wallpaper')}/>
                                            <label style={{marginLeft: '10px'}} htmlFor={'background-file'}>
                                                <Button variant="contained" size='small' component="span" className={classes.button} style={{width:120,height:28,background:'#666666',color:'#ffffff',borderRadius:4,border:0}}>{t("btnUploadFile")}</Button>
                                            </label></div>
                                       <div style={{width:'100%',height:260,marginTop:10,marginBottom:10,lineHeight:'260px',overflow:'hidden',border:'1px solid #cecece',textAlign:'center'}}>
                                           {
                                                dialogType === ThemeDialog.TYPE_ADD ?
                                                    <img src={editingItem.get('wallpaper_GRFILE')} height='90%' width='auto' style={{verticalAlign:'middle'}}/>
                                                :
                                                    <img src={editingItem.get('wallpaperUrl')} height='90%' width='auto' style={{verticalAlign:'middle'}}/>
                                           }
                                       </div>
                                    </Grid>
                                    {/* 아이콘 설정 */}
                                    <Grid container spacing={12} direction="row" justify="flex-start" 
                                        alignItems="flex-start" style={{width:'inherit',margin:(20, 0)}}
                                    >
                                        <div><span style={{verticalAlign: 'middle'}}>{t("lbIconSetting")}</span></div>
                                        <div style={{width:'100%',height:260,marginTop:10,marginBottom:10,overflowX:'auto',border:'1px solid #cecece', background: '#cecece'}}>
                                            <div style={{margin:20}}>
                                            {
                                                ThemeDialog.APP_LIST && ThemeDialog.APP_LIST.map((n, i) => {
                                                    let beforeImg = '';
                                                    let actionType = 'DEL';
                                                    const defaultImg = window.location.origin + '/gpms/images/gr_icons/' + n.default;

                                                    beforeImg = editingItem.get(n.name + "_GRFILE");

                                                    if (dialogType === ThemeDialog.TYPE_EDIT) {
                                                        if (beforeImg === undefined || beforeImg === '') {
                                                            const beforeItem = editingItem.get('themeIcons').find ( o => o.get('fileEtcInfo') === n.name);
                                                            if (beforeItem) {
                                                                if (!editingItem.get(n.name + "_DELETE")) {
                                                                    beforeImg = beforeItem.get('imgUrl'); 
                                                                    if (beforeImg === defaultImg) {
                                                                        actionType = 'ADD';
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (beforeImg === undefined || beforeImg === '') {
                                                        actionType = 'ADD';
                                                    }
                                                    return (                                                        
                                                        <div key={i} style={{display: 'inline-block',width:200,height:180,position:'relative',marginRight:8,marginBottom:8,padding:'16px 10px 10px',background: '#ffffff',borderRadius: 16}}>
                                                            <div>{t(n.group)}</div>
                                                            <div style={{position:'relative',margin: '16px 10px 0'}}>
                                                                <div style={{display: 'inline-block',width:50,height:50}}>
                                                                    {/* 아이콘 위치 */}
                                                                    {(beforeImg && beforeImg !== '') ? 
                                                                        <img src={beforeImg} height="50" width="50" /> :
                                                                        <img src={defaultImg} height="50" width="50" /> 
                                                                    }
                                                                </div>
                                                                <div style={{display:'inline-block',position:'absolute',top:13,right:0,}}>
                                                                    {
                                                                        (actionType === 'DEL') ?
                                                                        <div id={n.name + '-file'} onClick={event => this.handleImageFileDelete (event, n.name)} style={{position:'relative',width:30,height:30,borderRadius:4,border:'1px solid rgb(206, 206, 206)',background:'#e9e9e9'}}>
                                                                            <DeleteOutline style={{minWidth:24,minHeight:24,position:'absolute',top:2,left:3,cursor:'pointer'}}/>
                                                                        </div>
                                                                        :
                                                                        <div style={{position:'relative',width:30,height:30,borderRadius:4,border:'1px solid rgb(206, 206, 206)',background:'#e9e9e9'}}>
                                                                            <input style={{display:'none'}} id={n.name + '-file'} type="file" accept=".svg" onChange={event => this.handleImageFileChange(event, n.name)}/>
                                                                            <label style={{marginLeft: '10px'}} htmlFor={n.name + '-file'}>
                                                                                <EditOutlined style={{minWidth:24,minHeight:24,position:'absolute',top:2,left:3,cursor:'pointer'}}/>
                                                                            </label>
                                                                        </div>
                                                                    }
                                                                </div> 
                                                            </div>                                                            
                                                            <div style={{height:50,position:'absolute',right:10,bottom:10,left:10,fontSize:14}}>
                                                                {/*넘버 주석처리 {n.no}. */}
                                                                {n.title}</div>
                                                            </div>                                                       
                                                    );
                                                })
                                            }
                                            </div>
                                        </div>                                                
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                        {(dialogType === ThemeDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                        }
                        {(dialogType === ThemeDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                        }
                            <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
  ThemeManageProps: state.ThemeManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ThemeManageActions: bindActionCreators(ThemeManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ThemeDialog)));

