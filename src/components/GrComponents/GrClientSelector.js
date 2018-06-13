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
    const {groupList, clientList, selectorType, handleSelect, height} = this.props;

    console.log('height ', height);

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
                <Checkbox className={selectCheck} onChange={this.handleGroupToggle(value)} /> : ''
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
                <Checkbox className={selectCheck} onChange={this.handleClientToggle(value)} /> : ''
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


