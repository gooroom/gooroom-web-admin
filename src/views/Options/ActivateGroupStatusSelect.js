import React, { Component } from "react";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Map, List } from "immutable";
import { translate, Trans } from "react-i18next";

import FormControl from '@material-ui/core/FormControl';

class ActivateGroupStatusSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Map({
        userStatusData: List([
          Map({ statusId: 'ALL', statusVal: 'ALL', statusTxt: 'stAll' }),
          Map({ statusId: 'USER', statusVal: 'USER', statusTxt: 'stActiveUser' }),
          Map({ statusId: 'CLIENT', statusVal: 'CLIENT', statusTxt: 'stActiveClient' }),
          Map({ statusId: 'DATE', statusVal: 'DATE', statusTxt: 'stActiveDate' })
        ]),
        selectedStatusValue: 'ALL'
      })
    }
  }
  
  // Events...
  handleChangeSelect = event => {
    const { data } = this.state;
    this.setState({
      data: data.set('selectedStatusValue', event.target.value)
    });
    this.props.onChangeSelect(event.target.value);
  };

  render() {
    const { value } = this.props;
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
      <FormControl fullWidth={true}>
      <Select
        value={value}
        onChange={this.handleChangeSelect}
        inputProps={{name: 'userStatus'}}
      >
        {this.state.data.get('userStatusData').map(x => (
          <MenuItem value={x.get('statusVal')} key={x.get('statusId')}>
            {t(x.get('statusTxt'))}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      </React.Fragment>
    );
  }
}

export default translate("translations")(ActivateGroupStatusSelect);


