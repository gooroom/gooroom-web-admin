import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as BulkActions from 'modules/PortableBulkModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import Grid from '@material-ui/core/Grid';
import { Button, TextField } from '@material-ui/core/'
import ReactFileReader from 'react-file-reader';
import HelpOutline from '@material-ui/icons/HelpOutline';

import { grRequestGetAPI } from 'components/GRUtils/GRRequester';
import { convertCsvToJson, isPortableCsvFile } from 'components/GRUtils/GRPortableUtils'
import { isEmpty, isUndefined } from 'components/GRUtils/GRValidationUtils';

import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';

const rowHeads = {
  id: 'ID',
  passwd: 'Password',
  email: 'Email',
  name: 'Name',
  phone: 'Phone',
};

class InputCsv extends React.Component {
  constructor(props) {
    super(props);
  }

  onDownloadTemplate = () => {
    grRequestGetAPI('portable/downloadTemplate'
    ).then(res => {
      if (res.data && res.data.result && response.data.result === 'failure') {
        this.props.GRAlertActions.showAlert({
          alertTitle: t('dtSystemError'),
          alertMsg: res.data.message,
        });

        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'template.csv');

      document.body.appendChild(link);
      link.click();
    });
  }

  handleClickCsvGuide = () => {
    const { BulkActions } = this.props;

    BulkActions.openCsvGuide(true);
  }

  readCsv = (files) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const { t } = this.props;
      if (isPortableCsvFile(reader.result.toString())) {
        const items = convertCsvToJson(reader.result.toString());
        const rearItem = items[items.length - 1];
        if (isEmpty(rearItem['ID']) && isUndefined(rearItem['Email']) &&
            isUndefined(rearItem['Password']) && isUndefined(rearItem['Phone']) &&
            isUndefined(rearItem['NamE']))
          items.splice(items.length - 1, 1);

        this.props.BulkActions.uploadCsvItems(
          items
        ).then(response => {
        }).catch(error => {
          this.props.GRAlertActions.showAlert({
            alertTitle: t('dtSystemError'),
            alertMsg: error.message,
          });
        });
      } else {
        this.props.BulkActions.setCsvStatus(INPUT_STATUS.INVALID);
      }
    }

    reader.readAsText(files[0]);
  }

  updateErrorMessage = () => {
    const msg = [];
    const { t } = this.props;
    const { BulkProps } = this.props;
    const ids = BulkProps['invalidIds'];
    const emails = BulkProps['invalidEmails'];

    if (ids && ids.length > 0) {
      msg.push(t("msgDuplicateIds", {ids: ids.join(', ')}));
    }
    if (emails && emails.length > 0) {
      msg.push(`${t("msgInvalidEmails", {emails: emails.join(', ')})}`);
    }

    if (BulkProps.error && BulkProps.error.status) {
      msg.push(BulkProps.error.status.message, BulkProps.error.data.join(', '));
    }
    else if (ids.length === 0 && emails.length === 0) {
      msg.push(BulkProps.error.status && BulkProps.error.message ? BulkProps.error.message : t('msgEmptyCsv'));
    }

    return msg.join('\n');
  }

  render() {
    const { t, classes } = this.props;
    const { BulkProps } = this.props;

    let message = t('msgEmptyCsv');
    const status = BulkProps['csvStatus'];
    switch (status) {
      case INPUT_STATUS.INVALID:
        message = t('msgInvalidCsvFile');
        break;
      case INPUT_STATUS.FAILURE:
        message = this.updateErrorMessage();
        break;
      case INPUT_STATUS.EMPTY:
        message = t('msgEmptyCsv');
        break;
      case INPUT_STATUS.SUCCESS:
        message = t('msgCompleteCsv');
    }

    return (
      <React.Fragment>
        <Grid container spacing={40} alignItems="baseline" direction="column">
          <Grid item>
            <Grid container spacing={32} alignItems="baseline" direction="row">
              <Grid item>
                <ReactFileReader handleFiles={this.readCsv} fileTypes={".csv"}>
                  <Button
                    xs={8}
                    className={classes.ptgrBulkUploadButton}
                    variant="contained"
                    color="primary"
                  >
                    {t('btnApplyCsv')}
                  </Button>
                </ReactFileReader>
              </Grid>
              <Grid item>
                <Grid container spacing={8}>
                  <Grid item>
                    <Button
                      className={classes.ptgrBulkDownloadCsvButton}
                      onClick={this.onDownloadTemplate}
                      variant="contained"
                      color="primary">
                      {t('btnDownloadCsv')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className={classes.GRSmallButton}
                      onClick={this.handleClickCsvGuide}
                    >
                      <HelpOutline />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <b>{t('lbResultCsv')}</b>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  multiline
                  rows="5"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={{
                    width: 450
                  }}
                  value={message}
                  error={status === INPUT_STATUS.FAILURE || status === INPUT_STATUS.EMPTY || status === INPUT_STATUS.INVALID}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BulkProps: state.PortableBulkModule,
});

const mapDispatchToProps = (dispatch) => ({
  BulkActions: bindActionCreators(BulkActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(InputCsv)));