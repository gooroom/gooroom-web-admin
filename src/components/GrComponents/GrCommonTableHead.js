import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import { arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

class GrCommonTableHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  // static columnData = [
  //   { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: "그룹이름" },
  //   { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "단말수" },
  // ];

  render() {
    const { classes, columnData } = this.props;
    const { 
      onSelectAllClick,
      orderDir,
      orderColumn,
      selectedData,
      listData
    } = this.props;

    let checkSelection = 0;
    if(listData && listData.length > 0 && selectedData) {
      checkSelection = arrayContainsArray(selectedData, listData.map(x => x.grpId));
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
                  <Checkbox
                    indeterminate={checkSelection === 50}
                    checked={checkSelection === 100}
                    onChange={onSelectAllClick}
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
                              onClick={this.createSortHandler(column.id)}
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

export default (GrCommonTableHead);
