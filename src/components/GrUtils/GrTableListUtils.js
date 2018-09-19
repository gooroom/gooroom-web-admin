
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
    if(propObj.getIn(['viewItems', compId, 'listData'])) {
        const selectedViewItem = propObj.getIn(['viewItems', compId, 'listData']).find((element) => {
            return element.get(keyId) == id;
        });
        return (selectedViewItem) ? fromJS(selectedViewItem.toJS()) : null;
    } 
    return null;
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

export const getSelectedObjectInComp = (propObj, compId) => {
    if(propObj.get('viewItems')) {
        const viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        return (viewItem) ? viewItem.get('selectedViewItem') : null;
    }
    return null;
}

export const getSelectedObjectInCompAndId = (propObj, compId) => {
    if(propObj.get('viewItems')) {
        const viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });

        if(viewItem && viewItem.get('listAllData') && viewItem.get('selectedOptionItemId') != null) {
            const item = viewItem.get('listAllData').find((element) => {
              return element.get('objId') == viewItem.get('selectedOptionItemId');
            });
            if(item) {
              return fromJS(item.toJS());
            }
        }
    }
    return null;
}

// ?????
export const getConfigIdsInComp = (ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps, compId) => {

    const clientConfIndex = ClientConfSettingProps.get('viewItems').findIndex((e) => {
        return e.get('_COMPID_') == compId;
    });
    const hostsConfIndex = ClientHostNameProps.get('viewItems').findIndex((e) => {
        return e.get('_COMPID_') == compId;
    });
    const updateServerConfIndex = ClientUpdateServerProps.get('viewItems').findIndex((e) => {
        return e.get('_COMPID_') == compId;
    });

    return {
        clientConfigId: ClientConfSettingProps.getIn(['viewItems', clientConfIndex, 'selectedOptionItemId']),
        hostNameConfigId: ClientHostNameProps.getIn(['viewItems', hostsConfIndex, 'selectedOptionItemId']),
        updateServerConfigId: ClientUpdateServerProps.getIn(['viewItems', updateServerConfIndex, 'selectedOptionItemId'])
    }
}
