import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientStatusSelect extends Component {

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
    const { CommonOptionProps } = this.props;
    return (
      <Select
        value={CommonOptionProps.selectedClientStatus.statusId}
        onChange={this.handleChangeSelect}
        inputProps={{name: 'clientStatus'}}
      >
        {CommonOptionProps.clientStatusData.map(x => (
          <MenuItem value={x.statusId} key={x.statusId}>
            {x.statusNm}
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientStatusSelect);


