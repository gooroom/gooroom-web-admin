import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { formatBytes } from 'components/GRUtils/GRCommonUtils';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ComputerIcon from '@material-ui/icons/Computer';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManageSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { t, i18n } = this.props;

    const { compId, ClientManageProps } = this.props;
    const informOpen = ClientManageProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = ClientManageProps.getIn(['viewItems', compId, 'viewItem']);

    let storageRate = '';
    let storageInfo = '';
    if(viewItem && viewItem.get('strgSize') && viewItem.get('strgSize') > 0 && viewItem.get('strgUse') && viewItem.get('strgUse') > 0) {
      storageRate = ((viewItem.get('strgUse') * 100) / viewItem.get('strgSize')).toFixed(2) + '%';
      storageInfo = formatBytes(viewItem.get('strgUse'), 1) + '/' + formatBytes(viewItem.get('strgSize'), 1);
    }

    let clientInfo = null;
    let clientInfoSubHeader = null;
    if(viewItem) {
      clientInfo = <div>
        <ComputerIcon fontSize="large" style={{verticalAlign: 'middle', marginRight:10}} />
        <Typography variant="h6" style={{display: 'inline-block', marginRight:18}}>{(viewItem) ? viewItem.get('clientName') : ''}</Typography>
        <Chip avatar={<Avatar>ID</Avatar>} label={viewItem.get('clientId')} style={{marginRight:18}} />
      </div>;

      clientInfoSubHeader = <div style={{marginTop: 10}}>
        <CheckCircleOutlineIcon style={{verticalAlign: 'middle', marginRight:5, color: 'black'}} />
        <Typography style={{display: 'inline-block', fontWeight:'bold', marginRight:18}}>{t("spClientRegDate")}</Typography>
        <Typography style={{display: 'inline-block'}}>{formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD')}</Typography>
      </div>;
    }

    return (
      <div>
      {(informOpen && viewItem) &&
        <Card style={{marginBottom: 20}}>
          <CardHeader
            title={clientInfo}
            style={{wordBreak:'break-all'}}
            subheader={clientInfoSubHeader}
          />
          <CardContent style={{paddingTop:0}}>
            <Typography component="pre">
              {(viewItem.get('clientStatus') == 'STAT021') ? t("msgRevokedClient") : ''}
            </Typography>
            <Divider />
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spClientGroup")}</TableCell>
                      <TableCell >
                        {viewItem.get('clientGroupName')} ({viewItem.get('clientGroupId')})
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spClientDesc")}</TableCell>
                      <TableCell >{viewItem.get('comment')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spIsOnline")}</TableCell>
                      <TableCell >{(viewItem.get('isOn') == '0') ? t("selOffline") : t("selOnline")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spHomeSizeRate")}</TableCell>
                      <TableCell >{(storageRate != '') ? (storageRate + ' (' + storageInfo + ')') : ''}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spInstalledPkgCnt")}</TableCell>
                      <TableCell >{viewItem.get('totalCnt')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spCleanModeSupport")}</TableCell>
                      <TableCell >{viewItem.get('useCleanMode')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} sm={6} >
                <Table>
                  <TableBody>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spBootViolated")}</TableCell>
                      <TableCell >{(viewItem.get('countBootProtector') > 0) ? t("selViolated") : t("selUnviolated")}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spExeViolated")}</TableCell>
                      <TableCell >{(viewItem.get('countExeProtector') > 0) ? t("selViolated") : t("selUnviolated")}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spMediaViolated")}</TableCell>
                      <TableCell >{(viewItem.get('countMediaProtector') > 0) ? t("selViolated") : t("selUnviolated")}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spOSViolated")}</TableCell>
                      <TableCell >{(viewItem.get('countOsProtector') > 0) ? t("selViolated") : t("selUnviolated")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spClientRegDate")}</TableCell>
                      <TableCell >{formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD HH:mm:ss')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} {t("spCleanModeRun")}</TableCell>
                      <TableCell >{viewItem.get('cleanModeAllow') === "true" ? t("selActive") : t("selInActive")}</TableCell>
                    </TableRow>
                  </TableBody>

                </Table>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      }
      </div>
    );

  }
}


const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientManageSpec)));

