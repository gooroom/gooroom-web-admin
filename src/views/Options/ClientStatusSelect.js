import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";


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
      <React.Fragment>
      <InputLabel htmlFor="client-status">단말상태</InputLabel>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientStatusSelect);


