import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoticeActions from 'modules/NoticeModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRAlert from 'components/GRComponents/GRAlert';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import { ValidatorForm } from 'react-material-ui-form-validator';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from 'react-i18next';

import { Card, CardContent, CardHeader, CardActions } from '@material-ui/core';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class NoticeDialog extends Component {

    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    constructor(props) {
        super(props);
    
        this.state = { title:'', content: '' };
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(!(this.props.NoticeProps.equals(nextProps.NoticeProps))) {
            const editingItem = (nextProps.NoticeProps.get('editingItem')) ? nextProps.NoticeProps.get('editingItem') : null;
            if (editingItem) {
                const title = (editingItem.get('title')) ? editingItem.get('title') : '';
                const content = (editingItem.get('content')) ? editingItem.get('content') : '';
                this.setState({ title: title, content: content });
            }
        }
    }

    handleClose = (event) => {
        this.props.NoticeActions.closeNoticeDialog(this.props.compId);
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
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
                confirmObject: { 
                    title: this.state.title,
                    content: this.state.content
                }
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
                title: paramObject.title,
                content: paramObject.content
            }).then((res) => {
                NoticeActions.readNoticeListPaged(NoticeProps, compId, {page:0}).then((res) => {
                    const newNoticeId = this.props.NoticeProps.getIn(['viewItems', compId, 'listData',0, 'noticeId']);
                    const selectRowObject = getRowObjectById(this.props.NoticeProps, compId, newNoticeId, 'noticeId');
                    if(onAfterConfirmResult && selectRowObject) {
                        onAfterConfirmResult(selectRowObject);
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
                confirmObject: {
                    noticeId: NoticeProps.get('editingItem').get('noticeId'),
                    title: this.state.title,
                    content: this.state.content
                }
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
            const noticeId = paramObject.noticeId;

            NoticeActions.updateNotice({
                noticeId: noticeId,
                title: paramObject.title,
                content: paramObject.content
            }).then((res) => {
                NoticeActions.readNoticeListPaged(NoticeProps, compId).then((res) => {
                    const selectRowObject = getRowObjectById(this.props.NoticeProps, compId, noticeId, 'noticeId');
                    if(onAfterConfirmResult && selectRowObject) {
                        onAfterConfirmResult(selectRowObject);
                    }
                });
            });
            this.handleClose();
        }
    }

    handleContentChange = (event) => {
        this.setState({ content: event.target.value });
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
                <Modal open={NoticeProps.get('dialogOpen')}>
                    <div className={classes.noticeDialogContainer} tabIndex="">
                        <Card style={{width:'100%', maxWidth:'600px', margin:'48px'}}>
                            <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
                                <CardHeader className={classes.noticeDialogHeader} titleTypographyProps={{variant:'h6'}} title={title}></CardHeader>
                                <CardContent className={classes.noticeDialogContent}>
                                    <TextField
                                        label={t('lbNoticeTitle')}
                                        value={this.state.title}
                                        onChange={this.handleTitleChange}
                                        className={classes.fullWidth}
                                        required
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <TextField
                                        label={t('lbNoticeContent')}
                                        multiline
                                        rows="15"
                                        className={classes.fullWidth}
                                        margin="normal"
                                        variant="outlined"
                                        value={this.state.content}
                                        onChange={this.handleContentChange}
                                    />
                                </CardContent>
                                <CardActions className={classes.noticeDialogActions}>
                                    {(dialogType === NoticeDialog.TYPE_ADD) &&
                                        <Button type="submit" variant="contained" color="secondary">{t('btnRegist')}</Button>
                                    }
                                    {(dialogType === NoticeDialog.TYPE_EDIT) &&
                                        <Button type="submit" variant="contained" color="secondary">{t('btnSave')}</Button>
                                    }
                                    <Button onClick={this.handleClose} variant="contained" color="primary">{t('btnClose')}</Button>
                                </CardActions>
                            </ValidatorForm>
                        </Card>
                    </div>
                </Modal>
            }
            {/*<GRAlert /> */}
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

