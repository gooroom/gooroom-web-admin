import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GrUtils/GrRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientPackage/COMMON_PENDING';
const COMMON_FAILURE = 'clientPackage/COMMON_FAILURE';
const SET_EDITING_ITEM_VALUE = 'clientPackage/SET_EDITING_ITEM_VALUE';
const CHG_LISTPARAM_DATA = 'clientPackage/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientPackage/CHG_COMPDATA_VALUE';

const GET_CLIENTPACKAGE_LISTPAGED_SUCCESS = 'clientPackage/GET_CLIENTPACKAGE_LISTPAGED_SUCCESS';

const CREATE_CLIENTPACKAGE_SUCCESS = 'clientPackage/CREATE_CLIENTPACKAGE_SUCCESS';
const EDIT_CLIENTPACKAGE_SUCCESS = 'clientPackage/EDIT_CLIENTPACKAGE_SUCCESS';
const DELETE_CLIENTPACKAGE_SUCCESS = 'clientPackage/DELETE_CLIENTPACKAGE_SUCCESS';

const SHOW_CLIENTPACKAGE_INFORM = 'clientPackage/SHOW_CLIENTPACKAGE_INFORM';
const CLOSE_CLIENTPACKAGE_INFORM = 'clientPackage/CLOSE_CLIENTPACKAGE_INFORM';
const SHOW_CLIENTPACKAGE_DIALOG = 'clientPackage/SHOW_CLIENTPACKAGE_DIALOG';
const CLOSE_CLIENTPACKAGE_DIALOG = 'clientPackage/CLOSE_CLIENTPACKAGE_DIALOG';

const ADD_CLIENTINGROUP_SUCCESS = 'clientPackage/ADD_CLIENTINGROUP_SUCCESS';
const REMOVE_CLIENTINGROUP_SUCCESS = 'clientPackage/REMOVE_CLIENTINGROUP_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chPackageId', 'asc', {dialogTabValue: 0});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTPACKAGE_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTPACKAGE_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTPACKAGE_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTPACKAGE_INFORM,
        compId: param.compId
    });
};

export const readClientPackageListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readTotalPackageListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTPACKAGE_LISTPAGED_SUCCESS,
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

// create (add)
export const createClientPackageData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientPackage', {
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
                        type: CREATE_CLIENTPACKAGE_SUCCESS,
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
export const editClientPackageData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientPackage', {
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
                requestPostAPI('readClientPackageData', {'groupId': item.get('grpId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CLIENTPACKAGE_SUCCESS,
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
export const deleteClientPackageData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientPackage', {'groupId': param.grpId}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTPACKAGE_SUCCESS,
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
export const deleteSelectedClientPackageData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientPackageList', {'groupIds': param.grpIds}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTPACKAGE_SUCCESS,
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
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            ex: (action.ex) ? action.ex : ''
        });
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({ editingItem: state.get('editingItem').merge({[action.name]: action.value}) });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return state.setIn(['viewItems', action.compId, action.name], action.value);
    },


    [GET_CLIENTPACKAGE_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [SHOW_CLIENTPACKAGE_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CLIENTPACKAGE_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_CLIENTPACKAGE_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CLIENTPACKAGE_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },


    [CREATE_CLIENTPACKAGE_SUCCESS]: (state, action) => {
        return state.merge({ pending: false, error: false });
    },
    [EDIT_CLIENTPACKAGE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_CLIENTPACKAGE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    },

    [ADD_CLIENTINGROUP_SUCCESS]: (state, action) => {
        return state.merge({ pending: false, error: false });
    },
    [REMOVE_CLIENTINGROUP_SUCCESS]: (state, action) => {
        return state.merge({ pending: false, error: false });
    }

}, initialState);

