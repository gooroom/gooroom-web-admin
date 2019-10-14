import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DesktopAppSpec extends Component {

  render() {

    const { classes } = this.props;
    const { compId, targetType, selectedItem } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let GRAvartar = null;
    if(selectedItem) {
      viewItem = selectedItem.get('viewItem');
      GRAvartar = getAvatarForRuleGrade(targetType, "DESKTOP_APP");
    }

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={4} style={{marginBottom:20}}>
            <CardHeader
              avatar={GRAvartar}
              title={viewItem.get('appNm')} 
              subheader={viewItem.get('appId') + ', ' + viewItem.get('appInfo')}
              action={<div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(viewItem, targetType)}
                  ><SettingsApplicationsIcon /></Button>
                  {(this.props.onClickCopy) &&
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(viewItem)}
                  ><CopyIcon /></Button>
                  }
                </div>}
              style={{paddingBottom:0}}
            />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbDesktopAppType")}</TableCell>
                  <TableCell >{viewItem.get('appGubun')}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbExecuteCmd")}</TableCell>
                  <TableCell  style={{wordBreak: 'break-word', maxWidth:200}}>{viewItem.get('appExec')}</TableCell>
                </TableRow>

                { (viewItem.get('appGubun') === 'mount') &&
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbMountUrl")}</TableCell>
                  <TableCell >{viewItem.get('appMountUrl')}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbMountPoint")}</TableCell>
                  <TableCell >{viewItem.get('appMountPoint')}</TableCell>
                </TableRow>
                }

                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbServiceStatus")}</TableCell>
                  <TableCell >{(viewItem.get('statusCd') === 'STAT010') ? t("selSeviceOn") : t("selSeviceOff")}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbIconEditDate")}</TableCell>
                  <TableCell >{formatDateToSimple(viewItem.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbIconDivision")}</TableCell>
                  <TableCell >{viewItem.get('iconGubun')}</TableCell>
                  <TableCell component="th" scope="row">{bull} {t("lbIconInfo")}</TableCell>
                  <TableCell >{(viewItem.get('iconGubun') == 'favicon') ? viewItem.get('iconUrl') : viewItem.get('iconId')}</TableCell>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppSpec)));

