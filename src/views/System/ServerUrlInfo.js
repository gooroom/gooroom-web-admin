import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

import GRPane from 'containers/GRContent/GRPane';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class ServerUrlInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        gpmsIp: '',
        gpmsDomain: '',
        glmIp: '',
        glmDomain: '',
        grmIp: '',
        grmDomain: ''
      })
    };
  }

  componentDidMount() {
    this.getSeverUrlInfo();
  }

  getSeverUrlInfo = () => {
    requestPostAPI('readCurrentMgServerConf', {}).then(
      (response) => {
        const { data } = response.data;
        if(data && data.length > 0) {
          this.setState(({stateData}) => ({
            stateData: stateData.set('gpmsIp', data[0].pmIp)
            .set('gpmsDomain', data[0].pmUrl)
            .set('glmIp', data[0].lmIp)
            .set('glmDomain', data[0].lmUrl)
            .set('grmIp', data[0].rmIp)
            .set('grmDomain', data[0].rmUrl)
          }));
        }
    });
  };

  handleSaveData = (event) => {
    const { GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
        confirmTitle: '구름관리서버설정 저장',
        confirmMsg: '구름관리서버설정을 저장하시겠습니까?',
        handleConfirmResult: this.handleSaveDataConfirmResult
    });
  }
  handleSaveDataConfirmResult = (confirmValue) => {
      if(confirmValue) {
          const { stateData } = this.state;
          requestPostAPI('createMgServerConf', {
            pmIp: stateData.get('gpmsIp'),
            pmUrl: stateData.get('gpmsDomain'),
            lmIp: stateData.get('glmIp'),
            lmUrl: stateData.get('glmDomain'),
            rmIp: stateData.get('grmIp'),
            rmUrl: stateData.get('grmDomain')
          }).then(
            (response) => {
              if(response.data.status.result !== 'success') {
                this.props.GRAlertActions.showAlert({
                    alertTitle: '시스템오류',
                    alertMsg: '구름관리서버설정을 저장되지 않았습니다.'
                });
                this.getSeverUrlInfo();
              }
              // ????? do something
          });
      } else {
        this.getSeverUrlInfo();
      }
  }

  handleValueChange = name => event => {
    const { stateData } = this.state;
    this.setState({
      stateData: stateData.set(name, event.target.value)
    });
  }


  render() {
    const { stateData } = this.state;

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>

        <AppBar position="static" elevation={0} color="default">
          <Toolbar variant="dense">
            <div style={{flexGrow: 1}} />
            <Button onClick={this.handleSaveData} size="small" variant='contained' color="primary">저장</Button>
          </Toolbar>
        </AppBar>

        <Card style={{marginTop: 16}}>
          <CardHeader style={{paddingBottom: 0}}
            title="GPMS 서버 정보"
            subheader="ip and domain"
          />
          <CardContent style={{paddingTop: 0}}>
            <TextField label="IP 정보"
              margin="normal"
              variant="outlined"
              value={stateData.get('gpmsIp')}
              onChange={this.handleValueChange("gpmsIp")}
            />
            <TextField label="Domain 정보"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('gpmsDomain')}
              onChange={this.handleValueChange("gpmsDomain")}
            />
          </CardContent>
        </Card>

        <Card style={{marginTop: 16}}>
          <CardHeader style={{paddingBottom: 0}}
            title="GLM 서버 정보"
            subheader="ip and domain"
          />
          <CardContent style={{paddingTop: 0}}>
            <TextField label="IP 정보"
              margin="normal"
              variant="outlined"
              value={stateData.get('glmIp')}
              onChange={this.handleValueChange("glmIp")}
            />
            <TextField label="Domain 정보"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('glmDomain')}
              onChange={this.handleValueChange("glmDomain")}
            />
          </CardContent>
        </Card>

        <Card style={{marginTop: 16}}>
          <CardHeader style={{paddingBottom: 0}}
            title="GRM 서버 정보"
            subheader="ip and domain"
          />
          <CardContent style={{paddingTop: 0}}>
            <TextField label="IP 정보"
              margin="normal"
              variant="outlined"
              value={stateData.get('grmIp')}
              onChange={this.handleValueChange("grmIp")}
            />
            <TextField label="Domain 정보"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('grmDomain')}
              onChange={this.handleValueChange("grmDomain")}
            />
          </CardContent>
        </Card>
          
        </GRPane>
        <GRConfirm />
        <GRAlert />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ServerUrlInfo));

