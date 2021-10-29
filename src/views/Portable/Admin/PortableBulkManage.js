import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as BulkActions from 'modules/PortableBulkModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';
import { Grid, Button } from '@material-ui/core/'

import InputCsv from './InputCsv';
import InputPassword from '../common/InputPassword';
import InputDate from '../common/InputDate';
import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';

import PortableCsvGuide from './PortableCsvGuide';

class PortableBulkManage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.BulkActions.initBulkState();
  }

  handleChangePasswd = (passwd, confirm) => {
    this.props.BulkActions.setPasswd(passwd, confirm);
  }

  handleChangeDate = (date, isBegin) => {
    this.props.BulkActions.setDate(
      this.props.BulkProps,
      date.format('YYYY-MM-DD'),
      isBegin,
    );
  }

  handleCreatePortable = () => {
    const { t } = this.props;
    const { BulkActions, BulkProps } = this.props;
    const status = {
      csvStatus: BulkProps['csvStatus'],
      passwdStatus: BulkProps['passwdStatus'],
      dateStatus: BulkProps['dateStatus'],
    };

    /* check csv validate */
    if (status.csvStatus === INPUT_STATUS.INIT) {
      status.csvStatus = INPUT_STATUS.EMPTY;
    }

    /* check password validate */
    if (status.passwdStatus === INPUT_STATUS.INIT) {
      status.passwdStatus = INPUT_STATUS.EMPTY;
    }

    if (status.csvStatus !== INPUT_STATUS.SUCCESS ||
        status.passwdStatus !== INPUT_STATUS.SUCCESS ||
        status.dateStatus !== INPUT_STATUS.SUCCESS) {
      BulkActions.setStatusAll(status);

      return;
    }

    this.props.BulkActions.createBulkItems(this.props.BulkProps, this.props.AdminProps.get('adminId'))
      .then(res => {
        if (res && res.status && res.status.result === 'success') {
          this.props.GRAlertActions.showAlert({
            alertTitle: t('dtSystemNotice'),
            alertMsg: res.status.message ? res.status.message : t('msgBulkSuccess'),
          });

          this.props.BulkActions.initBulkState();
        } else if (res && res.status && res.status.result === 'fail') {
          this.props.GRAlertActions.showAlert({
            alertTitle: t('dtSystemError'),
            alertMsg: res.status.message,
          });
        }
      }).catch(error => {
        this.props.GRAlertActions.showAlert({
          alertTitle: t('dtSystemError'),
          alertMsg: error.message,
        });
    });
  }

  render() {
    const { t, classes } = this.props;
    const { BulkProps } = this.props;
    const {
      passwd, confirm, passwdStatus,
      beginDate, endDate, dateStatus,
    } = BulkProps;

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container>
            <Grid container spacing={40} alignItems="baseline" direction="column" justify="flex-start">
              <Grid item>
                <InputCsv />
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
                <InputDate
                  beginDate={beginDate}
                  endDate={endDate}
                  status={dateStatus}
                  onChangeDate={this.handleChangeDate}
                />
              </Grid>
              <Grid item>
                <Button
                  className={classes.ptgrBulkApplyButton}
                  variant="contained"
                  onClick={this.handleCreatePortable}
                >
                  {t('btnAllCreate')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <PortableCsvGuide />
        </GRPane>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BulkProps: state.PortableBulkModule,
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  BulkActions: bindActionCreators(BulkActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PortableBulkManage)));