import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class SecurityRuleViewer extends Component {

  render() {

    const { classes, viewItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={0} className={classes.ruleViewerCard}>
            <CardContent style={{padding: 10}}>
            <Grid container>
              <Grid item xs={6}>
                <Typography color="default">
                {(viewItem.get('objNm') != '') ? viewItem.get('objNm') : ''}
                </Typography>
              </Grid>
              <Grid item xs={6}>
              </Grid>
            </Grid>
            <Typography color="textSecondary">
              {(viewItem.get('comment') != '') ? '"' + viewItem.get('comment') + '"' : ''}
            </Typography>
            <Divider />
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 화면보호기 설정시간(분)</TableCell>
                  <TableCell numeric>{viewItem.get('screenTime')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 패스워드 변경주기(일)</TableCell>
                  <TableCell numeric>{viewItem.get('passwordTime')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 패키지추가/삭제 기능</TableCell>
                  <TableCell numeric>{viewItem.get('packageHandle')}</TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 전체네트워크허용</TableCell>
                  <TableCell numeric>{viewItem.get('state')}</TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
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

export default withStyles(GRCommonStyle)(SecurityRuleViewer);

