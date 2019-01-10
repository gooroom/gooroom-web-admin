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

class AdminIpConfig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        gpmsDomain: '',
        glmDomain: '',
        grmDomain: '',
        pollingTime: 30
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
            stateData: stateData.set('gpmsDomain', data[0].pmUrl)
            .set('glmDomain', data[0].lmUrl)
            .set('grmDomain', data[0].rmUrl)
            .set('pollingTime', data[0].pollingTime)
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
            pmUrl: stateData.get('gpmsDomain'),
            lmUrl: stateData.get('glmDomain'),
            rmUrl: stateData.get('grmDomain'),
            pollingTime: stateData.get('pollingTime')
          }).then(
            (response) => {
              if(response && response.data && response.data.status && response.data.status.result === 'success') {
                this.props.GRAlertActions.showAlert({
                  alertTitle: '수정 완료',
                  alertMsg: '구름관리서버설정을 저장되었습니다.'
                });
                this.getSeverUrlInfo();
              } else {
                this.props.GRAlertActions.showAlert({
                  alertTitle: t("dtSystemError"),
                  alertMsg: '구름관리서버설정을 저장되지 않았습니다.'
                });
                this.getSeverUrlInfo();
              }
            }
          );
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
            <Button onClick={this.handleSaveData} size="small" variant='contained' color="primary">{t("btnSave")}</Button>
          </Toolbar>
        </AppBar>

        <Card style={{marginTop: 16}}>
          <CardHeader style={{paddingBottom: 0}}
            title="서버 정보"
            subheader="domain"
          />
          <CardContent style={{paddingTop: 0}}>
            <TextField label="GPMS 정보"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('gpmsDomain')}
              onChange={this.handleValueChange("gpmsDomain")}
            />
            <TextField label="GLM 정보"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('glmDomain')}
              onChange={this.handleValueChange("glmDomain")}
            />
            <TextField label="GRM 정보"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('grmDomain')}
              onChange={this.handleValueChange("grmDomain")}
            />
          </CardContent>
        </Card>

        <Card style={{marginTop: 16}}>
          <CardHeader style={{paddingBottom: 0}}
            title="구름 Agent 폴링 타임"
            subheader="구름단말 Agent 와 GRM 서버간의 정보교환 주기"
          />
          <CardContent style={{paddingTop: 0}}>
            <TextField label="Polling Seconds"
              margin="normal"
              variant="outlined"
              value={stateData.get('pollingTime')}
              onChange={this.handleValueChange("pollingTime")}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminIpConfig));

