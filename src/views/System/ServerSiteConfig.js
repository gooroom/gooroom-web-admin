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
import { translate, Trans } from "react-i18next";


class ServerSiteConfig extends Component {

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
    const { t, i18n } = this.props;
    GRConfirmActions.showConfirm({
        confirmTitle: t("lbSaveServerConfig"),
        confirmMsg: t("msgSaveServerConfig"),
        handleConfirmResult: this.handleSaveDataConfirmResult
    });
  }
  handleSaveDataConfirmResult = (confirmValue) => {
    const { t, i18n } = this.props;
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
                  alertTitle: t("dtEditOK"),
                  alertMsg: t("msgEditOkServerConfig")
                });
                this.getSeverUrlInfo();
              } else {
                this.props.GRAlertActions.showAlert({
                  alertTitle: t("dtSystemError"),
                  alertMsg: t("msgEditErrorServerConfig")
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
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>

        <AppBar position="static" elevation={0} color="default">
          <Toolbar variant="dense">
            <div style={{flexGrow: 1}} />
            <Button onClick={this.handleSaveData} size="small" variant='contained' color="primary">{t("btnSave")}</Button>
          </Toolbar>
        </AppBar>

        <Card style={{marginTop: 16}}>
          <CardHeader style={{paddingBottom: 0}}
            title={t("lbServerInfo")} subheader="domain"
          />
          <CardContent style={{paddingTop: 0}}>
            <TextField label={t("lbGPMSServerInfo")}
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('gpmsDomain')}
              onChange={this.handleValueChange("gpmsDomain")}
            />
            <TextField label={t("lbGLMServerInfo")}
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('glmDomain')}
              onChange={this.handleValueChange("glmDomain")}
            />
            <TextField label={t("lbGRMServerInfo")}
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
            title={t("lbAgentPollingTime")}
            subheader={t("msgAgentPollingTime")}
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ServerSiteConfig)));

