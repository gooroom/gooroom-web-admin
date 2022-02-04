import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';

class InputPassword extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onChangePasswd = ({ target }) => {
    this.props.onChangePasswd(target.value, this.props.confirm);
  }

  onChangeConfirm = ({ target }) => {
    this.props.onChangePasswd(this.props.passwd, target.value);
  }

  render() {
    const { t, classes } = this.props;
    const { passwd, confirm, status } = this.props;
    const isError = status !== INPUT_STATUS.INIT && status !== INPUT_STATUS.SUCCESS;

    let message = '';
    switch (status) {
      case INPUT_STATUS.INVALID:
          message = t('msgErrorPasswordInvalid');
        break;
      case INPUT_STATUS.FAILURE:
          message = t('msgErrorPasswordNotCompare');
        break;
      case INPUT_STATUS.EMPTY:
          message = t('msgErrorPasswordEmpty');
        break;
      default:
          message = '';
    }

    return (
      <React.Fragment>
        <Grid container spacing={16} alignItems="flex-start" direction="column">
          <Grid item>
            <b>{t('lbInputPasswordTitle')}</b>
          </Grid>
          <Grid item container alignItems="flex-start" direction="column" justify="space-between">
            <Grid item>
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" size="small">
                <Grid item>
                  <Grid container spacing={8}>
                    <Grid item>
                      <div
                        className={isError ? classes.ptgrInputLabelError : classes.ptgrInputLabel}
                      >
                        {t("lbPortablePassword") + " : " }
                    </div>
                    </Grid>
                    <Grid item>
                      <TextField
                        variant="standard"
                        size="small"
                        type="password"
                        value={passwd}
                        error={isError}
                        onChange={this.onChangePasswd}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={8}>
                    <Grid item>
                      <div
                        className={isError ? classes.ptgrInputLabelError : classes.ptgrInputLabel}
                      >
                        {t("lbConfirmPassword") + " : "}
                      </div>
                    </Grid>
                    <Grid item>
                      <TextField
                        variant="standard"
                        size="small"
                        type="password"
                        value={confirm}
                        error={isError}
                        onChange={this.onChangeConfirm}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            { message ? 
              <Grid item style={{ color: "red" }}>
                {message}
              </Grid>
              : null
            }
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(InputPassword));