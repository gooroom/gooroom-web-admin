import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DesktopAppActions from 'modules/DesktopAppModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import DesktopAppViewer from './DesktopAppViewer';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DesktopAppDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT_INAPP = 'EDIT_INAPP';
    static TYPE_EDIT_INCONF = 'EDIT_INCONF';
    static TYPE_COPY = 'COPY';

    handleClose = (event) => {
        this.props.DesktopAppActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.DesktopAppActions.setEditingItemValue({
                name: name,
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.DesktopAppActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleCreateData = (event) => {
        const { DesktopAppProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtAddDesktopApp"),
                confirmMsg: t("msgAddDesktopApp"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { DesktopAppProps, DesktopAppActions } = this.props;
                        DesktopAppActions.createDesktopAppData(DesktopAppProps.get('editingItem'))
                            .then((res) => {
                                refreshDataListInComps(DesktopAppProps, DesktopAppActions.readDesktopAppListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: DesktopAppProps.get('editingItem')
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
        const { DesktopAppProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtEditDesktopApp"),
                confirmMsg: t("msgEditDesktopApp"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { DesktopAppProps, DesktopAppActions, DesktopConfProps, DesktopConfActions } = this.props;
                        if(DesktopAppProps.get('dialogType') === DesktopAppDialog.TYPE_EDIT_INAPP || 
                            DesktopAppProps.get('dialogType') === DesktopAppDialog.TYPE_EDIT_INCONF) {
            
                            DesktopAppActions.editDesktopAppData(DesktopAppProps.get('editingItem'), this.props.compId)
                            .then((res) => {
            
                                if(DesktopAppProps.get('dialogType') === DesktopAppDialog.TYPE_EDIT_INAPP) {
            
                                    refreshDataListInComps(DesktopAppProps, DesktopAppActions.readDesktopAppListPaged);
                                    
                                } else if(DesktopAppProps.get('dialogType') === DesktopAppDialog.TYPE_EDIT_INCONF) {
                                    // 변경이 필요한 데이타를 위해 액션 리스트를 사용함.
                                    // OLD
                                    // DesktopConfActions.changedDesktopApp(DesktopConfProps, [
                                    //     DesktopConfActions.readDesktopConfListPaged, 
                                    //     DesktopConfActions.changeDesktopConfForEditing,
                                    //     DesktopConfActions.changeDesktopConfForViewItem
                                    // ], {}, {isCloseInform:true});
            
                                    // 선택된 App 리스트 처리
                                    //DesktopConfActions.changedDesktopConfForEdit(DesktopConfProps, DesktopConfActions);
                                    // 전체 APP 리스트 조회 (변경된 데이타로 주입)
                                    DesktopAppActions.readDesktopAppAllList();
                                }
                                this.handleClose();
                            });
            
                        }
                    }
                },
                confirmObject: DesktopAppProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }        
    }

    handleCopyCreateData = (event, id) => {
        const { DesktopAppProps, DesktopAppActions } = this.props;
        const { t, i18n } = this.props;
        DesktopAppActions.cloneDesktopAppData({
            'appId': DesktopAppProps.getIn(['editingItem', 'appId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyDesktopApp")
            });
            refreshDataListInComps(DesktopAppProps, DesktopAppActions.readDesktopAppListPaged);
            this.handleClose();
        });
    }

    render() {
        const { classes } = this.props;
        const { t, i18n } = this.props;

        const { DesktopAppProps } = this.props;
        const dialogType = DesktopAppProps.get('dialogType');
        const editingItem = (DesktopAppProps.get('editingItem')) ? DesktopAppProps.get('editingItem') : null;

        let title = "";
        if(dialogType === DesktopAppDialog.TYPE_ADD) {
            title = t("dtAddDesktopApp");
        } else if(dialogType === DesktopAppDialog.TYPE_VIEW) {
            title = t("dtViewDesktopApp");
        } else if(dialogType === DesktopAppDialog.TYPE_EDIT_INAPP) {
            title = t("dtEditDesktopApp");
        } else if(dialogType === DesktopAppDialog.TYPE_EDIT_INCONF) {
            title = t("dtEditDesktopApp");
        } else if(dialogType === DesktopAppDialog.TYPE_COPY) {
            title = t("dtCopyDesktopApp");
        }

        return (
            <div>
            {(DesktopAppProps.get('dialogOpen') && editingItem) &&
            <Dialog open={DesktopAppProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === DesktopAppDialog.TYPE_EDIT_INAPP || dialogType === DesktopAppDialog.TYPE_EDIT_INCONF || dialogType === DesktopAppDialog.TYPE_ADD) &&
                    <div>
                    <TextValidator label={t("lbName")} className={classes.fullWidth}
                        value={editingItem.get('appNm')}
                        name="appNm" validators={['required']} errorMessages={[t("msgInputName")]}
                        onChange={this.handleValueChange('appNm')} />
                    <TextField label={t("lbDesc")} className={classes.fullWidth}
                        value={editingItem.get('appInfo')}
                        onChange={this.handleValueChange('appInfo')} />
                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop:12}}>
                        <Grid xs={4} item>
                            <FormLabel component="legend">{t("lbDesktopAppType")}</FormLabel>
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="application" control={
                                <Radio color="primary" value="application" onChange={this.handleValueChange('appGubun')} checked={editingItem.get('appGubun') === 'application'} />
                            } label="Application" labelPlacement="end" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="mount" control={
                                <Radio color="primary" value="mount" onChange={this.handleValueChange('appGubun')} checked={editingItem.get('appGubun') === 'mount'} />
                            } label={t("lbMountApp")} labelPlacement="end" />
                        </Grid>
                    </Grid>
                    
                    <TextField label={t("lbExecuteCmd")} className={classes.fullWidth} multiple
                        value={editingItem.get('appExec')}
                        onChange={this.handleValueChange('appExec')} />
                    {(editingItem.get('appGubun') === 'mount') && 
                    <div>
                    <TextField label={t("lbMountUrl")} className={classes.fullWidth}
                        value={editingItem.get('appMountUrl')}
                        onChange={this.handleValueChange('appMountUrl')} />
                    <TextField label={t("lbMountPoint")} className={classes.fullWidth}
                        value={editingItem.get('appMountPoint')}
                        onChange={this.handleValueChange('appMountPoint')} />
                    </div>
                    }

                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop:12}}>
                        <Grid xs={4} item>
                            <FormLabel component="legend">{t("lbServiceStatus")}</FormLabel>
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="STAT010" control={
                                <Radio color="primary" value="STAT010" onChange={this.handleValueChange("statusCd")} checked={editingItem.get('statusCd') === 'STAT010'} />
                            } label={t("selSeviceOn")} labelPlacement="end" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="STAT020" control={
                                <Radio color="primary" value="STAT020" onChange={this.handleValueChange("statusCd")} checked={editingItem.get('statusCd') === 'STAT020'} />
                            } label={t("selSeviceOff")} labelPlacement="end" />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop:12,marginBottom:12}}>
                        <Grid xs={4} item>
                            <FormLabel component="legend">{t("lbIconDivision")}</FormLabel>
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="favicon" control={
                                <Radio color="primary" value="favicon" onChange={this.handleValueChange("iconGubun")} checked={editingItem.get('iconGubun') === 'favicon'} />
                            } label={t("lbUseFavicon")} labelPlacement="end" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="library" control={
                                <Radio color="primary" value="library" onChange={this.handleValueChange("iconGubun")} checked={editingItem.get('iconGubun') === 'library'} />
                            } label={t("lbUseIconLib")} labelPlacement="end" />
                        </Grid>
                    </Grid>
                    {(editingItem.get('iconGubun') === 'favicon') && 
                    <TextField label={t("lbFaviconUrl")} className={classes.fullWidth}
                        value={(editingItem.get('iconUrl')) ? editingItem.get('iconUrl') : ''}
                        onChange={this.handleValueChange("iconUrl")} />
                    }
                    {(editingItem.get('iconGubun') === 'library') && 
                    <FormControl className={classes.fullWidth}>
                        <InputLabel htmlFor="iconId">{t("lbIconType")}</InputLabel>
                        <Select value={(editingItem.get('iconId')) ? editingItem.get('iconId') : ''}
                            onChange={this.handleValueChange('iconId')}
                            name="iconId" style={{marginTop: 'theme.spacing.unit * 2'}}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="gooroom-cloud-storage">cloud storage</MenuItem>
                            <MenuItem value="gooroom-web-office">web office</MenuItem>
                            <MenuItem value="gooroom-sns">office SNS</MenuItem>
                            <MenuItem value="gooroom-collaboration">team</MenuItem>
                            <MenuItem value="gooroom-video-conference">video conferencing system</MenuItem>
                            <MenuItem value="gooroom-groupware">groupware</MenuItem>
                            <MenuItem value="accessories-text-editor">memo</MenuItem>
                            <MenuItem value="gooroom-kms">KMS</MenuItem>
                            <MenuItem value="gooroom-erp">ERP</MenuItem>
                            <MenuItem value="gooroom-accounting-management">accounting management</MenuItem>
                            <MenuItem value="gooroom-personnel-management">personnel management</MenuItem>
                            <MenuItem value="gooroom-other-applications">etc applications</MenuItem>
                            <MenuItem value="preferences-system-firewall">security status</MenuItem>
                            <MenuItem value="applets-screenshooter">screenshot</MenuItem>
                            <MenuItem value="gooroom-smartcard-register">smartcard register</MenuItem>
                            <MenuItem value="gooroom-client-server-register">gooroom terminal server</MenuItem>
                            <MenuItem value="synaptic">package management</MenuItem>
                            <MenuItem value="gooroomupdater">updater</MenuItem>
                            <MenuItem value="file-roller">archiver</MenuItem>
                            <MenuItem value="io.github.GnomeMpv">multimedia</MenuItem>
                            <MenuItem value="galculator">calculator</MenuItem>
                            <MenuItem value="preferences-system-network">network management</MenuItem>
                            <MenuItem value="org.gnome.Nautilus">file manager</MenuItem>
                            <MenuItem value="gooroom-browser">gooroom browser</MenuItem>
                        </Select>
                    </FormControl>
                    }
                    </div>
                }
                {(dialogType === DesktopAppDialog.TYPE_COPY) &&
                    <div>
                    <Typography variant="body1">
                        {t("msgCopyRule")}
                    </Typography>
                    <DesktopAppViewer viewItem={editingItem} />
                    </div>
                }
                </DialogContent>
                <DialogActions>
                {(dialogType === DesktopAppDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === DesktopAppDialog.TYPE_EDIT_INAPP) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === DesktopAppDialog.TYPE_EDIT_INCONF) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === DesktopAppDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("btnCopy")}</Button>
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
    DesktopAppProps: state.DesktopAppModule,
    DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
    DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch),
    DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppDialog)));

