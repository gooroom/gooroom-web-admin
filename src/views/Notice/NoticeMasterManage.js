import React, { Component } from 'react';
import { Map, List, Iterable } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next';

import * as GlobalActions from 'modules/GlobalModule';
import * as NoticeActions from 'modules/NoticeModule';
import * as NoticePublishActions from 'modules/NoticePublishModule';
import * as NoticePublishExtensionActions from 'modules/NoticePublishExtensionModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import NoticeDialog from './NoticeDialog';
import NoticePublishDialog from './NoticePublishDialog';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import KeywordOption from 'views/Options/KeywordOption';
import NoticeListComp from 'views/Notice/NoticeListComp';
import NoticeContentComp from 'views/Notice/NoticeContentComp';
import NoticePublishListComp from 'views/Notice/NoticePublishListComp';
import NoticePublishTargetListComp from 'views/Notice/NoticePublishTargetListComp';
import NoticeInstantNoticeListComp from 'views/Notice/NoticeInstantNoticeListComp';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class NoticeMasterManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noticeKeyword: ''
        };
    }

    // Select Notice Item - single
    handleNoticeSelect = (selectedNoticeObj, isEditable=true) => {
        const { NoticeActions, NoticePublishActions, NoticePublishExtensionActions } = this.props;
        const compId = this.props.match.params.grMenuId; 

        // show notice content.
        if(selectedNoticeObj) {
            const noticeId = selectedNoticeObj.get('noticeId');
            // close notice content
            NoticeActions.closeNoticeContent({compId: compId});
            // show notice content
            NoticeActions.showNoticeContent({
                compId: compId, viewItem: selectedNoticeObj, selectId: noticeId, isEditable: isEditable
            });
            // close notice publish list
            NoticePublishActions.closeNoticePublishInfo({compId: compId});
            // close notice publish extension info
            NoticePublishExtensionActions.closeNoticePublishExtensionInfo({compId: compId});
            // read notice publish list
            NoticePublishActions.readNoticePublishListPaged(this.props.NoticePublishProps, compId, {
                noticeId: noticeId, page:0
            });
            // show notice content
            NoticePublishActions.showNoticePublishInfo({
                compId: compId, viewItem: selectedNoticeObj, selectId: noticeId, isEditable: isEditable
            });
        }
    }

    // create dialog
    handleCreateNotice = () => {
        this.props.NoticeActions.showNoticeDialog({
            viewItem: {
                title: '',
                content: '' 
            },
            dialogType: NoticeDialog.TYPE_ADD
        });
    }

    handleNoticeKeywordChange = (name, value) => {
        this.setState({ noticeKeyword: value });
    }

    // search notice
    handleSearchNotice = () => {
        const { NoticeActions } = this.props;
        const { noticeKeyword } = this.state;

        NoticeActions.changeListParamData({
            name: 'keyword', 
            value: noticeKeyword,
            compId: this.props.match.params.grMenuId
        }).then(() => {
            NoticeActions.readNoticeListPaged(this.props.NoticeProps, this.props.match.params.grMenuId, {page: 0});
        });
    }

    // Select NoticePublish Item - single
    handleNoticePublishSelect = (selectedNoticePublishObj) => {
        const { NoticePublishExtensionActions, NoticePublishExtensionProps } = this.props;
        const compId = this.props.match.params.grMenuId; 

        // show notice publish extension info.
        if(selectedNoticePublishObj) {
            const noticePublishId = selectedNoticePublishObj.get('noticePublishId');
            // close notice publish extension info
            NoticePublishExtensionActions.closeNoticePublishExtensionInfo({compId: compId});
            // read notice publish target list
            NoticePublishExtensionActions.readNoticePublishTargetListPaged(NoticePublishExtensionProps, compId, {
                noticePublishId: noticePublishId, page:0
            });
            // read notice publish alarm list
            NoticePublishExtensionActions.readNoticeInstantNoticeListPaged(NoticePublishExtensionProps, compId, {
                noticePublishId: noticePublishId, page:0
            });
            // show notice publish extension info
            NoticePublishExtensionActions.showNoticePublishExtensionInfo({
                compId: compId, viewItem: selectedNoticePublishObj, selectId: noticePublishId
            });
        }
    }

    isNoticePublishChecked = () => {
        const checkedIds = this.props.NoticePublishProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
        return !(checkedIds && checkedIds.size > 0);
    }

    handleInstantNotice = () => {
        const { NoticePublishProps, GRConfirmActions } = this.props;
        const { t, i18n } = this.props;

        const checkedIds = NoticePublishProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
        if(checkedIds && checkedIds.size > 0) {
            GRConfirmActions.showConfirm({
              confirmTitle: t("dtInstantNotice"),
              confirmMsg: t("msgInstantNotice", {InstantNoticeCnt: checkedIds.size}),
              handleConfirmResult: this.handleInstantNoticeConfirmResult,
              confirmObject: {checkedIds: checkedIds}
            });
        }
    }

    handleInstantNoticeConfirmResult = (confirmValue, confirmObject) => {
        if(confirmValue) {
            const { NoticePublishExtensionActions, NoticeProps } = this.props;
            const checkedIds = confirmObject.checkedIds;
            if(checkedIds && checkedIds.size > 0) {
                const promises = [];
                for (const noticePublishId of checkedIds) {
                    const promiseCreateNoticeInstantNotice = new Promise((resolve, reject) => {
                        this.getPromiseOpenDtCheck(noticePublishId).then(() => {
                            NoticePublishExtensionActions.createNoticeInstantNotice({
                                noticePublishId: noticePublishId
                            }).then(() => resolve());
                        });
                    });
                    promises.push(promiseCreateNoticeInstantNotice);
                }
                Promise.all(promises).then(() => {
                    const compId = this.props.match.params.grMenuId;
                    const noticeId = NoticeProps.getIn(['viewItems', compId, 'viewItem', 'noticeId']);
                    const selectRowObject = getRowObjectById(NoticeProps, compId, noticeId, 'noticeId');
                    this.handleNoticeSelect(selectRowObject);
                });
            }
        }
    }

    getPromiseOpenDtCheck = (noticePublishId) => {
        const { NoticePublishActions, NoticePublishProps } = this.props;
        return new Promise((resolve, reject) => {
            const noticePublish = getRowObjectById(NoticePublishProps, this.props.match.params.grMenuId, noticePublishId, 'noticePublishId');
            if (noticePublish.get('openDt') > new Date().getTime()) {
                const openDt = new Date().toISOString().replace('Z' , '+0000');
                const closeDt = (typeof noticePublish.get('closeDt') !== 'undefined' ? new Date(noticePublish.get('closeDt')).toISOString().replace('Z' , '+0000') : undefined);
                NoticePublishActions.updateNoticePublish({
                    noticePublishId: noticePublishId,
                    openDt: openDt,
                    closeDt: closeDt,
                    statusCd: noticePublish.get('statusCd'),
                    viewType: noticePublish.get('viewType')
                }).then(() => resolve());
            } else {
                resolve();
            }
        });
    }

    handleChangeStatus = (statusId) => {
        const { NoticePublishProps, GRConfirmActions, CommonOptionProps } = this.props;
        const { t, i18n } = this.props;
        const status = CommonOptionProps.noticePublishStatusData.find(e => e.statusId === statusId);

        const checkedIds = NoticePublishProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
        if(checkedIds && checkedIds.size > 0) {
            GRConfirmActions.showConfirm({
              confirmTitle: t('dt' + status.statusNm),
              confirmMsg: t('msg' + status.statusNm, {cnt: checkedIds.size}),
              handleConfirmResult: this.handleChangeStatusConfirmResult,
              confirmObject: {checkedIds: checkedIds, statusCd: status.statusVal}
            });
        }
    }

    handleChangeStatusConfirmResult = (confirmValue, confirmObject) => {
        if(confirmValue) {
            const { NoticePublishActions, NoticePublishProps, NoticeProps } = this.props;
            const checkedIds = confirmObject.checkedIds;
            if(checkedIds && checkedIds.size > 0) {
                const promises = [];
                for (const noticePublishId of checkedIds) {
                    const promiseUpdateNoticePublish = new Promise((resolve, reject) => {
                        const noticePublish = getRowObjectById(NoticePublishProps, this.props.match.params.grMenuId, noticePublishId, 'noticePublishId');
                        const openDt = new Date(noticePublish.get('openDt')).toISOString().replace('Z' , '+0000');
                        let closeDt = undefined;
                        if (typeof noticePublish.get('closeDt') !== 'undefined') {
                            closeDt = new Date(noticePublish.get('closeDt')).toISOString().replace('Z' , '+0000');
                        }
                        NoticePublishActions.updateNoticePublish({
                            noticePublishId: noticePublishId,
                            openDt: openDt,
                            closeDt: closeDt,
                            statusCd: confirmObject.statusCd,
                            viewType: noticePublish.get('viewType')
                        }).then(() => resolve());
                    });
                    promises.push(promiseUpdateNoticePublish);
                }
                Promise.all(promises).then(() => {
                    const compId = this.props.match.params.grMenuId;
                    const noticeId = NoticeProps.getIn(['viewItems', compId, 'viewItem', 'noticeId']);
                    const selectRowObject = getRowObjectById(NoticeProps, compId, noticeId, 'noticeId');
                    this.handleNoticeSelect(selectRowObject);
                });
            }
        }
    }

    handleNowExitConfirmResult = (confirmValue, confirmObject) => {
        if(confirmValue) {
            const { NoticePublishActions, NoticePublishProps, NoticeProps } = this.props;
            const checkedIds = confirmObject.checkedIds;
            if(checkedIds && checkedIds.size > 0) {
                const promises = [];
                for (const noticePublishId of checkedIds) {
                    const promiseUpdateNoticePublish = new Promise((resolve, reject) => {
                        const noticePublish = getRowObjectById(NoticePublishProps, this.props.match.params.grMenuId, noticePublishId, 'noticePublishId');
                        let openDt = undefined;
                        if (noticePublish.get('openDt') <= new Date().getTime()) {
                            openDt = new Date(noticePublish.get('openDt')).toISOString().replace('Z' , '+0000');
                        } else {
                            openDt = new Date().toISOString().replace('Z' , '+0000');
                        }
                        let closeDt = undefined;
                        if (typeof noticePublish.get('closeDt') !== 'undefined' && noticePublish.get('closeDt') <= new Date().getTime()) {
                            closeDt = new Date(noticePublish.get('closeDt')).toISOString().replace('Z' , '+0000');
                        } else {
                            closeDt = new Date().toISOString().replace('Z' , '+0000');
                        }
                        NoticePublishActions.updateNoticePublish({
                            noticePublishId: noticePublishId,
                            openDt: openDt,
                            closeDt: closeDt,
                            statusCd: noticePublish.get('statusCd'),
                            viewType: noticePublish.get('viewType')
                        }).then(() => resolve());
                    });
                    promises.push(promiseUpdateNoticePublish);
                }
                Promise.all(promises).then(() => {
                    const compId = this.props.match.params.grMenuId;
                    const noticeId = NoticeProps.getIn(['viewItems', compId, 'viewItem', 'noticeId']);
                    const selectRowObject = getRowObjectById(NoticeProps, compId, noticeId, 'noticeId');
                    this.handleNoticeSelect(selectRowObject);
                });
            }
        }
    }

    // create dialog (NewNoticePublish)
    handleCreateNewNoticePublish = (noticeId) => {
        this.props.NoticePublishActions.showNoticePublishDialog({
            viewItem: Map({
                noticeId: noticeId,
                deptInfoList: List([]), 
                userInfoList: List([]), 
                grpInfoList: List([]), 
                clientInfoList: List([]),
                openDate: (new Date()).setMonth((new Date()).getMonth()),
                closeDate: (new Date()).setMonth((new Date()).getMonth() + 1),
                isInstantNotice: false,
                isUnlimited: false,
                viewType: '0'
            }),
            dialogType: NoticePublishDialog.TYPE_ADD
        });
    }

    render() {
        const { classes, t, NoticeProps, NoticePublishProps, NoticePublishExtensionProps } = this.props;
        const compId = this.props.match.params.grMenuId;
        const noticeId = NoticeProps.getIn(['viewItems', compId, 'viewItem', 'noticeId']);
        const isEditable = NoticeProps.getIn(['viewItems', compId, 'isEditable']);
        const informOpenNoticePublish = NoticePublishProps.getIn(['viewItems', compId, 'informOpen']);
        const informOpenNoticePublishExtension = NoticePublishExtensionProps.getIn(['viewItems', compId, 'informOpen']);

        return (
        <React.Fragment>
            <GRPageHeader name={t(this.props.match.params.grMenuName)}/>
            <GRPane>
                <Grid container alignItems="flex-end" direction="row" justify="space-between">
                    <Grid item xs={3}>
                        <Grid container alignItems="flex-end" direction="row">
                            <Grid item>
                                <FormControl>
                                    <KeywordOption handleKeywordChange={this.handleNoticeKeywordChange} handleSubmit={() => this.handleSearchNotice()}/>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSearchNotice()}>
                                    <Search/>{t('btnSearch')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3} style={{textAlign:'right'}}>
                        <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateNotice(); }}>
                            <AddIcon/>{t('btnRegist')}
                        </Button>
                    </Grid>
                    <Grid item xs={6} style={{textAlign:'right'}}>
                    </Grid>
                </Grid>
                <Grid container alignItems="flex-start" direction="row" justify="space-between">
                    <Grid item xs={12} sm={6} style={{border: '0px solid #efefef'}}>
                        <NoticeListComp
                            compId={compId}
                            onSelect={this.handleNoticeSelect}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{border: '0px solid #efefef'}}>
                        <NoticeContentComp
                            compId={compId}
                        />
                    </Grid>
                </Grid>
                { informOpenNoticePublish && 
                <Grid>
                    <Grid container alignItems="flex-end" direction="row" justify="space-between">
                        <Grid item xs={6} style={{textAlign:'right'}}>
                        </Grid>
                        <Grid item xs={6} style={{textAlign:'right'}}>
                            {isEditable &&
                            <Grid container alignItems="flex-end" direction="row" justify="flex-end" >
                                <Grid item>
                                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleInstantNotice() }} disabled={this.isNoticePublishChecked()}>
                                        {t('btnInstantNotice')}
                                    </Button>
                                </Grid>
                                <Grid item style={{paddingLeft: '3px'}}>
                                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleChangeStatus('INACTIVE') }} disabled={this.isNoticePublishChecked()}>
                                        {t('btnInactive')}
                                    </Button>
                                </Grid>
                                <Grid item style={{paddingLeft: '3px'}}>
                                    <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => this.handleCreateNewNoticePublish(noticeId)}>
                                        {t('btnNewPublish')}
                                    </Button>
                                </Grid>
                            </Grid>
                            }
                        </Grid>
                    </Grid>
                    <Grid container alignItems="flex-start" direction="row" justify="space-between">
                        <Grid item xs={12} sm={12} style={{border: '0px solid #efefef'}}>
                            <NoticePublishListComp
                                compId={compId}
                                onSelect={this.handleNoticePublishSelect}
                                isEditable={isEditable}
                            />
                        </Grid>
                    </Grid>
                    { informOpenNoticePublishExtension &&
                    <Grid container alignItems="flex-start" direction="row" justify="space-between">
                        <Grid item xs={12} sm={6} style={{border: '0px solid #efefef', paddingRight: '5px'}}>
                            <NoticePublishTargetListComp compId={compId}/>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{border: '0px solid #efefef', paddingLeft: '5px'}}>
                            <NoticeInstantNoticeListComp compId={compId}/>
                        </Grid>
                    </Grid>
                    }
                </Grid>
                }
            </GRPane>
            {/* dialog(popup) component area */}
            <NoticeDialog compId={compId} onAfterConfirmResult={this.handleNoticeSelect} />
            <NoticePublishDialog compId={compId} onAfterConfirmResult={this.handleNoticePublishSelect} />
            <GRConfirm />
        </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    GlobalProps: state.GlobalModule,
    NoticeProps: state.NoticeModule,
    NoticePublishProps: state.NoticePublishModule,
    NoticePublishExtensionProps: state.NoticePublishExtensionModule,
    CommonOptionProps: state.CommonOptionModule
});
  
const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    NoticeActions: bindActionCreators(NoticeActions, dispatch),
    NoticePublishActions: bindActionCreators(NoticePublishActions, dispatch),
    NoticePublishExtensionActions: bindActionCreators(NoticePublishExtensionActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
});
  
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticeMasterManage)));
  