import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'dailyProtected/COMMON_PENDING';
const COMMON_FAILURE = 'dailyProtected/COMMON_FAILURE';

const GET_DAILYPROTECTED_LIST_SUCCESS = 'dailyProtected/GET_DAILYPROTECTED_LIST_SUCCESS';
const GET_PROTECTED_LISTPAGED_SUCCESS = 'dailyProtected/GET_PROTECTED_LISTPAGED_SUCCESS';
const GET_DAILYPROTECTED_SUCCESS = 'dailyProtected/GET_DAILYPROTECTED_SUCCESS';

const SHOW_DAILYPROTECTED_INFORM = 'dailyProtected/SHOW_DAILYPROTECTED_INFORM';
const CLOSE_DAILYPROTECTED_INFORM = 'dailyProtected/CLOSE_DAILYPROTECTED_INFORM';
const SHOW_DAILYPROTECTED_DIALOG = 'dailyProtected/SHOW_DAILYPROTECTED_DIALOG';
const CLOSE_DAILYPROTECTED_DIALOG = 'dailyProtected/CLOSE_DAILYPROTECTED_DIALOG';

const SET_EDITING_ITEM_VALUE = 'dailyProtected/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'dailyProtected/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'dailyProtected/CHG_COMPDATA_VALUE';


// ...
const initialState = commonHandleActions.getCommonInitialState('LOG_SEQ', 'desc', null, {logItem: 'ALL', rowsPerPage: 5});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_DAILYPROTECTED_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_DAILYPROTECTED_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_DAILYPROTECTED_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_DAILYPROTECTED_INFORM,
        compId: param.compId
    });
};

export const readDailyProtectedList = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readProtectedDailyCount', {
        fromDate: newListParam.get('fromDate'),
        toDate: newListParam.get('toDate')
    }).then(
        (response) => {
            dispatch({
                type: GET_DAILYPROTECTED_LIST_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readProtectedListPaged = (module, compId, extParam) => dispatch => {

    let newListParam = module.getIn(['viewItems', compId, 'listParam']);
    if(newListParam) {
        if(newListParam.get('page') !== undefined) {
            newListParam = module.getIn(['viewItems', compId, 'listParam']).merge(extParam);
        } else {
            newListParam = module.getIn(['viewItems', compId, 'listParam']).merge(module.get('defaultListParam'));
            newListParam = newListParam.merge(extParam);
        }
    }

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readProtectedListPaged', {
        searchType: newListParam.get('protectedType'),
        searchDate: newListParam.get('logDate'),
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_PROTECTED_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getDailyProtected = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readDailyProtected', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_DAILYPROTECTED_SUCCESS,
                    compId: compId,
                    response: response
                });
            }
        ).catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
        });
    } else {
        return dispatch({
            type: COMMON_FAILURE,
            compId: compId,
            name: 'viewItem'
        });      
    }

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

export default handleActions({

    [COMMON_PENDING]: (state, action) => {
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [GET_DAILYPROTECTED_LIST_SUCCESS]: (state, action) => {
        const { data, extend } = action.response.data;
        let newListParam = Map();
        if(extend && extend.length > 0) {
            extend.forEach(e => { newListParam = newListParam.set(e.name, e.value); });
        }
        let newState = null;
        if(state.getIn(['viewItems', action.compId])) {
            newState = state.setIn(['viewItems', action.compId, 'listAllData'], List(data.map((e) => {return Map(e)})))
                            .setIn(['viewItems', action.compId, 'listParam'], action.listParam.merge(newListParam));
        } else {
            newState = state.setIn(['viewItems', action.compId, 'listAllData'], List(data.map((e) => {return Map(e)})))
                            .setIn(['viewItems', action.compId, 'listParam'], newListParam);
        }
        return newState;
    }, 
    [GET_PROTECTED_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_DAILYPROTECTED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend, action.target, 'objId');
    },
    [SHOW_DAILYPROTECTED_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_DAILYPROTECTED_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_DAILYPROTECTED_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_DAILYPROTECTED_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    }

}, initialState);

