import { handleActions } from 'redux-actions';
import { List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'mediaRule/COMMON_PENDING';
const COMMON_FAILURE = 'mediaRule/COMMON_FAILURE';

const GET_MEDIACONTROL_LIST_SUCCESS = 'mediaRule/GET_MEDIACONTROL_LIST_SUCCESS';
const GET_MEDIACONTROL_LISTPAGED_SUCCESS = 'mediaRule/GET_MEDIACONTROL_LISTPAGED_SUCCESS';
const GET_MEDIACONTROL_SUCCESS = 'mediaRule/GET_MEDIACONTROL_SUCCESS';
const CREATE_MEDIACONTROL_SUCCESS = 'mediaRule/CREATE_MEDIACONTROL_SUCCESS';
const EDIT_MEDIACONTROL_SUCCESS = 'mediaRule/EDIT_MEDIACONTROL_SUCCESS';
const DELETE_MEDIACONTROL_SUCCESS = 'mediaRule/DELETE_MEDIACONTROL_SUCCESS';

const SHOW_MEDIACONTROL_INFORM = 'mediaRule/SHOW_MEDIACONTROL_INFORM';
const CLOSE_MEDIACONTROL_INFORM = 'mediaRule/CLOSE_MEDIACONTROL_INFORM';
const SHOW_MEDIACONTROL_DIALOG = 'mediaRule/SHOW_MEDIACONTROL_DIALOG';
const CLOSE_MEDIACONTROL_DIALOG = 'mediaRule/CLOSE_MEDIACONTROL_DIALOG';

const SET_EDITING_ITEM_VALUE = 'mediaRule/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'mediaRule/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'mediaRule/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'mediaRule/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'mediaRule/DELETE_COMPDATA_ITEM';

const SET_BLUETOOTHMAC_ITEM = 'mediaRule/SET_BLUETOOTHMAC_ITEM';
const ADD_BLUETOOTHMAC_ITEM = 'mediaRule/ADD_BLUETOOTHMAC_ITEM';
const DELETE_BLUETOOTHMAC_ITEM = 'mediaRule/DELETE_BLUETOOTHMAC_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_MEDIACONTROL_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_MEDIACONTROL_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_MEDIACONTROL_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_MEDIACONTROL_INFORM,
        compId: param.compId
    });
};

export const readMediaRuleList = (module, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readMediaRuleList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_MEDIACONTROL_LIST_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readMediaRuleListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readMediaRuleListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_MEDIACONTROL_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getMediaRule = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readMediaRule', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_MEDIACONTROL_SUCCESS,
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
            itemName: 'selectedViewItem'
        });      
    }

};

export const getMediaRuleByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readMediaRuleByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_MEDIACONTROL_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getMediaRuleByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readMediaRuleByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_MEDIACONTROL_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getMediaRuleByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readMediaRuleByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_MEDIACONTROL_SUCCESS,
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

    const usbReadonly = (param.get('usbReadonly') == 'allow') ? 'allow' : 'disallow';
    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),
        
        usb_memory: (param.get('usbMemory') == 'allow') ? ((usbReadonly == 'allow') ? 'read_only' : 'allow') : 'disallow',
        cd_dvd: (param.get('cdAndDvd') == 'allow') ? 'allow' : 'disallow',
        printer: (param.get('printer') == 'allow') ? 'allow' : 'disallow',
        screen_capture: (param.get('screenCapture') == 'allow') ? 'allow' : 'disallow',
        camera: (param.get('camera') == 'allow') ? 'allow' : 'disallow',
        sound: (param.get('sound') == 'allow') ? 'allow' : 'disallow',
        keyboard: (param.get('keyboard') == 'allow') ? 'allow' : 'disallow',
        mouse: (param.get('mouse') == 'allow') ? 'allow' : 'disallow',
        wireless: (param.get('wireless') == 'allow') ? 'allow' : 'disallow',
        bluetooth_state: (param.get('bluetoothState') == 'allow') ? 'allow' : 'disallow',
        macAddressList: (param.get('macAddress')) ? param.get('macAddress').toArray() : []
    };
}

// create (add)
export const createMediaRuleData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createMediaRule', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_MEDIACONTROL_SUCCESS
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
export const editMediaRuleData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateMediaRule', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readMediaRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_MEDIACONTROL_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readMediaRuleList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_MEDIACONTROL_LIST_SUCCESS,
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
export const deleteMediaRuleData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteMediaRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_MEDIACONTROL_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit
export const inheritMediaRuleData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConfInherit', {
            'objId': param.objId,
            'confType': 'MEDIARULE',
            'deptCd': param.deptCd
        }).then(
        (response) => {
            dispatch({
                type: EDIT_MEDIACONTROL_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const addBluetoothMac = () => dispatch => {
    return dispatch({
        type: ADD_BLUETOOTHMAC_ITEM
    });
}

export const deleteBluetoothMac = (index) => dispatch => {
    return dispatch({
        type: DELETE_BLUETOOTHMAC_ITEM,
        index: index
    });
}

export const setBluetoothMac = (param) => dispatch => {
    return dispatch({
        type: SET_BLUETOOTHMAC_ITEM,
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
    [GET_MEDIACONTROL_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action);
    }, 
    [GET_MEDIACONTROL_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_MEDIACONTROL_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend);
    },
    [SHOW_MEDIACONTROL_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_MEDIACONTROL_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_MEDIACONTROL_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_MEDIACONTROL_INFORM]: (state, action) => {
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
    [CREATE_MEDIACONTROL_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_MEDIACONTROL_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_MEDIACONTROL_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    },
    [SET_BLUETOOTHMAC_ITEM]: (state, action) => {
        const newBluetoothMac = state.getIn(['editingItem', 'macAddress']).set(action.index, action.value);
        return state.setIn(['editingItem', 'macAddress'], newBluetoothMac);
    },
    [ADD_BLUETOOTHMAC_ITEM]: (state, action) => {
        const newBluetoothMac = (state.getIn(['editingItem', 'macAddress'])) ? state.getIn(['editingItem', 'macAddress']).push('') : List(['']);
        return state.setIn(['editingItem', 'macAddress'], newBluetoothMac);
    },
    [DELETE_BLUETOOTHMAC_ITEM]: (state, action) => {
        const newBluetoothMac = state.getIn(['editingItem', 'macAddress']).delete(action.index);
        return state.setIn(['editingItem', 'macAddress'], newBluetoothMac);
    }

}, initialState);

