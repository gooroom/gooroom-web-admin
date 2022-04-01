import React from 'react';
import moment from 'moment';
import { translate } from 'react-i18next';

import { Grid } from '@material-ui/core';
import { InlineDatePicker } from 'material-ui-pickers';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class InputPeriod extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    const { beginDate, endDate, nowDate , minDate, error } = this.props;

    return (
      <React.Fragment>
        <Grid container spacing={8} alignItems="flex-start" direction="row" justify="flex-start">
          <Grid item>
            <InlineDatePicker
              label={t('lbBeginDate')}
              format="YYYY-MM-DD"
              value={beginDate ? beginDate : nowDate}
              error={error}
              onChange={(date) => this.props.onDateChange(date, true)}
              minDate={minDate}
            />
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>&emsp;</Grid>
              <Grid item> ~ </Grid>
            </Grid>
          </Grid>
          <Grid item >
            <Grid item>
              <InlineDatePicker
                label={t('lbEndDate')}
                format="YYYY-MM-DD"
                value={endDate ? endDate : nowDate}
                error={error}
                onChange={(date) => this.props.onDateChange(date, false)}
                minDate={minDate}
              />
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(InputPeriod));