import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientConfSetting/COMMON_PENDING';
const COMMON_FAILURE = 'clientConfSetting/COMMON_FAILURE';

const GET_CONFSETTING_LIST_SUCCESS = 'clientConfSetting/GET_CONFSETTING_LIST_SUCCESS';
const GET_CONFSETTING_LISTPAGED_SUCCESS = 'clientConfSetting/GET_CONFSETTING_LISTPAGED_SUCCESS';
const GET_CONFSETTING_SUCCESS = 'clientConfSetting/GET_CONFSETTING_SUCCESS';
const CREATE_CONFSETTING_SUCCESS = 'clientConfSetting/CREATE_CONFSETTING_SUCCESS';
const EDIT_CONFSETTING_SUCCESS = 'clientConfSetting/EDIT_CONFSETTING_SUCCESS';
const DELETE_CONFSETTING_SUCCESS = 'clientConfSetting/DELETE_CONFSETTING_SUCCESS';

const SHOW_CONFSETTING_INFORM = 'clientConfSetting/SHOW_CONFSETTING_INFORM';
const CLOSE_CONFSETTING_INFORM = 'clientConfSetting/CLOSE_CONFSETTING_INFORM';
const SHOW_CONFSETTING_DIALOG = 'clientConfSetting/SHOW_CONFSETTING_DIALOG';
const CLOSE_CONFSETTING_DIALOG = 'clientConfSetting/CLOSE_CONFSETTING_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientConfSetting/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientConfSetting/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientConfSetting/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'clientConfSetting/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'clientConfSetting/DELETE_COMPDATA_ITEM';

const SET_NTP_VALUE = 'clientConfSetting/SET_NTP_VALUE';
const ADD_NTPADDRESS_ITEM = 'clientConfSetting/ADD_NTPADDRESS_ITEM';
const DELETE_NTPADDRESS_ITEM = 'clientConfSetting/DELETE_NTPADDRESS_ITEM';

// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_INFORM,
        compId: param.compId
    });
};

export const readClientConfSettingList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readClientConfSettingListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getClientConf = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readClientConf', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_CONFSETTING_SUCCESS,
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

export const getClientConfByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_SUCCESS,
                compId: compId,
                target: 'GROUP',
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

        USEHYPERVISOR: param.get('useHypervisor'),
        NTPSELECTADDRESS: (param.get('selectedNtpIndex') > -1) ? param.getIn(['ntpAddress', param.get('selectedNtpIndex')]) : '',
        NTPADDRESSES: (param.get('ntpAddress')) ? param.get('ntpAddress').toArray() : []
    };
}

// create (add)
export const createClientConfSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CONFSETTING_SUCCESS
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
export const editClientConfSettingData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readClientConf', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CONFSETTING_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readClientConfList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_CONFSETTING_LIST_SUCCESS,
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
export const deleteClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_CONFSETTING_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const cloneClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClonedClientConf', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_CONFSETTING_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};


export const addNtpAddress = () => dispatch => {
    return dispatch({
        type: ADD_NTPADDRESS_ITEM
    });
}

export const deleteNtpAddress = (index) => dispatch => {
    return dispatch({
        type: DELETE_NTPADDRESS_ITEM,
        index: index
    });
}

export const setNtpValue = (param) => dispatch => {
    return dispatch({
        type: SET_NTP_VALUE,
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
    [GET_CONFSETTING_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_CONFSETTING_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_CONFSETTING_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend, action.target, 'objId');
    },
    [SHOW_CONFSETTING_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CONFSETTING_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_CONFSETTING_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CONFSETTING_INFORM]: (state, action) => {
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
    [CREATE_CONFSETTING_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CONFSETTING_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_CONFSETTING_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    },
    [SET_NTP_VALUE]: (state, action) => {
        const newNtpAddress = state.getIn(['editingItem', 'ntpAddress']).set(action.index, action.value);
        return state.setIn(['editingItem', 'ntpAddress'], newNtpAddress);
    },
    [ADD_NTPADDRESS_ITEM]: (state, action) => {
        const newNtpAddress = (state.getIn(['editingItem', 'ntpAddress'])) ? state.getIn(['editingItem', 'ntpAddress']).push('') : List(['']);
        return state.setIn(['editingItem', 'ntpAddress'], newNtpAddress);
    },
    [DELETE_NTPADDRESS_ITEM]: (state, action) => {
        const newNtpAddress = state.getIn(['editingItem', 'ntpAddress']).delete(action.index);
        return state.setIn(['editingItem', 'ntpAddress'], newNtpAddress);
    },

}, initialState);

