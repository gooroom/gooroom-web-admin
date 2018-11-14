import React, { Component } from "react";
import { Map, List } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as DesktopAppActions from 'modules/DesktopAppModule';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';
import DesktopConfDialog from 'views/Rules/DesktopConfig/DesktopConfDialog';

import DesktopApp from './DesktopApp';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
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
    const bull = <span className={classes.bullet}>•</span>;
    const { compId, compType, targetType, selectedItem, ruleGrade, hasAction } = this.props;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = selectedItem;
      RuleAvartar = getAvatarForRuleGrade(targetType, ruleGrade);
    }

    let appPaneWidth = 0;
    if(viewItem && viewItem.get('apps') && viewItem.get('apps').size > 0) {
      appPaneWidth = viewItem.get('apps').size * (120 + 16) + 40;
    }
    
    return (
      <React.Fragment>
        {viewItem && 
          <Card elevation={4} className={classes.ruleViewerCard}>
          { hasAction &&
            <GRRuleCardHeader avatar={RuleAvartar}
              category='데스크톱 설정' title={viewItem.get('confNm')}
              subheader={viewItem.get('confId')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, compType)}
                  ><SettingsApplicationsIcon /></Button>
                  {(this.props.onClickCopy) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, compType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit && !(selectedItem.get('isDefault'))) && 
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickInherit(compId, compType)}
                  ><ArrowDropDownCircleIcon /></Button>
                  }
                </div>
              }
            />
            }
            <CardContent style={{paddingTop: 10}}>
            { !hasAction &&
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">{bull} 이름</TableCell>
                    <TableCell numeric>{viewItem.get('confNm')}</TableCell>
                    <TableCell component="th" scope="row">{bull} 아이디</TableCell>
                    <TableCell numeric>{viewItem.get('confId')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            }
              <div style={{overflowY: 'auto'}}>
                <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{width:appPaneWidth,margin:'0 10 0 10'}}>
                  {viewItem.get('apps') && viewItem.get('apps').map(n => {
                    return (
                      <Grid key={n.get('appId')} item>
                        <DesktopApp key={n.get('appId')} appObj={n}
                            themeId={viewItem.get('themeId')}
                            hasAction={false}
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
