import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next'

import * as NoticePublishExtensionActions from 'modules/NoticePublishExtensionModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class NoticePublishTargetListComp extends Component {
    componentDidMount() {
    }

    getTargetTypeName = targetType => {
        if (targetType === '0') {
            return '사용자';
        } else if (targetType === '1') {
            return '조직';
        } else if (targetType === '2') {
            return '단말';
        } else {
            return '단말그룹';
        }
    }

    handleChangePage = (event, page) => {
        this.props.NoticePublishExtensionActions.readNoticePublishTargetListPaged(this.props.NoticePublishExtensionProps, this.props.compId, {
          page: page
        });
    }
    
    handleChangeRowsPerPage = event => {
        this.props.NoticePublishExtensionActions.readNoticePublishTargetListPaged(this.props.NoticePublishExtensionProps, this.props.compId, {
          rowsPerPage: event.target.value, page: 0
        });
    }

    render() {
        const { classes } = this.props;
        const { NoticePublishExtensionProps, compId } = this.props;
        const { t, i18n } = this.props;

        const columnHeaders = [
            { id: 'chTargetType', isOrder: false, numeric: false, disablePadding: true, label: t('colTargetType') },
            { id: 'chTargetName', isOrder: false,GRCommonTableHeadnumeric: false, disablePadding: true, label: t('colTargetName') }
        ];

        const listObj = NoticePublishExtensionProps.getIn(['viewItems', compId]);
        let emptyRows = 0; 
        if(listObj && listObj.get('listData_NPT')) {
          emptyRows = listObj.getIn(['listParam_NPT', 'rowsPerPage']) - listObj.get('listData_NPT').size;
        }

        return (
        <div>
            {listObj &&
                <Table>
                    <GRCommonTableHead
                        classes={classes}
                        keyId='objId'
                        listData={listObj.get('listData_NPT')}
                        columnData={columnHeaders}
                    />
                    <TableBody>
                        {listObj.get('listData_NPT') && listObj.get('listData_NPT').map(n => {
                            return (
                            <TableRow key={n}>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{this.getTargetTypeName(n.get('targetType'))}</TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('targetName')}</TableCell>
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
            {listObj && listObj.get('listData_NPT') && listObj.get('listData_NPT').size > 0 &&
                <TablePagination
                    component='div'
                    count={listObj.getIn(['listParam_NPT', 'rowsFiltered'])}
                    rowsPerPage={listObj.getIn(['listParam_NPT', 'rowsPerPage'])}
                    rowsPerPageOptions={listObj.getIn(['listParam_NPT', 'rowsPerPageOptions']).toJS()}
                    page={listObj.getIn(['listParam_NPT', 'page'])}
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
  
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticePublishTargetListComp)));