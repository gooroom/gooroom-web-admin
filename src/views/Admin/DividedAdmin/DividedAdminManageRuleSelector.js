import React, { Component } from "react";
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Constants from "components/GRComponents/GRConstants";

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class DividedAdminManageRuleSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedValue: 'a',
        checked: ['client_add', 'client_delete', 'client_move', 'client_rule',
        'userAdd', 'userDelete', 'userMove', 'userRule',
        'ruleEdit', 'ruleUser', 'ruleClient', 'rule_value_04',
        'desktopEdit', 'desktopUser', 'desktopClient', 'desktop_value_04',
        'noticeEdit', 'noticeUser', 'noticeClient', 'notice_value_04'],
        checkClientRule: true,
    };
  }

  handleChange = event => {
    // this.setState({ selectedValue: event.target.value });
  };

  handleToggle = name => event => {
    const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 1 : 0) : event.target.value;
    this.props.AdminUserActions.setEditingItemValue({
        name: name,
        value: value.toString()
    });
  }

  render() {
    const { classes, compId, editingItem } = this.props;
    const { t, i18n } = this.props;
    const {selectedAdminId, selectedAdminName} = this.props;

    return (
      <div style={{marginTop: 10}} >
      { (selectedAdminId !== '') &&
        <React.Fragment>
        <Card>
          <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={"관리자 권한"}></CardHeader>
          {(editingItem.get('adminTp') === Constants.SUPER_TYPECODE || editingItem.get('adminTp') === Constants.ADMIN_TYPECODE) &&
          <CardContent style={{padding:0}}>
            <Typography variant="body1" style={{textAlign:'center',padding:30}} >{t("msgNoNeedPart")}</Typography>
          </CardContent>
          }
          {(editingItem.get('adminTp') === Constants.PART_TYPECODE) &&
          <CardContent style={{padding:0}}>

          <Grid container spacing={0} style={{padding:'10px 20px 10px 20px'}}>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >{t("lbClientPart")}
                <Checkbox checked={(editingItem) ? editingItem.get('isClientAdmin') == 1 : false}
                  onChange={this.handleToggle('isClientAdmin')} value="isClientAdmin"
                />
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >{t("lbUserPart")}
                <Checkbox checked={(editingItem) ? editingItem.get('isUserAdmin') == 1 : false}
                  onChange={this.handleToggle('isUserAdmin')} value="isUserAdmin"
                />
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >{t("lbDesktopPart")}
                <Checkbox checked={(editingItem) ? editingItem.get('isDesktopAdmin') == 1 : false}
                  onChange={this.handleToggle('isDesktopAdmin')} value="isDesktopAdmin"
                />
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >{t("lbNoticePart")}
                <Checkbox checked={(editingItem) ? editingItem.get('isNoticeAdmin') == 1 : false}
                  onChange={this.handleToggle('isNoticeAdmin')} value="isNoticeAdmin"
                />
              </Typography>
            </Grid>
            {window.usePortable ?
              <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
                <Typography variant="body1" style={{fontWeight:'bold'}} >{t("lbPortablePart")}
                  <Checkbox checked={(editingItem) ? editingItem.get('isPortableAdmin') == 1 : false}
                    onChange={this.handleToggle('isPortableAdmin')} value="isPortableAdmin"
                  />
                </Typography>
              </Grid>
            : null
            }
          </Grid>
  
          </CardContent>
          }
          </Card>

        </React.Fragment>
        }
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManageRuleSelector)));

