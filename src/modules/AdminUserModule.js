import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'adminUser/COMMON_PENDING';
const COMMON_FAILURE = 'adminUser/COMMON_FAILURE';

const CHG_LISTPARAM_DATA = 'adminUser/CHG_LISTPARAM_DATA';
const SET_EDITING_ITEM_VALUE = 'adminUser/SET_EDITING_ITEM_VALUE';

const GET_ADMINUSER_LISTPAGED_SUCCESS = 'adminUser/GET_ADMINUSER_LISTPAGED_SUCCESS';

const CREATE_ADMINUSER_SUCCESS = 'adminUser/CREATE_ADMINUSER_SUCCESS';
const EDIT_ADMINUSER_SUCCESS = 'adminUser/EDIT_ADMINUSER_SUCCESS';
const DELETE_ADMINUSER_SUCCESS = 'adminUser/DELETE_ADMINUSER_SUCCESS';

const SHOW_ADMINUSER_DIALOG = 'adminUser/SHOW_ADMINUSER_DIALOG';
const CLOSE_ADMINUSER_DIALOG = 'adminUser/CLOSE_ADMINUSER_DIALOG';


// ...
const initialState = commonHandleActions.getCommonInitialState('chAdminNm', 'asc', {}, {status: 'STAT010', keyword: ''});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_ADMINUSER_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_ADMINUSER_DIALOG
    });
};

// ...
export const readAdminUserListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readAdminUserListPaged', {
        keyword: newListParam.get('keyword'),
        status: newListParam.get('status'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_ADMINUSER_LISTPAGED_SUCCESS,
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

export const generateAdminUser = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('generateRegKeyNumber', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: SET_EDITING_ITEM_VALUE,
                        name: 'adminId',
                        value: response.data.data[0].key
                    });
                }
            } catch(ex) {
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

// create (add)
export const createAdminUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createAdminUser', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_ADMINUSER_SUCCESS,
                        response: response
                    });
                }    
            } catch(ex) {
                dispatch({
                    type: COMMON_FAILURE,
                    error: null,
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
export const editAdminUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateAdminUserData', param).then(
        (response) => {
            dispatch({
                type: EDIT_ADMINUSER_SUCCESS,
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

// delete
export const deleteAdminUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteAdminUserData', param).then(
        (response) => {
            dispatch({
                type: DELETE_ADMINUSER_SUCCESS,
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
            ex: (action.ex) ? action.ex : ''
        });
    },

    [GET_ADMINUSER_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },  
    [SHOW_ADMINUSER_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_ADMINUSER_DIALOG]: (state, action) => {
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
    [CREATE_ADMINUSER_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [EDIT_ADMINUSER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_ADMINUSER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    }

}, initialState);

