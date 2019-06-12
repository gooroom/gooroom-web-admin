import React, { Component } from 'react';
import { Map, List as GRIMTList } from 'immutable';

import { AutoSizer, Column, Table } from 'react-virtualized';
import clsx from 'clsx';

import TableCell from '@material-ui/core/TableCell';

import GRExtendedTreeList from 'components/GRTree/GRExtendedTreeList';

import ClientListForSelectByGroup from 'views/Client/ClientListForSelectByGroup';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from 'react-i18next';


const subStyles = theme => ({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    tableRow: {
      cursor: 'pointer',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
    },
  });
class MuiVirtualizedTable extends React.PureComponent {
    static defaultProps = {
      headerHeight: 48,
      rowHeight: 48,
    };
  
    getRowClassName = ({ index }) => {
      const { classes, onRowClick } = this.props;
  
      return clsx(classes.tableRow, classes.flexContainer, {
        [classes.tableRowHover]: index !== -1 && onRowClick != null,
      });
    };
  
    cellRenderer = ({ ...param }) => {

        
      const { columns, classes, rowHeight, onRowClick, onHandleClickInherit } = this.props;
      
      console.log('onHandleClickInherit :::: ', onHandleClickInherit);

      if(param.dataKey === 'isInheritCheck') {
        return (
            <TableCell
              component="div"
              className={clsx(classes.tableCell, classes.flexContainer, {
                [classes.noClick]: onRowClick == null,
              })}
              variant="body"
              style={{ height: rowHeight }}
              align={(param.columnIndex != null && columns[param.columnIndex].numeric) || false ? 'right' : 'left'}
            >

                <Checkbox color="primary"
                    onChange={event => {onHandleClickInherit(event, param.rowData.value);}}
                    //checked={(n.get('isCheck')) ? n.get('isCheck') : false}
                    disabled={false}
                />
            </TableCell>
          );
          
      } else {
        return (
            <TableCell
              component="div"
              className={clsx(classes.tableCell, classes.flexContainer, {
                [classes.noClick]: onRowClick == null,
              })}
              variant="body"
              style={{ height: rowHeight }}
              align={(param.columnIndex != null && columns[param.columnIndex].numeric) || false ? 'right' : 'left'}
            >
              {param.cellData}
            </TableCell>
          );
      }
    };
  
    headerRenderer = ({ label, columnIndex }) => {
      const { headerHeight, columns, classes } = this.props;
  
      return (
        <TableCell
          component="div"
          className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
          variant="head"
          style={{ height: headerHeight }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        >
          <span>{label}</span>
        </TableCell>
      );
    };
  
    render() {
      const { classes, columns, onHandleClickInherit, ...tableProps } = this.props;
      //console.log('tableProps ::: ', tableProps);
      return (
        <AutoSizer>
          {({ height, width }) => (
            <Table height={height} width={width} {...tableProps} rowClassName={this.getRowClassName}>
              {columns.map(({ dataKey, ...other }, index) => {
                // console.log('dataKey ::: ', dataKey);
                // console.log('other ::: ', other);
                // console.log('index ::: ', index);
                return (
                  <Column
                    key={dataKey}
                    headerRenderer={headerProps =>
                      this.headerRenderer({
                        ...headerProps,
                        columnIndex: index,
                      })
                    }
                    className={classes.flexContainer}
                    cellRenderer={this.cellRenderer}
                    dataKey={dataKey}
                    {...other}
                  />
                );
              })}
            </Table>
          )}
        </AutoSizer>
      );
    }
  }
  



class GroupAndClientMultiSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
          selectedGroupId: 0
        };
    }

    handleGroupNodeCheck = (param) => {
        const { selectedGroup, onSelectGroup } = this.props;
        let newInfoList = [];
        if(param.isChecked) {
            // add
            newInfoList = selectedGroup.push(Map({name: param.name, value: param.value}));
        } else {
            // delete
            newInfoList = selectedGroup.filter(n => (n.get('value') != param.value));
        }
        onSelectGroup(GRIMTList(newInfoList));
    }

    handleGroupNodeSelect = (param) => {
        this.setState({
            selectedGroupId: param.value
        });
    }

    handleCheckGroupForInherit = (event, item) => {
        const { selectedGroup, onSelectGroup } = this.props;
        const index = selectedGroup.findIndex(n => (n.get('value') === item));
        const newInfoList = selectedGroup.setIn([index, 'isCheck'], event.target.checked);
        onSelectGroup(GRIMTList(newInfoList));
    }

    handleGroupDeleteItem = (param) => {
        const { selectedGroup, onSelectGroup } = this.props;
        // delete
        const newInfoList = selectedGroup.filter(n => (n.get('value') != param));
        onSelectGroup(GRIMTList(newInfoList));
    }

    handleClientCheck = (isChecked, param) => {
        const { selectedClient, onSelectClient } = this.props;
        let newInfoList = [];
        if(isChecked) {
            // add
            newInfoList = selectedClient.push(Map({name: param.clientNm, value: param.clientId}));
        } else {
            // delete
            newInfoList = selectedClient.filter(n => (n.get('value') != param.clientId));
        }
        onSelectClient(GRIMTList(newInfoList));
    }

    handleClientDeleteItem = (param) => {
        const { selectedClient, onSelectClient } = this.props;
        // delete
        const newInfoList = selectedClient.filter(n => (n.get('value') != param));
        onSelectClient(GRIMTList(newInfoList));
    }





    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;
    
        return clsx(classes.tableRow, classes.flexContainer, {
          [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
      };

    render() {
        const { classes, compId } = this.props;
        const { title, selectedGroup, isCheckMasterOnly, selectedClient } = this.props;
        const { t, i18n } = this.props;

        const VirtualizedTable = withStyles(subStyles)(MuiVirtualizedTable);
        const sample = [
            ['Frozen yoghurt', 159, 6.0, 24, 4.0],
            ['Ice cream sandwich', 237, 9.0, 37, 4.3],
            ['Eclair', 262, 16.0, 24, 6.0],
            ['Cupcake', 305, 3.7, 67, 4.3],
            ['Gingerbread', 356, 16.0, 49, 3.9],
          ];
          
          function createData(id, dessert, calories, fat, carbs, protein) {
            return { id, dessert, calories, fat, carbs, protein };
          }
          
        const rows = (selectedGroup) ? (selectedGroup.toJS()) : [];
          
        return (

                    <Card >
                    	{title && <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={title}></CardHeader>}
                        <CardContent >

                            <Grid container spacing={0}>
                                <Grid item xs={6} style={{padding:0,height:200,overflowY:'scroll',marginBottom:0,border:'1px solid lightgray'}}>
                                    <GRExtendedTreeList
                                        compId={compId}
                                        useFolderIcons={true}
                                        listHeight='24px'
                                        url='readChildrenClientGroupList'
                                        paramKeyName='grpId'
                                        rootKeyValue='0'
                                        keyName='key'
                                        title='title'
                                        startingDepth='1'
                                        hasSelectChild={false}
                                        hasSelectParent={false}
                                        isShowCheck={true}
                                        isCheckMasterOnly={isCheckMasterOnly}
                                        isEnableEdit={false}
                                        onCheckedNode={(param) => {this.handleGroupNodeCheck(param);}}
                                        onSelectNode={(param) => {this.handleGroupNodeSelect(param);}}
                                        checkedNodes={selectedGroup}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{padding:0,height:200,marginBottom:0,border:'1px solid lightgray'}}>
                                    <Typography variant="subtitle2">선택된 항목</Typography>
                                    <div style={{padding:0,height: 400,width: '100%'}}>
                                        <VirtualizedTable
                                            rowCount={(selectedGroup) ? (selectedGroup.size) : 0}
                                            rowGetter={({ index }) => (rows[index])}
                                            rowHeight={32}
                                            headerHeight={32}
                                            onHandleClickInherit={this.handleCheckGroupForInherit}
                                            columns={[
                                                { width: 160, label: '이름', dataKey: 'name' },
                                                { width: 120, label: '아이디', dataKey: 'value' },
                                                { width: 120, label: '상속여부', dataKey: 'isInheritCheck' },
                                            ]}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6} style={{paddingTop:10,height:310,overflowY:'scroll',marginBottom:10,border:'1px solid lightgray'}}>
                                    <ClientListForSelectByGroup 
                                        groupId={this.state.selectedGroupId}
                                        checkedClient={selectedClient} 
                                        onCheckClient={this.handleClientCheck}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{padding:0,height:310,marginBottom:0,border:'1px solid lightgray'}}>
                                    <Typography variant="subtitle2">선택된 항목</Typography>
                                    <div style={{padding:0,overflowY:'auto'}}>
                                        <List >
                                        {selectedClient && selectedClient.map((n) => (
                                            <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                                <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                                <ListItemText primary={n.get('name')} />
                                                <ListItemSecondaryAction>
                                                    <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                                                        onClick={event => this.handleClientDeleteItem(n.get('value'))}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                        </List>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
        );
    }
}

export default translate("translations")(withStyles(GRCommonStyle)(GroupAndClientMultiSelector));
