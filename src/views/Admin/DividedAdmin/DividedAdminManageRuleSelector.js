import React, { Component } from "react";
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


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

