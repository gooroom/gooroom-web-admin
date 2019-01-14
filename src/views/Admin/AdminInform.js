import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import * as AdminActions from 'modules/AdminModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import AdminDialog from './AdminDialog';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class AdminInform extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isShowEdit: false,
      editValue: 0
    };
  }

  componentDidMount() {
    const { AdminActions } = this.props;
    AdminActions.getAdminInfo();
  }

  // .................................................
  handleClickLogout = () => {
    // const { AdminActions } = this.props;
    // AdminActions.logout();
    requestPostAPI('logout', {
      temp: 'dump'
    }).then(
      (response) => {
        document.location.href="/gpms";
      }
    ).catch(error => {
      document.location.href="/gpms";
    });

  };

  handleShowAdminEdit = (event) => {
    this.props.AdminActions.setEditingItemValue({
      name: 'editPollingCycle',
      value: this.props.AdminProps.get('pollingCycle')
    });
    this.setState({isShowEdit: true});
  };

  handleCloseAdminEdit = (event) => {
    this.setState({isShowEdit: false});
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { AdminProps } = this.props;
    const { t, i18n } = this.props;

    const bull = <span className={classes.bullet}>•</span>;

    return (
      <div>
        <Card style={{width:242}}>
          <CardHeader
            title={t("lbAdminTitle")}
            action={
              <IconButton style={{marginTop:10}} onClick={event => this.handleShowAdminEdit(event)}>
                <SettingsApplicationsIcon />
              </IconButton>
            }
          />
          <CardContent style={{paddingLeft:12,paddingRight:12}}>
            <Divider />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbAdminTitleName")}</TableCell>
                  <TableCell >{AdminProps.get('adminName')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbAdminTitleId")}</TableCell>
                  <TableCell >{AdminProps.get('adminId')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbAdminCycleTime")}</TableCell>
                  <TableCell >{AdminProps.get('pollingCycle')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2} style={{textAlign:'right'}}>
                    <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleClickLogout()} >
                    logout
                    </Button>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>

          </CardContent>
        </Card>
        <AdminDialog isShowEdit={this.state.isShowEdit} onClickClose={this.handleCloseAdminEdit} />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminActions: bindActionCreators(AdminActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminInform)));

