import React from 'react';
import { Map } from 'immutable';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

class PortableServerManage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stateData: Map({
        ptgrBuildDomain: '',
        ptgrBuilId: '',
        ptgrBuildToken: '',
      }),
    }
  }

  handleSaveData = () => {
    const { GRConfirmActions } = this.props;
    const { t } = this.props;

    if (!this.refs.form)
      return;

    if (!this.refs.form.isFormValid()) {
      this.refs.form.childs.map(c => {
          this.refs.form.validate(c);
      });

      return;
    }

    GRConfirmActions.showConfirm({
      confirmTitle: t('lbSavePortableServer'),
      confirmMsg: t('msgSavePortableServer'),
      handleConfirmResult: (confirmValue) => {
        const { t } = this.props;
        if (!confirmValue) return;

        const { stateData } = this.state;
        requestPostAPI('createPortableServerConf', {
          'domain': stateData.get('ptgrBuildDomain'),
          'id': stateData.get('ptgrBuildId'),
          'token': stateData.get('ptgrBuildToken'),
        }).then((response) => {
          let title = t('dtSystemError');

          if (response && response.data && response.data && response.data.result === 'success') {
            title = t('dtEditOK')
          }

          this.props.GRAlertActions.showAlert({
            alertTitle: title,
            alertmsg: response.data && response.data.message ? response.data.message : t('msgErrorPortableServer')
          });
        });
      }
    });
  }

  handleValueChange = name => event => {
    const { stateData } = this.state;
    const value = event.target.value;

    this.setState ({
      stateData: stateData.set(name, value),
    });
  }

  render() {
    const { t } = this.props;
    const { stateData } = this.state;

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <ValidatorForm ref="form">
          <AppBar position="static" elevation={0} color="default">
            <Toolbar variant="dense">
              <div style={{flexGrow: 1}} />
              <Button onClick={this.handleSaveData} size="small" variant="contained" color="primary">{t("btnSave")}</Button>
            </Toolbar>
          </AppBar>
          <Card style={{marginTop: 16}}>
            <CardHeader
              style={{paddingBottom: 0}}
              title={t("lbPortableServerConf")}
            />
            <CardContent style={{paddingTop: 0}}>
              <TextValidator
                name="buildServerDomain"
                label={t("lbPtgrBuildDomain")}
                validators={['required']}
                errorMessages={[t("msgPortableInputDomain")]}
                margin="normal"
                variant="outlined"
                value={stateData.get("ptgrBuildDomain")}
                onChange={this.handleValueChange("ptgrBuildDomain")}
              />
              <TextValidator
                name="buildServerId"
                label={t("lbPtgrBuildId")}
                validators={['required']}
                errorMessages={[t("msgPortableInputId")]}
                margin="normal"
                variant="outlined"
                value={stateData.get("ptgrBuildId")}
                onChange={this.handleValueChange("ptgrBuildId")}
              />
              <TextValidator
                name="buildServerToken"
                label={t("lbPtgrBuildToken")}
                validators={['required']}
                errorMessages={[t("msgPortableInputToken")]}
                margin="normal"
                variant="outlined"
                value={stateData.get("ptgrBuildToken")}
                onChange={this.handleValueChange("ptgrBuildToken")}
              />
            </CardContent>
          </Card>
        </ValidatorForm>
        </GRPane>
        <GRAlert />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  AdminProps: state.AdminModule,
});

const mapDispatchToProps = (dispatch) => ({
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PortableServerManage)));