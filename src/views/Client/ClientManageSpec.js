import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { formatBytes } from 'components/GRUtils/GRCommonUtils';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManageSpec extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { compId, ClientManageProps } = this.props;
    const informOpen = ClientManageProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = ClientManageProps.getIn(['viewItems', compId, 'viewItem']);

    let storageRate = '';
    let storageInfo = '';
    if(viewItem && viewItem.get('strgSize') && viewItem.get('strgSize') > 0 && viewItem.get('strgUse') && viewItem.get('strgUse') > 0) {
      storageRate = ((viewItem.get('strgUse') * 100) / viewItem.get('strgSize')).toFixed(2) + '%';
      storageInfo = formatBytes(viewItem.get('strgUse'), 1) + '/' + formatBytes(viewItem.get('strgSize'), 1);
    }

    return (
      <div>
      {(informOpen && viewItem) &&
        <Card style={{marginBottom: 20}}>
          <CardHeader
            title={(viewItem) ? viewItem.get('clientName') : ''}
            subheader={viewItem.get('clientId') + ', ' + formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD')}
          />
          <CardContent style={{paddingTop:0}}>
            <Typography component="pre">
              {(viewItem.get('clientStatus') == 'STAT021') ? '폐기된 단말입니다.' : ''}
            </Typography>
            <Divider />
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 단말그룹</TableCell>
                      <TableCell numeric>
                        {viewItem.get('clientGroupName')} ({viewItem.get('clientGroupId')})
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 단말설명</TableCell>
                      <TableCell numeric>{viewItem.get('comment')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 온라인여부</TableCell>
                      <TableCell numeric>{(viewItem.get('isOn') == '0') ? '오프라인' : '온라인'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 홈폴더 사용률</TableCell>
                      <TableCell numeric>{(storageRate != '') ? (storageRate + ' (' + storageInfo + ')') : ''}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 설치패키지수</TableCell>
                      <TableCell numeric>{viewItem.get('totalCnt')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} sm={6} >
                <Table>
                  <TableBody>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 부팅보안침해</TableCell>
                      <TableCell numeric>{(viewItem.get('countBootProtector') > 0) ? '침해' : '미침해'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 실행보안침해</TableCell>
                      <TableCell numeric>{(viewItem.get('countExeProtector') > 0) ? '침해' : '미침해'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">{bull} 매체보안침해</TableCell>
                      <TableCell numeric>{(viewItem.get('countMediaProtector') > 0) ? '침해' : '미침해'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">{bull} OS보안침해</TableCell>
                      <TableCell numeric>{(viewItem.get('countOsProtector') > 0) ? '침해' : '미침해'}</TableCell>
                    </TableRow>
                    {/**
                    <TableRow>
                      <TableCell component="th" scope="row">{bull} isProtector</TableCell>
                      <TableCell numeric>{(viewItem.get('isProtector') == '0') ? '침해' : '미침해'}</TableCell>
                    </TableRow>
                    */}
                  </TableBody>

                </Table>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      }
      </div>
    );

  }
}


const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientManageSpec));

