import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import { arrayContainsArray } from 'components/GRUtils/GRCommonUtils';

class GRCommonTableHead extends Component {

  createSortHandler = (columnId, orderDir) => event => {
    this.props.onRequestSort(event, columnId, orderDir);
  };

  render() {
    const { classes, columnData, keyId } = this.props;
    const { 
      onClickAllCheck,
      orderDir,
      orderColumn,
      checkedIds,
      listData
    } = this.props;

    let checkSelection = 0;
    if(listData && listData.size > 0 && checkedIds && checkedIds.size > 0) {
      checkSelection = arrayContainsArray(checkedIds.toJS(), listData.map(x => x.get(keyId)));
    }
    
    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {

            if(column.isCheckbox) {
              return (
                <TableCell padding="checkbox" 
                  className={classes.grSmallAndHeaderCell} 
                  key={column.id}
                >
                  <Checkbox color="primary"
                    indeterminate={checkSelection === 50}
                    checked={checkSelection === 100}
                    onChange={onClickAllCheck}
                  />
                </TableCell>
              );
            } else {
              return (
                <TableCell
                  className={classes.grSmallAndHeaderCell}
                  key={column.id}
                  sortDirection={orderColumn === column.id ? orderDir : false}
                >
                {(() => {
                  if(column.isOrder) {
                    return <TableSortLabel active={orderColumn === column.id}
                              direction={orderDir}
                              onClick={this.createSortHandler(column.id, orderDir)}
                            >{column.label}</TableSortLabel>
                  } else {
                    return <p>{column.label}</p>
                  }
                })()}
                </TableCell>
              );
            }
            
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

export default (GRCommonTableHead);
