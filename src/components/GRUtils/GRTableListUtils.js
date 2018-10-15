
import { Map, List, fromJS } from 'immutable';


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
