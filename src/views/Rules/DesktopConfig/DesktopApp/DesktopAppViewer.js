import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DesktopAppViewer extends Component {

  render() {

    const { classes, viewItem } = this.props;
    const { t, i18n } = this.props;

    const bull = <span className={classes.bullet}>•</span>;

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={4} style={{marginBottom:20}}>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbDesktopAppType")}</TableCell>
                  <TableCell >{viewItem.get('appGubun')}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbExecuteCmd")}</TableCell>
                  <TableCell  style={{wordBreak: 'break-word', maxWidth:200}}>{viewItem.get('appExec')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbMountUrl")}</TableCell>
                  <TableCell >{viewItem.get('appMountUrl')}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbMountPoint")}</TableCell>
                  <TableCell >{viewItem.get('appMountPoint')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbServiceStatus")}</TableCell>
                  <TableCell >{viewItem.get('statusCd')}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbIconEditDate")}</TableCell>
                  <TableCell >{formatDateToSimple(viewItem.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbIconDivision")}</TableCell>
                  <TableCell >{viewItem.get('iconGubun')}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbIconInfo")}</TableCell>
                  <TableCell >{(viewItem.get('iconGubun') == 'favicon') ? viewItem.get('iconUrl') : viewItem.get('iconNm')}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppViewer)));

