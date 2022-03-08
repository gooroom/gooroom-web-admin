import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ApplyActions from 'modules/PortableUserApplyModule';

import { Checkbox, Grid, FormControlLabel, TextField, MenuItem, InputAdornment, Select } from '@material-ui/core';

import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';
import { Map, List } from 'immutable';

class InputEmail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectionData: Map({
        typeData: List([
          Map({ typeId: 'ENTER_DIRECT', typeVal: 'ENTER_DIRECT', typeTxt: 'stEnterDirect'}),
          Map({ typeId: 'GMAIL', typeVal: 'gmail.com', typeTxt: 'gmail.com'}),
          Map({ typeId: 'NAVER', typeVal: 'naver.com', typeTxt: 'naver.com'}),
        ]),
        selectedTypeValue: 'ENTER_DIRECT'
      }),
      domain: '',
      account: '',
    };
  }

  handleChangeAccount = (e) => {
    const { ApplyActions } = this.props;
    const { domain } = this.state;

    this.setState({
      account: e.target.value,
    });

    ApplyActions.setEmail(e.target.value + '@' + domain);
  }

  handleChangeDomain = (e) => {
    const { ApplyActions } = this.props;
    const { account } = this.state;

    this.setState({
      domain: e.target.value,
    });

    ApplyActions.setEmail(account + '@' + e.target.value);
  }

  handleChangeNoti = (e) => {
    let notiType = '';

    if (e.target.checked)
      notiType = 'GPMS';

    this.props.ApplyActions.setNotiType(e.target.checked);
  }

  handleChangeSelect = (e, child) => {
    const { selectionData, account } = this.state;

    this.setState({
      selectionData: selectionData.set('selectedTypeValue', e.target.value),
      domain: e.target.value === 'ENTER_DIRECT' ? '' : e.target.value,
    });

    this.props.ApplyActions.setEmail(account + '@' + e.target.value);
  }

  render() {
    const { t, classes } = this.props;
    const { ApplyProps } = this.props;
    const { notiType, emailStatus } = ApplyProps;
    const isError = emailStatus !== INPUT_STATUS.SUCCESS && emailStatus !== INPUT_STATUS.INIT;
    const { selectionData, domain, account } = this.state;
    const readOnly = selectionData.get('selectedTypeValue') !== 'ENTER_DIRECT';

    let message = '';
    switch (emailStatus) {
      case INPUT_STATUS.FAILURE:
        message = t('msgInvalidEmail');
        break;
      case INPUT_STATUS.EMPTY:
        message = t('msgEmptyEmail');
        break;
    }

    return (
      <Grid container spacing={16} alignItems="flex-start" direction="column">
        <Grid item>
          <b>{t('lbInputReceiveTitle')}</b>
        </Grid>
        <Grid item>
          <Grid container spacing={8} direction="row">
            <Grid item>
              <TextField
                className={classes.ptgrEmailTextField}
                value={account}
                error={isError}
                onChange={this.handleChangeAccount}
              />
            </Grid>
            <Grid item>
              <TextField
                className={classes.ptgrEmailTextField}
                value={domain}
                error={isError}
                onChange={this.handleChangeDomain}
                InputProps={{
                  startAdornment:(
                    <InputAdornment>
                      <div>@</div>
                    </InputAdornment>
                  ),
                  readOnly: readOnly,
                }}
              />
            </Grid>
            <Grid item>
              <Select
                value={selectionData.get('selectedTypeValue')}
                onChange={this.handleChangeSelect}
              >
                {selectionData.get('typeData').map(x => (
                  <MenuItem value={x.get('typeVal')} key={x.get('typeId')}>
                    {t(x.get('typeTxt'))}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        {message ? 
          <Grid item style={{ color: "red" }}>
            {message}
          </Grid>
          : null
        }
        <Grid item>
          <FormControlLabel
            label={t('lbNotiFromGPMS')}
            control={
              <Checkbox
                checked={notiType}
                onChange={event => { this.handleChangeNoti(event) }}
                color="primary"
              />
            }
          />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  ApplyProps: state.PortableUserApplyModule,
});

const mapDispatchToProps = (dispatch) => ({
  ApplyActions: bindActionCreators(ApplyActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(InputEmail)));