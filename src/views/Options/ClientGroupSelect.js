import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

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
        grpIds: event.target.value
      }
    });
    if(this.props.onChangeSelect) {
      this.props.onChangeSelect(event, event.target.value);
    }    
  };

  makeRenderValue = (param) => {
    const { CommonOptionProps } = this.props;
    const newParam = param.map(x => {
      const grpObj = CommonOptionProps.listDataForClientGroupSelect.find(e => (e.grpId == x));
      return grpObj.grpNm;
    })
  
    return newParam.join(', ');
  }

  render() {

    const { CommonOptionProps } = this.props;

    return (
      <Select
        multiple
        value={CommonOptionProps.selectedClientGroup.grpIds}
        onChange={this.handleChangeSelect}
        renderValue={selected => {
          return this.makeRenderValue(selected);
        }}
      >
        {CommonOptionProps.listDataForClientGroupSelect.map(x => {
          return (
            <MenuItem value={x.grpId} key={x.grpId}>
              <Checkbox checked={CommonOptionProps.selectedClientGroup.grpIds.indexOf(x.grpId) > -1} />
              <ListItemText primary={x.grpNm} />
            </MenuItem>
          );
        })}
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


