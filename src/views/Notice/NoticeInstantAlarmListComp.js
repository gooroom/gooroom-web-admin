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
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class NoticeInstantAlarmListComp extends Component {
    componentDidMount() {
    }

    render() {
        const { classes } = this.props;
        const { NoticePublishExtensionProps, compId } = this.props;
        const { t, i18n } = this.props;

        const columnHeaders = [
            { id: 'chRegDt', isOrder: false, numeric: false, disablePadding: true, label: t('colRegDt') },
            { id: 'chRegUserId', isOrder: false,GRCommonTableHeadnumeric: false, disablePadding: true, label: t('colRegUserId') }
        ];

        const listObj = NoticePublishExtensionProps.getIn(['viewItems', compId, 'NOTICE_INSTANT_ALARM']);

        return (
        <div>
            {listObj &&
                <Table>
                    <GRCommonTableHead
                        classes={classes}
                        keyId='objId'
                        listData={listObj.get('listAllData')}
                        columnData={columnHeaders}
                    />
                    <TableBody>
                        {listObj.get('listAllData') && listObj.get('listAllData').map(n => {
                            return (
                            <TableRow key={n}>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD HH:mm')}</TableCell>
                                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
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