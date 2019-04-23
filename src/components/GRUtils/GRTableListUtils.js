import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DefaultIcon from '@material-ui/icons/Language';
import DeptIcon from '@material-ui/icons/BusinessCenter';
import UserIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/LaptopChromebook';

import StarsIcon from '@material-ui/icons/Stars';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';

export const refreshDataListInComps = (propObj, callBack, extParam, extOption) => {
    const viewItems = propObj.get('viewItems');
    if(viewItems) {
        viewItems.forEach((element, compId) => {
            if(element && element.get('listParam')) {
                callBack(propObj, compId, extParam, extOption);
            }
        });
    }
}

export const getRowObjectById = (propObj, compId, id, keyId) => {
    if(propObj.getIn(['viewItems', compId, 'listData'])) {
        const viewItem = propObj.getIn(['viewItems', compId, 'listData']).find((element) => {
            return element.get(keyId) == id;
        });
        return (viewItem) ? fromJS(viewItem.toJS()) : null;
    } 
    return null;
}

export const getRowObjectByIdInCustomList = (propObj, compId, id, keyId, listName) => {
    if(propObj.getIn(['viewItems', compId, listName])) {
        const viewItem = propObj.getIn(['viewItems', compId, listName]).find((element) => {
            return element.get(keyId) == id;
        });
        return (viewItem) ? fromJS(viewItem.toJS()) : null;
    } 
    return null;
}


export const getDataObjectVariableInComp = (propObj, compId, name) => {
    if(propObj.getIn(['viewItems', compId, name])) {
        return propObj.getIn(['viewItems', compId, name]);
    } else {
        return null;
    }    
}

export const setCheckedIdsInComp = (propObj, compId, id) => {
    const checkedIds = propObj.getIn(['viewItems', compId, 'checkedIds']);
    if(checkedIds) {
        const indexNo = checkedIds.indexOf(id);
        if(indexNo > -1) {
            return checkedIds.delete(indexNo);
        } else {
            return checkedIds.push(id);
        }
    } else {
        return List([id]);
    }
}

export const getDataPropertyInCompByParam = (propObj, compId, idName, checked, exceptRevoke=false) => {
    if(checked) {
        const listData = propObj.getIn(['viewItems', compId, 'listData']);
        if(exceptRevoke) {
            let temp = listData.filter((data) => {
                return data.get('clientStatus') !== "STAT021";
            });
            return (temp) ? temp.map((e) => (e.get(idName))) : List([]);
        } else {
            return (listData) ? listData.map((e) => (e.get(idName))) : List([]);
        }
    } else {
        return List([]);
    }
}

export const getSelectedObjectInComp = (propObj, compId, targetType) => {
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    return propObj.getIn(List(targetNames).push('viewItem'));
}

export const getValueInSelectedObjectInComp = (propObj, compId, targetType, name) => {
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    if(targetType != propObj.getIn(List(targetNames).push('ruleGrade'))) {
        return '';
    } else {
        return propObj.getIn(List(targetNames).push('viewItem', name));    
    }
}

export const getSelectedObjectInCompAndId = (propObj, compId, idName, targetType) => {
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];

    const listAllData = propObj.getIn(List(targetNames).push('listAllData'));
    const selectedOptionItemId = propObj.getIn(List(targetNames).push('selectedOptionItemId'));

    if(listAllData && selectedOptionItemId) {
        const item = listAllData.find((e) => {
            return e.get(idName) == selectedOptionItemId;
        }) 
        if(item) {
            return fromJS(item.toJS());
        }
    }
    return null;
}

export const getRoleTitleClassName = (targetType, isDefault, isDeptRole) => {

    if(isDefault) {
        return 'compTitleForBasic';
    } else {
        if(targetType == 'GROUP') {
            return 'compTitle';
        } else if(targetType == 'USER') {
            if(isDeptRole) {
                return 'compTitle';
            }
            return 'compTitleForUserRole';
        } else if(targetType == 'DEPT') {
            return 'compTitle';
        } else {
            return 'compTitleForBasic';
        }
    }
}

export const getAvatarForRule = (targetType, isDefault, isDeptRole, isUserRole, isGroupRole) => {

    if(isDefault) {
        return <Avatar aria-label="Recipe" style={{ backgroundColor: red[400] }}><DefaultIcon /></Avatar>;
    } else if(isDeptRole) {
        return <Avatar aria-label="Recipe" style={{ backgroundColor: blue[400] }}><DeptIcon /></Avatar>;
    } else if(isUserRole) {
        return <Avatar aria-label="Recipe" style={{ backgroundColor: orange[400] }}><UserIcon /></Avatar>;
    } else if(isGroupRole) {
        return <Avatar aria-label="Recipe" style={{ backgroundColor: green[400] }}><GroupIcon /></Avatar>;
    } else {
        if(targetType) {
            if(targetType == 'USER') {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: orange[400] }}><UserIcon /></Avatar>;
            } else if(targetType == 'DEPT') {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: blue[400] }}><DeptIcon /></Avatar>;
            } else if(targetType == 'GROUP') {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: green[400] }}><GroupIcon /></Avatar>;
            } else {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: red[400] }}><DefaultIcon /></Avatar>;
            }
        } else {
            return <Avatar aria-label="Recipe" style={{ backgroundColor: red[400] }}><DefaultIcon /></Avatar>;
        }
    }
}

export const getAvatarForRuleGrade = (targetType, ruleGrade) => {

    if(targetType == "DESKTOP_APP") {
        return <Avatar aria-label="Recipe" style={{ backgroundColor: red[100] }}><StarsIcon /></Avatar>;
    } else {
        if(ruleGrade) {
            if(ruleGrade == 'DEFAULT') {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: red[400] }}><DefaultIcon /></Avatar>;
            } else if(ruleGrade == 'DEPT') {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: blue[400] }}><DeptIcon /></Avatar>;
            } else if(ruleGrade == 'USER') {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: orange[400] }}><UserIcon /></Avatar>;
            } else if(ruleGrade == 'GROUP') {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: green[400] }}><GroupIcon /></Avatar>;
            } else {
                return <Avatar aria-label="Recipe" style={{ backgroundColor: red[100] }}><DefaultIcon /></Avatar>;
            }
        } else {
            return <Avatar aria-label="Recipe" style={{ backgroundColor: red[100] }}><DefaultIcon /></Avatar>;
        }
    }
}

export const getAvatarExplainForUser = (t) => {
    return <Paper style={{padding: '6 20 6 20', marginBottom:10}}>
        <Table>
            <TableBody>
                <TableRow>
                <TableCell ></TableCell>
                <TableCell style={{width:20,textAlign:'center',border:0}}><Avatar style={{ backgroundColor: red[400], width:16, height:16 }}><DefaultIcon style={{ fontSize: 12 }}/></Avatar></TableCell>
                <TableCell style={{width:120,textAlign:'left',border:0}}><Typography variant="overline" gutterBottom style={{marginTop:2,marginBottom:0}}>{t("lbDefaultRule")}</Typography></TableCell>
                <TableCell style={{width:20,textAlign:'center',border:0}}><Avatar style={{ backgroundColor: blue[400], width:16, height:16 }}><DeptIcon style={{ fontSize: 12 }}/></Avatar></TableCell>
                <TableCell style={{width:120,textAlign:'left',border:0}}><Typography variant="overline" gutterBottom style={{marginTop:2,marginBottom:0}}>{t("lbDeptRule")}</Typography></TableCell>
                <TableCell style={{width:20,textAlign:'center',border:0}}><Avatar style={{ backgroundColor: orange[400], width:16, height:16 }}><UserIcon style={{ fontSize: 12 }}/></Avatar></TableCell>
                <TableCell style={{width:120,textAlign:'left',border:0}}><Typography variant="overline" gutterBottom style={{marginTop:2,marginBottom:0}}>{t("lbUserRule")}</Typography></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Paper>;
}

export const getAvatarExplainForGroup = (t) => {
    return <Paper style={{padding: '6 20 6 20', marginBottom:10}}>
        <Table>
            <TableBody>
                <TableRow>
                <TableCell ></TableCell>
                <TableCell style={{width:20,textAlign:'center',border:0}}><Avatar style={{ backgroundColor: red[400], width:16, height:16 }}><DefaultIcon style={{ fontSize: 12 }}/></Avatar></TableCell>
                <TableCell style={{width:120,textAlign:'left',border:0}}><Typography variant="overline" gutterBottom style={{marginTop:2,marginBottom:0}}>{t("lbDefaultRule")}</Typography></TableCell>
                <TableCell style={{width:20,textAlign:'center',border:0}}><Avatar style={{ backgroundColor: green[400], width:16, height:16 }}><GroupIcon style={{ fontSize: 12 }}/></Avatar></TableCell>
                <TableCell style={{width:150,textAlign:'left',border:0}}><Typography variant="overline" gutterBottom style={{marginTop:2,marginBottom:0}}>{t("lbClientGroupRule")}</Typography></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Paper>;
}

