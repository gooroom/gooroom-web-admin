import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { translate, Trans } from "react-i18next";

import FormControl from '@material-ui/core/FormControl';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientStatusSelect extends Component {

  componentDidMount() {
    this.props.CommonOptionActions.changeSelectValue({
      name: 'selectedClientStatus',
      value: {
        statusId: '',
        statusNm: ''
      }
    });
  }

  // Events...
  handleChangeSelect = event => {
    const { CommonOptionActions } = this.props;
    CommonOptionActions.changeSelectValue({
      name: 'selectedClientStatus',
      value: {
        statusId: event.target.value,
        statusNm: event.target.name
      }
    });
    this.props.onChangeSelect(event, event.target.value);
  };

  render() {
    const { CommonOptionProps, value } = this.props;
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
      <FormControl fullWidth={true}>
      <InputLabel htmlFor="client-status">{t("optClientStatus")}</InputLabel>
      <Select
        value={value}
        onChange={this.handleChangeSelect}
        inputProps={{name: 'clientStatus'}}
      >
        {CommonOptionProps.clientStatusData.map(x => (
          <MenuItem value={x.statusId} key={x.statusId}>
            {t(x.statusNm)}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
  CommonOptionActions: bindActionCreators(CommonOptionActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(ClientStatusSelect));


