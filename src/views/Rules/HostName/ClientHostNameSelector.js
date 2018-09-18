import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientHostNameComp from './ClientHostNameComp';
import { createViewObject } from './ClientHostNameManageInform';
import { getDataObjectInComp, getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

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
    const viewItem = getDataObjectInComp(ClientHostNameProps, compId);

    let confItems = [];
    let selectedOptionItemId = '';

    if(viewItem && viewItem.get('listAllData') && viewItem.get('listAllData').size > 0) {
      confItems = viewItem.get('listAllData');

      if(viewItem && viewItem.get('selectedOptionItemId') && viewItem.get('selectedOptionItemId') !== '') {
        selectedOptionItemId = viewItem.get('selectedOptionItemId');
      } else {
        selectedOptionItemId = confItems.getIn([0, 'objId']);
      }
    }

    return (
      <Card className={classes.card}>
        <CardContent>
        <FormControl className={classes.formControl} style={{width: '100%'}}>
          <InputLabel htmlFor="cfg-helper"></InputLabel>
          <Select value={selectedOptionItemId}
            onChange={this.handleChange}
          >
          {confItems.map(item => (
            <MenuItem key={item.get('objId')} value={item.get('objId')}>{item.get('objNm')}</MenuItem>
          ))}
          </Select>
          <FormHelperText>Hosts 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
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


