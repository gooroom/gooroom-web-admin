import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminUserActions from 'modules/AdminUserModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';
import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import AdminUserDialog from './AdminUserDialog';
import AdminRecordDialog from './AdminRecordDialog';

import GrPane from 'containers/GrContent/GrPane';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class ServerUrlInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        gpmsInfo: '',
        glmInfo: '',
        grmInfo: ''
      })
    };
  }

  componentDidMount() {


  }


  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

        <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Word of the Day
          </Typography>
          <Typography variant="h5" component="h2">
            be
            {bull}
            nev
            {bull}o{bull}
            lent
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            adjective
          </Typography>
          <Typography component="p">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>



        <TextField label="GPMS Server"
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="outlined-dense"
          label="Dense"
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
          variant="outlined"
        />

        <TextField label="GLM Server"
          style={{ margin: 8 }}
          placeholder="Placeholder"
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField label="GRM Server"
          style={{ margin: 8 }}
          placeholder="Placeholder"
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
          
        </GrPane>
      </React.Fragment>
    );
  }
}

export default withStyles(GrCommonStyle)(ServerUrlInfo);
