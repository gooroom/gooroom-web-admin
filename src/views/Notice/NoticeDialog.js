import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoticeActions from 'modules/NoticeModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRAlert from 'components/GRComponents/GRAlert';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from 'react-i18next';

import { Editor } from '@tinymce/tinymce-react';
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
        const editingItem = (nextProps.NoticeProps.get('editingItem')) ? nextProps.NoticeProps.get('editingItem') : null;
        if (editingItem) {
            const title = (editingItem.get('title')) ? editingItem.get('title') : '';
            const content = (editingItem.get('content')) ? editingItem.get('content') : '';
            this.setState({ title: title, content: content });
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

    handleContentChange = (content) => {
        this.setState({ content: content });
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

        const tinymceInit = {
            language: (i18n.language === 'kr' ? 'ko_KR' : null),
            height: 400,
            menubar: false,
            resize: false,
            branding: false,
            statusbar: false,
            plugins: 'link code, image',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | link image code',
            image_advtab: true,
            file_picker_types: 'image',
            file_picker_callback: function (callback, value, meta) {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = function () {
                    const file = this.files[0];
                
                    const reader = new FileReader();
                    reader.onload = function () {
                        const id = 'blobid' + (new Date()).getTime();
                        const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                        const base64 = reader.result.split(',')[1];
                        const blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);

                        if (blobInfo.blob().size > 524288) {
                            alert('big size');
                        } else {
                            callback(blobInfo.blobUri(), { title: file.name });
                        }
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            }
        };

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
                                    <Editor
                                        init={tinymceInit}
                                        value={this.state.content}
                                        onEditorChange={this.handleContentChange}
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

