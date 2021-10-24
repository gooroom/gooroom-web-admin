import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'generalLog/COMMON_PENDING';
const COMMON_FAILURE = 'generalLog/COMMON_FAILURE';

const GET_GENERALLOG_LIST_SUCCESS = 'generalLog/GET_GENERALLOG_LIST_SUCCESS';
const GET_GENERALLOG_LISTPAGED_SUCCESS = 'generalLog/GET_GENERALLOG_LISTPAGED_SUCCESS';
const GET_GENERALLOG_SUCCESS = 'generalLog/GET_GENERALLOG_SUCCESS';

const SHOW_GENERALLOG_INFORM = 'generalLog/SHOW_GENERALLOG_INFORM';
const CLOSE_GENERALLOG_INFORM = 'generalLog/CLOSE_GENERALLOG_INFORM';
const SHOW_GENERALLOG_DIALOG = 'generalLog/SHOW_GENERALLOG_DIALOG';
const CLOSE_GENERALLOG_DIALOG = 'generalLog/CLOSE_GENERALLOG_DIALOG';

const SET_EDITING_ITEM_VALUE = 'generalLog/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'generalLog/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'generalLog/CHG_COMPDATA_VALUE';


// ...
const initialState = commonHandleActions.getCommonInitialState('LOG_SEQ', 'desc', null, {logItem: 'ALL'});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_GENERALLOG_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_GENERALLOG_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_GENERALLOG_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_GENERALLOG_INFORM,
        compId: param.compId
    });
};

export const readGeneralLogList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readGeneralLogList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_GENERALLOG_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readGeneralLogListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readGeneralLogListPaged', {
        fromDate: newListParam.get('fromDate'),
        toDate: newListParam.get('toDate'),
        logItem: newListParam.get('logItem'),
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_GENERALLOG_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getGeneralLog = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readGeneralLog', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_GENERALLOG_SUCCESS,
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
    [GET_GENERALLOG_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_GENERALLOG_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_GENERALLOG_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend, action.target, 'objId');
    },
    [SHOW_GENERALLOG_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_GENERALLOG_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_GENERALLOG_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_GENERALLOG_INFORM]: (state, action) => {
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

