import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as MediaRuleActions from 'modules/MediaRuleModule';
import MediaRuleSpec from 'views/Rules/UserConfig/MediaRuleSpec';
import MediaRuleDialog from 'views/Rules/UserConfig/MediaRuleDialog';

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
class MediaRuleSelector extends Component {

  componentDidMount() {
    const { MediaRuleProps, MediaRuleActions, compId, initId, targetType } = this.props;
    //
    MediaRuleActions.readMediaRuleList(MediaRuleProps, compId, targetType);
    //
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    if(!MediaRuleProps.getIn(List(targetNames).push('selectedOptionItemId'))) {
      MediaRuleActions.changeCompVariable({
        compId: compId,
        name: 'selectedOptionItemId',
        value: initId,
        targetType: targetType
      });
    }
  }
  
  handleChange = (event, value) => {
    const { MediaRuleActions, compId, targetType } = this.props;
    MediaRuleActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleEditClickForMediaRule = (viewItem, compType) => {
    this.props.MediaRuleActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { MediaRuleProps, compId, targetType } = this.props;

    const selectedObj = (targetType && targetType != '') ? MediaRuleProps.getIn(['viewItems', compId, targetType]) : MediaRuleProps.getIn(['viewItems', compId]);

    const listAllData = (selectedObj) ? selectedObj.get('listAllData') : null;
    let selectedOptionItemId = (selectedObj) ? selectedObj.get('selectedOptionItemId') : null;
    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = '-';
    }

    let selectedMediaRuleItem = null;
    if(listAllData && listAllData.size > 0) {
      const selectedData = listAllData.find((element) => {
        return element.get('objId') == selectedOptionItemId;
      });
      if(selectedData) {
        selectedMediaRuleItem = Map({'selectedViewItem': selectedData});
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
          <MediaRuleSpec 
            specType="inform" targetType={targetType}
            selectedItem={selectedMediaRuleItem}
            handleEditClick={this.handleEditClickForMediaRule}
          />
        }
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  MediaRuleProps: state.MediaRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(MediaRuleSelector));


