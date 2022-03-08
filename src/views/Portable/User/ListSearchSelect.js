import React from 'react';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Map, List } from "immutable";
import { translate, Trans } from "react-i18next";

class ReviewSearchSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Map({
        // 전체, 신청일, 발급 결과
        typeData: List([
          Map({ typeId: 'DATE', typeVal: 'chRegDate', typeTxt: 'stRegDate' }),
          Map({ typeId: 'STATUS', typeVal: 'chImagePublish', typeTxt: 'stImageStatus' }),
          Map({ typeId: 'ALL', typeVal: 'ALL', typeTxt: 'stAll' })
        ]),
        selectedSearchTypeValue: 'ALL'
      })
    }
  }

  // Events...
  handleChangeSelect = (event, child) => {
    const { data } = this.state;
    this.setState({
      data: data.set('selectedSearchTypeValue', event.target.value)
    });
    this.props.onChangeSelect(event.target.value);
  };

  render() {
    const { value } = this.props;
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
      <Select
        value={value}
        onChange={this.handleChangeSelect}
      >
        {this.state.data.get('typeData').map(x => (
          <MenuItem value={x.get('typeVal')} key={x.get('typeId')}>
            {t(x.get('typeTxt'))}
          </MenuItem>
        ))}
      </Select>
      </React.Fragment>
    );
  }
}

export default translate("translations")(ReviewSearchSelect);