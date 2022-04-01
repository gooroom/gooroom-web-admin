import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { translate } from 'react-i18next';

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import InputPeriod from './InputPeriod';

import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';

class InputDate extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleChangeDate = (date, isBegin) => {
    this.props.onChangeDate(date, isBegin);
  }

  render() {
    const { t } = this.props;
    const { status } = this.props;
    const now = new Date();
    const nowStart = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate()));

    const isError = status === INPUT_STATUS.FAILURE;
    const message = isError ? t('msgErrorEndDate') : '';

    return (
      <React.Fragment>
        <Grid container spacing={8} alignItems="flex-start" direction="column" justify="flex-start">
          <Grid item>
            <b>{t('lbInputDateTitle')}</b>
          </Grid>
          <Grid item>
            {t('lbToday')}: {moment(now).format('YYYY.MM.DD')}
          </Grid>
          <Grid item>
            <InputPeriod
              beginDate={this.props.beginDate}
              endDate={this.props.endDate}
              nowDate={nowStart}
              minDate={nowStart}
              error={isError}
              onDateChange={this.handleChangeDate}
            />
          </Grid>
          { message ?
            <Grid item style={{ color: "red" }}>
              { message }
            </Grid> : null
          }
        </Grid>
      </React.Fragment>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(InputDate));