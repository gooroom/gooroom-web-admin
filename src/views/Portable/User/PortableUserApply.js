import React from 'react';

import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import * as ApplyActions from 'modules/PortableUserApplyModule';
import * as GRAlertActions from "modules/GRAlertModule";
import * as GRConfirmActions from "modules/GRConfirmModule";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import InputPassword from '../common/InputPassword';
import InputDate from '../common/InputDate';
import InputEmail from './InputEmail';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';
import { Grid, Button } from '@material-ui/core/'

import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';

class PortableUserApply extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.ApplyActions.initClientApply();
  }

  handleChangeDate = (date, isbegin) => {
    this.props.ApplyActions.setDate(this.props.ApplyProps, date.format('YYYY-MM-DD'), isbegin);
  }

  handleChangePasswd = (passwd, confirm) => {
    this.props.ApplyActions.setPasswd(passwd, confirm);
  }

  handleRegistPortable = () => {
    const { t } = this.props;
    const { UserInfoProps, ApplyActions, ApplyProps, GRAlertActions } = this.props;
    const status = {
      dateStatus: ApplyProps['dateStatus'],
      passwdStatus: ApplyProps['passwdStatus'],
      emailStatus: ApplyProps['emailStatus'],
    };

    if (status.passwdStatus === INPUT_STATUS.INIT) {
      status.passwdStatus = INPUT_STATUS.EMPTY;
    }

    if (status.emailStatus === INPUT_STATUS.INIT) {
      status.emailStatus = INPUT_STATUS.EMPTY;
    }

    if (status.emailStatus !== INPUT_STATUS.SUCCESS ||
        status.passwdStatus !== INPUT_STATUS.SUCCESS ||
        status.dateStatus !== INPUT_STATUS.SUCCESS) {
      ApplyActions.setStatusAll(status);

      return;
    }

    ApplyActions.registPortable(ApplyProps, UserInfoProps.get('userId'))
      .then((res) => {
        if (res && res.data && res.data.result === 'success') {
          GRAlertActions.showAlert({
            alertTitle: t('dtSystemNotice'),
            alertMsg: res.data.message ? res.data.message: t('msgRegistPortable'),
          })
        } else if (res && res.data && res.data.result === 'fail') {
          GRAlertActions.showAlert({
            alertTitle: t('dtSystemError'),
            alertMsg: res.status.message,
          });
        }
      }).catch((err) => {
        GRAlertActions.showAlert({
          alertTitle: t('dtSystemError'),
          alert: error.message,
        })
      });
  }

  render() {
    const { t, classes } = this.props;
    const { UserInfoProps, ApplyProps } = this.props;
    const {
      passwd, confirm, passwdStatus,
      beginDate, endDate, dateStatus,
    } = ApplyProps;

    return (
      <div>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container spacing={40} alignItems="flex-start" direction="column" justify="space-between">
            <Grid item alignItems="flex-start" direction="row">
              <p style={{ margin: "40px 0 0" }}><b>{t('lbApplyAccount')}: {UserInfoProps.get('userId')}</b></p>
            </Grid>
            <Grid item>
              <InputDate
                beginDate={beginDate}
                endDate={endDate}
                status={dateStatus}
                onChangeDate={this.handleChangeDate}
              />
            </Grid>
            <Grid item>
              <InputPassword
                passwd={passwd}
                confirm={confirm}
                status={passwdStatus}
                onChangePasswd={this.handleChangePasswd}
              />
            </Grid>
            <Grid item>
              <InputEmail />
            </Grid>
            <Grid item>
              <Button
                className={classes.ptgrBulkApplyButton}
                variant="contained"
                color="secondary"
                onClick={this.handleRegistPortable}
              >{t("btnPortableRegist")}</Button>
            </Grid>
          </Grid>
        </GRPane>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  UserInfoProps: state.UserInfoModule,
  ApplyProps: state.PortableUserApplyModule,
});

const mapDispatchToProps = (dispatch) => ({
  ApplyActions: bindActionCreators(ApplyActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PortableUserApply)));