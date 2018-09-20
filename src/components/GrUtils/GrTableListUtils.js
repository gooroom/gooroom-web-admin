
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

export const getSelectedObjectInComp = (propObj, compId) => {
    
     return propObj.getIn(['viewItems', compId, 'selectedViewItem']);

    // if(propObj.get('viewItems')) {
    //     const viewItem = propObj.get('viewItems').find((element) => {
    //         return element.get('_COMPID_') == compId;
    //     });
    //     return (viewItem) ? viewItem.get('selectedViewItem') : null;
    // }
    // return null;
}

export const getSelectedObjectInCompAndId = (propObj, compId, idName) => {
    const listAllData = propObj.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = propObj.getIn(['viewItems', compId, 'selectedOptionItemId']);

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





export const getDataObjectInComp = (propObj, compId) => {
    if(propObj.get('viewItems')) {
        const viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        if(viewItem) {
            return viewItem;
        }
    }
    return Map({listParam: propObj.get('defaultListParam'), listData: List([])});
}


export const getDataListAndParamInComp = (propObj, compId) => {
    if(propObj.get('viewItems')) {
        const viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        return Map({listParam: viewItem.get('listParam'), listData: viewItem.get('listData')});
    } else {
        return Map({listParam: propObj.get('defaultListParam'), listData: List([])});
    }
}

export const ________getRowObjectById = (propObj, compId, id, keyId) => {
    if(propObj.get('viewItems')) {
        const viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        if(viewItem && viewItem.get('listData')) {
            const selectedViewItem = viewItem.get('listData').find((element) => {
                return element.get(keyId) == id;
            });
            return (selectedViewItem) ? fromJS(selectedViewItem.toJS()) : null;
        }
    }
    return null;
}

// ?????
export const getConfigIdsInComp = (ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps, compId) => {

    const clientConfigId = ClientConfSettingProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    const hostNameConfigId = ClientHostNameProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    const updateServerConfigId = ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedOptionItemId']);

    return {
        clientConfigId: clientConfigId,
        hostNameConfigId: hostNameConfigId,
        updateServerConfigId: updateServerConfigId
    }
}
