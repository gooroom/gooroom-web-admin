import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import ClientUpdateServerSpec from './ClientUpdateServerSpec';
import ClientUpdateServerDialog from './ClientUpdateServerDialog';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientUpdateServerSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.ClientUpdateServerActions.readClientUpdateServerList(this.props.ClientUpdateServerProps, this.props.compId);
    this.props.ClientUpdateServerActions.changeCompVariable({
      compId: this.props.compId,
      name: 'selectedOptionItemId',
      value: this.props.initId
    });
  }

  handleChange = (event, value) => {
    this.props.ClientUpdateServerActions.changeCompVariable({
      compId: this.props.compId,
      name: 'selectedOptionItemId',
      value: event.target.value
    });
  };

  // ===================================================================
  handleEditClickForClientUpdateServer = (viewItem, compType) => {
    this.props.ClientUpdateServerActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientUpdateServerDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientUpdateServerProps, compId, targetType } = this.props;

    const viewItem = ClientUpdateServerProps.getIn(['viewItems', compId, 'viewItem']);
    const listAllData = ClientUpdateServerProps.getIn(['viewItems', compId, 'listAllData']);
    let selectedOptionItemId = ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = listAllData.getIn([0, 'objId']);
    }

    let selectedClientUpdateServerItem = null;
    if(listAllData && listAllData.size > 0) {
      const selectedData = listAllData.find((element) => {
        return element.get('objId') == selectedOptionItemId;
      });
      if(selectedData) {
        selectedClientUpdateServerItem = Map({'viewItem': selectedData});
      }      
    };

    return (
      <Card className={classes.card}>
        <CardContent style={{padding: 0}}>
        {listAllData && 
        <FormControl className={classes.formControl} style={{width: '100%', marginBottom: 24, marginTop: 8, border: 'dotted 1px lightGray'}}>
          <InputLabel htmlFor="cfg-helper"></InputLabel>
          <Select value={selectedOptionItemId}
            onChange={this.handleChange}
          >
          <MenuItem key={'-'} value={'-'}>없음</MenuItem>
          {listAllData.map(item => (
            <MenuItem key={item.get('objId')} value={item.get('objId')}>{item.get('objNm')}</MenuItem>
          ))}
          </Select>
          <FormHelperText>업데이트서버 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientUpdateServerSpec compId={compId}
            specType="inform" targetType={targetType}
            selectedItem={selectedClientUpdateServerItem}
            handleEditClick={this.handleEditClickForClientUpdateServer}
          />
        }
        </CardContent>
      </Card>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientUpdateServerProps: state.ClientUpdateServerModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientUpdateServerSelector));


