import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupInform extends Component {

  // .................................................
  handleRequestSort = (event, property) => {

    const { ClientGroupProps, ClientGroupActions } = this.props;
    let orderDir = "desc";
    if (ClientGroupProps.listParam.orderColumn === property && ClientGroupProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readJobTargetList(getMergedListParam(ClientGroupProps.targetListParam, {orderColumn: property, orderDir: orderDir}));
  };

  render() {

    const { ClientGroupProps } = this.props;

    return (
      <div>
      {(ClientGroupProps.informOpen) &&
        <Card >
          <CardHeader
            title={(ClientGroupProps.viewItem) ? ClientGroupProps.viewItem.grpNm : ''}
            subheader={ClientGroupProps.viewItem.grpId + ', ' + formatDateToSimple(ClientGroupProps.viewItem.regDate, 'YYYY-MM-DD')}
          />
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <CardContent>
                <Typography component="pre">
                  {ClientGroupProps.viewItem.comment}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      }
      </div>
    );

  }
}


const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupInform);

