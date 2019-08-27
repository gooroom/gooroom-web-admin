import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';
import { refreshDataListInComps } from 'components/GRUtils/GRTableListUtils';

import ClientConfSettingSpec from './ClientConfSettingSpec';
import LogLevelSelect from 'views/Options/LogLevelSelect';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Divider from "@material-ui/core/Divider";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Radio from '@material-ui/core/Radio';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientConfSettingDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';
    static TYPE_INHERIT_DEPT = 'INHERIT_DEPT';
    static TYPE_INHERIT_GROUP = 'INHERIT_GROUP';
    static TYPE_COPY = 'COPY';

    componentDidMount() {
        // GreaterThanZero
        ValidatorForm.addValidationRule('isGreaterThanZero', (value) => {
            if (value > 0) {
                return true;
            }
            return false;
        });
    }

    handleClose = (event) => {
        this.props.ClientConfSettingActions.closeDialog();
    }

    handleValueChange = name => event => {
        const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        ClientConfSettingActions.setEditingItemValue({
            name: name,
            value: value
        });
        // handle 'isDeleteLog'
        if(name == 'isDeleteLog' && event.target.type === 'checkbox' && !event.target.value) {
            const editingItem = (ClientConfSettingProps.get('editingItem')) ? ClientConfSettingProps.get('editingItem') : null;
            if(editingItem && editingItem.get('logRemainDate') == '0') {
                ClientConfSettingActions.setEditingItemValue({ name: 'logRemainDate', value: '1' });
            }            
        }
    }

    handleWhiteIpValueChange = index => event => {
        this.props.ClientConfSettingActions.setWhiteIpValue({
            index: index,
            value: event.target.value
        });
    }

    handleCreateData = (event) => {
        const { ClientConfSettingProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtAddClientConf"),
                confirmMsg: t("msgAddClientConf"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
                        ClientConfSettingActions.createClientConfSettingData(paramObject)
                            .then((res) => {
                                refreshDataListInComps(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: ClientConfSettingProps.get('editingItem')
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
        const { ClientConfSettingProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t("dtEditClientConf"),
                confirmMsg: t("msgEditClientConf"),
                handleConfirmResult: (confirmValue, paramObject) => {
                    if(confirmValue) {
                        const { ClientConfSettingProps, ClientConfSettingActions, compId } = this.props;
                        ClientConfSettingActions.editClientConfSettingData(paramObject, compId)
                            .then((res) => {
                                refreshDataListInComps(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
                                this.handleClose();
                            });
                    }
                },
                confirmObject: ClientConfSettingProps.get('editingItem')
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
    }

    handleInheritSaveDataForGroup = (event, id) => {
        const { ClientConfSettingProps, ClientGroupProps, ClientConfSettingActions, compId } = this.props;
        const { t, i18n } = this.props;
        const grpId = ClientGroupProps.getIn(['viewItems', compId, 'viewItem', 'grpId']);

        ClientConfSettingActions.inheritClientConfSettingDataForGroup({
            'objId': ClientConfSettingProps.getIn(['editingItem', 'objId']),
            'grpId': grpId
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgApplyClientConfChild")
            });
            this.handleClose();
        });
    }

    handleCopyCreateData = (event, id) => {
        const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
        const { t, i18n } = this.props;
        ClientConfSettingActions.cloneClientConfSettingData({
            'objId': ClientConfSettingProps.getIn(['editingItem', 'objId'])
        }).then((res) => {
            this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: t("msgCopyClientConf")
            });
            refreshDataListInComps(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
            this.handleClose();
        });
    }

    handleChangeLogLevelSelect = (event, child) => {
        const { ClientConfSettingProps, ClientConfSettingActions, CommonOptionProps } = this.props;

        const name = event.target.name;
        const value = event.target.value;
        const logType = name.split('_')[0];
        const logGubun = name.split('_')[1];
        const levelNo = child.props.levelno;

        if(logType == 'notify') {
            ClientConfSettingActions.setEditingItemValue({
                name: logGubun + '_minno',
                value: levelNo
            });
            if(levelNo > ClientConfSettingProps.getIn(['editingItem', logGubun+'_minno'])) {
                // get bigger item in Show-Data
                const biggerShowItem = CommonOptionProps.logLevelShowData.find((n) => (n.levelNo >= levelNo));
                ClientConfSettingActions.setEditingItemValue({ name: 'transmit_'+logGubun , value: biggerShowItem.levelVal });

                // get bigger item in Transmit-Data
                const biggerTransmitItem = CommonOptionProps.logLevelTransmitData.find((n) => (n.levelNo >= levelNo));
                ClientConfSettingActions.setEditingItemValue({ name: 'show_'+logGubun , value: biggerTransmitItem.levelVal });
            }
        }
        ClientConfSettingActions.setEditingItemValue({
            name: name,
            value: value
        });
    };

    handleAddWhiteIp = () => {
        const { ClientConfSettingActions } = this.props;
        ClientConfSettingActions.addWhiteIp();
    }

    handleDeleteWhiteIp = index => event => {
        const { ClientConfSettingActions } = this.props;
        ClientConfSettingActions.deleteWhiteIp(index);
    }

    render() {
        const { classes } = this.props;
        const { t, i18n } = this.props;

        const bull = <span className={classes.bullet}>•</span>;
        const cartBull = <span className={classes.cartBullet}>#</span>;

        const { ClientConfSettingProps, CommonOptionProps } = this.props;
        const dialogType = ClientConfSettingProps.get('dialogType');
        const editingItem = (ClientConfSettingProps.get('editingItem')) ? ClientConfSettingProps.get('editingItem') : null;

        let title = "";
        if(dialogType === ClientConfSettingDialog.TYPE_ADD) {
            title = t("dtAddClientConf");
            if(window.gpmsain === Constants.SUPER_RULECODE) {
                title += " - " + t("selStandard");
            }
        } else if(dialogType === ClientConfSettingDialog.TYPE_VIEW) {
            title = t("dtViewClientConf");
        } else if(dialogType === ClientConfSettingDialog.TYPE_EDIT) {
            title = t("dtEditClientConf");
        } else if(dialogType === ClientConfSettingDialog.TYPE_INHERIT_DEPT || dialogType === ClientConfSettingDialog.TYPE_INHERIT_DEPT) {
            title = t("dtInheritClientConf");
        } else if(dialogType === ClientConfSettingDialog.TYPE_COPY) {
            title = t("dtCopyClientConf");
        }

        return (
            <div>
            {((ClientConfSettingProps.get('dialogOpen') && editingItem)) &&
            <Dialog open={ClientConfSettingProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === ClientConfSettingDialog.TYPE_EDIT || dialogType === ClientConfSettingDialog.TYPE_ADD) &&
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
                        <Grid container spacing={0} alignItems="flex-end" direction="row" justify="space-between" style={{margin:'0 0 8 0'}}>
                            <Grid item xs={4}>
                                <div style={{marginTop:"10px"}}>
                                    <FormLabel style={{marginRight:"50px"}}>{bull} {t("dtInitHomeFolder")}</FormLabel>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('useHomeReset')} color="primary"
                                            checked={(editingItem.get('useHomeReset')) ? editingItem.get('useHomeReset') : false} />
                                        }
                                        label={(editingItem.get('useHomeReset')) ? t("selExecute") : t("selStop")}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div style={{marginTop:"10px"}}>
                                    <FormLabel style={{marginRight:"50px"}}>{bull} {t("dtRootAllow")}</FormLabel>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('rootAllow')} color="primary"
                                            checked={(editingItem.get('rootAllow')) ? editingItem.get('rootAllow') : false} />
                                        }
                                        label={(editingItem.get('rootAllow')) ? t("selActive") : t("selInActive")}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div style={{marginTop:"10px"}}>
                                    <FormLabel style={{marginRight:"50px"}}>{bull} {t("dtSudoAllow")}</FormLabel>
                                    <FormControlLabel
                                        control={
                                        <Switch onChange={this.handleValueChange('sudoAllow')} color="primary"
                                            checked={(editingItem.get('sudoAllow')) ? editingItem.get('sudoAllow') : false} />
                                        }
                                        label={(editingItem.get('sudoAllow')) ? t("selActive") : t("selInActive")}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={6}></Grid>
                        </Grid>
                        <Paper elevation={4} style={{padding:10,marginBottom:10,backgroundColor:'#d8e1ec'}}>
                        <div style={{margin:'8 0 32 0'}}>
                            <FormLabel >{bull} {t("lbViolatedLogLebel")}</FormLabel>
                            <Table style={{margin:'8 0 0 0'}}>
                                <TableBody>
                                    <TableRow>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtTrustedBoot")}</InputLabel>
                                        <LogLevelSelect name="notify_boot" no
                                            logLevelData={CommonOptionProps.logLevelNotifyData}
                                            value={(editingItem.get('notify_boot')) ? editingItem.get('notify_boot') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtOSProtect")}</InputLabel>
                                        <LogLevelSelect name="notify_os" 
                                            logLevelData={CommonOptionProps.logLevelNotifyData}
                                            value={(editingItem.get('notify_os')) ? editingItem.get('notify_os') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtExeProtect")}</InputLabel>
                                        <LogLevelSelect name="notify_exe" 
                                            logLevelData={CommonOptionProps.logLevelNotifyExeData}
                                            value={(editingItem.get('notify_exe')) ? editingItem.get('notify_exe') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtMediaProtect")}</InputLabel>
                                        <LogLevelSelect name="notify_media" 
                                            logLevelData={CommonOptionProps.logLevelNotifyData}
                                            value={(editingItem.get('notify_media')) ? editingItem.get('notify_media') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtAgent")}</InputLabel>
                                        <LogLevelSelect name="notify_agent" 
                                            logLevelData={CommonOptionProps.logLevelNotifyData}
                                            value={(editingItem.get('notify_agent')) ? editingItem.get('notify_agent') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        </Paper>
                        <Paper elevation={4} style={{padding:10,marginBottom:10,backgroundColor:'#d8e1ec'}}>
                        <div style={{margin:'8 0 32 0'}}>

                            <FormLabel >{bull} {t("lbClientLogLevel")}</FormLabel>
                            <Table style={{margin:'8 0 16 0'}}>
                                <TableBody>
                                    <TableRow>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtTrustedBoot")}</InputLabel>
                                        <LogLevelSelect name="show_boot" minNo={editingItem.get('boot_minno')}
                                            logLevelData={CommonOptionProps.logLevelShowData}
                                            value={(editingItem.get('show_boot')) ? editingItem.get('show_boot') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtOSProtect")}</InputLabel>
                                        <LogLevelSelect name="show_os" minNo={editingItem.get('os_minno')}
                                            logLevelData={CommonOptionProps.logLevelShowData}
                                            value={(editingItem.get('show_os')) ? editingItem.get('show_os') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtExeProtect")}</InputLabel>
                                        <LogLevelSelect name="show_exe" minNo={editingItem.get('exe_minno')}
                                            logLevelData={CommonOptionProps.logLevelShowData}
                                            value={(editingItem.get('show_exe')) ? editingItem.get('show_exe') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtMediaProtect")}</InputLabel>
                                        <LogLevelSelect name="show_media" minNo={editingItem.get('media_minno')}
                                            logLevelData={CommonOptionProps.logLevelShowData}
                                            value={(editingItem.get('show_media')) ? editingItem.get('show_media') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtAgent")}</InputLabel>
                                        <LogLevelSelect name="show_agent" minNo={editingItem.get('agent_minno')}
                                            logLevelData={CommonOptionProps.logLevelShowData}
                                            value={(editingItem.get('show_agent')) ? editingItem.get('show_agent') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        </Paper>
                        <Paper elevation={4} style={{padding:10,marginBottom:10,backgroundColor:'#d8e1ec'}}>
                        <div style={{margin:'8 0 0 0'}}>
                            <FormLabel>{bull} {t("lbServerLogLevel")}</FormLabel>
                            <Table style={{margin:'8 0 0 0'}}>
                                <TableBody>
                                    <TableRow>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtTrustedBoot")}</InputLabel>
                                        <LogLevelSelect name="transmit_boot" minNo={editingItem.get('boot_minno')}
                                            logLevelData={CommonOptionProps.logLevelTransmitData}
                                            value={(editingItem.get('transmit_boot')) ? editingItem.get('transmit_boot') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtOSProtect")}</InputLabel>
                                        <LogLevelSelect name="transmit_os" minNo={editingItem.get('os_minno')}
                                            logLevelData={CommonOptionProps.logLevelTransmitData}
                                            value={(editingItem.get('transmit_os')) ? editingItem.get('transmit_os') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtExeProtect")}</InputLabel>
                                        <LogLevelSelect name="transmit_exe" minNo={editingItem.get('exe_minno')}
                                            logLevelData={CommonOptionProps.logLevelTransmitData}
                                            value={(editingItem.get('transmit_exe')) ? editingItem.get('transmit_exe') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtMediaProtect")}</InputLabel>
                                        <LogLevelSelect name="transmit_media" minNo={editingItem.get('media_minno')}
                                            logLevelData={CommonOptionProps.logLevelTransmitData}
                                            value={(editingItem.get('transmit_media')) ? editingItem.get('transmit_media') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    <TableCell style={{width:'20%'}} component="th" scope="row">
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="client-status">{t("dtAgent")}</InputLabel>
                                        <LogLevelSelect name="transmit_agent" minNo={editingItem.get('agent_minno')}
                                            logLevelData={CommonOptionProps.logLevelTransmitData}
                                            value={(editingItem.get('transmit_agent')) ? editingItem.get('transmit_agent') : ""}
                                            onChangeSelect={this.handleChangeLogLevelSelect}
                                        />
                                    </FormControl>
                                    </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Grid container spacing={0} alignItems="flex-end" direction="row" justify="space-between" style={{margin:'8 0 16 0'}}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <div style={{marginTop:"10px"}}>
                                        <FormLabel style={{marginRight:"50px"}}>{bull} {t("lbDeleteAfterSend")}</FormLabel>
                                        <FormControlLabel
                                            control={
                                            <Switch onChange={this.handleValueChange('isDeleteLog')} color="primary"
                                                checked={(editingItem.get('isDeleteLog')) ? editingItem.get('isDeleteLog') : false} />
                                            }
                                            label={(editingItem.get('isDeleteLog')) ? t("selDelete") : t("selNoDelete")}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                <TextValidator name="logRemainDate" label={t("lbSaveDateAfterSend")} 
                                    validators={['required', 'isGreaterThanZero']}
                                    errorMessages={[t("msgValidOnlyUpperZero"), t("msgValidOnlyUpperZero")]}
                                    value={(editingItem.get('logRemainDate')) ? editingItem.get('logRemainDate') : ''}
                                    onChange={this.handleValueChange("logRemainDate")}
                                    className={classes.fullWidth}
                                    disabled={!(editingItem.get('isDeleteLog'))}
                                />
                                </Grid>
                            </Grid>
                        </div>
                        </Paper>
                        <Typography variant="body1">{bull} {t("dtClientLogSetup")}</Typography>
                            <Grid container spacing={16} alignItems="flex-end" direction="row" justify="flex-start" style={{margin:'0 0 16 0'}}>
                                <Grid item xs={12} sm={4} md={4}>
                                <TextValidator name="logFileMax" label={t("lbLogFileMax")}
                                    validators={['required', 'minNumber:1', 'maxNumber:10000', 'isNumber']}
                                    errorMessages={[t("msgInvalidNumber"), t("msgInvalidValue"), t("msgInvalidValue"), t("msgTypeNumberOnly")]}
                                    value={(editingItem.get('logMaxSize')) ? editingItem.get('logMaxSize') : ''}
                                    onChange={this.handleValueChange("logMaxSize")}
                                    className={classNames(classes.fullWidth)}
                                />
                                <Typography variant="caption">{t("msgInputRange") + ": 1 ~ 10000"}</Typography>
                                <Typography variant="caption">{t("msgMegabateUnit")}</Typography>
                                <Typography variant="caption">{t("msgCreateNewFileIfMax")}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                <TextValidator name="logFileCount" label={t("lbSavedLogFileCount")}
                                    validators={['required', 'minNumber:1', 'maxNumber:5', 'isNumber']}
                                    errorMessages={[t("msgInvalidNumber"), t("msgInvalidValue"), t("msgInvalidValue"), t("msgTypeNumberOnly")]}
                                    value={(editingItem.get('logMaxCount')) ? editingItem.get('logMaxCount') : ''}
                                    onChange={this.handleValueChange("logMaxCount")}
                                    className={classNames(classes.fullWidth)}
                                />
                                <Typography variant="caption">{t("msgInputRange") + ": 1 ~ 5"}</Typography>
                                <Typography variant="caption">{t("msgRemainFileSettingCount")}</Typography>
                                <Typography variant="caption">{t("msgDeleteFileIfOverCount")}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                <TextValidator name="diskSizeRate" label={t("lbMinimumDiskSizeRate")}
                                    validators={['required', 'minNumber:1', 'maxNumber:30', 'isNumber']}
                                    errorMessages={[t("msgInvalidNumber"), t("msgInvalidValue"), t("msgInvalidValue"), t("msgTypeNumberOnly")]}
                                    value={(editingItem.get('systemKeepFree')) ? editingItem.get('systemKeepFree') : ''}
                                    onChange={this.handleValueChange("systemKeepFree")}
                                    className={classNames(classes.fullWidth)}
                                />
                                <Typography variant="caption">{t("msgInputRange") + ": 1 ~ 30"}</Typography>
                                <Typography variant="caption">{t("msgHelpMinimumDiskSizeRate")}</Typography>
                                <Typography variant="caption">{t("msgHelpDiskSizeData")}</Typography>
                                </Grid>
                            </Grid>

                        <Grid container spacing={0} alignItems="flex-end" direction="row" justify="space-between" style={{margin:'20px 0px 8px 0px'}}>
                            <Grid item xs={6}>
                                <FormLabel style={{marginRight:"20px"}}>{bull} {t("dtSetupConnectableIp")}</FormLabel>
                                <Button onClick={this.handleAddWhiteIp} variant="contained" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">{t("btnAdd")}</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel style={{marginRight:"50px"}}>{bull} {t("dtPermitAllIp")}</FormLabel>
                                <FormControlLabel style={{height:27}}
                                    control={
                                    <Switch onChange={this.handleValueChange('whiteIpAll')} color="primary"
                                        checked={(editingItem.get('whiteIpAll')) ? editingItem.get('whiteIpAll') : false} />
                                    }
                                    label={(editingItem.get('whiteIpAll')) ? t("selPermit") : t("selNoPermit")}
                                />
                            </Grid>
                        </Grid>
                            <div style={{maxHeight:140,overflow:'auto'}}>
                                <Grid container spacing={0} alignItems="flex-end" direction="row" justify="flex-start" style={{margin:'0 0 16 0'}}>
                                {editingItem.get('whiteIp') && editingItem.get('whiteIp').size > 0 && editingItem.get('whiteIp').map((value, index) => (
                                    <Grid item xs={6} key={index}>
                                        <TextValidator style={{width:'80%'}}
                                            name="whiteIp" validators={['matchRegexp:^[0-9.*-]+$']}
                                            errorMessages={[t("msgWrongIpString")]}
                                            value={value}
                                            onChange={this.handleWhiteIpValueChange(index)}
                                        />
                                        <IconButton onClick={this.handleDeleteWhiteIp(index)} aria-label="WhiteIpDelete">
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Grid>
                                ))}
                                </Grid>
                            </div>

                    </div>
                    }
                    {(dialogType === ClientConfSettingDialog.TYPE_INHERIT_DEPT || dialogType === ClientConfSettingDialog.TYPE_INHERIT_DEPT) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgApplyRuleToChild")}
                        </Typography>
                        <ClientConfSettingSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                    {(dialogType === ClientConfSettingDialog.TYPE_COPY) &&
                        <div>
                        <Typography variant="body1">
                            {t("msgCopyRule")}
                        </Typography>
                        <ClientConfSettingSpec selectedItem={editingItem} hasAction={false} />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                {(dialogType === ClientConfSettingDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                }
                {(dialogType === ClientConfSettingDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                }
                {(dialogType === ClientConfSettingDialog.TYPE_INHERIT_DEPT) &&
                    <Button onClick={this.handleInheritSaveDataForDept} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === ClientConfSettingDialog.TYPE_INHERIT_GROUP) &&
                    <Button onClick={this.handleInheritSaveDataForGroup} variant='contained' color="secondary">{t("dtApply")}</Button>
                }
                {(dialogType === ClientConfSettingDialog.TYPE_COPY) &&
                    <Button onClick={this.handleCopyCreateData} variant='contained' color="secondary">{t("dtCopy")}</Button>
                }

                <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
                <GRConfirm />
            </Dialog>
            }
            {/*<GRAlert /> */}
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientConfSettingProps: state.ClientConfSettingModule,
    ClientGroupProps: state.ClientGroupModule,
    CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientConfSettingDialog)));

