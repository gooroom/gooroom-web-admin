import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { translate, Trans } from "react-i18next";


class LogLevelSelect extends Component {

  render() {
    const { name, value, minNo=0, logLevelData } = this.props;
    const { t, i18n } = this.props;
    return (
      <React.Fragment>
      <Select
        value={value}
        onChange={this.props.onChangeSelect}
        inputProps={{name: name}}
      >
        {logLevelData.filter(x => (x.levelNo >= minNo) || x.levelNo == 0).map(x => (
          <MenuItem value={x.levelVal} levelno={x.levelNo} key={x.levelId}>
            {t(x.levelNm)}
          </MenuItem>
        ))}
      </Select>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(LogLevelSelect));


