import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserStatusSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {

    // const { CommonOptionActions, CommonOptionProps } = this.props;
    // CommonOptionActions.readClientStatusList(CommonOptionProps.listParam);
  }

  // Events...
  handleChangeSelect = (event, child) => {
    const { CommonOptionActions } = this.props;
    CommonOptionActions.changeSelectValue({
      name: 'selectedUserStatus',
      value: {
        statusVal: event.target.value,
        statusNm: event.target.name
      }
    });
    this.props.onChangeSelect(event);
  };

  render() {

    const { CommonOptionProps } = this.props;

    return (

      <Select
        value={CommonOptionProps.selectedUserStatus.statusVal}
        onChange={this.handleChangeSelect}
      >
        {CommonOptionProps.userStatusData.map(x => (
          <MenuItem value={x.statusVal} key={x.statusId}>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserStatusSelect);


