import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { css } from 'glamor';

import { getMergedListParam, arrayContainsArray } from '../../components/GrUtils/GrCommonUtils';

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
class ClientHostsComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
  }

  // .................................................
  render() {

    const { ClientGroupProps } = this.props;
    const bull = <span className={bullet}>•</span>;

    return (

      <Card className={card}>
        <CardContent>
          <Typography className={title} color="textSecondary">
            Hosts설정
          </Typography>
          <Typography variant="headline" component="h2">
            {ClientGroupProps.viewItem.hostNameConfigNm}
          </Typography>
          <Typography className={pos} color="textSecondary">
          {bull}이 정책에 대한 설명을 보여주는 곳
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">상세보기</Button>
        </CardActions>
      </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHostsComp);


