import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'groupComp/COMMON_PENDING';
const COMMON_FAILURE = 'groupComp/COMMON_FAILURE';

const GET_GROUP_LIST_SUCCESS = 'groupComp/GET_GROUP_LIST_SUCCESS';
const GET_GROUP_LISTPAGED_SUCCESS = 'groupComp/GET_GROUP_LISTPAGED_SUCCESS';

const CREATE_CLIENTGROUP_SUCCESS = 'groupComp/CREATE_CLIENTGROUP_SUCCESS';
const EDIT_CLIENTGROUP_SUCCESS = 'groupComp/EDIT_CLIENTGROUP_SUCCESS';
const DELETE_CLIENTGROUP_SUCCESS = 'groupComp/DELETE_CLIENTGROUP_SUCCESS';

const SHOW_CLIENTGROUP_INFORM = 'groupComp/SHOW_CLIENTGROUP_INFORM';
const CLOSE_CLIENTGROUP_INFORM = 'groupComp/CLOSE_CLIENTGROUP_INFORM';
const SHOW_CLIENTGROUP_DIALOG = 'groupComp/SHOW_CLIENTGROUP_DIALOG';
const CLOSE_CLIENTGROUP_DIALOG = 'groupComp/CLOSE_CLIENTGROUP_DIALOG';

const SET_EDITING_ITEM_VALUE = 'groupComp/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'groupComp/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'groupComp/CHG_COMPDATA_VALUE';
const CHG_STORE_DATA = 'groupComp/CHG_STORE_DATA';
const ADD_CLIENTINGROUP_SUCCESS = 'groupComp/ADD_CLIENTINGROUP_SUCCESS';
const REMOVE_CLIENTINGROUP_SUCCESS = 'groupComp/REMOVE_CLIENTINGROUP_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chGrpNm', 'asc', {dialogTabValue: 0});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTGROUP_DIALOG
    });
};

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTGROUP_INFORM,
        compId: param.compId
    });
};

export const readClientGroupListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientGroupListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_GROUP_LISTPAGED_SUCCESS,
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
export const createClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientGroup', {
        groupName: param.groupName,
        groupComment: param.groupComment,
        clientConfigId: (param.clientConfigId == '-') ? '' : param.clientConfigId,
        hostNameConfigId: (param.hostNameConfigId == '-') ? '' : param.hostNameConfigId,
        updateServerConfigId: (param.updateServerConfigId == '-') ? '' : param.updateServerConfigId,
        browserRuleId: (param.browserRuleId == '-') ? '' : param.browserRuleId,
        mediaRuleId: (param.mediaRuleId == '-') ? '' : param.mediaRuleId,
        securityRuleId: (param.securityRuleId == '-') ? '' : param.securityRuleId
    }).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CLIENTGROUP_SUCCESS,
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
export const editClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroup', {
        groupId: param.groupId,
        groupName: param.groupName,
        groupComment: param.groupComment,
        clientConfigId: (param.clientConfigId == '-') ? '' : param.clientConfigId,
        hostNameConfigId: (param.hostNameConfigId == '-') ? '' : param.hostNameConfigId,
        updateServerConfigId: (param.updateServerConfigId == '-') ? '' : param.updateServerConfigId,
        browserRuleId: (param.browserRuleId == '-') ? '' : param.browserRuleId,
        mediaRuleId: (param.mediaRuleId == '-') ? '' : param.mediaRuleId,
        securityRuleId: (param.securityRuleId == '-') ? '' : param.securityRuleId
    }).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                requestPostAPI('readClientGroupData', {'groupId': item.get('grpId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CLIENTGROUP_SUCCESS,
                            grpId: item.get('grpId'),
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
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientGroup', {'groupId': param.grpId}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTGROUP_SUCCESS,
                compId: param.compId,
                grpId: param.grpId
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

// delete group selected
export const deleteSelectedClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientGroupList', {'groupIds': param.grpIds}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTGROUP_SUCCESS,
                compId: param.compId,
                grpId: param.grpId
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};


// add clients in group
export const addClientsInGroup = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('addClientsInGroup', itemObj).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: ADD_CLIENTINGROUP_SUCCESS
                    });
                }    
            } catch(ex) {
                dispatch({ type: COMMON_FAILURE, ex: ex });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete clients in group
export const removeClientsInGroup = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('removeClientsInGroup', itemObj).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: REMOVE_CLIENTINGROUP_SUCCESS
                    });
                }    
            } catch(ex) {
                dispatch({ type: COMMON_FAILURE, ex: ex });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
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

    [GET_GROUP_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [SHOW_CLIENTGROUP_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CLIENTGROUP_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CLIENTGROUP_INFORM]: (state, action) => {
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
    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    },
    [ADD_CLIENTINGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [REMOVE_CLIENTINGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    }

}, initialState);

