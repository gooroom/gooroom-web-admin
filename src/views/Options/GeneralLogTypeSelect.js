import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";


//
//  ## Content ########## ########## ########## ########## ########## 
//
class GeneralLogTypeSelect extends Component {

  render() {
    const { CommonOptionProps, name, value, label } = this.props;
    return (
      <FormControl >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        value={value}
        onChange={this.props.onChangeSelect}
        inputProps={{id: name}}
      >
        {CommonOptionProps.generalLogTypeData.map(x => (
          <MenuItem value={x.typeVal} key={x.typeId}>
            {x.typeId}
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

export default connect(mapStateToProps, mapDispatchToProps)(GeneralLogTypeSelect);


