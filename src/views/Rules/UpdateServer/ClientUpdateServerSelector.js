import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import ClientUpdateServerComp from './ClientUpdateServerComp';
import { getDataObjectInComp, getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

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

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientUpdateServerProps, compId } = this.props;

    const selectedViewItem = ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = ClientUpdateServerProps.getIn(['viewItems', compId, 'listAllData']);
    let selectedOptionItemId = ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = listAllData.getIn([0, 'objId']);
    }

    return (
      <Card className={classes.card}>
        <CardContent>
        {listAllData && 
        <FormControl className={classes.formControl} style={{width: '100%'}}>
          <InputLabel htmlFor="cfg-helper"></InputLabel>
          <Select value={selectedOptionItemId}
            onChange={this.handleChange}
          >
          {listAllData.map(item => (
            <MenuItem key={item.get('objId')} value={item.get('objId')}>{item.get('objNm')}</MenuItem>
          ))}
          </Select>
          <FormHelperText>업데이트서버 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientUpdateServerComp
            compId={compId}
            objId={selectedOptionItemId}
            compType="VIEW"
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientUpdateServerSelector));

