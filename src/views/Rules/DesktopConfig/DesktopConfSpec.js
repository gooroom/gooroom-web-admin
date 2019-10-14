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

import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DesktopConfSpec extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedItem } = nextProps;
    if(selectedItem !== undefined && selectedItem !== null) {
      return true;
    } else {
      return false;
    }
  }
  
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
    const { compId, targetType, selectedItem, ruleGrade, hasAction, simpleTitle } = this.props;
    const { t, i18n } = this.props;

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
              category={t("lbDesktopConf")} title={viewItem.get('confNm')}
              subheader={viewItem.get('confId')}
              action={<div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.onClickEdit(compId, targetType)}
                  ><EditIcon /></Button>
                  {(this.props.onClickCopy && !selectedItem.get('confId').endsWith('DEFAULT')) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickCopy(compId, targetType)}
                  ><CopyIcon /></Button>
                  }
                  {(this.props.inherit) &&
                  <Button size="small" variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.onClickInherit(compId, targetType)}
                  ><ArrowDropDownCircleIcon /></Button>
                  }
                </div>}
            />
            }
            { simpleTitle &&
            <GRRuleCardHeader
              category={t("lbDesktopConf")} title={viewItem.get('confNm')}
              subheader={viewItem.get('confId')}
            />
            }
            <CardContent style={{paddingTop: 10}}>
            { (!hasAction && !simpleTitle) &&
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell style={{width:'25%'}} component="th" scope="row">{bull} {t("lbName")}</TableCell>
                    <TableCell style={{width:'25%'}} >{viewItem.get('confNm')}</TableCell>
                    <TableCell style={{width:'25%'}} component="th" scope="row">{bull} {t("lbId")}</TableCell>
                    <TableCell style={{width:'25%'}} >{viewItem.get('confId')}</TableCell>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopConfSpec)));
