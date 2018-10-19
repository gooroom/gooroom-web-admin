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

class ClientUpdateServerViewer extends Component {

  render() {
    const { classes, viewItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <React.Fragment>
        {viewItem && 
          <Card>
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
                    <TableCell component="th" scope="row" >{bull} 주 OS 정보</TableCell>
                    <TableCell><pre>{viewItem.get('mainos')}</pre></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" >{bull} 기반 OS 정보</TableCell>
                    <TableCell><pre>{viewItem.get('extos')}</pre></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" >{bull} gooroom.pref</TableCell>
                    <TableCell><pre>{viewItem.get('priorities')}</pre></TableCell>
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

export default withStyles(GRCommonStyle)(ClientUpdateServerViewer);
