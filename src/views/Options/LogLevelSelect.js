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
class LogLevelSelect extends Component {

  render() {
    const { CommonOptionProps, name, value, minNo=1 } = this.props;
    return (
      <React.Fragment>
      <Select
        value={value}
        onChange={this.props.onChangeSelect}
        inputProps={{name: name}}
      >
        {CommonOptionProps.logLevelData.filter(x => (x.levelNo >= minNo)).map(x => (
          <MenuItem value={x.levelVal} levelno={x.levelNo} key={x.levelId}>
            {x.levelId} ({x.levelNm})
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

export default connect(mapStateToProps, mapDispatchToProps)(LogLevelSelect);


