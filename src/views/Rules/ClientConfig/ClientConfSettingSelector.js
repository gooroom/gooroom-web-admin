import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';

import { getDataObjectInComp, getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

import ClientConfSettingComp from 'views/Rules/ClientConfig/ClientConfSettingComp';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientConfSettingSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.ClientConfSettingActions.readClientConfSettingList(this.props.ClientConfSettingProps, this.props.compId);
  }

  handleChange = (event, value) => {
    this.props.ClientConfSettingActions.changeCompVariable({
      compId: this.props.compId,
      name: 'selectedOptionItemId',
      value: event.target.value
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientConfSettingProps, compId } = this.props;
    const viewItem = getDataObjectInComp(ClientConfSettingProps, compId);

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
          <InputLabel htmlFor="cfg-helper">단말정책정보</InputLabel>
          <Select value={selectedOptionItemId}
            onChange={this.handleChange}
          >
          {confItems.map(item => (
            <MenuItem key={item.get('objId')} value={item.get('objId')}>{item.get('objNm')}</MenuItem>
          ))}
          </Select>
          <FormHelperText>정책 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientConfSettingComp
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
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientConfSettingSelector));


