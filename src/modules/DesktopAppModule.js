import { handleActions } from 'redux-actions';
import { List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'desktopApp/COMMON_PENDING';
const COMMON_FAILURE = 'desktopApp/COMMON_FAILURE';

const GET_DESKTOPAPP_LIST_SUCCESS = 'desktopApp/GET_DESKTOPAPP_LIST_SUCCESS';
const GET_DESKTOPAPP_LISTPAGED_SUCCESS = 'desktopApp/GET_DESKTOPAPP_LISTPAGED_SUCCESS';
const GET_DESKTOPAPP_SUCCESS = 'desktopApp/GET_DESKTOPAPP_SUCCESS';
const CREATE_DESKTOPAPP_SUCCESS = 'desktopApp/CREATE_DESKTOPAPP_SUCCESS';
const EDIT_DESKTOPAPP_SUCCESS = 'desktopApp/EDIT_DESKTOPAPP_SUCCESS';
const DELETE_DESKTOPAPP_SUCCESS = 'desktopApp/DELETE_DESKTOPAPP_SUCCESS';

const SHOW_DESKTOPAPP_INFORM = 'desktopApp/SHOW_DESKTOPAPP_INFORM';
const CLOSE_DESKTOPAPP_INFORM = 'desktopApp/CLOSE_DESKTOPAPP_INFORM';
const SHOW_DESKTOPAPP_DIALOG = 'desktopApp/SHOW_DESKTOPAPP_DIALOG';
const CLOSE_DESKTOPAPP_DIALOG = 'desktopApp/CLOSE_DESKTOPAPP_DIALOG';

const SET_EDITING_ITEM_VALUE = 'desktopApp/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'desktopApp/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'desktopApp/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'desktopApp/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'desktopApp/DELETE_COMPDATA_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chAppId', 'asc');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_DESKTOPAPP_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_DESKTOPAPP_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_DESKTOPAPP_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_DESKTOPAPP_INFORM,
        compId: param.compId
    });
};

export const readDesktopAppList = (module, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopAppList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPAPP_LIST_SUCCESS,
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

export const readDesktopAppListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopAppListPaged', {
        keyword: newListParam.get('keyword'),
        status: newListParam.get('statusCd'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPAPP_LISTPAGED_SUCCESS,
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

export const getDesktopApp = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readDesktopApp', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_DESKTOPAPP_SUCCESS,
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
        return dispatch({
            type: DELETE_COMPDATA_ITEM,
            compId: compId,
            itemName: 'selectedViewItem'
        });      
    }

};

export const getDesktopAppByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopAppByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPAPP_SUCCESS,
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

export const getDesktopAppByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopAppByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPAPP_SUCCESS,
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

export const getDesktopAppByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopAppByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPAPP_SUCCESS,
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

export const deleteCompData = (param) => dispatch => {
    return dispatch({
        type: DELETE_COMPDATA,
        compId: param.compId
    });
};

const makeParameter = (param) => {
    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),

        webSocket: param.get('webSocket'),
        webWorker: param.get('webWorker'),
        trustSetupId: param.get('trustSetupId'),
        untrustSetupId: param.get('untrustSetupId'),
        trustUrlList: (param.get('trustUrlList')) ? param.get('trustUrlList').toArray() : []
    };
}

// create (add)
export const createDesktopAppData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createDesktopAppConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_DESKTOPAPP_SUCCESS
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
export const editDesktopAppData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDesktopAppConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readDesktopApp', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_DESKTOPAPP_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                });

                // change object array for selector
                requestPostAPI('readDesktopAppList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_DESKTOPAPP_LIST_SUCCESS,
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
export const deleteDesktopAppData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteDesktopAppConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_DESKTOPAPP_SUCCESS,
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
    [GET_DESKTOPAPP_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action);
    }, 
    [GET_DESKTOPAPP_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_DESKTOPAPP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend);
    },
    [SHOW_DESKTOPAPP_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_DESKTOPAPP_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_DESKTOPAPP_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_DESKTOPAPP_INFORM]: (state, action) => {
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
    [DELETE_COMPDATA]: (state, action) => {
        return state.deleteIn(['viewItems', action.compId]);
    },
    [DELETE_COMPDATA_ITEM]: (state, action) => {
        return state.deleteIn(['viewItems', action.compId, action.itemName]);
    },
    [CREATE_DESKTOPAPP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_DESKTOPAPP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_DESKTOPAPP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    }

}, initialState);

