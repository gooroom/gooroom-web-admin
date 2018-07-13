import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from '../../modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {

    const { CommonOptionActions, CommonOptionProps } = this.props;
    CommonOptionActions.readClientGroupListAll(CommonOptionProps.listParam);
  }

  // Events...
  handleChangeSelect = event => {
    const { CommonOptionActions } = this.props;
    CommonOptionActions.changeSelectValue({
      name: 'selectedClientGroup',
      value: {
        grpId: event.target.value,
        grpNm: event.target.name
      }
    });
    if(this.props.onChangeSelect) {
      this.props.onChangeSelect(event, event.target.value);
    }    
  };

  render() {

    const { CommonOptionProps } = this.props;

    return (

      <Select
        value={CommonOptionProps.selectedClientGroup.grpId}
        onChange={this.handleChangeSelect}
        inputProps={{name: 'clientGroup'}}
      >
        {CommonOptionProps.listDataForClientGroupSelect.map(x => (
          <MenuItem value={x.grpId} key={x.grpId}>
            {x.grpNm}
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupSelect);


