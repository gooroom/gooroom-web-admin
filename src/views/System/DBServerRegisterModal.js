import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Grid, FormControl, Select, Checkbox, ListItemText, InputLabel, FormHelperText } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HealthCheckActions from 'modules/HealthCheckModule';
import * as GRAlertActions from "modules/GRAlertModule";
import { translate } from "react-i18next";

const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
const urlRegex = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

const DBServerRegisterModal = ({ open, onClose, onSubmit, HealthCheckActions, GRAlertActions, t }) => {

    const resetForm = () => {
        setServerName('');
        setDbType('mysql');
        setSid('');
        setUsername('');
        setPassword('');
        setServerUrl('');
        setPort('');
        setSchedule('1');
        setNote('');
        setDbCheckItems([{ itemName: '', query: '' }]);
        setSelectedCheckItems([]);
        setErrors({
            serverName: '',
            serverUrl: ''
        });
    };

    const [serverName, setServerName] = useState('');
    const [sid, setSid] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverUrl, setServerUrl] = useState('');
    const [port, setPort] = useState('');
    const [schedule, setSchedule] = useState('1');
    const [note, setNote] = useState('');
    const [dbCheckItems, setDbCheckItems] = useState([{ itemName: '', query: '' }]);
    const [dbType, setDbType] = useState('mysql');
    const [selectedCheckItems, setSelectedCheckItems] = useState([]);
    const checkItems = ["Memory used", "database total size", "Threads connected", "Aborted connects"];


    const [errors, setErrors] = useState({
        serverName: '',
        sid:'',
        username:'',
        password:'',
        serverUrl: '',
        port:'',
        selectedCheckItems:''
    });

    const validate = () => {
        const newErrors = { serverName: '',sid:'',username:'',password:'', serverUrl: '',port:'',selectedCheckItems:'' };

        if (!serverName.match(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]{1,100}$/)) {
            newErrors.serverName = t("lblErrorTitle");
        }

        if(!serverName){
            newErrors.serverName = t("lblErrorEmpty")
        }


        if(!sid){
            newErrors.sid = t("lblErrorEmpty")
        }

        if(!username){
            newErrors.username = t("lblErrorEmpty")
        }

        if(!password){
            newErrors.password = t("lblErrorEmpty")
        }

        if (!serverUrl.match(ipRegex) && !serverUrl.match(urlRegex)) {
            newErrors.serverUrl = t('lblErrorUrl');
        }

        if(!serverUrl){
            newErrors.serverUrl = t("lblErrorEmpty")
        }

        if(isNaN(port) || +port < 1 || +port > 65535){
            newErrors.port = t("lblErrorPort")
        }

        if(!port){
            newErrors.port = t("lblErrorEmpty")
        }

        if(!selectedCheckItems || !selectedCheckItems.length){
            newErrors.selectedCheckItems = t('lblErrorEmpty')
        }

        setErrors(newErrors);

        if(Object.values(newErrors).some(message => message)) return false;
        return true;
    };

    const customEncryptPassword = (pw) => {
        const encodedPW = btoa(pw)
        const reversedEncodedPW = encodedPW.split("").reverse().join("")
        return reversedEncodedPW
    }

    const handleSubmit = () => {
        if (validate()) {
            const newDBServerData = {
                serverName,
                sid,
                dbType,
                username,
                password: customEncryptPassword(password),
                url: serverUrl,
                schedule: parseInt(schedule, 10),
                note,
                dbCheckItems: selectedCheckItems.map(item => ({
                    itemName: item,
                    query: ''  // query는 빈 값으로 설정
                })),
                port:port,
                target : 'db'
            };

            HealthCheckActions.registerDbServer(newDBServerData)
            .then(response => {
                console.log(response)
                if(response.error) {
                    // URL 체크 또는 서버 등록 실패 시 처리
                    GRAlertActions.showAlert({
                        alertTitle: t("registerFailTitle", { target: "DB" }),
                        alertMsg: response.message,
                    });
                } else if(response.data.status && response.data.status.result === 'success') {
                    GRAlertActions.showAlert({
                        alertTitle: t("registerSuccessTitle", { target: "DB" }), 
                        alertMsg: t("registerSuccessMsg", { target: "DB" }),
                        alertMsgDetail: t("registerSuccessMsgDtl")
                    });
                    resetForm();
                    onClose();
                    onSubmit();
                }
            })
        }
    };

    const handleCancel = () => {
        resetForm(); // 폼 상태만 리셋
        onClose(); // 모달 닫기
    };

    const handleAddItem = () => {
        setDbCheckItems([...dbCheckItems, { itemName: '', query: '' }]);
    };

    const handleDeleteItem = (index) => {
        if (dbCheckItems.length > 1) {
          const newdbCheckItems = dbCheckItems.filter((_, i) => i !== index);
          setDbCheckItems(newdbCheckItems);
        }
    };
    
    const handleItemChange = (index, field, value) => {
        const newdbCheckItems = [...dbCheckItems];
        newdbCheckItems[index][field] = value;
        setDbCheckItems(newdbCheckItems);
    };

    const handleCheckItemChange = (event) => {
        setSelectedCheckItems(event.target.value);
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{t("registerServerInfo", { target: "DB" })}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t("serverName")}
                            type="text"
                            fullWidth
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                            error={errors.serverName}
                            helperText={errors.serverName || t("maxLength100")}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            select
                            margin="dense"
                            label={t('dbType')}
                            fullWidth
                            value={dbType}
                            onChange={(e) => setDbType(e.target.value)}
                        >
                            <MenuItem value="mysql">MySQL</MenuItem>
                            {/* <MenuItem value="postgresql">PostgreSQL</MenuItem>
                            <MenuItem value="oracle">Oracle</MenuItem>
                            <MenuItem value="sqlserver">SQLServer</MenuItem> */}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                        margin="dense"
                        label={t('serverLocation')}
                        type="text"
                        fullWidth
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        error={errors.serverUrl}
                        helperText={errors.serverUrl || t('hostHint')}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                        margin="dense"
                        label={t('port')}
                        type="text"
                        fullWidth
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        error={errors.port}
                        helperText={errors.port}
                        />
                    </Grid>
                </Grid>
                <TextField
                    margin="dense"
                    label= {t("SidName")}
                    type="text"
                    fullWidth
                    value={sid}
                    onChange={(e) => setSid(e.target.value)}
                    error={errors.sid}
                    helperText={errors.sid}
                />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            label={t('dbUser')}
                            type="text"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={errors.username}
                            helperText={errors.username}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            label={t('password')}
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            helperText={errors.password}
                        />
                    </Grid>
                </Grid>
                <TextField
                    select
                    margin="dense"
                    label={t("healthCheckSchedule")}
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    fullWidth
                >
                    {[
                        { label: '1 minute', value: 1 },
                        { label: '3 minutes', value: 3 },
                        { label: '5 minutes', value: 5 },
                        { label: '10 minutes', value: 10 },
                        { label: '15 minutes', value: 15 },
                        { label: '20 minutes', value: 20 },
                        { label: '30 minutes', value: 30 },
                        { label: '1 hour', value: 60 }
                    ].map((option, index) => (
                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))}
                </TextField>
                <FormControl fullWidth error={errors.selectedCheckItems}>
                    <InputLabel>{t("Select Check Items")}</InputLabel>
                    <Select
                        multiple
                        value={selectedCheckItems}
                        onChange={handleCheckItemChange}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {checkItems.map((checkItem) => (
                            <MenuItem key={checkItem} value={checkItem}>
                                <Checkbox checked={selectedCheckItems.indexOf(checkItem) > -1} />
                                <ListItemText primary={checkItem} />
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.selectedCheckItems}</FormHelperText>
                </FormControl>
                <TextField
                    margin="dense"
                    label={t("note")}
                    type="text"
                    multiline
                    rows={4}
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    helperText={t("noteHint")}
                />
                {/* {dbCheckItems.map((item, index) => (
                    <div key={index}>
                        <TextField
                        margin="dense"
                        label={t('item')}
                        type="text"
                        fullWidth
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        />
                        <TextField
                        margin="dense"
                        label={t('query')}
                        type="text"
                        fullWidth
                        value={item.query}
                        onChange={(e) => handleItemChange(index, 'query', e.target.value)}
                        />
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteItem(index)}
                            disabled={dbCheckItems.length === 1} // 최소 1개의 item 필드를 유지
                            style={{ marginLeft: '10px', minWidth: '80px', float: 'right' }}
                        >
                            {t('deleteItem')}
                        </Button>
                    </div>
                ))} */}

                {/* <Button onClick={handleAddItem} color="primary">
                    {t('addItem')}
                </Button> */}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCancel} color="default">
                    {t("cancel")}
                </Button>
            <Button onClick={handleSubmit} color="primary">
                {t("register")}
            </Button>
            </DialogActions>
        </Dialog>
    );
};

DBServerRegisterModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    GRAlertActions: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    HealthCheckActions: bindActionCreators(HealthCheckActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(null, mapDispatchToProps)(DBServerRegisterModal));
