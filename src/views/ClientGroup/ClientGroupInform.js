import React, { Component } from "react";
import PropTypes from "prop-types";
//import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import { withStyles } from '@material-ui/core/styles';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import classnames from 'classnames';

import { css } from 'glamor';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

// const styles = theme => ({
//   card: {
//     maxWidth: "100%",
//     marginLeft: "20px",
//     marginRight: "20px",
//   }
// });

const tableClass = css({
  minWidth: "100px !important"
}).toString();

const tableHeadCellClass = css({
  whiteSpace: "nowrap",
  padding: "0px !important"
}).toString();

const tableContainerClass = css({
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    position: "absolute",
    height: 10,
    marginLeft: "-10px",
    },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#CFD8DC", 
    },
  "&::-webkit-scrollbar-thumb": {
    height: "30px",
    backgroundColor: "#78909C",
    backgroundClip: "content-box",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px 1px",
    }
}).toString();

const tableRowClass = css({
  height: "2em !important"
}).toString();

const tableCellClass = css({
  height: "1em !important",
  padding: "0px !important",
  cursor: "pointer"
}).toString();





//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupInform extends Component {

  // .................................................
  handleRequestSort = (event, property) => {

    const { clientGroupModule, ClientGroupActions } = this.props;
    let orderDir = "desc";
    if (clientGroupModule.listParam.orderColumn === property && clientGroupModule.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readJobTargetList(getMergedListParam(clientGroupModule.targetListParam, {orderColumn: property, orderDir: orderDir}));
  };

  render() {

    const { clientGroupModule } = this.props;
    // console.log('ClientGroupInform-render clientGroupModule >> ', clientGroupModule);

    return (
      <div>
      {(clientGroupModule.selectedItem && clientGroupModule.selectedItem.grpId) &&
        <Card >
          <CardHeader
            title={(clientGroupModule.selectedItem) ? clientGroupModule.selectedItem.grpNm : ''}
            subheader={clientGroupModule.selectedItem.grpId + ', ' + formatDateToSimple(clientGroupModule.selectedItem.regDate, 'YYYY-MM-DD')}
          />
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <CardContent>
                <Typography component="pre">
                  {clientGroupModule.selectedItem.comment}
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

  clientGroupModule: state.ClientGroupModule,
  grConfirmModule: state.GrConfirmModule,

});


const mapDispatchToProps = (dispatch) => ({

  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupInform);

