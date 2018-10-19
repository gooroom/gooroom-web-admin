import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class ClientConfSettingViewer extends Component {

  // .................................................
  render() {
    const { classes, viewItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <React.Fragment>
        {viewItem && 
        <Card>
          <CardContent>
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
                  <TableCell component="th" scope="row">{bull} 에이전트 폴링주기(초)</TableCell>
                  <TableCell numeric>{viewItem.get('pollingTime')}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(viewItem.get('useHypervisor')) ? '구동' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{viewItem.get('selectedNtpAddress')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{viewItem.get('ntpAddress').map(function(prop, index) {
                      return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
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

export default withStyles(GRCommonStyle)(ClientConfSettingViewer);
