import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as ClientConfSettingActions from '../../modules/ClientConfSettingModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { setParameterForView } from '../ClientConfig/ClientConfSettingInform';

import { css } from 'glamor';

import { getMergedListParam, arrayContainsArray } from '../../components/GrUtils/GrCommonUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


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

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientConfigComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    
    const { ClientGroupProps, ClientConfSettingActions } = this.props;
    ClientConfSettingActions.getClientConfSetting({
      objId: ClientGroupProps.selectedItem.clientConfigId
    });
  }

  showDetailRule = (event) => {

    const { ClientGroupProps, ClientConfSettingActions } = this.props;
    ClientConfSettingActions.getClientConfSetting({
      objId: ClientGroupProps.selectedItem.clientConfigId
    });
  }

  // .................................................
  render() {

    const { ClientGroupProps, ClientConfSettingProps } = this.props;
    const bull = <span className={bullet}>•</span>;
    const viewItem = ClientConfSettingProps.editingItem;

    return (

      <Card className={card}>
        <CardContent>
          <Typography className={title} color="textSecondary">
            단말정책설정
          </Typography>
          <Typography variant="headline" component="h2">
            {ClientGroupProps.selectedItem.clientConfigNm}
          </Typography>
          <Divider />
            <br />
          {(viewItem) &&
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
        <CardActions>
          <Button onClick={this.showDetailRule} size="small">상세보기</Button>
        </CardActions>
      </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientConfigComp);


