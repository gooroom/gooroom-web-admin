import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoticePublishActions from 'modules/NoticePublishModule';
import * as NoticePublishExtensionActions from 'modules/NoticePublishExtensionModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import NoticePublishTargetSelector from './NoticePublishTargetSelector';
import NoticePublishTargetViewer from './NoticePublishTargetViewer';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import GRAlert from 'components/GRComponents/GRAlert';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { InlineDateTimePicker } from 'material-ui-pickers';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from 'react-i18next';


class NoticePublishDialog extends Component {

    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.NoticePublishActions.closeNoticePublishDialog(this.props.compId);
    }

    handleSubmit = (event) => {
        const dialogType = this.props.NoticePublishProps.get('dialogType');

        if(dialogType === NoticePublishDialog.TYPE_ADD) {
            this.handleCreateData(event);
        } else if(dialogType === NoticePublishDialog.TYPE_EDIT) {
            this.handleEditData(event);
        }
    }

    handleDateChange = (date, name) => {
        this.props.NoticePublishActions.setEditingItemValue({
            name: name, 
            value: date.format('YYYY-MM-DD HH:mm')
        });
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.NoticePublishActions.setEditingItemValue({
            name: name, 
            value: value
        });
    }

    handleCreateData = (event) => {
        const { NoticePublishProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        const editingItem = NoticePublishProps.get('editingItem');
        const isTargetValid = (editingItem.get('grpInfoList').size > 0)
            || (editingItem.get('clientInfoList').size > 0)
            || (editingItem.get('deptInfoList').size > 0)
            || (editingItem.get('userInfoList').size > 0);

        if(this.refs.form && this.refs.form.isFormValid() && isTargetValid) {
            GRConfirmActions.showConfirm({
                confirmTitle: t('dtAddNoticePublish'),
                confirmMsg: t('msgAddNoticePublish'),
                handleConfirmResult: this.handleCreateDataConfirmResult,
                confirmObject: editingItem
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }
    }

    handleCreateDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { NoticePublishActions, NoticePublishExtensionActions } = this.props;

            const noticeId = paramObject.get('noticeId');
            const grpInfos = paramObject.get('grpInfoList').map(x => (x.get('value') + ':' + (x.get('isCheck') ? 1 : 0))).toArray();
            const clientIds = paramObject.get('clientInfoList').map(x => x.get('value')).toArray();
            const deptInfos = paramObject.get('deptInfoList').map(x => (x.get('value') + ':' + (x.get('isCheck') ? 1 : 0))).toArray();
            const userIds = paramObject.get('userInfoList').map(x => x.get('value')).toArray();
            const openDt = (!paramObject.get('isInstantAlarm') ? new Date(paramObject.get('openDate')) : new Date()).toISOString().replace('Z' , '+0000');
            const closeDt = !paramObject.get('isUnlimited') ? new Date(paramObject.get('closeDate')).toISOString().replace('Z' , '+0000') : undefined;
            const viewType = paramObject.get('viewType');

            NoticePublishActions.createNoticePublish({
                noticeId: noticeId,
                openDt: openDt,
                closeDt: closeDt,
                viewType: viewType
            }).then((res) => {
                const noticePublishId = res.data.data[0].noticePublishId;
                NoticePublishExtensionActions.createNoticePublishTarget({
                    noticePublishId: noticePublishId,
                    grpInfos: grpInfos,
                    clientIds: clientIds,
                    deptInfos: deptInfos,
                    userIds: userIds
                }).then((res) => {
                    if (paramObject.get('isInstantAlarm')) {
                        NoticePublishExtensionActions.createNoticeInstantAlarm({
                            noticePublishId: noticePublishId
                        }).then();
                    }
                    this.refreshNoticePublishList(noticePublishId);
                });
            });
            this.handleClose();
        }
    }

    handleEditData = (event) => {
        const { NoticePublishProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        const editingItem = NoticePublishProps.get('editingItem');
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t('dtEditNoticePublish'),
                confirmMsg: t('msgEditNoticePublish'),
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: editingItem
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
            const { NoticePublishActions } = this.props;

            const noticePublishId = paramObject.get('noticePublishId');
            const openDt = new Date(paramObject.get('openDate')).toISOString().replace('Z' , '+0000');
            const closeDt = !paramObject.get('isUnlimited') ? new Date(paramObject.get('closeDate')).toISOString().replace('Z' , '+0000') : undefined;

            NoticePublishActions.updateNoticePublish({
                noticePublishId: noticePublishId,
                openDt: openDt,
                closeDt: closeDt,
                statusCd: paramObject.get('statusCd'),
                viewType: paramObject.get('viewType')
            }).then((res) => {
                this.refreshNoticePublishList(noticePublishId);
            });
        }
    }

    refreshNoticePublishList = (noticePublishId) => {
        const { NoticePublishActions, NoticePublishProps, compId, onAfterConfirmResult } = this.props;

        NoticePublishActions.readNoticePublishListPaged(NoticePublishProps, compId, {})
        .then((res) => {
            const selectRowObject = getRowObjectById(this.props.NoticePublishProps, compId, noticePublishId, 'noticePublishId');
            if(onAfterConfirmResult && selectRowObject) {
                onAfterConfirmResult(selectRowObject);
            }
        });
    }

    render() {
        const { classes, t } = this.props;
        const { NoticePublishProps, compId } = this.props;

        const dialogType = NoticePublishProps.get('dialogType');
        const editingItem = (NoticePublishProps.get('editingItem')) ? NoticePublishProps.get('editingItem') : null;

        let title = '';
        let minOpenDate = '';
        let minCloseDate = editingItem ? formatDateToSimple(editingItem.get('openDate'), 'YYYY-MM-DD HH:mm') : '';
        let isOpenDateDisabled = false;
        let isCloseDateDisabled = false;
        let isUnlimitedDisabled = false;
        if(dialogType === NoticePublishDialog.TYPE_ADD) {
            title = t('dtAddNoticePublish');
            if (editingItem) {
                minOpenDate = formatDateToSimple(new Date(), 'YYYY-MM-DD HH:mm');
                isOpenDateDisabled = editingItem.get('isInstantAlarm');
                isCloseDateDisabled = editingItem.get('isUnlimited');
            }
        } else if(dialogType === NoticePublishDialog.TYPE_EDIT) {
            title = t('dtEditNoticePublish');
            if (editingItem) {
                if (new Date(editingItem.get('openDate')).getTime() < new Date().getTime()) {
                    isOpenDateDisabled = true;
                    minCloseDate = formatDateToSimple(new Date(), 'YYYY-MM-DD HH:mm');
                }
                if (editingItem.get('isUnlimited') || editingItem.get('isUnlimitedDisabled')) {
                    isCloseDateDisabled = true;
                    minCloseDate = '';
                }
                isUnlimitedDisabled = editingItem.get('isUnlimitedDisabled');
            }
        }

        return (
        <div>
            {(NoticePublishProps.get('dialogOpen') && editingItem) &&
                <Dialog open={NoticePublishProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                    <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={0}>
                                <Grid item xs={12} >
                                    <Typography variant="h6" style={{marginTop:7}} gutterBottom>{t('lbSelectTarget')}</Typography>
                                    {(dialogType === NoticePublishDialog.TYPE_ADD) &&
                                        <NoticePublishTargetSelector compId={compId} editingItem={editingItem} />
                                    }
                                    {(dialogType === NoticePublishDialog.TYPE_EDIT) &&
                                        <NoticePublishTargetViewer compId={compId} editingItem={editingItem} />
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" style={{marginTop:7}} gutterBottom>{t('lbAlarmPeriod')}</Typography>
                                    <Grid container spacing={16} direction="row" justify="flex-start" alignItems="center">
                                        <Grid item xs={5}>
                                            <InlineDateTimePicker label={t('colNoticePublishOpenDt')} format='YYYY-MM-DD HH:mm'
                                                minDate={minOpenDate}
                                                value={(editingItem.get('openDate')) ? formatDateToSimple(editingItem.get('openDate'), 'YYYY-MM-DD HH:mm') : ''}
                                                onChange={(date) => {this.handleDateChange(date, 'openDate')}}
                                                className={classes.fullWidth} disabled={isOpenDateDisabled}/>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <InlineDateTimePicker label={t('colNoticePublishCloseDt')} format='YYYY-MM-DD HH:mm'
                                                minDate={minCloseDate}
                                                value={(editingItem.get('closeDate')) ? formatDateToSimple(editingItem.get('closeDate'), 'YYYY-MM-DD HH:mm') : null}
                                                onChange={(date) => {this.handleDateChange(date, 'closeDate')}}
                                                className={classes.fullWidth} disabled={isCloseDateDisabled}/>
                                        </Grid>
                                        <Grid item xs={2}>
                                            {(dialogType === NoticePublishDialog.TYPE_ADD) &&
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox color='primary'
                                                            checked={editingItem.get('isInstantAlarm')}
                                                            onChange={this.handleValueChange('isInstantAlarm')}
                                                            className={classes.grObjInCell}/>
                                                    }
                                                    label={t('lbInstantAlarm')} />
                                            }
                                            <FormControlLabel
                                                control={
                                                    <Checkbox color='primary'
                                                        checked={editingItem.get('isUnlimited')}
                                                        onChange={this.handleValueChange('isUnlimited')}
                                                        className={classes.grObjInCell}
                                                        disabled={isUnlimitedDisabled}/>
                                                }
                                                label={t('lbIndefiniteAlarm')} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" style={{marginTop:7}} gutterBottom>{t('lbViewType')}</Typography>
                                    <Grid container spacing={16} direction="row" justify="flex-start" alignItems="center">
                                        <Grid item xs={12}>
                                            <RadioGroup name="viewType" onChange={this.handleValueChange('viewType')} value={editingItem.get('viewType')} className={classes.group} row>
                                                <FormControlLabel value="0" control={<Radio />} label={t('lbOnlyAlarm')} />
                                                <FormControlLabel value="1" control={<Radio />} label={t('lbWithTitle')} />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            {(dialogType === NoticePublishDialog.TYPE_ADD) &&
                                <Button type="submit" variant="contained" color="secondary">{t('btnRegist')}</Button>
                            }
                            {(dialogType === NoticePublishDialog.TYPE_EDIT) &&
                                <Button type="submit" variant="contained" color="secondary">{t('btnSave')}</Button>
                            }
                            <Button onClick={this.handleClose} variant="contained" color="primary">{t('btnClose')}</Button>
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
    NoticePublishProps: state.NoticePublishModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticePublishActions: bindActionCreators(NoticePublishActions, dispatch),
    NoticePublishExtensionActions: bindActionCreators(NoticePublishExtensionActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticePublishDialog)));

