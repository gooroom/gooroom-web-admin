import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoticeActions from 'modules/NoticeModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRAlert from 'components/GRComponents/GRAlert';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from 'react-i18next';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class NoticeDialog extends Component {

    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.NoticeActions.closeNoticeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        this.props.NoticeActions.setEditingItemValue({
            name: name,
            value: event.target.value
        });
    }

    handleSubmit = (event) => {
        const dialogType = this.props.NoticeProps.get('dialogType');

        if(dialogType === NoticeDialog.TYPE_ADD) {
            this.handleCreateData(event);
        } else if(dialogType === NoticeDialog.TYPE_EDIT) {
            this.handleEditData(event);
        }
    }

    handleCreateData = (event) => {
        const { NoticeProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t('dtAddNotice'),
                confirmMsg: t('msgAddNotice'),
                handleConfirmResult: this.handleCreateDataConfirmResult,
                confirmObject: NoticeProps.get('editingItem')
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
            const { NoticeProps, NoticeActions, compId, onAfterConfirmResult } = this.props;
            NoticeActions.createNotice({
                title: paramObject.get('title'),
                content: paramObject.get('content'),
            }).then((res) => {
                NoticeActions.readNoticeListPaged(NoticeProps, compId, {page:0}).then((res) => {
                    const newNoticeId = this.props.NoticeProps.getIn(['viewItems', compId, 'listData',0, 'noticeId']);
                    const selectRowObject = getRowObjectById(this.props.NoticeProps, compId, newNoticeId, 'noticeId');
                    if(onAfterConfirmResult && selectRowObject) {
                        onAfterConfirmResult(selectRowObject)
                    }
                });
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { NoticeProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: t('dtEditNotice'),
                confirmMsg: t('msgEditNotice'),
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: NoticeProps.get('editingItem')
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
            const { NoticeProps, NoticeActions, compId, onAfterConfirmResult } = this.props;
            const noticeId = paramObject.get('noticeId');

            NoticeActions.updateNotice({
                noticeId: noticeId,
                title: paramObject.get('title'),
                content: paramObject.get('content')
            }).then((res) => {
                NoticeActions.readNoticeListPaged(NoticeProps, compId).then((res) => {
                    const selectRowObject = getRowObjectById(this.props.NoticeProps, compId, noticeId, 'noticeId');
                    if(onAfterConfirmResult && selectRowObject) {
                        onAfterConfirmResult(selectRowObject)
                    }
                });
                this.handleClose();
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { NoticeProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = NoticeProps.get('dialogType');
        const editingItem = (NoticeProps.get('editingItem')) ? NoticeProps.get('editingItem') : null;

        let title = '';
        if(dialogType === NoticeDialog.TYPE_ADD) {
            title = t('dtAddNotice');
        } else if(dialogType === NoticeDialog.TYPE_EDIT) {
            title = t('dtEditNotice');
        }

        return (
        <div>
            {(NoticeProps.get('dialogOpen') && editingItem) &&
                <Dialog open={NoticeProps.get('dialogOpen')}>
                    <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>
                            <TextField
                                label={t('lbNoticeTitle')}
                                value={(editingItem.get('title')) ? editingItem.get('title') : ''}
                                onChange={this.handleValueChange('title')}
                                className={classes.fullWidth}
                                required
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                label={t('lbNoticeContent')}
                                value={(editingItem.get('content')) ? editingItem.get('content') : ''}
                                onChange={this.handleValueChange("content")}
                                className={classes.fullWidth}
                                required
                                multiline
                                rows="10"
                                margin="normal"
                                variant="outlined"
                            />
                        </DialogContent>
                        <DialogActions>
                            {(dialogType === NoticeDialog.TYPE_ADD) &&
                                <Button type="submit" variant="contained" color="secondary">{t('btnRegist')}</Button>
                            }
                            {(dialogType === NoticeDialog.TYPE_EDIT) &&
                                <Button type="submit" variant="contained" color="secondary">{t('btnSave')}</Button>
                            }
                            <Button onClick={this.handleClose} variant="contained" color="primary">{t('btnClose')}</Button>
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
            }
            <GRAlert />
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
    NoticeProps: state.NoticeModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticeActions: bindActionCreators(NoticeActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticeDialog)));

