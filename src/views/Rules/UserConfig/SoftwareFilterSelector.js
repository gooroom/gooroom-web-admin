import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import SoftwareFilterSpec from 'views/Rules/UserConfig/SoftwareFilterSpec';
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';

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
class SoftwareFilterSelector extends Component {

  componentDidMount() {
    const { SoftwareFilterProps, SoftwareFilterActions, compId, initId, targetType } = this.props;
    //
    SoftwareFilterActions.readSoftwareFilterList(SoftwareFilterProps, compId, targetType);
    //
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    if(!SoftwareFilterProps.getIn(List(targetNames).push('selectedOptionItemId'))) {
      SoftwareFilterActions.changeCompVariable({
        compId: compId,
        name: 'selectedOptionItemId',
        value: initId,
        targetType: targetType
      });
    }
  }
  
  handleChange = (event, value) => {
    const { SoftwareFilterActions, compId, targetType } = this.props;
    SoftwareFilterActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleEditClickForSoftwareFilter = (viewItem, compType) => {
    this.props.SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { SoftwareFilterProps, compId, targetType } = this.props;

    const selectedObj = (targetType && targetType != '') ? SoftwareFilterProps.getIn(['viewItems', compId, targetType]) : SoftwareFilterProps.getIn(['viewItems', compId]);

    const listAllData = (selectedObj) ? selectedObj.get('listAllData') : null;
    let selectedOptionItemId = (selectedObj) ? selectedObj.get('selectedOptionItemId') : null;
    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = '-';
    }

    let selectedSoftwareFilterItem = null;
    if(listAllData && listAllData.size > 0) {
      const selectedData = listAllData.find((element) => {
        return element.get('objId') == selectedOptionItemId;
      });
      if(selectedData) {
        selectedSoftwareFilterItem = Map({'viewItem': selectedData});
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
          <FormHelperText>정책 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <SoftwareFilterSpec compId={compId}
            specType="inform" targetType={targetType}
            selectedItem={selectedSoftwareFilterItem}
            onClickEdit={this.handleEditClickForSoftwareFilter}
          />
        }
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  SoftwareFilterProps: state.SoftwareFilterModule
});

const mapDispatchToProps = (dispatch) => ({
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SoftwareFilterSelector));


