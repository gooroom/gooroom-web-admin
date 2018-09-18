import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getViewItem } from 'components/GrUtils/GrCommonUtils';

import * as UserActions from 'modules/UserModule';

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
class UserManageInform extends Component {

  // .................................................

  render() {
    const { classes } = this.props;
    const { UserProps, compId } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const viewItem = getViewItem({ props: UserProps, compId: compId });
    const selectedViewItem = (viewItem) ? viewItem.selectedViewItem : null;

    return (
      <div >
      {(UserProps.informOpen && selectedViewItem) &&
        <Card>
          <CardHeader
            title="사용자 정보"
          />
          <CardContent >
            <Divider />
            <br />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 사용자 이름</TableCell>
                  <TableCell numeric>{selectedViewItem.userNm}</TableCell>
                  <TableCell component="th" scope="row">{bull} 사용자 아이디</TableCell>
                  <TableCell numeric>{selectedViewItem.userId}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

          </CardContent>
        </Card>
      }
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(UserManageInform));

