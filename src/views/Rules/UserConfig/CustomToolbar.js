import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import AddIcon from "@material-ui/icons/Add";


import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
};

class CustomToolbar extends React.Component {
  
  handleAddClick = () => {
    console.log('CustomToolbar > handleAddClick');
    if(this.props.handleAddClick) {
      this.props.handleAddClick();
    }
  }

  handleValueChange = (event) => {

  }

  checkAllow = value => {
    return (value == 'allow');
  }

  render() {
    const { classes } = this.props;
    const { editingItem } = this.props;

//    const state = (editing) ? editingItem.get('state') :

    console.log('editingItem ::::::: ', editingItem);

    return (
      <React.Fragment>
        {editingItem && 
        <FormControlLabel 
          control={
            <Switch onChange={this.handleValueChange('state')} 
                checked={this.checkAllow(editingItem.get('state'))}
                color="primary" style={{height:32}} />
          }
          label={(editingItem.get('state') == 'allow') ? '전체네트워크허용' : '전체네트워크차단'}
        />
        }
        <Tooltip title={"추가"}>
          <IconButton className={classes.iconButton} onClick={this.handleAddClick}>
            <AddIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);