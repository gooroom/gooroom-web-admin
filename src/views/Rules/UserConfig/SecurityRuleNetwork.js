import React, { Component, useState } from 'react';
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

import Popover from '@material-ui/core/Popover';
import ListItem from '@material-ui/core/ListItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';

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

function createBasicNetworkItem(editingItem, type, direction, protocol, address, srcport, dstport, state) {
  const nextCount = (editingItem && editingItem.get('networkItems')) ? editingItem.get('networkItems').size : 0;
  return Map({ no: nextCount, type, direction, protocol, address, srcport, dstport, state });
}

function createAdvNetworkItem(editingItem, type, command) {
  const nextCount = (editingItem && editingItem.get('networkItems')) ? editingItem.get('networkItems').size : 0;
  return Map({ no: nextCount, type, command });
}

let EnhancedTableToolbar = props => {
  const { numSelected, classes, t } = props;

  const [ addItemPopOver, setAddItemPopOver ] = useState(null);
  const open = Boolean(addItemPopOver);
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
              <Grid>
                <Tooltip title={t("ttAddItem")}>
                  <IconButton aria-label={t("ttAddItem")} onClick={(e) => setAddItemPopOver(e.currentTarget)} >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Popover
                  open={open}
                  anchorEl={addItemPopOver}
                  onClose={(e) => setAddItemPopOver(null)}
                  anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                  }}
                  transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                  }}
                  >
                    <ListItem>
                      <Button onClick={props.onAddClick('basic')}>메뉴 형태 추가하기</Button>
                    </ListItem>
                    <ListItem>
                      <Button onClick={props.onAddClick('advanced')}>입력창 형태 추가하기</Button>
                    </ListItem>
                </Popover>
              </Grid>
            )}
      
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    </Toolbar>
  );
};


class SecurityRuleNetwork extends Component {

  handleAddClick = type => event => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    if(type === 'basic') {
      this.props.SecurityRuleActions.addNetworkItem(createBasicNetworkItem(editingItem, type, 'input', 'tcp', '', '', '', 'accept'));
    } else { // advanced
      this.props.SecurityRuleActions.addNetworkItem(createAdvNetworkItem(editingItem, type, ''));
    }
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
        {(networkItems) &&
        <TableBody>
        {networkItems.map(n => {
          const isSelected = this.isSelected(n.get('no'));
          return (
            n.get('type') === 'basic' ?
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
                <FormControl>
                  <InputLabel shrink htmlFor="age-native-label-placeholder">
                    DIRECTION
                  </InputLabel>
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
                  <InputLabel shrink htmlFor="age-native-label-placeholder">
                    PROTOCOL
                  </InputLabel>
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
                  label="ADDRESS"
                  name='address'
                  validators={['matchRegexp:^[a-fA-F0-9.:/]*$']}
                  errorMessages={[t("msgValidFirewallAddress")]}
                  value={n.get('address')}
                  onChange={this.changeNetworkOption(n.get('no'))}
                />
              </TableCell>
              <TableCell>
                <TextValidator 
                  label="SRC PORT"
                  name='srcport'
                  validators={['matchRegexp:^[0-9,-]*$']}
                  errorMessages={[t("msgTypeNumberOnly")]}
                  value={n.get('srcport')}
                  onChange={this.changeNetworkOption(n.get('no'))}
                />
              </TableCell>
              <TableCell>
                <TextValidator 
                  label="DEST PORT"
                  name='dstport'
                  validators={['matchRegexp:^[0-9,-]*$']}
                  errorMessages={[t("msgTypeNumberOnly")]}
                  value={n.get('dstport')}
                  onChange={this.changeNetworkOption(n.get('no'))}
                />
              </TableCell>

              <TableCell>
                <FormControl className={classes.formControl}>
                  <InputLabel shrink htmlFor="age-native-label-placeholder">
                    STATE
                  </InputLabel>
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
            : <TableRow
                hover
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
                key={n.get('no')}
                selected={isSelected}
              >
              <TableCell padding="checkbox"><Checkbox checked={isSelected} color="primary" onClick={event => this.handleSelectRow(event, n.get('no'))} /></TableCell>
              <TableCell colSpan={6} align="left" className={classes.fullWidth}>
                <TextValidator 
                  label="COMMAND"
                  name='command'
                  validators={['matchRegexp:^[a-zA-Z0-9.:/-\\s]*$']}
                  errorMessages={[t("msgValidIptablesCmd")]}
                  value={n.get('command')}
                  onChange={this.changeNetworkOption(n.get('no'))}
                  className={classes.fullWidth}
                />
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

