import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next'
import { Map, List } from 'immutable';

import * as NoticePublishActions from 'modules/NoticePublishModule';
import * as NoticePublishExtensionActions from 'modules/NoticePublishExtensionModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import NoticePublishDialog from './NoticePublishDialog';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class NoticePublishListComp extends Component {
    componentDidMount() {
    }

    isChecked = id => {
        const { NoticePublishProps, compId } = this.props;
        const checkedIds = getDataObjectVariableInComp(NoticePublishProps, compId, 'checkedIds');
        if(checkedIds) {
          return checkedIds.includes(id);
        } else {
          return false;
        }
    }

    isDisabled = (statusCd, closeDt) => {
        return (statusCd !== 'STAT010') || ((typeof closeDt !== 'undefined') && closeDt <= new Date().getTime());
    }

    isSelected = id => {
        const { NoticePublishExtensionProps, compId } = this.props;
        const selectedNoticePublishItem = getDataObjectVariableInComp(NoticePublishExtensionProps, compId, 'viewItem');
        return (selectedNoticePublishItem && selectedNoticePublishItem.get('noticePublishId') == id);
    }

    handleChangePage = (event, page) => {
        this.props.NoticePublishActions.readNoticePublishListPaged(this.props.NoticePublishProps, this.props.compId, {
          page: page
        });
    }
    
    handleChangeRowsPerPage = event => {
        this.props.NoticePublishActions.readNoticePublishListPaged(this.props.NoticePublishProps, this.props.compId, {
          rowsPerPage: event.target.value, page: 0
        });
    }

    handleChangeSort = (event, columnId, currOrderDir) => {
        const { NoticePublishActions, NoticePublishProps, compId } = this.props;
        NoticePublishActions.readNoticePublishListPaged(NoticePublishProps, compId, {
            orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
        });
    };

    handleClickAllCheck = (event, checked) => {
        const { NoticePublishActions, NoticePublishProps, compId } = this.props;
        let newCheckedIds = List([]);
        if (checked) {
            newCheckedIds = NoticePublishProps.getIn(['viewItems', compId, 'listData'])
                .filter((data) => {
                    return (data.get('statusCd') === 'STAT010')
                        && ((typeof data.get('closeDt') === 'undefined') || data.get('closeDt') > new Date().getTime());
                })
                .map((data) => data.get('noticePublishId'));
        }
    
        NoticePublishActions.changeCompVariable({
            name: 'checkedIds',
            value: newCheckedIds,
            compId: compId
        });
    };

    handleCheckClick = (event, id) => {
        event.stopPropagation();
        const { NoticePublishActions, NoticePublishProps, compId } = this.props;
        const newCheckedIds = setCheckedIdsInComp(NoticePublishProps, compId, id);  
    
        NoticePublishActions.changeCompVariable({
          name: 'checkedIds',
          value: newCheckedIds,
          compId: compId
        });
    }

    handleSelectRow = (event, id) => {
        event.stopPropagation();
        const { NoticePublishProps, compId } = this.props;
        // get Object
        const selectRowObject = getRowObjectById(NoticePublishProps, compId, id, 'noticePublishId');
        if(this.props.onSelect && selectRowObject) {
          this.props.onSelect(selectRowObject);
        }
    }

    // edit dialog
    handleEditClick = (event, id) => {
        event.stopPropagation();
        const { NoticePublishProps, NoticePublishActions, NoticePublishExtensionActions, compId } = this.props;
        const viewItem = getRowObjectById(NoticePublishProps, compId, id, 'noticePublishId');
        NoticePublishExtensionActions.readNoticePublishTargetList({noticePublishId: id})
            .then((res) => {
                const targets = res.data;
                const users = targets.filter((target) => target.targetType === '0')
                    .map((user) => Map({ name: user.targetName, value: user.targetId }));
                const departments = targets.filter((target) => target.targetType === '1')
                    .map((department) => {
                        return Map({ name: department.targetName, value: department.targetId, isCheck: department.isChildCheck === '1' ? true : false });
                    });
                const clients = targets.filter((target) => target.targetType === '2')
                    .map((client) => Map({ name: client.targetName, value: client.targetId }));
                const clientGroups = targets.filter((target) => target.targetType === '3')
                    .map((clientGroup) => {
                        return Map({ name: clientGroup.targetName, value: clientGroup.targetId, isCheck: clientGroup.isChildCheck === '1' ? true : false });
                    });
                const isUnlimitedDisabled = typeof viewItem.get('closeDt') !== 'undefined' && new Date(viewItem.get('closeDt')).getTime() < new Date().getTime();
                NoticePublishActions.showNoticePublishDialog({
                    viewItem: Map({
                        noticePublishId: id,
                        userInfoList: users,
                        deptInfoList: departments,
                        clientInfoList: clients,
                        grpInfoList: clientGroups,
                        openDate: viewItem.get('openDt'),
                        closeDate: viewItem.get('closeDt'),
                        statusCd: viewItem.get('statusCd'),
                        viewType: viewItem.get('viewType'),
                        isUnlimited: typeof viewItem.get('closeDt') === 'undefined',
                        isUnlimitedDisabled: isUnlimitedDisabled
                    }),
                    dialogType: NoticePublishDialog.TYPE_EDIT
                });
            });
    };

    render() {
        const { classes } = this.props;
        const { NoticePublishProps, compId, CommonOptionProps, isEditable } = this.props;
        const { t, i18n } = this.props;

        const columnHeaders = [
            { id: 'chStatusCd', isOrder: false, numeric: false, disablePadding: true, label: t('colStatus') },
            { id: 'chNoticePublishId', isOrder: true, numeric: false, disablePadding: true, label: t('colId') },
            { id: 'chOpenDt', isOrder: true, numeric: false, disablePadding: true, label: t('colNoticePublishOpenDt') },
            { id: 'chCloseDt', isOrder: true, numeric: false, disablePadding: true, label: t('colNoticePublishCloseDt') },
            { id: 'chViewType', isOrder: true, numeric: false, disablePadding: true, label: t('colNoticePublishViewType') },
            { id: 'chViewCnt', isOrder: true, numeric: false, disablePadding: true, label: t('colNoticePublishViewCnt') },
            { id: 'chInstantNoticeCnt', isOrder: true, numeric: false, disablePadding: true, label: t('colNoticePublishInstantNoticeCnt') },
            { id: 'chRegUserId', isOrder: true, numeric: false, disablePadding: true, label: t('colRegUserId') },
        ];

        const listObj = NoticePublishProps.getIn(['viewItems', compId]);
        let activeListData = undefined;
        let emptyRows = 0; 
        if(listObj && listObj.get('listData')) {
          emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
          activeListData = listObj.get('listData').filter(n => (!this.isDisabled(n.get('statusCd'), n.get('closeDt'))));
        }

        return (
        <div>
            {listObj &&
                <Table>
                    <GRCommonTableHead
                        classes={classes}
                        keyId='noticePublishId'
                        orderDir={listObj.getIn(['listParam', 'orderDir'])}
                        orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                        onRequestSort={this.handleChangeSort}
                        listData={activeListData}
                        columnData={columnHeaders}
                    />
                    <TableBody>
                        {listObj.get('listData') && listObj.get('listData').map(n => {
                            const isChecked = this.isChecked(n.get('noticePublishId'));
                            const isDisabled = this.isDisabled(n.get('statusCd'), n.get('closeDt'));
                            const isSelected = this.isSelected(n.get('noticePublishId'));
                            const status = CommonOptionProps.noticePublishStatusData.find(e => e.statusVal === n.get('statusCd'));
                            return (
                            <TableRow
                                hover
                                className={(isSelected) ? classes.grSelectedRow : ''}
                                onClick={event => this.handleSelectRow(event, n.get('noticePublishId'))}
                                role='checkbox'
                                key={n.get('noticePublishId')}>
                                {isEditable &&
                                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                                    <Checkbox checked={isChecked} disabled={isDisabled} color='primary' className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('noticePublishId'))}/>
                                  </TableCell>
                                }
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    { t('lb' + status.statusNm) }
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('noticePublishId')}</TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {formatDateToSimple(n.get('openDt'), 'YYYY-MM-DD HH:mm')}
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {(n.get('closeDt') !== undefined && n.get('closeDt') !== null) ? formatDateToSimple(n.get('closeDt'), 'YYYY-MM-DD HH:mm') : t('lbUnlimited')}
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {n.get('viewType') === '0' ? t('lbOnlyAlarm') : t('lbWithTitle')}
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {(n.get('openedUserCnt') !== undefined ? n.get('openedUserCnt') : '0') }
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {(n.get('InstantNoticeCnt') !== undefined ? n.get('InstantNoticeCnt') : '0') }
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {isEditable && 
                                    <Button size="small" color="secondary"
                                        className={classes.buttonInTableRow} 
                                        onClick={event => this.handleEditClick(event, n.get('noticePublishId'))}>
                                        <SettingsApplicationsIcon/>
                                    </Button>
                                    }
                                </TableCell>
                            </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
                            <TableRow key={e}>
                                <TableCell
                                    colSpan={columnHeaders.length + 1}
                                    className={classes.grSmallAndClickCell}
                                />
                            </TableRow>
                        )}))}
                    </TableBody>
                </Table>
            }
            {listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
                <TablePagination
                    component='div'
                    count={listObj.getIn(['listParam', 'rowsFiltered'])}
                    rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
                    rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
                    page={listObj.getIn(['listParam', 'page'])}
                    backIconButtonProps={{'aria-label': 'Previous Page'}}
                    nextIconButtonProps={{'aria-label': 'Next Page'}}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            }
        </div>
        );
    }
}

const mapStateToProps = (state) => ({
    NoticePublishProps: state.NoticePublishModule,
    NoticePublishExtensionProps: state.NoticePublishExtensionModule,
    CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticePublishActions: bindActionCreators(NoticePublishActions, dispatch),
    NoticePublishExtensionActions: bindActionCreators(NoticePublishExtensionActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});
  
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticePublishListComp)));