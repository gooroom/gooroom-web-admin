import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'gcspManage/COMMON_PENDING';
const COMMON_FAILURE = 'gcspManage/COMMON_FAILURE';
const SET_EDITING_ITEM_VALUE = 'gcspManage/SET_EDITING_ITEM_VALUE';
const CHG_LISTPARAM_DATA = 'gcspManage/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'gcspManage/CHG_COMPDATA_VALUE';

const SHOW_GCSP_INFORM = 'gcspManage/SHOW_GCSP_INFORM';
const CLOSE_GCSP_INFORM = 'gcspManage/CLOSE_GCSP_INFORM';
const SHOW_GCSP_DIALOG = 'gcspManage/SHOW_GCSP_DIALOG';
const CLOSE_GCSP_DIALOG = 'gcspManage/CLOSE_GCSP_DIALOG';

const GET_GCSP_LISTPAGED_SUCCESS = 'gcspManage/GET_GCSP_LISTPAGED_SUCCESS';

const CREATE_GCSP_SUCCESS = 'adminUser/CREATE_GCSP_SUCCESS';
const EDIT_GCSP_SUCCESS = 'adminUser/EDIT_GCSP_SUCCESS';
const DELETE_GCSP_SUCCESS = 'adminUser/DELETE_GCSP_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chPackageId', 'asc', {dialogTabValue: 0});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_GCSP_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_GCSP_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_GCSP_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('gcspId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_GCSP_INFORM,
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

export const readGcspListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readGcspListPaged', {
        keyword: newListParam.get('keyword'),
        clientId: newListParam.get('clientId'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_GCSP_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// create (add)
export const createGcspData = (param) => (dispatch, getState) => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createGcspData', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_GCSP_SUCCESS,
                        response: response
                    });
                } else {
                    dispatch({ type: COMMON_FAILURE, error: response.data });
                    return response.data;
                }
            } catch(error) {
                return error;
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// edit
export const editGcspData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateGcspData', param).then(
        (response) => {
            dispatch({
                type: EDIT_GCSP_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete
export const deleteGcspData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteGcspData', param).then(
        (response) => {
            dispatch({
                type: DELETE_GCSP_SUCCESS,
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
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({ editingItem: state.get('editingItem').merge({[action.name]: action.value}) });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [SHOW_GCSP_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_GCSP_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_GCSP_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_GCSP_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [CREATE_GCSP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [EDIT_GCSP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_GCSP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    },
    [GET_GCSP_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }

}, initialState);

