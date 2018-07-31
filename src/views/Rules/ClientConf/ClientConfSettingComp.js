import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientConfSettingDialog from './ClientConfSettingDialog';
import { createViewObject } from './ClientConfSettingInform';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

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

  handleEditBtnClick = (param) => {
    const { ClientConfSettingActions, ClientConfSettingProps, compId } = this.props;
    const viewItem = ClientConfSettingProps.viewItems.find(function(element) {
      return element._COMPID_ == compId;
    });

    ClientConfSettingActions.showDialog({
      compId: compId,
      selectedItem: createViewObject(viewItem.selectedItem),
      dialogType: ClientConfSettingDialog.TYPE_EDIT,
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientConfSettingProps, compId } = this.props;
    const { viewItems } = ClientConfSettingProps;
    const bull = <span className={classes.bullet}>•</span>;

    let viewCompItem = null;
    if(viewItems) {
      const viewItem = viewItems.find((element) => {
        return element._COMPID_ === compId;
      });
      if(viewItem) {
        viewCompItem = createViewObject(viewItem.selectedItem);
      }
    }

    return (
      <React.Fragment>
      <Card>
        {(viewCompItem) && <CardContent>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Typography >
                단말정책설정
              </Typography>
            </Grid>
            <Grid item xs={6} style={{textAlign:"right"}}>
              <Button
                variant="outlined" color="primary"
                onClick={() => this.handleEditBtnClick(viewCompItem.objId)}
              ><SettingsApplicationsIcon />수정</Button>
            </Grid>
          </Grid>
          <Typography variant="headline" component="h2">
            {viewCompItem.objNm}
          </Typography>
          <Typography color="textSecondary">
            {(viewCompItem.comment != '') ? '"' + viewCompItem.comment + '"' : ''}
          </Typography>
          <Divider />
          {(viewCompItem && viewCompItem.objId != '') &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 에이전트 폴링주기(초)</TableCell>
                  <TableCell numeric>{viewCompItem.pollingTime}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(viewCompItem.useHypervisor) ? '구동' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{(viewCompItem.selectedNtpIndex > -1) ? viewCompItem.ntpAddress[viewCompItem.selectedNtpIndex] : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{viewCompItem.ntpAddress.map(function(prop, index) {
                      return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        </CardContent>
        }
      </Card>
      <ClientConfSettingDialog />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupModule,
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientConfSettingComp));


