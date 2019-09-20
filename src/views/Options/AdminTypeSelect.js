import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { translate, Trans } from "react-i18next";

import FormControl from '@material-ui/core/FormControl';

class AdminTypeSelect extends Component {

  // componentDidMount() {
  //   this.props.CommonOptionActions.changeSelectValue({
  //     name: 'selectedAdminType',
  //     value: {
  //       typeId: '',
  //       typeNm: ''
  //     }
  //   });
  // }

  handleChangeSelect = event => {
    const { CommonOptionActions } = this.props;
    CommonOptionActions.changeSelectValue({
      name: 'selectedAdminType',
      value: {
        typeId: event.target.value,
        typeNm: event.target.name
      }
    });
    this.props.onChangeSelect(event, event.target.value);
  };

  render() {
    const { CommonOptionProps } = this.props;
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
      <FormControl fullWidth={true}>
      <InputLabel htmlFor="admin-type">{t("lbAdminType")}</InputLabel>
      <Select
        value={CommonOptionProps.selectedAdminType.typeId}
        onChange={this.handleChangeSelect}
        inputProps={{name: 'clientStatus'}}
      >
        {CommonOptionProps.adminTypeData.map(x => (
          <MenuItem value={x.typeId} key={x.typeId}>
            {t(x.typeNm)}
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(AdminTypeSelect));