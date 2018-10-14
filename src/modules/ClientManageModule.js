
import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientManageComp/COMMON_PENDING';
const COMMON_FAILURE = 'clientManageComp/COMMON_FAILURE';

const GET_CLIENT_LISTPAGED_SUCCESS = 'clientManageComp/GET_CLIENT_LISTPAGED_SUCCESS';
const CREATE_CLIENT_SUCCESS = 'clientManageComp/CREATE_CLIENT_SUCCESS';
const EDIT_CLIENT_SUCCESS = 'clientManageComp/EDIT_CLIENT_SUCCESS';
const DELETE_CLIENT_SUCCESS = 'clientManageComp/DELETE_CLIENT_SUCCESS';

const SHOW_CLIENT_DIALOG = 'clientManageComp/SHOW_CLIENT_DIALOG';
const CLOSE_CLIENT_DIALOG = 'clientManageComp/CLOSE_CLIENT_DIALOG';
const SHOW_CLIENT_INFORM = 'clientManageComp/SHOW_CLIENT_INFORM';
const CLOSE_CLIENT_INFORM = 'clientManageComp/CLOSE_CLIENT_INFORM';

const SET_EDITING_ITEM_VALUE = 'clientManageComp/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientManageComp/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientManageComp/CHG_COMPDATA_VALUE';
const CHG_STORE_DATA = 'clientManageComp/CHG_STORE_DATA';

const GET_CLIENT_INFORM = 'clientManage/GET_CLIENT_INFORM';


// ...
const initialState = commonHandleActions.getCommonInitialState('clientName', 'desc', {}, {
    clientType: 'ALL',
    groupId: '',
    keyword: ''});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENT_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENT_DIALOG
    });
};

export const showClientManageInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENT_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeClientManageInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENT_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

// ...
export const readClientListPaged = (module, compId, extParam, isResetSelect=false) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientListPaged', {
        clientType: newListParam.get('clientType'),
        groupId: newListParam.get('groupId'),
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENT_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                isResetSelect: isResetSelect,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete client(s) selected
export const deleteClientData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientsCertToRevoke', {'clientIds': param.clientIds}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENT_SUCCESS
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
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },

    [GET_CLIENT_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [SHOW_CLIENT_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CLIENT_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_CLIENT_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CLIENT_INFORM]: (state, action) => {
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
        return state.merge({[action.name]: action.value});
    },

    // [EDIT_CLIENT_SUCCESS]: (state, action) => {
    //     return commonHandleActions.handleEditSuccessAction(state, action);
    // },
    
    [DELETE_CLIENT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    },

}, initialState);



