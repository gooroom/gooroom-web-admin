import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoticePublishActions from 'modules/NoticePublishModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRAlert from 'components/GRComponents/GRAlert';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from 'react-i18next';


class NoticePublishDialog extends Component {

    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.NoticePublishActions.closeNoticePublishDialog(this.props.compId);
    }

    handleClientGroupCheck = (selectedGroupObj, selectedGroupIdArray) => {
    };

    handleValueChange = name => event => {
    }

    handleSubmit = (event) => {
    }

    handleCreateData = (event) => {
    }

    handleCreateDataConfirmResult = (confirmValue, paramObject) => {
    }

    handleEditData = (event) => {
    }

    handleEditDataConfirmResult = (confirmValue, paramObject) => {
    }

    render() {
        const { classes } = this.props;
        const { NoticePublishProps, compId } = this.props;
        const { t, i18n } = this.props;

        const dialogType = NoticePublishProps.get('dialogType');
        const editingItem = (NoticePublishProps.get('editingItem')) ? NoticePublishProps.get('editingItem') : null;

        let title = '';
        if(dialogType === NoticePublishDialog.TYPE_ADD) {
            title = t('dtAddNoticePublish');
        } else if(dialogType === NoticePublishDialog.TYPE_EDIT) {
            title = t('dtEditNoticePublish');
        }

        return (
        <div>
            {(NoticePublishProps.get('dialogOpen') && editingItem) &&
                <Dialog open={NoticePublishProps.get('dialogOpen')}>
                    <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={6}>
                                <ClientGroupComp compId={compId}
                                    selectorType='multiple'
                                    onCheck={this.handleClientGroupCheck}
                                />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                </Grid>
                                <Grid item xs={12}>
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
            <GRAlert />
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
    NoticePublishProps: state.NoticePublishModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticePublishActions: bindActionCreators(NoticePublishActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticePublishDialog)));

