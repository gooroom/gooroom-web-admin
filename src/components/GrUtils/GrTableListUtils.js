import { Map, List, fromJS } from 'immutable';

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

export const getDataObjectVariableInComp = (propObj, compId, name) => {
    if(propObj.get('viewItems')) {
        const viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        if(viewItem) {
            return viewItem.get(name);
        }
    } else {
        return null;
    }
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

export const getRowObjectById = (propObj, compId, id, keyId) => {
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

export const getSelectedObjectInComp = (propObj, compId) => {
    if(propObj.get('viewItems')) {
        const viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        return (viewItem) ? viewItem.get('selectedViewItem') : null;
    }
    return null;
}
