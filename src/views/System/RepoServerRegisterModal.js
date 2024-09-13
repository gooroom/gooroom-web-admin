import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HealthCheckActions from 'modules/HealthCheckModule';
import * as GRAlertActions from "modules/GRAlertModule";
import { translate } from "react-i18next";

const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
const urlRegex = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

const RepoServerRegisterModal = ({ open, onClose, onSubmit, HealthCheckActions, GRAlertActions, t }) => {
    const [serverName, setServerName] = useState('');
    const [serverUrl, setServerUrl] = useState('');
    const [serverDist, setServerDist] = useState('');
    const [schedule, setSchedule] = useState('1');
    const [note, setNote] = useState('');

    const resetForm = () => {
        setServerName('');
        setServerUrl('');
        setServerDist('');
        setSchedule('1');
        setNote('');
    }
    
    // 유효성 검사 상태
    const [errors, setErrors] = useState({
        serverName: '',
        serverUrl: '',
        serverDist: ''
    });

    // 유효성 검사 함수
    const validate = () => {
        const newErrors = { serverName: '', serverUrl: '', serverDist: '' };

        if (!serverName.match(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]{1,100}$/)) {
            newErrors.serverName = t('lblErrorTitle')
        }

        if(!serverName){
            newErrors.serverName = t('lblErrorEmpty')
        }

        if (!serverUrl.match(ipRegex) && !serverUrl.match(urlRegex)) {
            newErrors.serverUrl = t('lblErrorUrl')
        }

        if(!serverUrl){
            newErrors.serverUrl = t('lblErrorEmpty')
        }

        if (!serverDist.match(/^\S+$/)) {
            newErrors.serverDist = t("lblErrorDist");
        }

        if (!serverDist) {
            newErrors.serverDist = t('lblErrorEmpty');
        }

        setErrors(newErrors);
        if(Object.values(newErrors).some(message => message)) return false;
        return true;
    };

    const handleSubmit = () => {
        if (validate()) {
            const newServerData = {
                serverName,
                url: serverUrl,
                dist: serverDist,
                schedule: parseInt(schedule, 10),
                note,
                target: 'repo'
            };
            HealthCheckActions.registerRepoServer(newServerData)
            .then(response => {
                console.log(response)
                if (response.error) {
                    // URL 체크 또는 서버 등록 실패 시 처리
                    GRAlertActions.showAlert({
                        alertTitle: t("registerFailTitle", { target: "Repository" }),
                        alertMsg: response.message,
                    });
                } else if (response.data.status && response.data.status.result === 'success') {
                    GRAlertActions.showAlert({
                        alertTitle: t("registerSuccessTitle", { target: "Repository" }), 
                        alertMsg: t("registerSuccessMsg", { target: "Repository" }),
                        alertMsgDetail: t("registerSuccessMsgDtl")
                    });
                    onClose();
                    onSubmit();
                }
            });
        }
    };

    const handleCancel = () => {
        resetForm(); // 폼 상태만 리셋
        onClose(); // 모달 닫기
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{t("registerServerInfo", { target: "Repository" })}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t("serverName")}
                    type="text"
                    fullWidth
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    error={!!errors.serverName}
                    helperText={errors.serverName || t("maxLength100")}
                />
                <TextField
                    margin="dense"
                    label={t("repoUrl")}
                    type="text"
                    fullWidth
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    error={!!errors.serverUrl}
                    helperText={errors.serverUrl || t("lblValidUrl")}
                />
                <TextField
                    margin="dense"
                    label={t("repoDist")}
                    type="text"
                    fullWidth
                    value={serverDist}
                    onChange={(e) => setServerDist(e.target.value)}
                    helperText={errors.serverDist || t("lblValidDist")}
                    error={!!errors.serverDist}
                />
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

RepoServerRegisterModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    HealthCheckActions: PropTypes.object.isRequired,
    GRAlertActions: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    HealthCheckActions: bindActionCreators(HealthCheckActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(null, mapDispatchToProps)(RepoServerRegisterModal));
