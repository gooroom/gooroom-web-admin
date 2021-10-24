import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next';

import * as NoticeActions from 'modules/NoticeModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import NoticeDialog from './NoticeDialog';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import { getRowObjectById, getDataObjectVariableInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class NoticeListComp extends Component {
    componentDidMount() {
        const { NoticeActions, NoticeProps, compId } = this.props;

        NoticeActions.readNoticeListPaged(NoticeProps, compId);
    }
    
    isSelected = id => {
        const { NoticeProps, compId } = this.props;
        const selectedNoticeItem = getDataObjectVariableInComp(NoticeProps, compId, 'viewItem');
        return (selectedNoticeItem && selectedNoticeItem.get('noticeId') == id);
    }

    handleChangePage = (event, page) => {
        this.props.NoticeActions.readNoticeListPaged(this.props.NoticeProps, this.props.compId, {
          page: page
        });
    }
    
    handleChangeRowsPerPage = event => {
        this.props.NoticeActions.readNoticeListPaged(this.props.NoticeProps, this.props.compId, {
          rowsPerPage: event.target.value, page: 0
        });
    }

    handleSelectRow = (event, id, isEditable) => {
        event.stopPropagation();
        const { NoticeProps, compId } = this.props;
        // get Object
        const selectRowObject = getRowObjectById(NoticeProps, compId, id, 'noticeId');
        if(this.props.onSelect && selectRowObject) {
          this.props.onSelect(selectRowObject, isEditable);
        }
    }

    // edit dialog
    handleEditClick = (event, id) => {
        event.stopPropagation();
        const { NoticeProps, NoticeActions, compId } = this.props;
        const viewItem = getRowObjectById(NoticeProps, compId, id, 'noticeId');
        NoticeActions.showNoticeDialog({
            viewItem: viewItem,
            dialogType: NoticeDialog.TYPE_EDIT
        });
    };

    // delete
    handleDeleteClick = (event, id) => {
        event.stopPropagation();
        const { NoticeProps, GRConfirmActions, compId } = this.props;
        const { t, i18n } = this.props;
        const viewItem = getRowObjectById(NoticeProps, compId, id, 'noticeId');
        GRConfirmActions.showConfirm({
            confirmTitle: t('dtDeleteNotice'),
            confirmMsg: t('msgDeleteNotice', {noticeId: viewItem.get('noticeId')}),
            handleConfirmResult: this.handleDeleteConfirmResult,
            confirmObject: viewItem
        });
    };

    handleDeleteConfirmResult = (confirmValue, confirmObject) => {
        if(confirmValue) {
            const { NoticeProps, NoticeActions, compId } = this.props;
            NoticeActions.deleteNotice({
                compId: compId,
                noticeId: confirmObject.get('noticeId')
            }).then(() => {
                NoticeActions.readNoticeListPaged(NoticeProps, compId);
            });
        }
    };

    render() {
        const { classes, AdminProps } = this.props;
        const { NoticeProps, compId, selectorType } = this.props;
        const { t, i18n } = this.props;

        const columnHeaders = [
            { id: 'chNoticeId', isOrder: false, numeric: false, disablePadding: true, label: t('colNoticeId') },
            { id: 'chTitle', isOrder: false, numeric: false, disablePadding: true, label: t('colTitle') },
            { id: 'chRegUserId', isOrder: false, numeric: false, disablePadding: true, label: t('colRegUserId') },
            { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t('colEditDelete') },
        ];

        const listObj = NoticeProps.getIn(['viewItems', compId]);
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
                        keyId='noticeId'
                        orderDir={listObj.getIn(['listParam', 'orderDir'])}
                        orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                        columnData={columnHeaders}
                    />
                    <TableBody>
                        {listObj.get('listData') && listObj.get('listData').map(n => {

                            const isSelected = this.isSelected(n.get('noticeId'));
                            let isEditable = false;
                            if(AdminProps.get('adminId') === n.get('regUserId')) {
                                isEditable = true;
                            }

                            return (
                            <TableRow
                                hover
                                className={(isSelected) ? classes.grSelectedRow : ''}
                                onClick={event => this.handleSelectRow(event, n.get('noticeId'), isEditable)}
                                role='checkbox'
                                key={n.get('noticeId')}>
                                <TableCell style={{width: "100px"}} className={classes.grSmallAndClickAndCenterCell}>{n.get('noticeId')}</TableCell>
                                <TableCell className={classes.grSmallAndClickCell}>{n.get('title')}</TableCell>
                                <TableCell style={{width: "100px"}} className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                                <TableCell style={{width: "60px"}} className={classes.grSmallAndClickAndCenterCell}>
                                    {isEditable && 
                                    <Button size="small" color='secondary'
                                        className={classes.buttonInTableRow} 
                                        onClick={event => this.handleEditClick(event, n.get('noticeId'))}>
                                        <SettingsApplicationsIcon/>
                                    </Button>
                                    }
                                    {isEditable && n.get('publishCount') < 1 &&
                                        <Button size="small" color="secondary"
                                            className={classes.buttonInTableRow} 
                                            onClick={event => this.handleDeleteClick(event, n.get('noticeId'))}>
                                            <DeleteIcon />
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
    NoticeProps: state.NoticeModule,
    AdminProps: state.AdminModule
});
  
const mapDispatchToProps = (dispatch) => ({
    NoticeActions: bindActionCreators(NoticeActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});
  
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticeListComp)));