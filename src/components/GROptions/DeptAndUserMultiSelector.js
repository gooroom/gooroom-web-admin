import React, { Component } from "react";
import { Map, List as GRIMTList } from 'immutable';

import { AutoSizer, Column, Table } from 'react-virtualized';
import clsx from 'clsx';
import TableCell from '@material-ui/core/TableCell';

import GRExtendedTreeList from "components/GRTree/GRExtendedTreeList";

import UserListForSelectByDept from 'views/User/UserListForSelectByDept';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

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
        const { columns, classes, rowHeight, onRowClick, onHandleClickInherit, onHandleClickDelete } = this.props;

        if (param.dataKey === 'isInheritCheck') {
            return (
                <TableCell component="div" variant="body"
                    className={clsx(classes.tableCell, classes.flexContainer)}
                    style={{ height: rowHeight }}>
                    <Checkbox color="primary"
                        onChange={event => { onHandleClickInherit(event, param.rowData.value); }}
                        checked={(param.rowData.isCheck) ? param.rowData.isCheck : false}
                        disabled={false}
                    />
                </TableCell>
            );
        } else if (param.dataKey === 'deleteBtn') {
            return (
                <TableCell component="div" variant="body"
                    className={clsx(classes.tableCell, classes.flexContainer)}
                    style={{ height: rowHeight }}>
                    <Button size="small" color="primary" className={classes.buttonInTableRow}
                        onClick={() => onHandleClickDelete(param.rowData.value)}>
                        <DeleteIcon />
                    </Button>
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
        const { classes, columns, onHandleClickInherit, onHandleClickDelete, ...tableProps } = this.props;
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


class DeptAndUserMultiSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDeptCd: 0
        };
    }

    handleDeptNodeCheck = (param) => {
        const { selectedDept, onSelectDept } = this.props;
        let newInfoList = [];
        if (param.isChecked) {
            // add
            newInfoList = selectedDept.push(Map({ name: param.name, value: param.value }));
        } else {
            // delete
            newInfoList = selectedDept.filter(n => (n.get('value') != param.value));
        }
        onSelectDept(GRIMTList(newInfoList));
    }

    handleDeptNodeSelect = (param) => {
        this.setState({
            selectedDeptCd: param.value
        });
    }

    handleCheckDeptForInherit = (event, item) => {
        const { selectedDept, onSelectDept } = this.props;
        const index = selectedDept.findIndex(n => (n.get('value') === item));
        const newInfoList = selectedDept.setIn([index, 'isCheck'], event.target.checked);
        onSelectDept(GRIMTList(newInfoList));
    }

    handleDeptDeleteItem = (param) => {
        const { selectedDept, onSelectDept } = this.props;
        // delete
        const newInfoList = selectedDept.filter(n => (n.get('value') != param));
        onSelectDept(GRIMTList(newInfoList));
    }

    handleUserCheck = (isChecked, param) => {
        const { selectedUser, onSelectUser } = this.props;
        let newInfoList = [];
        if (isChecked) {
            // add
            newInfoList = selectedUser.push(Map({ name: param.userNm, value: param.userId }));
        } else {
            // delete
            newInfoList = selectedUser.filter(n => (n.get('value') != param.userId));
        }
        onSelectUser(GRIMTList(newInfoList));
    }

    handleUserMultiCheck = (isChecked, params) => {
        const { selectedUser, onSelectUser } = this.props;
        let newInfoList = [];
        if (isChecked) {
            // add
            newInfoList = selectedUser;
            params.forEach(n => {
                newInfoList = newInfoList.push(Map({ name: n.userNm, value: n.userId }));
            });
        } else {
            // delete
            newInfoList = selectedUser;
            params.forEach(n => {
                newInfoList = newInfoList.push(Map({ name: n.userNm, value: n.userId }));
                newInfoList = newInfoList.filter(e => (e.get('value') != n.userId));
            });
        }
        onSelectUser(GRIMTList(newInfoList));
    }

    handleUserDeleteItem = (param) => {
        const { selectedUser, onSelectUser } = this.props;
        // delete
        const newInfoList = selectedUser.filter(n => (n.get('value') != param));
        onSelectUser(GRIMTList(newInfoList));
    }

    render() {
        const { classes, compId } = this.props;
        const { title, selectedDept, isCheckMasterOnly, selectedUser } = this.props;
        const VirtualizedTable = withStyles(subStyles)(MuiVirtualizedTable);

        return (

            <Card >
                {title && <CardHeader style={{ padding: 3, backgroundColor: '#a1b1b9' }} titleTypographyProps={{ variant: 'body2', style: { fontWeight: 'bold' } }} title={title}></CardHeader>}
                <CardContent >

                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{ padding: 0, height: 200, overflowY: 'scroll', marginBottom: 0, border: '1px solid lightgray' }}>
                            <GRExtendedTreeList
                                compId={compId}
                                useFolderIcons={true}
                                listHeight='24px'
                                url='readChildrenDeptList'
                                paramKeyName='deptCd'
                                rootKeyValue='0'
                                keyName='key'
                                title='title'
                                startingDepth='1'
                                hasSelectChild={false}
                                hasSelectParent={false}
                                isShowCheck={true}
                                isCheckMasterOnly={isCheckMasterOnly}
                                isEnableEdit={false}
                                onCheckedNode={(param) => { this.handleDeptNodeCheck(param); }}
                                onSelectNode={(param) => { this.handleDeptNodeSelect(param); }}
                                checkedNodes={selectedDept}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ padding: 0, height: 200, marginBottom: 0, border: '1px solid lightgray' }}>
                            <div style={{ padding: 0, height: '100%', width: '100%' }}>
                                <VirtualizedTable
                                    rowCount={(selectedDept) ? (selectedDept.size) : 0}
                                    rowGetter={({ index }) => (selectedDept.get(index).toJS())}
                                    rowHeight={32}
                                    headerHeight={32}
                                    onHandleClickInherit={this.handleCheckDeptForInherit}
                                    onHandleClickDelete={this.handleDeptDeleteItem}
                                    columns={[
                                        { width: 160, label: '이름', dataKey: 'name' },
                                        { width: 120, label: '아이디', dataKey: 'value' },
                                        { width: 120, label: '상속여부', dataKey: 'isInheritCheck' },
                                        { width: 120, label: '삭제', dataKey: 'deleteBtn' },
                                    ]}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: 10, height: 310, overflowY: 'scroll', marginBottom: 10, border: '1px solid lightgray' }}>
                            <UserListForSelectByDept
                                deptCd={this.state.selectedDeptCd}
                                checkedUser={selectedUser}
                                onSelectUser={this.handleUserCheck}
                                onCheckMultiUser={this.handleUserMultiCheck}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ padding: 0, height: 310, marginBottom: 0, border: '1px solid lightgray' }}>
                            <div style={{ padding: 0, height: '100%', width: '100%' }}>
                                <VirtualizedTable
                                rowCount={(selectedUser) ? (selectedUser.size) : 0}
                                rowGetter={({ index }) => (selectedUser.get(index).toJS())}
                                rowHeight={32}
                                headerHeight={32}
                                onHandleClickDelete={this.handleUserDeleteItem}
                                columns={[
                                    { width: 160, label: '이름', dataKey: 'name' },
                                    { width: 160, label: '아이디', dataKey: 'value' },
                                    { width: 120, label: '삭제', dataKey: 'deleteBtn' },
                                ]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

export default translate("translations")(withStyles(GRCommonStyle)(DeptAndUserMultiSelector));
