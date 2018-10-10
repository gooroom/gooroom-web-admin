import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as AdminActions from 'modules/AdminModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class AdminInform extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { AdminActions } = this.props;
    AdminActions.getAdminInfo();
  }

  // .................................................
  render() {
    const { classes } = this.props;
    const { AdminProps } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <div>
        <Card>
          <CardHeader
            title="..관리자.."
          />
          <CardContent >
            <Divider />
            <br />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 이름</TableCell>
                  <TableCell numeric>{AdminProps.get('adminName')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 아이디</TableCell>
                  <TableCell numeric>{AdminProps.get('adminId')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 이메일</TableCell>
                  <TableCell numeric>{AdminProps.get('email')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 알람사용여부</TableCell>
                  <TableCell numeric>{(AdminProps.get('isEnableAlarm')) ? '사용함' : '사용안함'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 갱신주기</TableCell>
                  <TableCell numeric>{AdminProps.get('pollingTime')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

          </CardContent>
        </Card>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminActions: bindActionCreators(AdminActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(AdminInform));

