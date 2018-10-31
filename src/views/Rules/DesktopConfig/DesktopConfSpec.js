import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as DesktopAppActions from 'modules/DesktopAppModule';

import DesktopConfDialog from './DesktopConfDialog';
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';

import DesktopApp from './DesktopApp';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DesktopConfSpec extends Component {

  handleEditAppClick = (viewItem) => {
    this.props.DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_EDIT_INCONF
    });
  };
  
  // .................................................
  render() {

    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = selectedItem.get('viewItem');
      RuleAvartar = getAvatarForRuleGrade(targetType, selectedItem.get('ruleGrade'));
    }

    let appPaneWidth = 0;
    if(viewItem && viewItem.get('apps') && viewItem.get('apps').size > 0) {
      appPaneWidth = viewItem.get('apps').size * (120 + 16) + 40;
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} style={{marginBottom:20}}>
            <CardHeader
              avatar={RuleAvartar}
              title={viewItem.get('confNm')}
              subheader={viewItem.get('confId')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(viewItem, compType)}
                  ><SettingsApplicationsIcon /></Button>
                  {(this.props.onClickCopy) &&
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(viewItem)}
                  ><CopyIcon /></Button>
                  }
                </div>
              }
              style={{paddingBottom:0}}
            />
            <CardContent style={{paddingTop:0}}>
              <div style={{overflowY: 'auto'}}>
                <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{width:appPaneWidth,margin:'0 10 0 10'}}>
                  {viewItem.get('apps') && viewItem.get('apps').map(n => {
                    return (
                      <Grid key={n.get('appId')} item>
                        <DesktopApp 
                            key={n.get('appId')}
                            appObj={n}
                            themeId={viewItem.get('themeId')}
                            onEditClick={this.handleEditAppClick}
                          />
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch),
  DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopConfSpec));
