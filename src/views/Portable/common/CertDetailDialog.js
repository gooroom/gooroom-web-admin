import React from 'react';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PortableCertActions from 'modules/PortableCertModule';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

class CertDetailDialog extends React.Component {

  handleClose = () => {
    this.props.PortableCertActions.openCertDialog(false);
  }

  render() {
    const { t, classes } = this.props;
    const { PortableCertProps } = this.props;
    const { isOpen, userId, createDate, transferDate } = PortableCertProps;

    const columnHeaders = [
      {id: "chUser", isOrder: false, numeric: false, disablePadding: true, label: t("colUser") },
      {id: "chCreateDate", isOrder: false, numeric: false, disablePadding: true, label: t("colCreateDate") },
      {id: "chTransferDate", isOrder: false, numeric: false, disablePadding: true, label: t("colTransferDate") },
    ];

    return (
      <Dialog fullWidth={false} maxWidth={"sm"} open={isOpen}>
        <DialogTitle sx={{ m: 0, p: 2 }}>{t("dtCertDialog")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-title">
            <Table>
              <GRCommonTableHead
                classes={classes}
                columnData={columnHeaders}
              />
              <TableBody>
                <TableRow key="0">
                  <TableCell className={classes.grSmallAndDateCell}>{userId}</TableCell>
                  <TableCell className={classes.grSmallAndDateCell}>{formatDateToSimple(createDate, 'YYYY-MM-DD HH:mm:ss')}</TableCell>
                  <TableCell className={classes.grSmallAndDateCell}>{formatDateToSimple(transferDate, 'YYYY-MM-DD HH:mm:ss')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContentText>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {t("btnOK")}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = (state) => ({
    PortableCertProps: state.PortableCertModule,
});

const mapDispatchToProps = (dispatch) => ({
    PortableCertActions: bindActionCreators(PortableCertActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(CertDetailDialog)));