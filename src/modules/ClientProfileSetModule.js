import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GRUtils/GRRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientProfileSet/COMMON_PENDING';
const COMMON_FAILURE = 'clientProfileSet/COMMON_FAILURE';

const GET_PROFILESET_LISTPAGED_SUCCESS = 'clientProfileSet/GET_LIST_SUCCESS';

const CREATE_PROFILESET_DATA_SUCCESS = 'clientProfileSet/CREATE_DATA_SUCCESS';
const EDIT_PROFILESET_DATA_SUCCESS = 'clientProfileSet/EDIT_DATA_SUCCESS';
const DELETE_PROFILESET_DATA_SUCCESS = 'clientProfileSet/DELETE_DATA_SUCCESS';

const CREATE_PROFILESET_JOB_SUCCESS = 'clientProfileSet/CREATE_JOB_SUCCESS';

const SHOW_PROFILESET_DIALOG = 'clientProfileSet/SHOW_PROFILESET_DIALOG';
const CLOSE_PROFILESET_DIALOG = 'clientProfileSet/CLOSE_PROFILESET_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientProfileSet/SET_EDITING_ITEM_VALUE';


// ...
const initialState = commonHandleActions.getCommonInitialState('chProfileSetNo', 'desc');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_PROFILESET_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_PROFILESET_DIALOG
    });
};


// ...
export const readClientProfileSetListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readProfileSetListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_PROFILESET_LISTPAGED_SUCCESS,
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

// create (add)
export const createClientProfileSetData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createProfileSet', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_PROFILESET_DATA_SUCCESS,
                        response: response
                    });
                }
            } catch(error) {
                dispatch({
                    type: COMMON_FAILURE,
                    error: null,
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

// edit
export const editClientProfileSetData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('editProfileSetData', param).then(
        (response) => {
            dispatch({
                type: EDIT_PROFILESET_DATA_SUCCESS,
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
export const deleteClientProfileSetData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteProfileSetData', param).then(
        (response) => {
            dispatch({
                type: DELETE_PROFILESET_DATA_SUCCESS,
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

// create profile job
export const createClientProfileSetJob = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createProfileJob', param).then(
        (response) => {
            dispatch({
                type: CREATE_PROFILESET_JOB_SUCCESS,
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
            errorObj: (action.error) ? action.error : ''
        });
    },

    [GET_PROFILESET_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [CREATE_PROFILESET_DATA_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [SHOW_PROFILESET_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_PROFILESET_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CREATE_PROFILESET_JOB_SUCCESS]: (state, action) => {
        return state.merge({
            pending: true, 
            error: false
        });
    },

}, initialState);



