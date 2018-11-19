import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'securityLog/COMMON_PENDING';
const COMMON_FAILURE = 'securityLog/COMMON_FAILURE';

const GET_SECURITYLOG_LIST_SUCCESS = 'securityLog/GET_SECURITYLOG_LIST_SUCCESS';
const GET_SECURITYLOG_LISTPAGED_SUCCESS = 'securityLog/GET_SECURITYLOG_LISTPAGED_SUCCESS';
const GET_SECURITYLOG_SUCCESS = 'securityLog/GET_SECURITYLOG_SUCCESS';
const CREATE_SECURITYLOG_SUCCESS = 'securityLog/CREATE_SECURITYLOG_SUCCESS';
const EDIT_SECURITYLOG_SUCCESS = 'securityLog/EDIT_SECURITYLOG_SUCCESS';
const DELETE_SECURITYLOG_SUCCESS = 'securityLog/DELETE_SECURITYLOG_SUCCESS';

const SHOW_SECURITYLOG_INFORM = 'securityLog/SHOW_SECURITYLOG_INFORM';
const CLOSE_SECURITYLOG_INFORM = 'securityLog/CLOSE_SECURITYLOG_INFORM';
const SHOW_SECURITYLOG_DIALOG = 'securityLog/SHOW_SECURITYLOG_DIALOG';
const CLOSE_SECURITYLOG_DIALOG = 'securityLog/CLOSE_SECURITYLOG_DIALOG';

const SET_EDITING_ITEM_VALUE = 'securityLog/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'securityLog/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'securityLog/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'securityLog/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'securityLog/DELETE_COMPDATA_ITEM';

const SET_BLUETOOTHMAC_ITEM = 'securityLog/SET_BLUETOOTHMAC_ITEM';
const ADD_BLUETOOTHMAC_ITEM = 'securityLog/ADD_BLUETOOTHMAC_ITEM';
const DELETE_BLUETOOTHMAC_ITEM = 'securityLog/DELETE_BLUETOOTHMAC_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('LOG_SEQ', 'desc');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_SECURITYLOG_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_SECURITYLOG_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_SECURITYLOG_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_SECURITYLOG_INFORM,
        compId: param.compId
    });
};

export const readSecurityLogList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityLogList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_SECURITYLOG_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readSecurityLogListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityLogListPaged', {
        fromDate: '2018-11-16',
        toDate: '2018-11-19',
        logItem: 'ALL',
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_SECURITYLOG_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getSecurityLog = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readSecurityLog', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_SECURITYLOG_SUCCESS,
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
            name: 'viewItem'
        });      
    }

};

export const getSecurityLogByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityLogByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYLOG_SUCCESS,
                compId: compId,
                target: 'USER',
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getSecurityLogByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityLogByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYLOG_SUCCESS,
                compId: compId,
                target: 'DEPT',
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getSecurityLogByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityLogByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYLOG_SUCCESS,
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

export const deleteCompDataItem = (param) => dispatch => {
    return dispatch({
        type: DELETE_COMPDATA_ITEM,
        compId: param.compId,
        name: param.name,
        targetType: param.targetType
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
export const createSecurityLogData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createSecurityLog', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_SECURITYLOG_SUCCESS
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
export const editSecurityLogData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateSecurityLog', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readSecurityLog', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_SECURITYLOG_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readSecurityLogList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_SECURITYLOG_LIST_SUCCESS,
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
export const deleteSecurityLogData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteSecurityLog', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_SECURITYLOG_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit
export const inheritSecurityLogData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConfInherit', {
            'objId': param.objId,
            'confType': 'MEDIARULE',
            'deptCd': param.deptCd
        }).then(
        (response) => {
            dispatch({
                type: EDIT_SECURITYLOG_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const cloneSecurityLogData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClonedSecurityLog', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_SECURITYLOG_SUCCESS,
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
    [GET_SECURITYLOG_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_SECURITYLOG_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_SECURITYLOG_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend, action.target, 'objId');
    },
    [SHOW_SECURITYLOG_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_SECURITYLOG_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_SECURITYLOG_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_SECURITYLOG_INFORM]: (state, action) => {
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
    [CREATE_SECURITYLOG_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_SECURITYLOG_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_SECURITYLOG_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
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

