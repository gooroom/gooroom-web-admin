import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from "material-ui/styles";
import { css } from "glamor";

//
//  ## Style ########## ########## ########## ########## ##########
//

class DeptManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleId: "",
    };
  }

  render() {
    const { clientInfo } = this.props;

    return (
        <div>DeptManage</div>
    );
  }
}

export default DeptManage;
