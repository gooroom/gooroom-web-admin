import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next'

import * as NoticePublishActions from 'modules/NoticePublishModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

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

    isSelected = id => {
        const { NoticePublishProps, compId } = this.props;
        const selectedNoticeItem = getDataObjectVariableInComp(NoticePublishProps, compId, 'viewItem');
        return (selectedNoticeItem && selectedNoticeItem.get('noticePublishId') == id);
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
        const newCheckedIds = getDataPropertyInCompByParam(NoticePublishProps, compId, 'noticePublishId', checked);
    
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

    render() {
        const { classes } = this.props;
        const { NoticePublishProps, compId, CommonOptionProps } = this.props;
        const { t, i18n } = this.props;

        const columnHeaders = [
            { id: "chCheckbox", isCheckbox: true },
            { id: 'chStatusCd', isOrder: false, numeric: false, disablePadding: true, label: t("colStatus") },
            { id: 'chNoticePublishId', isOrder: true, numeric: false, disablePadding: true, label: t("colId") },
            { id: 'chOpenDt', isOrder: true, numeric: false, disablePadding: true, label: t('colOpenDt') },
            { id: 'chCloseDt', isOrder: true, numeric: false, disablePadding: true, label: t('colCloseDt') },
            { id: 'chViewType', isOrder: true, numeric: false, disablePadding: true, label: t('colViewType') },
            { id: 'chViewCnt', isOrder: true, numeric: false, disablePadding: true, label: t('colViewCnt') },
            { id: 'chInstantAlarm', isOrder: true, numeric: false, disablePadding: true, label: t('colInstantAlarm') },
            { id: 'chRegUserId', isOrder: true, numeric: false, disablePadding: true, label: t('colRegUserId') },
            { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t('colEdit') },
        ];

        const listObj = NoticePublishProps.getIn(['viewItems', compId]);
        let emptyRows = 0; 
        if(listObj && listObj.get('listData')) {
          emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
        }

        return (
        <div>
            {listObj &&
                <Table>
                    <GRCommonTableHead
                        classes={classes}
                        keyId="noticePublishId"
                        orderDir={listObj.getIn(['listParam', 'orderDir'])}
                        orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                        onRequestSort={this.handleChangeSort}
                        onClickAllCheck={this.handleClickAllCheck}
                        checkedIds={listObj.get('checkedIds')}
                        listData={listObj.get('listData')}
                        columnData={columnHeaders}
                    />
                    <TableBody>
                        {listObj.get('listData') && listObj.get('listData').map(n => {
                            const isChecked = this.isChecked(n.get('noticePublishId'));
                            const isSelected = this.isSelected(n.get('noticePublishId'));
                            return (
                            <TableRow
                                hover
                                className={(isSelected) ? classes.grSelectedRow : ''}
                                onClick={event => this.handleSelectRow(event, n.get('noticePublishId'))}
                                role='checkbox'
                                key={n.get('noticePublishId')}>
                                <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                                    <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('noticePublishId'))}/>
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    { CommonOptionProps.noticePublishStatusData.find(e => e.statusVal === n.get('statusCd')).statusNm }
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('noticePublishId')}</TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {formatDateToSimple(n.get('openDt'), 'YYYY-MM-DD HH:mm')}
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {(n.get('closeDt') !== undefined && n.get('closeDt') !== null) ? formatDateToSimple(n.get('closeDt'), 'YYYY-MM-DD HH:mm') : '무기한'}
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {n.get('viewType') === '0' ? '알림만' : '제목과함께'}
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {(n.get('openedUserCnt') !== undefined ? n.get('openedUserCnt') : '0') + '명' }
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    {(n.get('instantAlarmCnt') !== undefined ? n.get('instantAlarmCnt') : '0') + '회' }
                                </TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>
                                    <Button size="small" color="secondary"
                                        className={classes.buttonInTableRow} 
                                        onClick={event => this.handleEditClick(event, n.get('noticePublishId'))}>
                                        <SettingsApplicationsIcon/>
                                    </Button>
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
    CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticePublishActions: bindActionCreators(NoticePublishActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});
  
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticePublishListComp)));