import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as MediaRuleActions from 'modules/MediaRuleModule';

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

import MediaRuleComp from 'views/Rules/UserConfig/MediaRuleComp';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class MediaRuleSelector extends Component {

  componentDidMount() {
    const { MediaRuleProps, MediaRuleActions, compId, initId } = this.props;
    MediaRuleActions.readMediaRuleList(MediaRuleProps, compId);
    if(!MediaRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId'])) {
      MediaRuleActions.changeCompVariable({
        compId: compId,
        name: 'selectedOptionItemId',
        value: initId
      });
    }
  }
  
  handleChange = (event, value) => {
    const { MediaRuleProps, MediaRuleActions, compId } = this.props;
    MediaRuleActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { MediaRuleProps, compId } = this.props;

    const listAllData = MediaRuleProps.getIn(['viewItems', compId, 'listAllData']);
    let selectedOptionItemId = MediaRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = listAllData.getIn([0, 'objId']);
    }

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
          <MediaRuleComp
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
  MediaRuleProps: state.MediaRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(MediaRuleSelector));


