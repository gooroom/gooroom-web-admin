import React, { Component } from "react";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Map, List } from "immutable";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserStatusSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Map({
        userStatusData: List([
          Map({ statusId: 'NORMAL', statusVal: 'STAT010', statusTxt: '정상' }),
          Map({ statusId: 'DELETE', statusVal: 'STAT020', statusTxt: '삭제' }),
          Map({ statusId: 'ALL', statusVal: 'ALL', statusTxt: '전체' })
        ]),
        selectedUserStatusValue: 'STAT010'
      })
    }
  }
  
  // Events...
  handleChangeSelect = (event, child) => {
    const { data } = this.state;
    this.setState({
      data: data.set('selectedUserStatusValue', event.target.value)
    });
    this.props.onChangeSelect(event.target.value);
  };

  render() {
    return (
      <React.Fragment>
      <InputLabel htmlFor="user-status">사용자상태</InputLabel>
      <Select
        value={this.state.data.get('selectedUserStatusValue')}
        onChange={this.handleChangeSelect}
      >
        {this.state.data.get('userStatusData').map(x => (
          <MenuItem value={x.get('statusVal')} key={x.get('statusId')}>
            {x.get('statusTxt')}
          </MenuItem>
        ))}
      </Select>
      </React.Fragment>
    );
  }
}

export default UserStatusSelect;


