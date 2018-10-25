import { handleActions } from 'redux-actions';
import { List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'desktopConf/COMMON_PENDING';
const COMMON_FAILURE = 'desktopConf/COMMON_FAILURE';

const GET_DESKTOPCONF_LIST_SUCCESS = 'desktopConf/GET_DESKTOPCONF_LIST_SUCCESS';
const GET_DESKTOPCONF_LISTPAGED_SUCCESS = 'desktopConf/GET_DESKTOPCONF_LISTPAGED_SUCCESS';
const GET_DESKTOPCONF_SUCCESS = 'desktopConf/GET_DESKTOPCONF_SUCCESS';
const CREATE_DESKTOPCONF_SUCCESS = 'desktopConf/CREATE_DESKTOPCONF_SUCCESS';
const EDIT_DESKTOPCONF_SUCCESS = 'desktopConf/EDIT_DESKTOPCONF_SUCCESS';
const DELETE_DESKTOPCONF_SUCCESS = 'desktopConf/DELETE_DESKTOPCONF_SUCCESS';

const SHOW_DESKTOPCONF_INFORM = 'desktopConf/SHOW_DESKTOPCONF_INFORM';
const CLOSE_DESKTOPCONF_INFORM = 'desktopConf/CLOSE_DESKTOPCONF_INFORM';
const SHOW_DESKTOPCONF_DIALOG = 'desktopConf/SHOW_DESKTOPCONF_DIALOG';
const CLOSE_DESKTOPCONF_DIALOG = 'desktopConf/CLOSE_DESKTOPCONF_DIALOG';

const SET_EDITING_ITEM_VALUE = 'desktopConf/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'desktopConf/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'desktopConf/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'desktopConf/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'desktopConf/DELETE_COMPDATA_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId', 'asc');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_DESKTOPCONF_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_DESKTOPCONF_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_DESKTOPCONF_INFORM,
        compId: param.compId,
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_DESKTOPCONF_INFORM,
        compId: param.compId
    });
};

export const readDesktopConfList = (module, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopConfList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPCONF_LIST_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readDesktopConfListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopConfListPaged', {
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
                type: GET_DESKTOPCONF_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getDesktopConf = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readDesktopConf', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_DESKTOPCONF_SUCCESS,
                    compId: compId,
                    response: response
                });
            }
        ).catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
        });
    } else {
        return dispatch({
            type: DELETE_COMPDATA_ITEM,
            compId: compId,
            itemName: 'viewItem'
        });      
    }

};

export const getDesktopConfByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopConfByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPCONF_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getDesktopConfByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopConfByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPCONF_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getDesktopConfByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopConfByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_DESKTOPCONF_SUCCESS,
                compId: compId,
                response: response
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
export const createDesktopConfData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createDesktopConfConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_DESKTOPCONF_SUCCESS
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
export const editDesktopConfData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDesktopConfConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readDesktopConf', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_DESKTOPCONF_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readDesktopConfList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_DESKTOPCONF_LIST_SUCCESS,
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
export const deleteDesktopConfData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteDesktopConfConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_DESKTOPCONF_SUCCESS,
                compId: param.compId,
                objId: param.objId
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
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [GET_DESKTOPCONF_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action);
    }, 
    [GET_DESKTOPCONF_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_DESKTOPCONF_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend);
    },
    [SHOW_DESKTOPCONF_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_DESKTOPCONF_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_DESKTOPCONF_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_DESKTOPCONF_INFORM]: (state, action) => {
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
        return state.deleteIn(['viewItems', action.compId, action.itemName]);
    },
    [CREATE_DESKTOPCONF_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_DESKTOPCONF_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_DESKTOPCONF_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    }

}, initialState);

