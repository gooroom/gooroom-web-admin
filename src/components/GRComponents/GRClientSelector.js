import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp';
import ClientManageComp from 'views/Client/ClientManageComp';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class GRClientSelector extends Component {

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
    requestPostAPI('readClientListForGroups', {groupId: value.grpId}).then(
      (response) => {
        const { data } = response.data;
        this.setState({
          clientList: data
        });
    });
  }

  // handle click event in client list, set selected client data and call parent function if exixted.
  handleClickClient = (clientObj, id) => {

    console.log('clientObj >>>>>>>>>>>>>>>>>  ', clientObj.toJS());

    // call assigned handler from parameters(properties), don't save in local state
    // only call where type is 'single'
    if(this.props.handleClientSelect && this.props.selectorType === 'single') {
      this.props.handleClientSelect(clientObj);
    }
  }

  // handle click event in client check box list, 
  // handleClientCheckToggle = (value) => (event) => {
    
  //   const { checkedClient } = this.state;
  //   const currentIndex = checkedClient.indexOf(value);
  //   const newChecked = [...checkedClient];

  //   if (currentIndex === -1 && event.target.checked) {
  //     newChecked.push(value);
  //   } else if(currentIndex !== -1 && !event.target.checked) {
  //     newChecked.splice(currentIndex, 1);
  //   } else {
  //     // 
  //   }

  //   if(this.props.handleClientSelect && this.props.selectorType === 'multiple') {
  //     this.props.handleClientSelect(newChecked);
  //   }
  //   this.setState({
  //     checkedClient: newChecked
  //   });
  // };

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

  // Select Group Item
  handleClientGroupSelect = (selectedGroupObj, selectedGroupIdArray) => {
    const { ClientManageProps, ClientManageActions, compId } = this.props;

    // show client list
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      groupId: selectedGroupIdArray.toJS(), page:0
    }, true);
  };
  

  // RENDER...
  render() {
    const { classes, compId } = this.props;
    const { groupList, clientList } = this.state;
    const { selectorType, height } = this.props;

    return (
      <React.Fragment>
        <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
          <Grid item xs={12} sm={4} lg={4} style={{border: '1px solid #efefef'}}>
            <ClientGroupComp compId={compId} selectorType={selectorType}
              onSelectAll={this.handleClientGroupSelectAll}
              onSelect={this.handleClientGroupSelect}
            />
          </Grid>
          <Grid item xs={12} sm={8} lg={8} style={{border: '1px solid #efefef'}}>
            <ClientManageComp compId={compId} selectorType={selectorType}
              onSelect={this.handleClickClient}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )

    // return (
    //   <div className={classes.csRoot} style={{height: height}}>
    //     <div className={classes.csGroupArea}>
    //     <List className={classes.csSelectItemList}>
    //       {groupList.map(value => (
    //         <ListItem key={value.grpId} className={classes.csSelectItem} dense button onClick={() => this.handleClickGroup(value)}>
    //           {(selectorType === 'multiple') ?
    //             <Checkbox className={classes.csSelectCheck} onChange={this.handleGroupCheckToggle(value)} /> : ''
    //           }
    //           <ListItemText primary={value.grpNm} />
    //         </ListItem>
    //       ))}
    //     </List>
    //     </div>
    //     <div className={classes.csClientArea}>
    //       <List className={classes.csSelectItemList}>
    //         {clientList.map(value => (
    //           <ListItem key={value.clientId} className={classes.csSelectItem} dense button onClick={() => this.handleClickClient(value)}>
    //           {(selectorType === 'multiple') ?
    //             <Checkbox className={classes.csSelectCheck} onChange={this.handleClientCheckToggle(value)} /> : ''
    //           }
    //             <ListItemText primary={value.clientName} />
    //           </ListItem>
    //         ))}
    //       </List>
    //     </div>
    //   </div>
    // );
  }
}


const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRClientSelector));

