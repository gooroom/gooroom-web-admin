import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class KeywordOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  
  handleKeywordChange = name => event => {
    this.props.handleKeywordChange('keyword', event.target.value);
  }

  render() {
    return (
      <TextField id='keyword' label='검색어' onChange={this.handleKeywordChange()} />
    );
  }
}

export default KeywordOption;


