import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { translate, Trans } from "react-i18next";


class ProtectionTypeSelect extends Component {

  render() {
    const { CommonOptionProps, name, value, label } = this.props;
    const { t, i18n } = this.props;

    return (
      <FormControl >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        value={value}
        onChange={this.props.onChangeSelect}
        inputProps={{id: name}}
      >
        {CommonOptionProps.protectionTypeData.map(x => (
          <MenuItem value={x.typeVal} key={x.typeId}>
            {t(x.typeId)}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
    );
  }
}

const mapStateToProps = (state) => ({
  CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
  CommonOptionActions: bindActionCreators(CommonOptionActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(ProtectionTypeSelect));


