import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'mediaControlSetting/COMMON_PENDING';
const COMMON_FAILURE = 'mediaControlSetting/COMMON_FAILURE';

const GET_MEDIACONTROL_LIST_SUCCESS = 'mediaControlSetting/GET_MEDIACONTROL_LIST_SUCCESS';
const GET_MEDIACONTROL_LISTPAGED_SUCCESS = 'mediaControlSetting/GET_MEDIACONTROL_LISTPAGED_SUCCESS';
const GET_MEDIACONTROL_SUCCESS = 'mediaControlSetting/GET_MEDIACONTROL_SUCCESS';
const CREATE_MEDIACONTROL_SUCCESS = 'mediaControlSetting/CREATE_MEDIACONTROL_SUCCESS';
const EDIT_MEDIACONTROL_SUCCESS = 'mediaControlSetting/EDIT_MEDIACONTROL_SUCCESS';
const DELETE_MEDIACONTROL_SUCCESS = 'mediaControlSetting/DELETE_MEDIACONTROL_SUCCESS';

const SHOW_MEDIACONTROL_INFORM = 'mediaControlSetting/SHOW_MEDIACONTROL_INFORM';
const CLOSE_MEDIACONTROL_INFORM = 'mediaControlSetting/CLOSE_MEDIACONTROL_INFORM';
const SHOW_MEDIACONTROL_DIALOG = 'mediaControlSetting/SHOW_MEDIACONTROL_DIALOG';
const CLOSE_MEDIACONTROL_DIALOG = 'mediaControlSetting/CLOSE_MEDIACONTROL_DIALOG';

const SET_EDITING_ITEM_VALUE = 'mediaControlSetting/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'mediaControlSetting/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'mediaControlSetting/CHG_COMPVARIABLE_DATA';

const SET_BLUETOOTHMAC_ITEM = 'mediaControlSetting/SET_BLUETOOTHMAC_ITEM';
const ADD_BLUETOOTHMAC_ITEM = 'mediaControlSetting/ADD_BLUETOOTHMAC_ITEM';
const DELETE_BLUETOOTHMAC_ITEM = 'mediaControlSetting/DELETE_BLUETOOTHMAC_ITEM';


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

export const readMediaControlSettingList = (module, compId) => dispatch => {
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
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const readMediaControlSettingListPaged = (module, compId, extParam) => dispatch => {
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
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const getMediaControlSetting = (param) => dispatch => {
    const compId = param.compId;
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
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const getMediaControlSettingByUserId = (param) => dispatch => {
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
export const createMediaControlSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createMediaRule', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_MEDIACONTROL_SUCCESS
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
export const editMediaControlSettingData = (itemObj) => dispatch => {
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
export const deleteMediaControlSettingData = (param) => dispatch => {
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
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
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
    [GET_MEDIACONTROL_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action);
    }, 
    [GET_MEDIACONTROL_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_MEDIACONTROL_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data);
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
    [CHG_COMPVARIABLE_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, action.name], action.value);
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

