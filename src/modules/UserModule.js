
import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'user/COMMON_PENDING';
const COMMON_FAILURE = 'user/COMMON_FAILURE';

const GET_USER_LISTPAGED_SUCCESS = 'user/GET_USER_LISTPAGED_SUCCESS';
const GET_LISTALL_SUCCESS = 'user/GET_LISTALL_SUCCESS';
const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
const EDIT_USER_SUCCESS = 'user/EDIT_USER_SUCCESS';
const DELETE_USER_SUCCESS = 'user/DELETE_USER_SUCCESS';

const SHOW_USER_INFORM = 'user/SHOW_USER_INFORM';
const CLOSE_USER_INFORM = 'user/CLOSE_USER_INFORM';
const SHOW_USER_DIALOG = 'user/SHOW_USER_DIALOG';
const CLOSE_USER_DIALOG = 'user/CLOSE_USER_DIALOG';

const SET_EDITING_ITEM_VALUE = 'user/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'user/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'user/CHG_COMPDATA_VALUE';

const CHG_STORE_DATA = 'user/CHG_STORE_DATA';

// ...
const initialState = commonHandleActions.getCommonInitialState('chUserNm', 'asc', {}, {status: 'STAT010', deptCd: '', keyword: ''});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_USER_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_USER_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_USER_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = () => dispatch => {
    return dispatch({
        type: CLOSE_USER_INFORM,
        compId: param.compId
    });
};

export const readUserListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUserListPagedInDept', {
        status: newListParam.get('status'),
        deptCd: newListParam.get('deptCd'),
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_USER_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
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
        value: param.value
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        name: param.name,
        value: param.value
    });
};

// create (add)
export const createUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createUser', {
        userId: param.userId,
        userPasswd: param.userPassword,
        userNm: param.userNm
    }).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_USER_SUCCESS
                    });
                }
            } catch(ex) {
                dispatch({
                    type: COMMON_FAILURE,
                    ex: ex
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

// edit
export const editUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateUserData', {
        userId: param.userId,
        userPasswd: param.userPassword,
        userNm: param.userNm
    }).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                requestPostAPI('readUserData', {'userId': item.get('userId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_USER_SUCCESS,
                            userId: item.get('userId'),
                            response: response
                        });
                    }
                ).catch(error => {
                });
            } else {
                // alarm ... fail
                dispatch({
                    type: COMMON_FAILURE,
                    error: error
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

// delete
export const deleteUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteUserData', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: DELETE_USER_SUCCESS,
                compId: param.compId,
                userId: param.userId
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export default handleActions({

    [COMMON_PENDING]: (state, action) => {
        return state.merge({
            pending: true, 
            error: false
        });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({
            pending: false, 
            error: true,
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            ex:  (action.ex) ? action.ex : ''
        });
    },

    [GET_USER_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [SHOW_USER_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_USER_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_USER_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_USER_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return state.setIn(['viewItems', action.compId, action.name], action.value);
    },
    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({
            [action.name]: action.value
        });
    },
    [CREATE_USER_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_USER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_USER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    },

}, initialState);

