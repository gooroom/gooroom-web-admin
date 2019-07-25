import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'policyKitRule/COMMON_PENDING';
const COMMON_FAILURE = 'policyKitRule/COMMON_FAILURE';

const GET_POLICYKIT_LIST_SUCCESS = 'policyKitRule/GET_POLICYKIT_LIST_SUCCESS';
const GET_POLICYKIT_LISTPAGED_SUCCESS = 'policyKitRule/GET_POLICYKIT_LISTPAGED_SUCCESS';
const GET_POLICYKIT_SUCCESS = 'policyKitRule/GET_POLICYKIT_SUCCESS';
const CREATE_POLICYKIT_SUCCESS = 'policyKitRule/CREATE_POLICYKIT_SUCCESS';
const EDIT_POLICYKIT_SUCCESS = 'policyKitRule/EDIT_POLICYKIT_SUCCESS';
const DELETE_POLICYKIT_SUCCESS = 'policyKitRule/DELETE_POLICYKIT_SUCCESS';

const SHOW_POLICYKIT_INFORM = 'policyKitRule/SHOW_POLICYKIT_INFORM';
const CLOSE_POLICYKIT_INFORM = 'policyKitRule/CLOSE_POLICYKIT_INFORM';
const SHOW_POLICYKIT_DIALOG = 'policyKitRule/SHOW_POLICYKIT_DIALOG';
const CLOSE_POLICYKIT_DIALOG = 'policyKitRule/CLOSE_POLICYKIT_DIALOG';

const SET_EDITING_ITEM_VALUE = 'policyKitRule/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'policyKitRule/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'policyKitRule/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'policyKitRule/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'policyKitRule/DELETE_COMPDATA_ITEM';

const SET_BLUETOOTHMAC_ITEM = 'policyKitRule/SET_BLUETOOTHMAC_ITEM';
const ADD_BLUETOOTHMAC_ITEM = 'policyKitRule/ADD_BLUETOOTHMAC_ITEM';
const DELETE_BLUETOOTHMAC_ITEM = 'policyKitRule/DELETE_BLUETOOTHMAC_ITEM';

const SET_SERIALNO_ITEM = 'policyKitRule/SET_SERIALNO_ITEM';
const ADD_SERIALNO_ITEM = 'policyKitRule/ADD_SERIALNO_ITEM';
const DELETE_SERIALNO_ITEM = 'policyKitRule/DELETE_SERIALNO_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_POLICYKIT_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_POLICYKIT_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_POLICYKIT_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem,
        isEditable: param.isEditable
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_POLICYKIT_INFORM,
        compId: param.compId
    });
};

export const readPolicyKitRuleList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readPolicyKitRuleList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_POLICYKIT_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readPolicyKitRuleListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readPolicyKitRuleListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_POLICYKIT_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getPolicyKitRule = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readPolicyKitRule', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_POLICYKIT_SUCCESS,
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

export const getPolicyKitRuleByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readPolicyKitRuleByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_POLICYKIT_SUCCESS,
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

export const getPolicyKitRuleByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readPolicyKitRuleByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_POLICYKIT_SUCCESS,
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

export const getPolicyKitRuleByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readPolicyKitRuleByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_POLICYKIT_SUCCESS,
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
        adminType: param.get('adminType'),

        gooroom_update: (param.get('gooroomUpdate')) ? param.get('gooroomUpdate') : 'disallow',
        gooroom_agent: (param.get('gooroomAgent')) ? param.get('gooroomAgent') : 'disallow',
        gooroom_register: (param.get('gooroomRegister')) ? param.get('gooroomRegister') : 'disallow',
        grac_editor: (param.get('gracEditor')) ? param.get('gracEditor') : 'disallow',
        wire_wireless: (param.get('wireWireless')) ? param.get('wireWireless') : 'disallow',
        network_config: (param.get('networkConfig')) ? param.get('networkConfig') : 'disallow',
        printer: (param.get('printer')) ? param.get('printer') : 'disallow',
        disk_mount: (param.get('diskMount')) ? param.get('diskMount') : 'disallow',
        bluetooth: (param.get('bluetooth')) ? param.get('bluetooth') : 'disallow',
        pkexec: (param.get('pkexec')) ? param.get('pkexec') : 'disallow'
    };
}

// create (add)
export const createPolicyKitRuleData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createPolicyKitRule', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_POLICYKIT_SUCCESS
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
export const editPolicyKitRuleData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updatePolicyKitRule', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // change selected object
                requestPostAPI('readPolicyKitRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_POLICYKIT_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readPolicyKitRuleList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_POLICYKIT_LIST_SUCCESS,
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
export const deletePolicyKitRuleData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deletePolicyKitRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_POLICYKIT_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit -dept
export const inheritPolicyKitRuleDataForDept = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConfInherit', {
            'objId': param.objId,
            'confType': 'POLICYKITRULE',
            'deptCd': param.deptCd
        }).then(
        (response) => {
            dispatch({
                type: EDIT_POLICYKIT_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit - group
export const inheritPolicyKitRuleDataForGroup = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroupConfInherit', {
            'objId': param.objId,
            'confType': 'POLICYKITRULE',
            'grpId': param.grpId
        }).then(
        (response) => {
            dispatch({
                type: EDIT_POLICYKIT_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const clonePolicyKitRuleData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('clonePolicyKitRule', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_POLICYKIT_SUCCESS,
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

export const addSerialNo = () => dispatch => {
    return dispatch({
        type: ADD_SERIALNO_ITEM
    });
}

export const deleteSerialNo = (index) => dispatch => {
    return dispatch({
        type: DELETE_SERIALNO_ITEM,
        index: index
    });
}

export const setSerialNo = (param) => dispatch => {
    return dispatch({
        type: SET_SERIALNO_ITEM,
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
    [GET_POLICYKIT_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_POLICYKIT_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_POLICYKIT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.data, action.extend, action.target, 'objId');
    },
    [SHOW_POLICYKIT_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_POLICYKIT_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_POLICYKIT_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_POLICYKIT_INFORM]: (state, action) => {
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
    [CREATE_POLICYKIT_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_POLICYKIT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_POLICYKIT_SUCCESS]: (state, action) => {
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
    },
    [SET_SERIALNO_ITEM]: (state, action) => {
        const newSerialNo = state.getIn(['editingItem', 'usbSerialNo']).set(action.index, action.value);
        return state.setIn(['editingItem', 'usbSerialNo'], newSerialNo);
    },
    [ADD_SERIALNO_ITEM]: (state, action) => {
        const newSerialNo = (state.getIn(['editingItem', 'usbSerialNo'])) ? state.getIn(['editingItem', 'usbSerialNo']).push('') : List(['']);
        return state.setIn(['editingItem', 'usbSerialNo'], newSerialNo);
    },
    [DELETE_SERIALNO_ITEM]: (state, action) => {
        const newSerialNo = state.getIn(['editingItem', 'usbSerialNo']).delete(action.index);
        return state.setIn(['editingItem', 'usbSerialNo'], newSerialNo);
    }

}, initialState);

