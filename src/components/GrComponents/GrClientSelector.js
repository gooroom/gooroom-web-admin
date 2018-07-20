import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';


const groupDiv = css({
  height: "100%",
  width: "30%",
  overflow: "auto"
}).toString();

const clientDiv = css({
  height: "100%",
  width: "70%",
  overflow: "auto"
}).toString();

const selectItemList = css({
  paddingTop: "0px !important",
  paddingBottom: "0px !important"
}).toString();

const selectItem = css({
  padding: "5px 0px 5px 0px !important"
}).toString();

const selectCheck = css({
  width: "24px !important",
  height: "24px !important"
}).toString();


class GrClientSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
        pending: false,
        error: false,

        groupList: [],
        clientList: [],
        checkedGroup: [],
        checkedClient: [],

        functionForClickGroup: {},
        functionForClickClient: {}
    };
  }

  // life-cycle function.
  componentDidMount() {

    // init request client group list data
    // TODO: error process.
    requestPostAPI('readClientGroupList', {}).then(
      (response) => {
        const { data } = response.data;
        this.setState({
          groupList: data
        });
    });
  }

  // handle click event in group list, to request client list in selected client group.
  handleClickGroup = (value) => {
    // TODO: error process.
    requestPostAPI('readClientListForGroups', {groupId: value.grpId}).then(
      (response) => {
        const { data } = response.data;
        this.setState({
          clientList: data
        });
    });
  }

  // handle click event in client list, set selected client data and call parent function if exixted.
  handleClickClient = (value) => {
    // call assigned handler from parameters(properties), don't save in local state
    // only call where type is 'single'
    if(this.props.handleClientSelect && this.props.selectorType === 'single') {
      this.props.handleClientSelect(value);
    }
  }

  // handle click event in client check box list, 
  handleClientCheckToggle = (value) => (event) => {
    
    const { checkedClient } = this.state;
    const currentIndex = checkedClient.indexOf(value);
    const newChecked = [...checkedClient];

    if (currentIndex === -1 && event.target.checked) {
      newChecked.push(value);
    } else if(currentIndex !== -1 && !event.target.checked) {
      newChecked.splice(currentIndex, 1);
    } else {
      // 
    }

    if(this.props.handleClientSelect && this.props.selectorType === 'multiple') {
      this.props.handleClientSelect(newChecked);
    }
    this.setState({
      checkedClient: newChecked
    });
  };

  // handle click event in client group check box list, 
  handleGroupCheckToggle = (value) => (event) => {

    const { checkedGroup } = this.state;
    const currentIndex = checkedGroup.indexOf(value);
    const newChecked = [...checkedGroup];

    if (currentIndex === -1 && event.target.checked) {
      newChecked.push(value);
    } else if(currentIndex !== -1 && !event.target.checked) {
      newChecked.splice(currentIndex, 1);
    } else {
      //
    }

    if(this.props.handleGroupSelect && this.props.selectorType === 'multiple') {
      this.props.handleGroupSelect(newChecked);
    }
    this.setState({
      checkedGroup: newChecked
    });
  };

  // RENDER...
  render() {
    const {groupList, clientList} = this.state;
    const {selectorType, height} = this.props;

    const temp = {
      height: height,
      border: '1px solid gray',
      display: 'flex'
    }
    return (
      <div style={temp}>
        <div className={groupDiv}>
        <List className={selectItemList}>
          {groupList.map(value => (
            <ListItem key={value.grpId} className={selectItem} dense button onClick={() => this.handleClickGroup(value)}>
              {(selectorType === 'multiple') ?
                <Checkbox className={selectCheck} onChange={this.handleGroupCheckToggle(value)} /> : ''
              }
              <ListItemText primary={value.grpNm} />
            </ListItem>
          ))}
        </List>
        </div>
        <div className={clientDiv}>
          <List className={selectItemList}>
            {clientList.map(value => (
              <ListItem key={value.clientId} className={selectItem} dense button onClick={() => this.handleClickClient(value)}>
              {(selectorType === 'multiple') ?
                <Checkbox className={selectCheck} onChange={this.handleClientCheckToggle(value)} /> : ''
              }
                <ListItemText primary={value.clientName} />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default GrClientSelector;


