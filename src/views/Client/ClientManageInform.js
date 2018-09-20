import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getDataObjectInComp } from 'components/GrUtils/GrTableListUtils';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import ClientConfSettingComp from 'views/Rules/ClientConfig/ClientConfSettingComp';
import ClientHostNameComp from 'views/Rules/HostName/ClientHostNameComp';
import DesktopConfigComp from 'views/Rules/DesktopConfig/DesktopConfigComp';
import ClientUpdateServerComp from 'views/Rules/UpdateServer/ClientUpdateServerComp';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManageInform extends Component {

  // .................................................
  render() {
    const { classes } = this.props;
    const { compId, ClientManageProps } = this.props;

    const viewItem = getDataObjectInComp(ClientManageProps, compId);
    const selectedViewItem = viewItem.get('selectedViewItem');

    const bull = <span className={classes.bullet}>•</span>;

    return (
      <div>
      {(viewItem.get('informOpen') && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.get('clientName') : ''}
            subheader={selectedViewItem.get('clientId') + ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              {selectedViewItem.get('clientStatus')}
            </Typography>
          </CardContent>
          <Divider />

          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 단말그룹</TableCell>
                    <TableCell numeric>{selectedViewItem.get('clientGroupName')} ({selectedViewItem.get('clientGroupId')})</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell component="th" scope="row">{bull} 단말설명</TableCell>
                    <TableCell numeric>{selectedViewItem.get('comment')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 온라인여부</TableCell>
                    <TableCell numeric>{(selectedViewItem.get('isOn') == '0') ? '오프라인' : '온라인'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} sm={6} >
              <Table>
                <TableBody>
                  
                  <TableRow>
                    <TableCell component="th" scope="row">{bull} isBootProtector</TableCell>
                    <TableCell numeric>{(selectedViewItem.get('isBootProtector') == '0') ? '미침해' : '침해'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} isExeProtector</TableCell>
                    <TableCell numeric>{(selectedViewItem.get('isExeProtector') == '0') ? '미침해' : '침해'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} isMediaProtector</TableCell>
                    <TableCell numeric>{(selectedViewItem.get('isMediaProtector') == '0') ? '미침해' : '침해'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} isOsProtector</TableCell>
                    <TableCell numeric>{(selectedViewItem.get('isOsProtector') == '0') ? '미침해' : '침해'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">{bull} isProtector</TableCell>
                    <TableCell numeric>{(selectedViewItem.get('isProtector') == '0') ? '미침해' : '침해'}</TableCell>
                  </TableRow>

                </TableBody>

              </Table>
            </Grid>
          </Grid>
          {/*
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} >
              <ClientConfSettingComp
                compId={compId}
                objId={selectedViewItem.get('clientConfigId')} 
                objNm={selectedViewItem.get('clientConfigNm')} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <DesktopConfigComp 
                compId={compId}
                objId={selectedViewItem.get('desktopConfigId')} 
                objNm={selectedViewItem.get('desktopConfigNm')} 
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} >
              <ClientHostNameComp
                compId={compId}
                objId={selectedViewItem.get('hostNameConfigId')} 
                objNm={selectedViewItem.get('hostNameConfigNm')} 
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <ClientUpdateServerComp
                compId={compId}
                objId={selectedViewItem.get('updateServerConfigId')} 
                objNm={selectedViewItem.get('updateServerConfigNm')} 
              />
            </Grid>
          </Grid>
          */}
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
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientManageInform));

