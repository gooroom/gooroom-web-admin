import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientRegKey/COMMON_PENDING';
const COMMON_FAILURE = 'clientRegKey/COMMON_FAILURE';

const GET_REGKEY_LISTPAGED_SUCCESS = 'clientRegKey/GET_REGKEY_LISTPAGED_SUCCESS';

const CREATE_REGKEY_SUCCESS = 'clientRegKey/CREATE_REGKEY_SUCCESS';

const EDIT_REGKEY_SUCCESS = 'clientRegKey/EDIT_REGKEY_SUCCESS';
const DELETE_REGKEY_SUCCESS = 'clientRegKey/DELETE_REGKEY_SUCCESS';

const CHG_LISTPARAM_DATA = 'clientRegKey/CHG_LISTPARAM_DATA';

const SHOW_REGKEY_DIALOG = 'clientRegKey/SHOW_REGKEY_DIALOG';
const CLOSE_REGKEY_DIALOG = 'clientRegKey/CLOSE_REGKEY_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientRegKey/SET_EDITING_ITEM_VALUE';

// ...
const initialState = commonHandleActions.getCommonInitialState('chModDate', 'desc');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_REGKEY_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_REGKEY_DIALOG
    });
};

// ...
export const readClientRegkeyListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readRegKeyInfoListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_REGKEY_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
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

export const generateClientRegkey = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('generateRegKeyNumber', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: SET_EDITING_ITEM_VALUE,
                        name: 'regKeyNo',
                        value: response.data.data[0].key
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

// create (add)
export const createClientRegKeyData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createRegKeyData', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_REGKEY_SUCCESS,
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

// edit
export const editClientRegKeyData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('editRegKeyData', param).then(
        (response) => {
            dispatch({
                type: EDIT_REGKEY_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete
export const deleteClientRegKeyData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteRegKeyData', param).then(
        (response) => {
            dispatch({
                type: DELETE_REGKEY_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};


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

    [GET_REGKEY_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },  
    [SHOW_REGKEY_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_REGKEY_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CREATE_REGKEY_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [EDIT_REGKEY_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_REGKEY_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    }

}, initialState);

