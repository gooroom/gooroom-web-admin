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

class SoftwareFilterViewer extends Component {

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
                  <TableCell component="th" scope="row">{bull} USB메모리</TableCell>
                  <TableCell numeric>{viewItem.get('usbMemory')}</TableCell>
                  <TableCell component="th" scope="row">{bull} CD/DVD</TableCell>
                  <TableCell numeric>{viewItem.get('cdAndDvd')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린터</TableCell>
                  <TableCell numeric>{viewItem.get('printer')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 화면캡쳐</TableCell>
                  <TableCell numeric>{viewItem.get('screenCapture')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 사운드(소리,마이크)</TableCell>
                  <TableCell numeric>{viewItem.get('sound')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 카메라</TableCell>
                  <TableCell numeric>{viewItem.get('camera')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} USB키보드</TableCell>
                  <TableCell numeric>{viewItem.get('keyboard')}</TableCell>
                  <TableCell component="th" scope="row">{bull} USB마우스</TableCell>
                  <TableCell numeric>{viewItem.get('mouse')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 무선랜</TableCell>
                  <TableCell numeric>{viewItem.get('wireless')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 블루투스</TableCell>
                  <TableCell numeric>{viewItem.get('bluetoothState')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                  <TableCell component="th" scope="row">{bull} 맥주소(블루투스)</TableCell>
                  <TableCell numeric>{viewItem.get('macAddress').map(function(prop, index) {
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

export default withStyles(GRCommonStyle)(SoftwareFilterViewer);
