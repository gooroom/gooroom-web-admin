import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import { GRCommonStyle } from "templates/styles/GRStyles";
import { translate, Trans } from 'react-i18next';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as BulkActions from 'modules/PortableBulkModule';

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

class CsvGuide extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOk = () => {
    const { BulkActions } = this.props;
    BulkActions.openCsvGuide(false);
  }

  render() {
    const { t, classes } = this.props;
    const { BulkProps } = this.props;

    const columnHeaders = [
      {id: "chUserID", isOrder: false, numeric: false, disablePadding: true, label: "ID" },
      {id: "chPassword", isOrder: false, numeric: false, disablePadding: true, label: "Password"},
      {id: "chEmail", isOrder: false, numeric: false, disablePadding: true, label: "Email"},
      {id: "chName", isOrder: false, numeric: false, disablePadding: true, label: "Name"},
      {id: "chPhone", isOrder: false, numeric: false, disablePadding: true, label: "Phone"},
    ];

    const rowData = [
      {
        id: "user1", passwd: "1234", email: "user1@gooroom.kr", name: "김길동", phone: "000-0000-0000"
      },
      {
        id: "user2", passwd: "1234", email: "user2@gooroom.kr", name: "고길동", phone: "000-0000-0000"
      },
      {
        id: "user3", passwd: "1234", email: "user3@gooroom.kr", name: "Hong kil dong", phone: "000-0000-0000"
      },
    ]

    return (
      <Dialog open={BulkProps['isOpenCsvGuide']}>
        <DialogTitle>{"CSV 작성 예"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-title">
            <Table>
              <GRCommonTableHead
                classes={classes}
                columnData={columnHeaders}
              />
              <TableBody>
                {rowData.map(n => {
                  return (
                    <TableRow key="0">
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.id}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.passwd}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.email}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.name}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.phone}</TableCell>
                    </TableRow>
                  )})
                }
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
    )
  }
}

const mapStateToProps = (state) => ({
  BulkProps: state.PortableBulkModule,
});

const mapDispatchToProps = (dispatch) => ({
  BulkActions: bindActionCreators(BulkActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(CsvGuide)));