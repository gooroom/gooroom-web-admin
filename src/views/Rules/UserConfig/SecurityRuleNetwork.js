import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//import MUIDataTable from "mui-datatables";

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import GRConfirm from 'components/GRComponents/GRConfirm';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';

import Checkbox from "@material-ui/core/Checkbox";
import Input from '@material-ui/core/Input';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


const columns = [
  { id: 'direction', numeric: false, label: 'DIRECTION' },
  { id: 'protocol', numeric: true, label: 'PROTOCOL' },
  { id: 'address', numeric: true, label: 'ADDRESS' },
  { id: 'srcport', numeric: true, label: 'SRC PORT' },
  { id: 'dstport', numeric: true, label: 'DEST PORT' },
  { id: 'state', numeric: true, label: 'STATE' },
];

function createNetworkItem(editingItem, direction, protocol, address, srcport, dstport, state) {
  const nextCount = (editingItem && editingItem.get('networkItems')) ? editingItem.get('networkItems').size : 0;
  const srcName = 'srcport';//_' + nextCount; 
  return Map({ no: nextCount, direction, protocol, address, [srcName]:srcport, dstport, state });
}

let EnhancedTableToolbar = props => {
  const { numSelected, classes, t } = props;

  return (
    <Toolbar style={{padding:0}}>
    
    <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
      <Grid item xs={12} sm={4} md={4}>
      
      {numSelected > 0 ? (
        <Typography color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="subtitle1" id="tableTitle">{t("lbSetupFirewall")}</Typography>
      )}
    
      
      
      </Grid>
      <Grid item xs={12} sm={8} md={8}>

        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={12} sm={6} md={6}>
      
            <FormControlLabel
                control={
                <Switch onChange={props.onGlobalNetworkChange('globalNetwork')} 
                    checked={(props.globalNetwork == 'accept')}
                    color="primary" />
                }
                label={(props.globalNetwork == 'accept') ? t("selEnableBasicNetwork") : t("selDisableBasicNetwork")}
            />

          </Grid>
          <Grid item xs={12} sm={6} md={6}>

            {numSelected > 0 ? (
              <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
                <Grid item xs={12} sm={4} md={4}>
                  <Tooltip title="Delete">
                    <IconButton aria-label="Delete" onClick={props.onDeleteClick} >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <Tooltip title="Up">
                    <IconButton aria-label="Up" onClick={props.onUpwardClick} >
                      <UpIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <Tooltip title="Down">
                    <IconButton aria-label="Down" onClick={props.onDownwardClick} >
                      <DownIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            ) : (
              <Tooltip title={t("ttAddItem")}>
                <IconButton aria-label={t("ttAddItem")} onClick={props.onAddClick} >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
      
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    </Toolbar>
  );
};


class SecurityRuleNetwork extends Component {

  handleAddClick = () => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    this.props.SecurityRuleActions.addNetworkItem(createNetworkItem(editingItem, 'input', 'tcp', '', '', '', 'accept'));
  }

  handleDeleteClick = () => {
    const { SecurityRuleProps } = this.props;
    const { t, i18n } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    const selected = (editingItem && editingItem.get('selected')) ? editingItem.get('selected').toJS() : [];

    if(selected.length > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("lbDeleteSecuItem"),
        confirmMsg: t("msgDeleteSecuItem", {selectCnt: selected.length}),
        handleConfirmResult: this.handleDeleteConfirmResult,
        confirmObject: selected
      });

    }
  }
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      this.props.SecurityRuleActions.deleteNetworkItem(paramObject);
    }
  };


  handleSelectRow = (event, id) => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;

    const selected = (editingItem && editingItem.get('selected')) ? editingItem.get('selected').toJS() : [];
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.props.SecurityRuleActions.setEditingItemValue({
      name: 'selected',
      value: newSelected
    });
  };

  handleValueChange = name => event => {
    const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 'accept' : 'drop') : event.target.value;
    this.props.SecurityRuleActions.setEditingItemValue({
        name: name,
        value: value
    });
  }

  changeNetworkOption = count => event => {
    this.props.SecurityRuleActions.setEditingNetworkValue({
      count: count,
      name: event.target.name,
      value: event.target.value
    });
  };

  handleSelectUpwardClick = () => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    const selected = (editingItem && editingItem.get('selected')) ? editingItem.get('selected') : List([]);

    this.props.SecurityRuleActions.chgSelectedNetworkItemUpward(selected.toJS());
  }

  handleSelectDownwardClick = () => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    const selected = (editingItem && editingItem.get('selected')) ? editingItem.get('selected') : List([]);

    this.props.SecurityRuleActions.chgSelectedNetworkItemDownward(selected.toJS());
  }

  handleUpwardClick = (event, id) => {
    this.props.SecurityRuleActions.chgNetworkItemUpward(id);
  }

  handleDownwardClick = (event, id) => {
    this.props.SecurityRuleActions.chgNetworkItemDownward(id);
  }

  isSelected = id => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;

    const selected = (editingItem && editingItem.get('selected')) ? editingItem.get('selected') : [];
    return selected.indexOf(id) !== -1;
  }

  render() {
    const { classes } = this.props;
    const { SecurityRuleProps } = this.props;
    const { t, i18n } = this.props;
    
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    const selected = (editingItem && editingItem.get('selected')) ? editingItem.get('selected').toJS() : [];
    const networkItems = editingItem.get('networkItems');

   
    return (
      <Paper style={{paddingBottom: 20}} elevation={0}>

      <EnhancedTableToolbar 
        numSelected={selected.length} 
        onAddClick={this.handleAddClick}
        onDeleteClick={this.handleDeleteClick}
        onUpwardClick={this.handleSelectUpwardClick}
        onDownwardClick={this.handleSelectDownwardClick}
        onGlobalNetworkChange={this.handleValueChange}
        globalNetwork={(editingItem) ? editingItem.get('globalNetwork') : 'drop'}
        t={t}
      />
      
      <div>
      <Table className={classes.table} aria-labelledby="tableTitle">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {columns.map(column => {
              return (
                <TableCell key={column.id}>{column.label}</TableCell>
              );
            }, this)}
            <TableCell>{t("lbNetworkMove")}</TableCell>
          </TableRow>
        </TableHead>
        {(networkItems) &&
        <TableBody>
          {networkItems.map(n => {
              const isSelected = this.isSelected(n.get('no'));
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={n.get('no')}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox"><Checkbox checked={isSelected} color="primary" onClick={event => this.handleSelectRow(event, n.get('no'))} /></TableCell>
                  <TableCell>
                    <FormControl className={classes.formControl}>
                      <Select
                        value={n.get('direction')}
                        name="direction"
                        onChange={this.changeNetworkOption(n.get('no'))}
                      >
                        <MenuItem value={'input'}>input</MenuItem>
                        <MenuItem value={'output'}>output</MenuItem>
                        <MenuItem value={'all'}>all</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl className={classes.formControl}>
                      <Select
                        value={n.get('protocol')}
                        name="protocol"
                        onChange={this.changeNetworkOption(n.get('no'))}
                      >
                        <MenuItem value={'tcp'}>tcp</MenuItem>
                        <MenuItem value={'udp'}>udp</MenuItem>
                        <MenuItem value={'icmp'}>icmp</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextValidator 
                      name='address'
                      validators={['matchRegexp:^[a-fA-F0-9./]*$']}
                      errorMessages={[t("msgValidFirewallAddress")]}
                      value={n.get('address')}
                      onChange={this.changeNetworkOption(n.get('no'))}
                    />
                  </TableCell>
                  <TableCell>
                    <TextValidator 
                      name='srcport'
                      validators={['matchRegexp:^[0-9,-]*$']}
                      errorMessages={[t("msgTypeNumberOnly")]}
                      value={n.get('srcport')}
                      onChange={this.changeNetworkOption(n.get('no'))}
                    />
                  </TableCell>
                  <TableCell>
                    <TextValidator 
                      name='dstport'
                      validators={['matchRegexp:^[0-9,-]*$']}
                      errorMessages={[t("msgTypeNumberOnly")]}
                      value={n.get('dstport')}
                      onChange={this.changeNetworkOption(n.get('no'))}
                    />
                  </TableCell>

                  <TableCell>
                  
                    <FormControl className={classes.formControl}>
                      <Select
                        value={n.get('state')}
                        name="state"
                        onChange={this.changeNetworkOption(n.get('no'))}
                      >
                        <MenuItem value={'accept'}>accept</MenuItem>
                        <MenuItem value={'drop'}>drop</MenuItem>
                      </Select>
                    </FormControl>
                  
                  </TableCell>

                  <TableCell className={classes.grSmallAndClickCell}>

                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleUpwardClick(event, n.get('no'))}>
                      <UpIcon />
                    </Button>

                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleDownwardClick(event, n.get('no'))}>
                      <DownIcon />
                    </Button>                        

                  </TableCell>

                </TableRow>
              );
            })}
        </TableBody>
        }
      </Table>
      </div>
      <GRConfirm />
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  SecurityRuleProps: state.SecurityRuleModule,
});

const mapDispatchToProps = (dispatch) => ({
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityRuleNetwork)));

