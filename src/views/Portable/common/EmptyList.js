import React from 'react';

import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class EmptyList extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div>
        <div
          style={{height:"400px", lineHeight: "400px", textAlign: "center", userSelect: "none"}}
        >
          조회된 데이터가 없습니다.
        </div>
      </div>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(EmptyList));