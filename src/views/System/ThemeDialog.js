import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ThemeManageActions from 'modules/ThemeManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

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
//import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class ThemeDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    static APP_LIST = [
        {no:1, title:'cloud storage', name:'gooroom-cloud-storage'},
        {no:2, title:'web office', name:'gooroom-web-office'},
        {no:3, title:'office SNS', name:'gooroom-sns'},
        {no:4, title:'team', name:'gooroom-collaboration'},
        {no:5, title:'video conferencing system', name:'gooroom-video-conference'},
        {no:6, title:'groupware', name:'gooroom-groupware'},
        {no:7, title:'memo', name:'memo'},
        {no:8, title:'KMS', name:'gooroom-kms'},
        {no:9, title:'ERP', name:'gooroom-erp'},
        {no:10, title:'accounting management', name:'gooroom-accounting-management'},
        {no:11, title:'personnel management', name:'gooroom-personnel-management'},
        {no:12, title:'etc applications', name:'gooroom-other-applications'},
        {no:13, title:'security status', name:'preferences-system-firewall'},
        {no:14, title:'screenshot', name:'applets-screenshooter'},
        {no:15, title:'smartcard register', name:'gooroom-smartcard-register'},
        {no:16, title:'gooroom terminal server', name:'gooroom-client-server-register'},
        {no:17, title:'package management', name:'synaptic'},
        {no:18, title:'updater', name:'gooroomupdater'},
        {no:19, title:'archiver', name:'file-roller'},
        {no:20, title:'multimedia', name:'io.github.GnomeMpv'},
        {no:21, title:'calculator', name:'galculator'},
        {no:22, title:'network management', name:'preferences-system-network'},
        {no:23, title:'file manager', name:'org.gnome.Nautilus'},
        {no:24, title:'gooroom browser', name:'gooroom-browser'}
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

    makeParameter = (paramObject) => {

        let dataParam = Map({
            themeId: paramObject.get('themeId'),
            themeNm: paramObject.get('themeNm'),
            themeCmt: paramObject.get('themeCmt')
        });
        ThemeDialog.APP_LIST.map(n => {
            dataParam = dataParam.set(n.name, paramObject.get(n.name));
        });
        return dataParam.toJS();
    }

    // 생성
    handleCreateData = (event) => {
        const { ThemeManageProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
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
            ThemeManageActions.createThemeData(this.makeParameter(paramObject)).then((res) => {
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
            ThemeManageActions.editThemeData(this.makeParameter(paramObject)).then((res) => {
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

        const defaultThemes = ThemeManageProps.getIn(['viewItems', compId, 'listData']);
        const defaultTheme = defaultThemes && defaultThemes.get(0).getIn(['themeIcons']);

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
                                            <input style={{display:'none'}} id={'background-file'} type="file" onChange={event => this.handleImageFileChange(event, 'beforeBackground')}/>
                                            <label style={{marginLeft: '10px'}} htmlFor={'background-file'}>
                                                <Button variant="contained" size='small' component="span" className={classes.button} style={{width:120,height:28,background:'#666666',color:'#ffffff',borderRadius:4,border:0}}>{t("btnUploadFile")}</Button>
                                            </label></div>
                                       <div style={{width:'100%',height:260,marginTop:10,marginBottom:10,lineHeight:'260px',overflow:'hidden',border:'1px solid #cecece',textAlign:'center'}}>
                                           {
                                                <img src={editingItem.get('beforeBackground_GRFILE')} height='90%' width='auto' style={{verticalAlign:'middle'}}/>
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
                                                {ThemeDialog.APP_LIST && ThemeDialog.APP_LIST.map((n, i) => {
                                                    let beforeImg = '';
                                                    let defaultImg = '';
                                                    let actionType = 'DEL';

                                                    if(dialogType === ThemeDialog.TYPE_ADD) {
                                                        beforeImg = editingItem.get(n.name + "_GRFILE");
                                                        if (beforeImg === undefined || beforeImg === '') {
                                                            const iconItem = defaultTheme.find(icon => {
                                                                return icon.get('fileEtcInfo') == n.name;
                                                            });
                                                            if(iconItem && iconItem.get('fileName') && iconItem.get('fileName') !== '') {
                                                                defaultImg = iconItem.get('imgUrl') + iconItem.get('fileName');
                                                            }
                                                            actionType = 'ADD';
                                                        }
                                                    }
                                                    return (                                                        
                                                        <div key={i} style={{display: 'inline-block',width:200,height:160,marginRight:8,marginBottom:8,padding:10,background: '#ffffff',borderRadius: 16}}>
                                                            <div>{t("lbUtility")}</div>
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
                                                                            <input style={{display:'none'}} id={n.name + '-file'} type="file" onChange={event => this.handleImageFileChange(event, n.name)}/>
                                                                            <label style={{marginLeft: '10px'}} htmlFor={n.name + '-file'}>
                                                                                {
                                                                                    (actionType === 'DEL') ?  <DeleteOutline style={{minWidth:24,minHeight:24,position:'absolute',top:2,left:3,cursor:'pointer'}}/> : <EditOutlined style={{minWidth:24,minHeight:24,position:'absolute',top:2,left:3,cursor:'pointer'}}/>
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    }
                                                                </div> 
                                                            </div>                                                            
                                                            <div style={{height:50,marginTop:8,fontSize:14}}>
                                                                {/*넘버 주석처리 {n.no}. */}
                                                                {n.title}</div>
                                                        </div>                                                       
                                                    );
                                                })}
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
            
            // <Dialog open={ThemeManageProps.get('dialogOpen')} fullWidth={true} maxWidth="sm">
            //     <ValidatorForm ref="form">
            //     <DialogTitle>{title}</DialogTitle>
            //     <DialogContent>
            //     {(dialogType === ThemeDialog.TYPE_EDIT) &&
            //         <TextField label={t("lbThemeId")} className={classes.fullWidth}
            //             value={(editingItem.get('themeId')) ? editingItem.get('themeId') : ''}
            //         />
            //     }
            //         <TextValidator label={t("lbThemeName")} className={classes.fullWidth}
            //             value={(editingItem.get('themeNm')) ? editingItem.get('themeNm') : ''}
            //             name="themeNm" validators={['required']} errorMessages={[t("msgThemeName")]}
            //             onChange={this.handleValueChange("themeNm")}
            //         />
            //         <TextField label={t("lbThemeDesc")} className={classes.fullWidth}
            //             value={(editingItem.get('themeCmt')) ? editingItem.get('themeCmt') : ''}
            //             onChange={this.handleValueChange("themeCmt")}
            //         />
            //         <div style={{marginTop:20}}></div>
            //         <FormLabel>{t("lbIconSetting")}</FormLabel>
            //         <div style={{maxHeight:270,overflowY:'auto'}}>
            //         <Table>
            //             <TableBody>
            //                 {ThemeDialog.APP_LIST && ThemeDialog.APP_LIST.map(n => {
            //                     let beforeImg = '';
            //                     if(dialogType == ThemeDialog.TYPE_EDIT) {
            //                         const iconItem = editingItem.get('themeIcons').find(icon => {
            //                             return icon.get('fileEtcInfo') == n.name;
            //                         });
            //                         if(iconItem && iconItem.get('fileName') && iconItem.get('fileName') !== '') {
            //                             beforeImg = iconItem.get('imgUrl') + iconItem.get('fileName');
            //                         }                                    
            //                     }

            //                     return (
            //                         <TableRow hover key={n.no}>
            //                             <TableCell style={{width:230}}>{n.no}. {n.title}</TableCell>
            //                             {(dialogType === ThemeDialog.TYPE_EDIT) &&
            //                                 <TableCell style={{width:50}}>
            //                                 {(beforeImg && beforeImg !== '') && 
            //                                     <img src={beforeImg} height="50" style={{border:'solid 1 red'}} />
            //                                 }
            //                                 </TableCell>
            //                             }
            //                             <TableCell style={{width:80}}>
            //                                 <input style={{display:'none'}} id={n.name + '-file'} type="file" onChange={event => this.handleImageFileChange(event, n.name)} />
            //                                 <label htmlFor={n.name + '-file'}>
            //                                     <Button variant="contained" size='small' component="span" className={classes.button}>{t("btnSelectFile")}</Button>
            //                                 </label>
            //                             </TableCell>
            //                             <TableCell>
            //                                 <img src={editingItem.get(n.name + '_GRFILE')} height="50" />
            //                             </TableCell>
            //                         </TableRow>
            //                     );
            //                 })}
            //             </TableBody>
            //         </Table>
            //         </div>
            //     </DialogContent>
            //     <DialogActions>
            //     {(dialogType === ThemeDialog.TYPE_ADD) &&
            //         <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
            //     }
            //     {(dialogType === ThemeDialog.TYPE_EDIT) &&
            //         <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
            //     }
            //     <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
            //     </DialogActions>
            //     </ValidatorForm>
            // </Dialog>
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
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ThemeDialog)));

