import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientConfSettingDialog from './ClientConfSettingDialog';

import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';


//
//  ## Theme override ########## ########## ########## ########## ########## 
//

//
//  ## Style ########## ########## ########## ########## ########## 
//

const title = css({
  marginBottom: 16,
  fontSize: 14,
}).toString();

const card = css({
  minWidth: 275,
}).toString();

const bullet = css({
  display: 'inline-block',
  margin: '0 2px',
  transform: 'scale(0.8)',
}).toString();

const pos = css({
  marginBottom: 12,
}).toString();

const grNarrowButton = css({
  paddingTop: '2px !important',
  paddingBottom: '2px !important'
}).toString();

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
      selectedItem: viewItem,
      dialogType: ClientConfSettingDialog.TYPE_EDIT,
    });
  };

  // .................................................
  render() {
    const bull = <span className={bullet}>•</span>;
    const { ClientConfSettingProps, compId } = this.props;
    const { viewItems } = ClientConfSettingProps;

    let viewItem = null;
    if(viewItems) {
      viewItem = viewItems.find(function(element) {
        return element._COMPID_ == compId;
      });
    }

    return (
      <React.Fragment>
      <Card className={card}>
        {(viewItem) && <CardContent>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Typography className={title} style={{backgroundColor:"lightBlue",color:"white",fontWeight:"bold"}}>
                단말정책설정
              </Typography>
            </Grid>
            <Grid item xs={6} style={{textAlign:"right"}}>
              <Button
                className={grNarrowButton}
                variant="outlined" color="primary"
                onClick={() => this.handleEditBtnClick(viewItem.objId)}
              ><SettingsApplicationsIcon />수정</Button>
            </Grid>
          </Grid>
          <Typography variant="headline" component="h2">
            {viewItem.objNm}
          </Typography>
          <Typography className={pos} color="textSecondary">
            {(viewItem.comment != '') ? '"' + viewItem.comment + '"' : ''}
          </Typography>
          <Divider />
          {(viewItem && viewItem.objId != '') &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 에이전트 폴링주기(초)</TableCell>
                  <TableCell numeric>{viewItem.pollingTime}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">{bull} 운영체제 보호</TableCell>
                  <TableCell numeric>{(viewItem.useHypervisor) ? '구동' : '중단'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 선택된 NTP 서버 주소</TableCell>
                  <TableCell numeric>{(viewItem.selectedNtpIndex > -1) ? viewItem.ntpAddress[viewItem.selectedNtpIndex] : ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} NTP 서버로 사용할 주소정보</TableCell>
                  <TableCell numeric>{viewItem.ntpAddress.map(function(prop, index) {
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientConfSettingComp);


