import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next'

import * as NoticePublishExtensionActions from 'modules/NoticePublishExtensionModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import { formatDateToSimple } from 'components/GRUtils/GRDates';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class NoticeInstantAlarmListComp extends Component {
    componentDidMount() {
    }

    handleChangePage = (event, page) => {
        this.props.NoticePublishExtensionActions.readNoticeInstantAlarmListPaged(this.props.NoticePublishExtensionProps, this.props.compId, {
          page: page
        });
    }
    
    handleChangeRowsPerPage = event => {
        this.props.NoticePublishExtensionActions.readNoticeInstantAlarmListPaged(this.props.NoticePublishExtensionProps, this.props.compId, {
          rowsPerPage: event.target.value, page: 0
        });
    }

    render() {
        const { classes } = this.props;
        const { NoticePublishExtensionProps, compId } = this.props;
        const { t, i18n } = this.props;

        const columnHeaders = [
            { id: 'chRegDt', isOrder: false, numeric: false, disablePadding: true, label: t('colRegDate') },
            { id: 'chRegUserId', isOrder: false,GRCommonTableHeadnumeric: false, disablePadding: true, label: t('colRegUserId') }
        ];

        const listObj = NoticePublishExtensionProps.getIn(['viewItems', compId]);
        let emptyRows = 0; 
        if(listObj && listObj.get('listData_NIA')) {
          emptyRows = listObj.getIn(['listParam_NIA', 'rowsPerPage']) - listObj.get('listData_NIA').size;
        }

        return (
        <div>
            {listObj &&
                <Table>
                    <GRCommonTableHead
                        classes={classes}
                        keyId='objId'
                        listData={listObj.get('listData_NIA')}
                        columnData={columnHeaders}
                    />
                    <TableBody>
                        {listObj.get('listData_NIA') && listObj.get('listData_NIA').map(n => {
                            return (
                            <TableRow key={n}>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD HH:mm')}</TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
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
            {listObj && listObj.get('listData_NIA') && listObj.get('listData_NIA').size > 0 &&
                <TablePagination
                    component='div'
                    count={listObj.getIn(['listParam_NIA', 'rowsFiltered'])}
                    rowsPerPage={listObj.getIn(['listParam_NIA', 'rowsPerPage'])}
                    rowsPerPageOptions={listObj.getIn(['listParam_NIA', 'rowsPerPageOptions']).toJS()}
                    page={listObj.getIn(['listParam_NIA', 'page'])}
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
    NoticePublishExtensionProps: state.NoticePublishExtensionModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticePublishExtensionActions: bindActionCreators(NoticePublishExtensionActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});
  
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticeInstantAlarmListComp)));