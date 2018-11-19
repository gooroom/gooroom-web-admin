import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ProtectionTypeSelect extends Component {

  render() {
    const { CommonOptionProps, name, value } = this.props;
    return (
      <React.Fragment>
      <Select
        value={value}
        onChange={this.props.onChangeSelect}
        inputProps={{name: name}}
      >
        {CommonOptionProps.protectionTypeData.map(x => (
          <MenuItem value={x.typeVal} key={x.typeId}>
            {x.typeId} ({x.typeNm})
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

export default connect(mapStateToProps, mapDispatchToProps)(ProtectionTypeSelect);


