import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientPackage/COMMON_PENDING';
const COMMON_FAILURE = 'clientPackage/COMMON_FAILURE';
const SET_EDITING_ITEM_VALUE = 'clientPackage/SET_EDITING_ITEM_VALUE';
const CHG_LISTPARAM_DATA = 'clientPackage/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientPackage/CHG_COMPDATA_VALUE';
const SET_INITDATA_SUCCESS = 'clientPackage/SET_INITDATA_SUCCESS';

const SHOW_CLIENTPACKAGE_INFORM = 'clientPackage/SHOW_CLIENTPACKAGE_INFORM';
const CLOSE_CLIENTPACKAGE_INFORM = 'clientPackage/CLOSE_CLIENTPACKAGE_INFORM';
const SHOW_CLIENTPACKAGE_DIALOG = 'clientPackage/SHOW_CLIENTPACKAGE_DIALOG';
const CLOSE_CLIENTPACKAGE_DIALOG = 'clientPackage/CLOSE_CLIENTPACKAGE_DIALOG';

const GET_CLIENTPACKAGE_LISTPAGED_SUCCESS = 'clientPackage/GET_CLIENTPACKAGE_LISTPAGED_SUCCESS';

const UPDATE_PACKAGETOCLIENT_SUCCESS = 'clientPackage/UPDATE_PACKAGETOCLIENT_SUCCESS';
const DELETE_PACKAGETOCLIENT_SUCCESS = 'clientPackage/DELETE_PACKAGETOCLIENT_SUCCESS';
const UPDATE_PACKAGELIST_SUCCESS = 'clientPackage/UPDATE_PACKAGELIST_SUCCESS';
const UPDATE_PACKAGEALLLIST_SUCCESS = 'clientPackage/UPDATE_PACKAGEALLLIST_SUCCESS';

const UPDATE_TOTLAPACKAGELIST_SUCCESS = 'clientPackage/UPDATE_TOTLAPACKAGELIST_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chPackageId', 'asc', {dialogTabValue: 0});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTPACKAGE_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTPACKAGE_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTPACKAGE_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTPACKAGE_INFORM,
        compId: param.compId
    });
};

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        name: param.name,
        value: param.value
    });
};

export const changeListParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_LISTPARAM_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
};

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
        targetType: param.targetType
    });
};
// ...

export const readProfilePackageListPaged = (module, compId, extParam) => dispatch => {
    let newListParam = Map({});
    if(module.getIn(['viewItems', compId])) {
        newListParam = module.getIn(['viewItems', compId, 'listParam']).merge(extParam)
    } else {
        newListParam = module.get('defaultListParam');
        if(extParam) {
            newListParam = newListParam.merge(extParam);
        }
    }

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readProfilePackageListPaged', {
        keyword: newListParam.get('keyword'),
        profileNo: newListParam.get('profileNo'),
        clientId: newListParam.get('clientId'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTPACKAGE_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};


export const readPackageListPagedInClient = (module, compId, extParam) => dispatch => {
    let newListParam = Map({});
    
    if(module.getIn(['viewItems', compId])) {
        newListParam = module.getIn(['viewItems', compId, 'listParam']).merge(extParam)
    } else {
        newListParam = module.get('defaultListParam');
        if(extParam) {
            newListParam = newListParam.merge(extParam);
        }
    }

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readPackageListPagedInClient', {
        keyword: newListParam.get('keyword'),
        clientId: newListParam.get('clientId'),
        isFiltered: (newListParam.get('isFiltered')) ? newListParam.get('isFiltered') : false,
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTPACKAGE_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readClientPackageListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readTotalPackageListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTPACKAGE_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const updatePackageInClient = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updatePackageInClient', param).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: UPDATE_PACKAGETOCLIENT_SUCCESS,
                        response: response
                    });
                }
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const deletePackageInClient = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deletePackageInClient', {
        clientId: param.clientIds,
        packageIds: param.packageIds
    }).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: DELETE_PACKAGETOCLIENT_SUCCESS,
                        response: response
                    });
                }
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};


// 선택한 단말 또는 그룹에 전체 패키지 업데이트
export const createPackageAllUpgrade = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createPackageAllUpgrade', param).then(
        (response) => {
            dispatch({
                type: UPDATE_PACKAGEALLLIST_SUCCESS,
                compId: param.compId
            });
            return {response: response};
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};


export const updateTotalPackage = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateTotalPackage', {}).then(
        (response) => {
            dispatch({
                type: UPDATE_TOTLAPACKAGELIST_SUCCESS,
                compId: param.compId,
                grpId: param.grpId
            });
            return {response: response};
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const setDataInit = (param) => dispatch => {
    return dispatch({
        type: SET_INITDATA_SUCCESS,
        compId: param.compId
    });
}

export default handleActions({

    [COMMON_PENDING]: (state, action) => {
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({ editingItem: state.get('editingItem').merge({[action.name]: action.value}) });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [SHOW_CLIENTPACKAGE_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CLIENTPACKAGE_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_CLIENTPACKAGE_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CLIENTPACKAGE_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_INITDATA_SUCCESS]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listData'], List([]))
        .setIn(['viewItems', action.compId, 'listParam'], state.get('defaultListParam'));
    },

    [GET_CLIENTPACKAGE_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [UPDATE_PACKAGETOCLIENT_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [UPDATE_PACKAGELIST_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [UPDATE_PACKAGEALLLIST_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [DELETE_PACKAGETOCLIENT_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [UPDATE_TOTLAPACKAGELIST_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },

}, initialState);

