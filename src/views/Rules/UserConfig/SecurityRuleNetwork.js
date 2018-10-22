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

import CustomToolbar from "./CustomToolbar";
import CustomToolbarSelect from "./CustomToolbarSelect";

import { refreshDataListInComp, getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import SecurityRuleDialog from './SecurityRuleDialog';
import SecurityRuleSpec from './SecurityRuleSpec';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';

import Checkbox from "@material-ui/core/Checkbox";
import Input from '@material-ui/core/Input';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//

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
  return Map({ no: nextCount, direction, protocol, address, srcport, dstport, state });
}

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar style={{padding:0}}>
      <div style={{flex: '0 0 auto'}}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="subtitle1" id="tableTitle">
            방화벽 설정
          </Typography>
        )}
      </div>
      <div style={{flex: '1 1 100%'}} />
      <div >
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
          <Tooltip title="항목 추가">
            <IconButton aria-label="항목 추가" onClick={props.onAddClick} >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};


class SecurityRuleNetwork extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: 'chDirection', isOrder: false, numeric: false, disablePadding: true, label: 'DIRECTION' },
    { id: 'chConfName', isOrder: false, numeric: false, disablePadding: true, label: '내용' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  handleAddClick = () => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    this.props.SecurityRuleActions.addNetworkItem(createNetworkItem(editingItem, 'INPUT', 'TCP', '', '', '', 'ACCEPT'));
  }

  handleDeleteClick = () => {
    const { SecurityRuleProps } = this.props;
    const editingItem = (SecurityRuleProps.get('editingItem')) ? SecurityRuleProps.get('editingItem') : null;
    const selected = (editingItem && editingItem.get('selected')) ? editingItem.get('selected').toJS() : [];

    if(selected.length > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: '삭제',
        confirmMsg: '선택한 항목(' + selected.length + '개)을 삭제하시겠습니까?',
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


  handleRowClick = (event, id) => {
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
            <TableCell>ORDER</TableCell>
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
                  <TableCell padding="checkbox"><Checkbox checked={isSelected} onClick={event => this.handleRowClick(event, n.get('no'))} /></TableCell>
                  <TableCell>
                    <FormControl className={classes.formControl}>
                      <Select
                        value={n.get('direction')}
                        name="direction"
                        onChange={this.changeNetworkOption(n.get('no'))}
                      >
                        <MenuItem value={'INPUT'}>INPUT</MenuItem>
                        <MenuItem value={'OUTPUT'}>OUTPUT</MenuItem>
                        <MenuItem value={'ALL'}>ALL</MenuItem>
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
                        <MenuItem value={'TCP'}>TCP</MenuItem>
                        <MenuItem value={'UDP'}>UDP</MenuItem>
                        <MenuItem value={'ICMP'}>ICMP</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>

                    <Input style={{padding: 0}}
                      value={n.get('address')}
                      name="address"
                      variant='outlined'
                      onChange={this.changeNetworkOption(n.get('no'))}
                    />                  
                  
                  </TableCell>
                  <TableCell>

                    <Input style={{padding: 0}}
                      value={n.get('srcport')}
                      name="srcport"
                      variant='outlined'
                      onChange={this.changeNetworkOption(n.get('no'))}
                    />                  
                  
                  </TableCell>
                  <TableCell>

                    <Input style={{padding: 0}}
                      value={n.get('dstport')}
                      name="dstport"
                      variant='outlined'
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
                        <MenuItem value={'ACCEPT'}>ACCEPT</MenuItem>
                        <MenuItem value={'DROP'}>DROP</MenuItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityRuleNetwork));

