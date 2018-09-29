import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SecurityRuleActions from 'modules/SecurityRuleModule';

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

import SecurityRuleComp from 'views/Rules/UserConfig/SecurityRuleComp';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class SecurityRuleSelector extends Component {

  componentDidMount() {
    const { SecurityRuleProps, SecurityRuleActions, compId, initId } = this.props;
    SecurityRuleActions.readSecurityRuleList(SecurityRuleProps, compId);
    SecurityRuleActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: initId
    });
  }

  handleChange = (event, value) => {
    const { SecurityRuleProps, SecurityRuleActions, compId } = this.props;
    SecurityRuleActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { SecurityRuleProps, SecurityRuleActions, compId } = this.props;

    const selectedViewItem = SecurityRuleProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = SecurityRuleProps.getIn(['viewItems', compId, 'listAllData']);
    let selectedOptionItemId = SecurityRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
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
          <FormHelperText>정책 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <SecurityRuleComp
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
  SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(SecurityRuleSelector));


