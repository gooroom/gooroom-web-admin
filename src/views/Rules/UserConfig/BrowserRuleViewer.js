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

class BrowserRuleViewer extends Component {

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
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webSocket')}</TableCell>
                  <TableCell component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{viewItem.get('webWorker')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{viewItem.get('trustSetupId')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 비신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{viewItem.get('untrustSetupId')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} White List</TableCell>
                  <TableCell colSpan={3} numeric>{viewItem.get('trustUrlList').map(function(prop, index) {
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

export default withStyles(GRCommonStyle)(BrowserRuleViewer);

