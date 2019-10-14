import React, { Component } from "react";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Map, List } from "immutable";
import { translate, Trans } from "react-i18next";


class UserStatusSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Map({
        userStatusData: List([
          Map({ statusId: 'NORMAL', statusVal: 'STAT010', statusTxt: 'stNormal' }),
          Map({ statusId: 'DELETE', statusVal: 'STAT020', statusTxt: 'stDelete' }),
          Map({ statusId: 'ALL', statusVal: 'ALL', statusTxt: 'stAll' })
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
    const { value } = this.props;
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
      <InputLabel htmlFor="user-status">사용자상태</InputLabel>
      <Select
        value={value}
        onChange={this.handleChangeSelect}
      >
        {this.state.data.get('userStatusData').map(x => (
          <MenuItem value={x.get('statusVal')} key={x.get('statusId')}>
            {t(x.get('statusTxt'))}
          </MenuItem>
        ))}
      </Select>
      </React.Fragment>
    );
  }
}

export default translate("translations")(UserStatusSelect);


