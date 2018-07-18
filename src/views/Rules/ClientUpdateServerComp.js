import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupCompModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { getMergedObject, arrayContainsArray } from '../../components/GrUtils/GrCommonUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

//
//  ## Theme override ########## ########## ########## ########## ########## 
//

//
//  ## Style ########## ########## ########## ########## ########## 
//

const title = css({
  marginBottom: 16,
  fontSize: 14,
}).toString();

const card = css({
  minWidth: 275,
}).toString();

const bullet = css({
  display: 'inline-block',
  margin: '0 2px',
  transform: 'scale(0.8)',
}).toString();

const pos = css({
  marginBottom: 12,
}).toString();

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientUpdateServerComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  // .................................................
  render() {

    const { ClientUpdateServerProps, compId } = this.props;
    const bull = <span className={bullet}>•</span>;
    const { [compId + '__editingItem'] : viewItem } = ClientUpdateServerProps;

    return (

      <Card className={card}>
        {(viewItem) && <CardContent>
          <Typography className={title} color="textSecondary">
            업데이트서버설정
          </Typography>
          <Typography variant="headline" component="h2">
            {viewItem.objNm}
          </Typography>
          <Typography className={pos} color="textSecondary">
            {(viewItem.comment != '') ? '"' + viewItem.comment + '"' : ''}
          </Typography>
          <Divider />
          {(viewItem && viewItem.objId != '') &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 주 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewItem.mainos}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 기반 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewItem.extos}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} gooroom.pref</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewItem.priorities}</pre></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        </CardContent>
      }
      </Card>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupCompModule,
  ClientUpdateServerProps: state.ClientUpdateServerModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientUpdateServerComp);


