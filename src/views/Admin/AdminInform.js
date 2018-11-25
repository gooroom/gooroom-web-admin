import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import  { Redirect } from 'react-router-dom';

import * as AdminActions from 'modules/AdminModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

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
  handleClickLogout = () => {
    // const { AdminActions } = this.props;
    // AdminActions.logout();
    requestPostAPI('logout', {
      temp: 'dump'
    }).then(
      (response) => {
        console.log('11111 ::: ', this.props );
        this.props.history.push('/');
        return <Redirect to='/' />
      }
    ).catch(error => {
      console.log('22222');
      return <Redirect to='/' />
    });

  };
  

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
                  <TableCell component="th" scope="row">{bull} 로그아웃</TableCell>
                  <TableCell>

              <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleClickLogout()} >
                <Search />logout
              </Button>
                  
                  </TableCell>
                </TableRow>
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
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminInform));

