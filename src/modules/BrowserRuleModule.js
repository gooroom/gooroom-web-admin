import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'browserRule/COMMON_PENDING';
const COMMON_FAILURE = 'browserRule/COMMON_FAILURE';

const GET_BROWSERRULE_LIST_SUCCESS = 'browserRule/GET_BROWSERRULE_LIST_SUCCESS';
const GET_BROWSERRULE_LISTPAGED_SUCCESS = 'browserRule/GET_BROWSERRULE_LISTPAGED_SUCCESS';
const GET_BROWSERRULE_SUCCESS = 'browserRule/GET_BROWSERRULE_SUCCESS';

const CREATE_BROWSERRULE_SUCCESS = 'browserRule/CREATE_BROWSERRULE_SUCCESS';
const EDIT_BROWSERRULE_SUCCESS = 'browserRule/EDIT_BROWSERRULE_SUCCESS';
const DELETE_BROWSERRULE_SUCCESS = 'browserRule/DELETE_BROWSERRULE_SUCCESS';

const SHOW_BROWSERRULE_INFORM = 'browserRule/SHOW_BROWSERRULE_INFORM';
const CLOSE_BROWSERRULE_INFORM = 'browserRule/CLOSE_BROWSERRULE_INFORM';
const SHOW_BROWSERRULE_DIALOG = 'browserRule/SHOW_BROWSERRULE_DIALOG';
const CLOSE_BROWSERRULE_DIALOG = 'browserRule/CLOSE_BROWSERRULE_DIALOG';

const SET_EDITING_ITEM_VALUE = 'browserRule/SET_EDITING_ITEM_VALUE';
const CHG_LISTPARAM_DATA = 'browserRule/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'browserRule/CHG_COMPDATA_VALUE';

const DELETE_COMPDATA = 'browserRule/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'browserRule/DELETE_COMPDATA_ITEM';

const SET_WHITELIST_ITEM = 'browserRule/SET_WHITELIST_ITEM';
const ADD_WHITELIST_ITEM = 'browserRule/ADD_WHITELIST_ITEM';
const DELETE_WHITELIST_ITEM = 'browserRule/DELETE_WHITELIST_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_BROWSERRULE_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_BROWSERRULE_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_BROWSERRULE_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem,
        isEditable: param.isEditable
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_BROWSERRULE_INFORM,
        compId: param.compId
    });
};

export const readBrowserRuleList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRuleList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readBrowserRuleListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRuleListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getBrowserRule = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readBrowserRule', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_BROWSERRULE_SUCCESS,
                    compId: compId,
                    data: (response.data.data) ? response.data.data : null,
                    extend: (response.data.extend) ? response.data.extend : null,
                    target: ''
                });
            }
        ).catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
        });
    } else {
        return dispatch({
            type: DELETE_COMPDATA_ITEM,
            compId: compId,
            name: 'viewItem'
        });      
    }
};

export const getBrowserRuleByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRuleByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_SUCCESS,
                compId: compId,
                data: (response.data.data) ? response.data.data : null,
                extend: (response.data.extend) ? response.data.extend : null,
                target: 'USER'
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getBrowserRuleByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRuleByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_SUCCESS,
                compId: compId,
                data: (response.data.data) ? response.data.data : null,
                extend: (response.data.extend) ? response.data.extend : null,
                target: 'DEPT'
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getBrowserRuleByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRuleByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_SUCCESS,
                compId: compId,
                data: (response.data.data) ? response.data.data : null,
                extend: (response.data.extend) ? response.data.extend : null,
                target: 'GROUP'
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
        value: param.value,
        targetType: param.targetType
    });
};

export const deleteCompData = (param) => dispatch => {
    return dispatch({
        type: DELETE_COMPDATA,
        compId: param.compId,
        targetType: param.targetType
    });
};

export const deleteCompDataItem = (param) => dispatch => {
    return dispatch({
        type: DELETE_COMPDATA_ITEM,
        compId: param.compId,
        name: param.name,
        targetType: param.targetType
    });
};

const makeParameter = (param) => {
    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),
        adminType: param.get('adminType'),

        webSocket: (param.get('webSocket')) ? param.get('webSocket') : 'disallow',
        webWorker: (param.get('webWorker')) ? param.get('webWorker') : 'disallow',

        devToolRule__trust: (param.get('devToolRule__trust')) ? param.get('devToolRule__trust') : '1',
        downloadRule__trust: (param.get('downloadRule__trust')) ? param.get('downloadRule__trust') : '0',
        printRule__trust: (param.get('printRule__trust')) ? param.get('printRule__trust') : 'true',
        viewSourceRule__trust: (param.get('viewSourceRule__trust')) ? param.get('viewSourceRule__trust') : 'true',
        trustSetup: (param.get('trustSetup')) ? param.get('trustSetup') : '',
        
        devToolRule__untrust: (param.get('devToolRule__untrust')) ? param.get('devToolRule__untrust') : '1',
        downloadRule__untrust: (param.get('downloadRule__untrust')) ? param.get('downloadRule__untrust') : '0',
        printRule__untrust: (param.get('printRule__untrust')) ? param.get('printRule__untrust') : 'true',
        viewSourceRule__untrust: (param.get('viewSourceRule__untrust')) ? param.get('viewSourceRule__untrust') : 'true',
        untrustSetup: (param.get('untrustSetup')) ? param.get('untrustSetup') : '',
        
        trustUrlList: (param.get('trustUrlList')) ? param.get('trustUrlList').toArray() : []
    };
}

// create (add)
export const createBrowserRuleData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createBrowserRuleConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_BROWSERRULE_SUCCESS
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
export const editBrowserRuleData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateBrowserRuleConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // change selected object
                requestPostAPI('readBrowserRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_BROWSERRULE_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readBrowserRuleList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_BROWSERRULE_LIST_SUCCESS,
                            compId: compId,
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });
            } else {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete
export const deleteBrowserRuleData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteBrowserRuleConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_BROWSERRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit - dept
export const inheritBrowserRuleDataForDept = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConfInherit', {
            'objId': param.objId,
            'confType': 'BROWSERRULE',
            'deptCd': param.deptCd
        }).then(
        (response) => {
            dispatch({
                type: EDIT_BROWSERRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit - group
export const inheritBrowserRuleDataForGroup = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroupConfInherit', {
            'objId': param.objId,
            'confType': 'BROWSERRULE',
            'grpId': param.grpId
        }).then(
        (response) => {
            dispatch({
                type: EDIT_BROWSERRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const cloneBrowserRuleData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('cloneBrowserRule', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_BROWSERRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const addWhiteList = () => dispatch => {
    return dispatch({
        type: ADD_WHITELIST_ITEM
    });
}

export const deleteWhiteList = (index) => dispatch => {
    return dispatch({
        type: DELETE_WHITELIST_ITEM,
        index: index
    });
}

export const setWhiteList = (param) => dispatch => {
    return dispatch({
        type: SET_WHITELIST_ITEM,
        index: param.index,
        value: param.value
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
    [GET_BROWSERRULE_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_BROWSERRULE_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_BROWSERRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.data, action.extend, action.target, 'objId');
    },
    [SHOW_BROWSERRULE_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_BROWSERRULE_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_BROWSERRULE_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_BROWSERRULE_INFORM]: (state, action) => {
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
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [DELETE_COMPDATA]: (state, action) => {
        return state.deleteIn(['viewItems', action.compId]);
    },
    [DELETE_COMPDATA_ITEM]: (state, action) => {
        return commonHandleActions.handleDeleteCompItem(state, action);
    },
    [CREATE_BROWSERRULE_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_BROWSERRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_BROWSERRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    },
    [SET_WHITELIST_ITEM]: (state, action) => {
        const newWhiteList = state.getIn(['editingItem', 'trustUrlList']).set(action.index, action.value);
        return state.setIn(['editingItem', 'trustUrlList'], newWhiteList);
    },
    [ADD_WHITELIST_ITEM]: (state, action) => {
        const newWhiteList = (state.getIn(['editingItem', 'trustUrlList'])) ? state.getIn(['editingItem', 'trustUrlList']).push('') : List(['']);
        return state.setIn(['editingItem', 'trustUrlList'], newWhiteList);
    },
    [DELETE_WHITELIST_ITEM]: (state, action) => {
        const newWhiteList = state.getIn(['editingItem', 'trustUrlList']).delete(action.index);
        return state.setIn(['editingItem', 'trustUrlList'], newWhiteList);
    },

}, initialState);

