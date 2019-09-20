import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';
import { resolve } from 'url';

const COMMON_PENDING = 'notice/COMMON_PENDING';
const COMMON_FAILURE = 'notice/COMMON_FAILURE';

const SHOW_NOTICE_DIALOG = 'notice/SHOW_NOTICE_DIALOG';
const CLOSE_NOTICE_DIALOG = 'notice/CLOSE_NOTICE_DIALOG';
const SHOW_NOTICE_CONTENT = 'notice/SHOW_NOTICE_CONTENT';
const CLOSE_NOTICE_CONTENT = 'notice/CLOSE_NOTICE_CONTENT';

const GET_NOTICE_LISTPAGED_SUCCESS = 'notice/GET_NOTICE_LISTPAGED_SUCCESS';

const CREATE_NOTICE_SUCCESS = 'notice/CREATE_NOTICE_SUCCESS';
const UPDATE_NOTICE_SUCCESS = 'notice/UPDATE_NOTICE_SUCCESS';
const DELETE_NOTICE_SUCCESS = 'notice/DELETE_NOTICE_SUCCESS';

const CHG_LISTPARAM_DATA = 'notice/CHG_LISTPARAM_DATA';
const SET_EDITING_ITEM_VALUE = 'notice/SET_EDITING_ITEM_VALUE';

const initialState = commonHandleActions.getCommonInitialState('chNoticeId', 'desc', null, {rowsPerPage: 5});

export const showNoticeDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_NOTICE_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeNoticeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_NOTICE_DIALOG
    });
};

export const showNoticeContent = (param) => dispatch => {
    return dispatch({
        type: SHOW_NOTICE_CONTENT,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('noticeId') : '',
        viewItem: param.viewItem,
        isEditable: param.isEditable
    });
};

export const closeNoticeContent = (param) => dispatch => {
    return dispatch({
        type: CLOSE_NOTICE_CONTENT,
        compId: param.compId
    });
};

export const readNoticeListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readNoticeListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_NOTICE_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const changeListParamData = (param) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: CHG_LISTPARAM_DATA,
            compId: param.compId,
            name: param.name,
            value: param.value
        });
        resolve();
    });
};

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        name: param.name,
        value: param.value
    });
};

// create (add)
export const createNotice = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createNotice', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_NOTICE_SUCCESS,
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

// update
export const updateNotice = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateNotice', param).then(
        (response) => {
            dispatch({
                type: UPDATE_NOTICE_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete
export const deleteNotice = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteNotice', param).then(
        (response) => {
            dispatch({
                type: DELETE_NOTICE_SUCCESS,
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
    [SHOW_NOTICE_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_NOTICE_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_NOTICE_CONTENT]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_NOTICE_CONTENT]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [GET_NOTICE_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CREATE_NOTICE_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [UPDATE_NOTICE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_NOTICE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    }
}, initialState);

