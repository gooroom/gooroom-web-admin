import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientConfSettingDialog from './ClientConfSettingDialog';
import { createViewObject } from './ClientConfSettingInform';
import { getDataObjectInComp, getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientConfSettingComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  handleEditBtnClick = (objId) => {
    const { ClientConfSettingProps, ClientConfSettingActions, compId } = this.props;
    const selectedItem = getSelectedObjectInComp(ClientConfSettingProps, compId);

    ClientConfSettingActions.showDialog({
      selectedItem: createViewObject(selectedItem),
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { ClientConfSettingProps, compId } = this.props;
    const viewItem = getDataObjectInComp(ClientConfSettingProps, compId);
    const viewCompItem = createViewObject(viewItem.get('selectedItem'));

    return (
      <React.Fragment>
      <Card elevation={0}>
        {(viewCompItem) && <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.compTitle}>
                단말정책설정
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justify="flex-end">
                <Button size="small"
                  variant="outlined" color="primary"
                  onClick={() => this.handleEditBtnClick(viewCompItem.get('objId'))}
                ><SettingsApplicationsIcon />수정</Button>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="headline" component="h2">
            {viewCompItem.get('objNm')}
          </Typography>
          <Typography color="textSecondary">
            {(viewCompItem.get('comment') != '') ? '"' + viewCompItem.get('comment') + '"' : ''}
          </Typography>
          <Divider />
          {(viewCompItem && viewCompItem.get('objId') != '') &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 에이전트 폴링주기(초)</TableCell>
                  <TableCell numeric>{viewCompItem.get('pollingTime')}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(viewCompItem.get('useHypervisor')) ? '구동' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{viewCompItem.get('selectedNtpAddress')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{viewCompItem.get('ntpAddress').map(function(prop, index) {
                      return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        </CardContent>
        }
      </Card>
      <ClientConfSettingDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientConfSettingComp));


