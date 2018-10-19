import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import Avatar from '@material-ui/core/Avatar';
import DefaultIcon from '@material-ui/icons/Language';
import DeptIcon from '@material-ui/icons/BusinessCenter';
import UserIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/LaptopChromebook';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';

export const refreshDataListInComp = (propObj, callBack) => {
    const viewItems = propObj.get('viewItems');
    if(viewItems) {
        viewItems.forEach((element, compId) => {
            if(element && element.get('listParam')) {
                callBack(propObj, compId, {});
            }
        });
    }
}

export const getRowObjectById = (propObj, compId, id, keyId) => {
    if(propObj.getIn(['viewItems', compId, 'listData'])) {
        const selectedViewItem = propObj.getIn(['viewItems', compId, 'listData']).find((element) => {
            return element.get(keyId) == id;
        });
        return (selectedViewItem) ? fromJS(selectedViewItem.toJS()) : null;
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

export const setSelectedIdsInComp = (propObj, compId, id) => {
    const selectedIds = propObj.getIn(['viewItems', compId, 'selectedIds']);
    if(selectedIds) {
        const indexNo = selectedIds.indexOf(id);
        if(indexNo > -1) {
            return selectedIds.delete(indexNo);
        } else {
            return selectedIds.push(id);
        }
    } else {
        return List([id]);
    }
}

export const setAllSelectedIdsInComp = (propObj, compId, idName, checked) => {
    if(checked) {
        const listData = propObj.getIn(['viewItems', compId, 'listData']);
        return (listData) ? listData.map((e) => (e.get(idName))) : List([]);
    } else {
        return List([]);
    }
}

export const getSelectedObjectInComp = (propObj, compId, targetType) => {
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    
    return propObj.getIn(List(targetNames).push('selectedViewItem'));
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
        if(targetType == 'USER') {
            return <Avatar aria-label="Recipe" style={{ backgroundColor: orange[400] }}><UserIcon /></Avatar>;
        } else if(targetType == 'DEPT') {
            return <Avatar aria-label="Recipe" style={{ backgroundColor: blue[400] }}><DeptIcon /></Avatar>;
        } else if(targetType == 'GROUP') {
            return <Avatar aria-label="Recipe" style={{ backgroundColor: green[400] }}><GroupIcon /></Avatar>;
        } else {
            return <Avatar aria-label="Recipe" style={{ backgroundColor: red[400] }}><DefaultIcon /></Avatar>;
        }
    }
}
