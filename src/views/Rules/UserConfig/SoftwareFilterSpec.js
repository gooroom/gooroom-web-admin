import React, { Component } from "react";
import { Map, List } from 'immutable';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';
import SoftwareFilterDialog from './SoftwareFilterDialog';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';
import GRSoftwareCardHeader from 'components/GRComponents/GRSoftwareCardHeader';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import { refreshDataListInComps, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

class SoftwareFilterSpec extends Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedItem } = nextProps;
    if (selectedItem !== undefined && selectedItem !== null) {
      return true;
    } else {
      return false;
    }
  }

  handleSoftwareGroupValueChange = name => event => {
    const { selectedItem, SoftwareFilterProps, SoftwareFilterActions, compId } = this.props;
    const state = event.target.checked ? 'allow' : 'disallow'

    let viewItem = generateSoftwareFilterObject(selectedItem, false);
    let swItems = viewItem.get('SWITEM');

    const itemList = SoftwareFilterDialog.SW_GROUP_LIST && SoftwareFilterDialog.SW_GROUP_LIST.find(n => n.tag === name);
    if (itemList) {
      itemList.list.map(n => {

        swItems = swItems.map(o => {
          if (o === n.tag) {
            return { ...o, value: state }
          }
          return o;
        })

        const findItem = swItems.find(o => o === n.tag);
        if (findItem === undefined) {
          swItems = swItems.set(n.tag, state);
        }
      })
    }

    viewItem = viewItem.setIn(['SWITEM'], swItems);
    SoftwareFilterActions.editSoftwareFilterData(viewItem, compId).then((res) => {
      refreshDataListInComps(SoftwareFilterProps, SoftwareFilterActions.readSoftwareFilterListPaged);
    });

  }

  handleSoftwareValueChange = name => event => {
    const { selectedItem, SoftwareFilterProps, SoftwareFilterActions, compId } = this.props;
    const state = event.target.checked ? 'allow' : 'disallow'

    let viewItem = generateSoftwareFilterObject(selectedItem, false);
    let swItems = viewItem.get('SWITEM');

    const item = SoftwareFilterDialog.SW_LIST && SoftwareFilterDialog.SW_LIST.find(n => n.tag === name);

    if (item) {
      swItems = swItems.map(o => {
        if (o === item.tag) {
          return { ...o, value: state }
        }
        return o;
      })

      const findItem = swItems.find(o => o === item.tag);
      if (findItem === undefined) {
        swItems = swItems.set(item.tag, state);
      }
    }

    viewItem = viewItem.setIn(['SWITEM'], swItems);
    SoftwareFilterActions.editSoftwareFilterData(viewItem, compId).then((res) => {
      refreshDataListInComps(SoftwareFilterProps, SoftwareFilterActions.readSoftwareFilterListPaged);
    });
  }

  render() {

    const { classes } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle, isEditable } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if (selectedItem) {
      viewItem = generateSoftwareFilterObject(selectedItem, true);
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    return (
      <React.Fragment>
        {viewItem &&
          <Card elevation={4} className={classes.ruleViewerCard}>
            {hasAction &&
              <GRRuleCardHeader avatar={RuleAvartar}
                category={t("dtCategorySWRule")} title={viewItem.get('objNm')}
                subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
                action={
                  <div style={{ paddingTop: 16, paddingRight: 24 }}>
                    {isEditable &&
                      <Button size="small" variant="outlined" color="primary" style={{ minWidth: 32 }}
                        onClick={() => this.props.onClickEdit(compId, targetType)}
                      ><EditIcon /></Button>
                    }
                    {(this.props.onClickCopy && isEditable && !selectedItem.get('objId').endsWith('DEFAULT')) &&
                      <Button size="small" variant="outlined" color="primary" style={{ minWidth: 32, marginLeft: 10 }}
                        onClick={() => this.props.onClickCopy(compId, targetType)}
                      ><CopyIcon /></Button>
                    }
                    {(this.props.inherit && isEditable) &&
                      <Button size="small" variant="outlined" color="primary" style={{ minWidth: 32, marginLeft: 10 }}
                        onClick={() => this.props.onClickInherit(compId, targetType)}
                      ><ArrowDropDownCircleIcon /></Button>
                    }
                  </div>
                }
              />
            }
            {simpleTitle &&
              <GRRuleCardHeader
                category={t("dtCategorySWRule")} title={viewItem.get('objNm')}
                subheader={viewItem.get('objId') + ', ' + viewItem.get('comment')}
              />
            }
            <CardContent>
              <InputLabel className={classes.specTitle} style={{ color: 'black' }}>{t("msStopRunRedSW")}</InputLabel>
              <Grid container spacing={8} alignItems="flex-start" direction="row" justify="flex-start" style={{ marginTop: 10 }}>
                {SoftwareFilterDialog.SW_GROUP_LIST && SoftwareFilterDialog.SW_GROUP_LIST.map(n => {
                  const find = n.list.find(o => {
                    return viewItem.getIn(['SWITEM', o.tag]) ? o : null;
                  })
                  const chk = find ? true : false;
                  //const chk = false;
                  return (
                    <div key={n.no} style={{ width: 570, height: 240, margin: 10, border: '1.5px solid #BFBFBF' }}>
                      {/* Header */}
                      <div style={{ height: 46, position: 'relative', lineHeight: '46px', padding: '0 20px', background: '#F2F2F2', borderBottom: '1.5px solid #BFBFBF' }}>
                        <span>{this.props.lng === 'kr' ? n.name_kr : n.tag}</span>
                        {
                          hasAction &&
                          <span style={{ position: 'absolute', right: 0 }}>
                            <FormControlLabel control={
                              <Switch
                                onChange={this.handleSoftwareGroupValueChange(n.tag)}
                                color="primary"
                                checked={chk}
                              />
                            }
                            />
                          </span>
                        }
                      </div>
                      {/* Body */}
                      <div>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, height: 192, overflow: 'auto' }}>
                          {/* 반복 시작 */}
                          {
                            n.list && n.list.map(item => {
                              const selected = (viewItem.getIn(['SWITEM', item.tag])) ? true : false;
                              const swStyle = (selected) ? { color: 'red', fontWeight: 'bold' } : { color: '#8484', fontWeight: 'bold' };
                              const iconUrl = location.origin + '/gpms/images/gr_icons/icons/' + item.icon;

                              return (
                                <li style={{ padding: '20px 30px' }} key={item.no}>
                                  <div style={{ display: 'inline-block' }}>
                                    <div style={{ display: 'inline-block' }}>
                                      <img src={iconUrl} height="50" width="50" />
                                    </div>
                                    <div style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: '30px' }}>
                                      <div style={swStyle}>{item.name}</div>
                                      <div>{item.name_kr}</div>
                                    </div>
                                  </div>
                                  <div style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: '30px', float: 'right' }}>
                                    <span style={{ position: 'center', right: 0 }}>
                                      <FormControlLabel control={
                                        <Switch
                                          onChange={this.handleSoftwareValueChange(item.tag)}
                                          color="primary"
                                          checked={selected}
                                        />
                                      }
                                      />
                                    </span>
                                  </div>
                                </li>
                              )
                            })
                          }
                          {/* 반복 끝 */}
                        </ul>
                      </div>
                    </div>
                  );
                })
                }
              </Grid>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  SoftwareFilterProps: state.SoftwareFilterModule
});

const mapDispatchToProps = (dispatch) => ({
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SoftwareFilterSpec)));
//export default translate("translations")(withStyles(GRCommonStyle)(SoftwareFilterSpec));

export const generateSoftwareFilterObject = (param, isForViewer) => {

  if (param) {
    let filtered_software = [];

    param.get('propList').forEach(function (e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if (ename == 'filtered_software') {
        filtered_software.push(evalue);
      }
    });

    let selectedSoftware = Map({});
    filtered_software.map(n => {
      selectedSoftware = selectedSoftware.set(n, 'allow');
    })

    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),

      SWITEM: selectedSoftware
    });

  } else {
    return param;
  }

};