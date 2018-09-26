import { handleActions } from 'redux-actions';
import { List } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientSecuSetting/COMMON_PENDING';
const COMMON_FAILURE = 'clientSecuSetting/COMMON_FAILURE';

const GET_CLIENTSECU_LIST_SUCCESS = 'clientSecuSetting/GET_CLIENTSECU_LIST_SUCCESS';
const GET_CLIENTSECU_LISTPAGED_SUCCESS = 'clientSecuSetting/GET_CLIENTSECU_LISTPAGED_SUCCESS';
const GET_CLIENTSECU_SUCCESS = 'clientSecuSetting/GET_CLIENTSECU_SUCCESS';
const CREATE_CLIENTSECU_SUCCESS = 'clientSecuSetting/CREATE_CLIENTSECU_SUCCESS';
const EDIT_CLIENTSECU_SUCCESS = 'clientSecuSetting/EDIT_CLIENTSECU_SUCCESS';
const DELETE_CLIENTSECU_SUCCESS = 'clientSecuSetting/DELETE_CLIENTSECU_SUCCESS';

const SHOW_CLIENTSECU_INFORM = 'clientSecuSetting/SHOW_CLIENTSECU_INFORM';
const CLOSE_CLIENTSECU_INFORM = 'clientSecuSetting/CLOSE_CLIENTSECU_INFORM';
const SHOW_CLIENTSECU_DIALOG = 'clientSecuSetting/SHOW_CLIENTSECU_DIALOG';
const CLOSE_CLIENTSECU_DIALOG = 'clientSecuSetting/CLOSE_CLIENTSECU_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientSecuSetting/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientSecuSetting/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'clientSecuSetting/CHG_COMPVARIABLE_DATA';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTSECU_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTSECU_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTSECU_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTSECU_INFORM,
        compId: param.compId
    });
};

export const readClientSecuSettingListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientSecuListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTSECU_LISTPAGED_SUCCESS,
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

export const getClientSecuSetting = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientSecuRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_CLIENTSECU_SUCCESS,
                compId: compId,
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

export const getClientSecuSettingByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientSecuRuleByUserId', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_CLIENTSECU_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        console.log('error ................. ', error);
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
        type: CHG_COMPVARIABLE_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
};

const makeParameter = (param) => {
    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),

        screen_time: param.get('screenTime'),
        password_time: param.get('passwordTime'),
        package_handle: (param.get('packageHandle') == 'allow') ? 'allow' : 'disallow',
        state: (param.get('state') == 'allow') ? 'allow' : 'disallow'
    };
}

// create (add)
export const createClientSecuSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientSecuConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CLIENTSECU_SUCCESS
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
export const editClientSecuSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientSecuConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readClientSecuRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CLIENTSECU_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                });

                // change object array for selector
                requestPostAPI('readClientSecuRuleList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_CLIENTSECU_LIST_SUCCESS,
                            compId: compId,
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({
                        type: COMMON_FAILURE,
                        error: error
                    });
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
export const deleteClientSecuSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientSecuConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTSECU_SUCCESS,
                compId: param.compId,
                objId: param.objId
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
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            ex: (action.ex) ? action.ex : ''
        });
    },
    [GET_CLIENTSECU_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action);
    }, 
    [GET_CLIENTSECU_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_CLIENTSECU_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.securityResult.data);
    },
    [SHOW_CLIENTSECU_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CLIENTSECU_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_CLIENTSECU_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CLIENTSECU_INFORM]: (state, action) => {
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
    [CHG_COMPVARIABLE_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, action.name], action.value);
    },
    [CREATE_CLIENTSECU_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CLIENTSECU_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_CLIENTSECU_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    }

}, initialState);

