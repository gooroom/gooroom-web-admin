import React from 'react';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ReviewActions from 'modules/PortableUserReviewModule';

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

class CertDetail extends React.Component {
  handleOk = () => {
    const { ReviewActions } = this.props;
    ReviewActions.openCertDialog(false);
  }

  render() {
    const { t, classes } = this.props;
    const { ReviewProps } = this.props;
    const createDate = formatDateToSimple(ReviewProps.get('certCreateDate'), 'YYYY-MM-DD');
    const transferDate = formatDateToSimple(ReviewProps.get('certTransferDate'), 'YYYY-MM-DD');

    const columnHeaders = [
      {id: "chCreateDate", isOrder: false, numeric: false, disablePadding: true, label: t("colCreateDate") },
      {id: "chTransferDate", isOrder: false, numeric: false, disablePadding: true, label: t("colTransferDate") },
    ];

    return (
      <Dialog maxWidth="lg" open={ReviewProps.get('isOpenCertDialog')}>
        <DialogTitle>{t("dtCertDialog")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-title">
            <Table>
              <GRCommonTableHead
                classes={classes}
                columnData={columnHeaders}
              />
              <TableBody>
                <TableRow key="0">
                  <TableCell className={classes.grSmallAndAndDateCell}>{createDate}</TableCell>
                  <TableCell className={classes.grSmallAndAndDateCell}>{transferDate}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContentText>
          <DialogActions>
            <Button onClick={this.handleOk} color="primary">
              {t("btnOK")}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  ReviewProps: state.PortableUserReviewModule,
});

const mapDispatchToProps = (dispatch) => ({
  ReviewActions: bindActionCreators(ReviewActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(CertDetail)));