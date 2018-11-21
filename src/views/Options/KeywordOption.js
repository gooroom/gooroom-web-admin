import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class KeywordOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paramName: (props.paramName) ? props.paramName : "keyword",
      label: (props.label) ? props.label : "검색어"
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
    
    return (
      <TextField label={this.state.label} onChange={this.handleKeywordChange()} onKeyDown={this.handleKeyPress()} value={this.props.keywordValue} />
    );
  }
}

export default KeywordOption;


