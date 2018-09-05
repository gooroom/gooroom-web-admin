import { Map, List } from 'immutable';

export const getTableListObject = (propObj, compId) => {

    if(propObj.get('viewItems')) {
        let viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        return viewItem;
    } else {
        return Map({listParam: propObj.get('defaultListParam'), listData: List([])});
    }
}

export const getDataListAndParamInComp = (propObj, compId) => {

    if(propObj.get('viewItems')) {
        let viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        return Map({listParam: viewItem.get('listParam'), listData: viewItem.get('listData')});
    } else {
        return Map({listParam: propObj.get('defaultListParam'), listData: List([])});
    }
}

export const getTableObjectById = (propObj, compId, id) => {

    if(propObj.get('viewItems')) {
        let viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        if(viewItem && viewItem.get('listData')) {
            const selectedItem = viewItem.get('listData').find((element) => {
                return element.get('grpId') == id;
            });
            return (selectedItem) ? selectedItem : null;
        }
    }
    return null;
}


export const getTableSelectedObject = (propObj, compId) => {

    if(propObj.get('viewItems')) {
        let viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        return (viewItem.get('selectedItem')) ? viewItem.get('selectedItem') : null;
    }
    return null;
}
