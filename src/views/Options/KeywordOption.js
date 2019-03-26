import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import { translate, Trans } from "react-i18next";

import FormControl from '@material-ui/core/FormControl';

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
    const { label, t } = this.props;
    return (
      <React.Fragment>
        <FormControl fullWidth={true}>
          <TextField label={(label) ? label : t("optKeyword")} 
            onChange={this.handleKeywordChange()} 
            onKeyDown={this.handleKeyPress()} value={this.props.keywordValue} />
        </FormControl>
      </React.Fragment>
    );
  }
}

export default translate("translations")(KeywordOption);


