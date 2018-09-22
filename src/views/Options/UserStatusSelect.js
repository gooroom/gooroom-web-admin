import React, { Component } from "react";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserStatusSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userStatusData: [
        { statusId: "NORMAL", statusVal: "STAT010", statusNm: "정상" },
        { statusId: "DELETE", statusVal: "STAT020", statusNm: "삭제" },
        { statusId: "ALL", statusVal: "ALL", statusNm: "전체" }
      ],
      selectedUserStatus: { statusId: "NORMAL", statusVal: "STAT010", statusNm: "정상" },
    };
  }
  
  // Events...
  handleChangeSelect = (event, child) => {
    this.setState({ 
      selectedUserStatus: {
        statusVal: event.target.value,
        statusNm: event.target.name
      } 
    });
    this.props.onChangeSelect(event);
  };

  render() {
    return (
      <React.Fragment>
      <InputLabel htmlFor="user-status">사용자상태</InputLabel>
      <Select
        value={this.state.selectedUserStatus.statusVal}
        onChange={this.handleChangeSelect}
      >
        {this.state.userStatusData.map(x => (
          <MenuItem value={x.statusVal} key={x.statusId}>
            {x.statusNm}
          </MenuItem>
        ))}
      </Select>
      </React.Fragment>
    );
  }
}

export default UserStatusSelect;


