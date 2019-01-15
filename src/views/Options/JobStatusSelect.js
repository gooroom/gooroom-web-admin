import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { translate, Trans } from "react-i18next";


class JobStatusSelect extends Component {

  // Events...
  handleChangeSelect = event => {
    const { CommonOptionActions } = this.props;
    CommonOptionActions.changeSelectValue({
      name: 'selectedJobStatus',
      value: {
        statusIds: event.target.value
      }
    });
    this.props.onChangeSelect(event, event.target.value);
  };

  makeRenderValue = (param) => {
    const { CommonOptionProps } = this.props;
    const { t, i18n } = this.props;
    const newParam = param.map(x => {
      const statusObj = CommonOptionProps.jobStatusData.find(e => (e.statusId == x));
      return t(statusObj.statusNm);
    })
  
    return newParam.join(', ');
  }

  render() {
    const { CommonOptionProps } = this.props;
    const { t, i18n } = this.props;

    return (
      <Select multiple  
        value={CommonOptionProps.selectedJobStatus.statusIds}
        onChange={this.handleChangeSelect}
        renderValue={selected => {
          return this.makeRenderValue(selected);
        }}
      >
        {CommonOptionProps.jobStatusData.map(x => (
          <MenuItem value={x.statusId} key={x.statusId}>
            <Checkbox checked={CommonOptionProps.selectedJobStatus.statusIds.indexOf(x.statusId) > -1} color="primary" />
            <ListItemText primary={t(x.statusNm)} />
          </MenuItem>
        ))}
      </Select>
    );
  }
}

const mapStateToProps = (state) => ({
  CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
  CommonOptionActions: bindActionCreators(CommonOptionActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(JobStatusSelect));


