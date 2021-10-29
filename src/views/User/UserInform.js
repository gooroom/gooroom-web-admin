import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserInfoActions from 'modules/UserInfoModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";

class UserInform extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.UserInfoActions.getUserInfo();
  }

  handleClickLogout = () => {
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

  render() {
    const { classes } = this.props;
    const { UserInfoProps } = this.props;
    const { t } = this.props;

    const bull = <span className={classes.bullet}>•</span>;

    return(
      <div>
        <Card style={{width:242}}>
          <CardHeader
            title={t("lbUser")}
            action={
              <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" 
                onClick={() => this.handleClickLogout()} >logout</Button>
            }
          />
          <CardContent style={{paddingLeft:12,paddingRight:12}}>
            <Divider />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbAdminTitleName")}</TableCell>
                  <TableCell colSpan={2}>{UserInfoProps.get('userName')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} {t("lbAdminTitleId")}</TableCell>
                  <TableCell colSpan={2} >{UserInfoProps.get('userId')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  UserInfoProps: state.UserInfoModule
});

const mapDispatchToProps = (dispatch) => ({
  UserInfoActions: bindActionCreators(UserInfoActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserInform)));

