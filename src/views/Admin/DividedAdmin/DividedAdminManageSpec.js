import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminUserActions from 'modules/AdminUserModule';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class DividedAdminManageSpec extends Component {

  render() {

    const { classes, selectedItem, compId } = this.props;
    const { AdminUserProps } = this.props;
    const { t, i18n } = this.props;

    const isSuper = (selectedItem && selectedItem.get('adminTp') === 'S') ? true : false;
    const isPart = (selectedItem && selectedItem.get('adminTp') === 'P') ? true : false;

    const isEditable = AdminUserProps.getIn(['viewItems', compId, 'isEditable']);

    return (
      <React.Fragment>
      {selectedItem &&
        <Card elevation={4} className={classes.ruleViewerCard}>
          <GRRuleCardHeader
            category={t('lbAdminSpecifiedRole')} title={selectedItem.get('adminNm')} 
            subheader={selectedItem.get('adminId')}
            action={
              (isEditable) ? 
              <div style={{paddingTop:16,paddingRight:24}}>
                <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={(event) => this.props.onClickEdit(event, selectedItem.get('adminId'))}
                ><EditIcon /></Button>
              </div>
              : <div></div>
            }
          />
          <CardContent style={{padding:10,width:'100%'}}>
            {isPart && 
            <Grid container spacing={0}>
              <Grid item xs={6} className={classes.specCategory} style={{paddingTop:16}}>
                [ {t('lbClientPart')} -
                {(selectedItem.get('isClientAdmin') === '1') && <span> {t('lbHaveIt')} ]</span>} 
                {(selectedItem.get('isClientAdmin') !== '1') && <span> {t('lbHaveNotIt')} ]</span>}
              </Grid>
              <Grid item xs={6} className={classes.specCategory} style={{paddingTop:16}}>
                [ {t('lbUserPart')} -
                {(selectedItem.get('isUserAdmin') === '1') && <span> {t('lbHaveIt')} ]</span>}
                {(selectedItem.get('isUserAdmin') !== '1') && <span> {t('lbHaveNotIt')} ]</span>}
              </Grid>
              <Grid item xs={6} className={classes.specCategory} style={{paddingTop:16}}>
                [ {t('lbDesktopPart')} -
                {(selectedItem.get('isDesktopAdmin') === '1') && <span> {t('lbHaveIt')} ]</span>}
                {(selectedItem.get('isDesktopAdmin') !== '1') && <span> {t('lbHaveNotIt')} ]</span>}
              </Grid>
              <Grid item xs={6} className={classes.specCategory} style={{paddingTop:16}}>
                [ {t('lbNoticePart')} -
                {(selectedItem.get('isNoticeAdmin') === '1') && <span> {t('lbHaveIt')} ]</span>}
                {(selectedItem.get('isNoticeAdmin') !== '1') && <span> {t('lbHaveNotIt')} ]</span>}
              </Grid>
            </Grid>
            }
            <Grid container spacing={0}>
              {(!isSuper && selectedItem.get('deptInfoList') && selectedItem.get('deptInfoList').size > 0) &&
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t('lbManagedDept')} - {t('lbManagedTargetCount')} : {selectedItem.get('deptInfoList').size} ea ]</Grid>
              }
              {(!isSuper && selectedItem.get('deptInfoList')) && selectedItem.get('deptInfoList').map((n, i) => (
                <React.Fragment key={n.get('value')}>
                  <Grid item xs={3} className={classes.specTitle}>{`( ${(i + 1)} ) ${t('lbDeptName')} / ${t('lbDeptId')}`}</Grid>
                  <Grid item xs={3} className={classes.specContent}>{n.get('name')} / {n.get('value')}</Grid>
                </React.Fragment>
              ))}
              {(!isSuper && selectedItem.get('deptInfoList') == null || selectedItem.get('deptInfoList').size < 1) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{t('lbManagedDept')}</strike> ]</Grid>
              }
              {(isSuper) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t('lbManagedDept')} - {t('stAll')}]</Grid>
              }
            </Grid>
            <Grid container spacing={0}>
              {(!isSuper && selectedItem.get('grpInfoList') && selectedItem.get('grpInfoList').size > 0) &&
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t('lbManagedClientGroup')} - {t('lbManagedTargetCount')} : {selectedItem.get('grpInfoList').size} ea ]</Grid>
              }
              {(!isSuper && selectedItem.get('grpInfoList')) && selectedItem.get('grpInfoList').map((n, i) => (
                <React.Fragment key={n.get('name')}>
                  <Grid item xs={3} className={classes.specTitle}>{`( ${(i + 1)} ) ${t('lbClientName')} / ${t('lbClientId')}`}</Grid>
                  <Grid item xs={3} className={classes.specContent}>{n.get('name')} / {n.get('value')}</Grid>
                </React.Fragment>
              ))}
              {(!isSuper && selectedItem.get('grpInfoList') == null || selectedItem.get('grpInfoList').size < 1) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{t('lbManagedClientGroup')}</strike> ]</Grid>
              }
              {(isSuper) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {t('lbManagedClientGroup')} - {t('stAll')}]</Grid>
              }
            </Grid>
            <Grid container spacing={0}>
              {(selectedItem.get('connIps') && selectedItem.get('connIps').size > 0) &&
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>{`[ ${t('lbConnectableIp')} ]`}</Grid>
              }
              {(selectedItem.get('connIps')) && selectedItem.get('connIps').map((n, i) => (
                <React.Fragment key={n}>
                  <Grid item xs={3} className={classes.specTitle}>{`( ${(i + 1)} ) ${t('lbIp')}`}</Grid>
                  <Grid item xs={3} className={classes.specContent}>{n}</Grid>
                </React.Fragment>
              ))}
              {(selectedItem.get('connIps') == null || selectedItem.get('connIps').size < 1) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{`[ ${t('lbConnectableIp')} ]`}</strike> ]</Grid>
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
  AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManageSpec)));
