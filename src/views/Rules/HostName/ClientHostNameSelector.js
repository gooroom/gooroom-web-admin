import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientHostNameActions from 'modules/ClientHostNameModule';

import ClientHostNameComp from './ClientHostNameComp';
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
class ClientHostNameSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.ClientHostNameActions.readClientHostNameList(this.props.ClientHostNameProps, this.props.compId);
  }

  handleChange = (event, value) => {
    this.props.ClientHostNameActions.changeCompVariable({
      compId: this.props.compId,
      name: 'selectedOptionItemId',
      value: event.target.value
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientHostNameProps, compId } = this.props;

    const selectedViewItem = ClientHostNameProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = ClientHostNameProps.getIn(['viewItems', compId, 'listAllData']);
    let selectedOptionItemId = ClientHostNameProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
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
          <FormHelperText>Hosts 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientHostNameComp
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
  ClientHostNameProps: state.ClientHostNameModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientHostNameSelector));


