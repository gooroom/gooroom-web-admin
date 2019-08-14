import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import { translate, Trans } from "react-i18next";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class KeywordOption extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      paramName: (props.paramName) ? props.paramName : "keyword"
    };
  }
  
  handleKeywordChange = name => event => {
    this.props.handleKeywordChange(this.state.paramName, event.target.value);
  }

  handleKeyPress = name => event => {
    if(event.keyCode == 13 && this.props.handleSubmit) {
      this.props.handleSubmit();
    }
  };

  render() {
    const { label } = this.props;
    const { t, i18n } = this.props;
    return (
      <TextField label={(label) ? label : t("optKeyword")} onChange={this.handleKeywordChange()} onKeyDown={this.handleKeyPress()} value={this.props.keywordValue} />
    );
  }
}

export default translate("translations")(KeywordOption);


