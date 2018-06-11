import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as grClientSelectorActions from '../../modules/GrClientSelectorModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';




class GrClientSelector extends Component {

  handleClose = (selectValue) => {
    this.setState({ open: false });
  };

  handleCancel = () => {
    this.props.GrConfirmActions.closeConfirm({
      confirmResult: false,
      confirmOpen: false
    });

    this.props.handleConfirmResult(false);
  };

  handleOk = () => {
    this.props.GrConfirmActions.closeConfirm({
      confirmResult: true,
      confirmOpen: false
    });
    this.props.handleConfirmResult(true);
  };

  handleGroupToggle = value => () => {
    const { checkedGroup } = this.props;
    const currentIndex = checkedGroup.indexOf(value);
    const newChecked = [...checkedGroup];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.props.GrClientSelectorActions.setValueByName({
      name: 'checkedGroup',
      value: newChecked
    });
  };

  handleClientToggle = value => () => {
    const { checkedClient } = this.props;
    const currentIndex = checkedClient.indexOf(value);
    const newChecked = [...checkedClient];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.props.GrClientSelectorActions.setValueByName({
      name: 'checkedClient',
      value: newChecked
    });
  };

  handleClickGroup = (value) => {
    this.props.GrClientSelectorActions.readClientListByGroup({
      groupId: value.grpId
    });
  }

  handleClickClient = (value) => {

    if(this.props.handleSelect) {
      this.props.handleSelect(value);
    }

  }

  componentDidMount() {

    this.props.GrClientSelectorActions.readClientGroupList({

    });
  }

  render() {
    const {groupList, clientList, selectorType, handleSelect} = this.props;

    const temp = {
      border: '1px solid red',
      display: 'flex'
    }
    return (
      <div style={temp}>
        <List>
          {groupList.map(value => (
            <ListItem key={value.grpId} dense button onClick={() => this.handleClickGroup(value)}>
              {(selectorType === 'multiple') ?
                <Checkbox onChange={this.handleGroupToggle(value)} /> : ''
              }
              <ListItemText primary={value.grpNm} />
            </ListItem>
          ))}
        </List>
        <List>
          {clientList.map(value => (
            <ListItem key={value.clientId} dense button onClick={() => this.handleClickClient(value)}>
            {(selectorType === 'multiple') ?
              <Checkbox onChange={this.handleClientToggle(value)} /> : ''
            }
              <ListItemText primary={value.clientName} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

  groupList: state.GrClientSelectorModule.groupList,
  clientList: state.GrClientSelectorModule.clientList,
  checkedGroup: state.GrClientSelectorModule.checkedGroup,
  checkedClient: state.GrClientSelectorModule.checkedClient

});

const mapDispatchToProps = (dispatch) => ({
  GrClientSelectorActions: bindActionCreators(grClientSelectorActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GrClientSelector);


