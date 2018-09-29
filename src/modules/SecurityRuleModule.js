import { handleActions } from 'redux-actions';
import { List } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'securityRule/COMMON_PENDING';
const COMMON_FAILURE = 'securityRule/COMMON_FAILURE';

const GET_SECURITYRULE_LIST_SUCCESS = 'securityRule/GET_SECURITYRULE_LIST_SUCCESS';
const GET_SECURITYRULE_LISTPAGED_SUCCESS = 'securityRule/GET_SECURITYRULE_LISTPAGED_SUCCESS';
const GET_SECURITYRULE_SUCCESS = 'securityRule/GET_SECURITYRULE_SUCCESS';
const CREATE_SECURITYRULE_SUCCESS = 'securityRule/CREATE_SECURITYRULE_SUCCESS';
const EDIT_SECURITYRULE_SUCCESS = 'securityRule/EDIT_SECURITYRULE_SUCCESS';
const DELETE_SECURITYRULE_SUCCESS = 'securityRule/DELETE_SECURITYRULE_SUCCESS';

const SHOW_SECURITYRULE_INFORM = 'securityRule/SHOW_SECURITYRULE_INFORM';
const CLOSE_SECURITYRULE_INFORM = 'securityRule/CLOSE_SECURITYRULE_INFORM';
const SHOW_SECURITYRULE_DIALOG = 'securityRule/SHOW_SECURITYRULE_DIALOG';
const CLOSE_SECURITYRULE_DIALOG = 'securityRule/CLOSE_SECURITYRULE_DIALOG';

const SET_EDITING_ITEM_VALUE = 'securityRule/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'securityRule/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'securityRule/CHG_COMPDATA_VALUE';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_SECURITYRULE_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_SECURITYRULE_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_SECURITYRULE_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_SECURITYRULE_INFORM,
        compId: param.compId
    });
};

export const readSecurityRuleList = (module, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_LIST_SUCCESS,
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

export const readSecurityRuleListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_LISTPAGED_SUCCESS,
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

export const getSecurityRule = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_SUCCESS,
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

export const getSecurityRuleByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleByUserId', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_SUCCESS,
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
export const createSecurityRule = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createSecurityRule', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_SECURITYRULE_SUCCESS
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
export const editSecurityRule = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateSecurityRule', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readSecurityRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_SECURITYRULE_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                });

                // change object array for selector
                requestPostAPI('readSecurityRuleList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_SECURITYRULE_LIST_SUCCESS,
                            compId: compId,
                            response: response
                        });
                    }
                ).catch(error => {
                    console.log('error ::::::::::::::::: ', error);
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
export const deleteSecurityRule = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteSecurityRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_SECURITYRULE_SUCCESS,
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
    [GET_SECURITYRULE_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action);
    }, 
    [GET_SECURITYRULE_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_SECURITYRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.securityResult.data);
    },
    [SHOW_SECURITYRULE_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_SECURITYRULE_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_SECURITYRULE_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_SECURITYRULE_INFORM]: (state, action) => {
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
    [CREATE_SECURITYRULE_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_SECURITYRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_SECURITYRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    }

}, initialState);

