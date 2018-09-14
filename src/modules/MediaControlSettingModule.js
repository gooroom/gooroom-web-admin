import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'mediaControlSetting/COMMON_PENDING';
const COMMON_FAILURE = 'mediaControlSetting/COMMON_FAILURE';

const GET_MEDIACONTROL_LIST_SUCCESS = 'mediaControlSetting/GET_LIST_SUCCESS';
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
const initialState = Map({
    pending: false,
    error: false,
    resultMsg: '',

    defaultListParam: Map({
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chConfId',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: List([5, 10, 25]),
        rowsTotal: 0,
        rowsFiltered: 0
    }),

    dialogOpen: false,
    dialogType: '',
});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_MEDIACONTROL_DIALOG,
        selectedItem: param.selectedItem,
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
        selectedItem: param.selectedItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_MEDIACONTROL_INFORM,
        compId: param.compId
    });
};

export const readMediaControlSettingList = (module, compId, extParam) => dispatch => {
    let newListParam;
    if(module.get('viewItems')) {
        const viewIndex = module.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == compId;
        });
        if(viewIndex < 0) {
            newListParam = module.get('defaultListParam');
        } else {
            newListParam = module.getIn(['viewItems', viewIndex, 'listParam']).merge(extParam);
        }
    } else {
        newListParam = module.get('defaultListParam');
    }

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
                type: GET_MEDIACONTROL_LIST_SUCCESS,
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
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = action.response.data;

        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });
            if(viewIndex > -1) {
                const newListParam = state.getIn(['viewItems', viewIndex, 'listParam']).merge({
                    rowsFiltered: parseInt(recordsFiltered, 10),
                    rowsTotal: parseInt(recordsTotal, 10),
                    page: parseInt(draw, 10),
                    rowsPerPage: parseInt(rowLength, 10),
                    orderColumn: orderColumn,
                    orderDir: orderDir
                });
                return state
                        .setIn(['viewItems', viewIndex, 'listData'], List(data.map((e) => {return Map(e)})))
                        .setIn(['viewItems', viewIndex, 'listParam'], newListParam);
            } else {
                return state.set('viewItems', state.get('viewItems').push(Map({
                    '_COMPID_': action.compId,
                    'listData': List(data.map((e) => {return Map(e)})),
                    'listParam': state.get('defaultListParam').merge({
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10),
                        orderColumn: orderColumn,
                        orderDir: orderDir
                    })
                })));
            }
        } else {
            return state.set('viewItems', List([Map({
                '_COMPID_': action.compId,
                'listData': List(data.map((e) => {return Map(e)})),
                'listParam': state.get('defaultListParam').merge({
                    rowsFiltered: parseInt(recordsFiltered, 10),
                    rowsTotal: parseInt(recordsTotal, 10),
                    page: parseInt(draw, 10),
                    rowsPerPage: parseInt(rowLength, 10),
                    orderColumn: orderColumn,
                    orderDir: orderDir
                })
            })]));
        }
    }, 
    [GET_MEDIACONTROL_SUCCESS]: (state, action) => {
        const { data } = action.response.data;
        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });

            if(viewIndex < 0) {
                return state.set('viewItems', state.get('viewItems').push(Map({
                    '_COMPID_': action.compId,
                    'informOpen': true,
                    'selectedItem': fromJS(data[0])
                })));
            } else {
                return state
                    .setIn(['viewItems', viewIndex, 'selectedItem'], fromJS(data[0]))
                    .setIn(['viewItems', viewIndex, 'informOpen'], true);
            }
        } else {
            return state.set('viewItems', List([Map({
                '_COMPID_': action.compId,
                'selectedItem': fromJS(data[0]),
                'informOpen': true
            })]));
        }
    },
    [SHOW_MEDIACONTROL_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.selectedItem,
            dialogOpen: true,
            dialogType: action.dialogType
        });
    },
    [CLOSE_MEDIACONTROL_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SHOW_MEDIACONTROL_INFORM]: (state, action) => {
        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });
            if(viewIndex < 0) {
                return state.set('viewItems', state.get('viewItems').push(Map({
                    '_COMPID_': action.compId,
                    'informOpen': true,
                    'selectedItem': action.selectedItem
                })));
            } else {
                return state
                    .setIn(['viewItems', viewIndex, 'selectedItem'], action.selectedItem)
                    .setIn(['viewItems', viewIndex, 'informOpen'], true);
            }
        } else {
            // no occure this event
        }
        return state;
    },
    [CLOSE_MEDIACONTROL_INFORM]: (state, action) => {
        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });
            return state
                    .setIn(['viewItems', viewIndex, 'informOpen'], false)
                    .deleteIn(['viewItems', viewIndex, 'selectedItem'])
        }
        return state;
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        const viewIndex = state.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == action.compId;
        });
        return state.setIn(['viewItems', viewIndex, 'listParam', action.name], action.value);
    },
    [CHG_COMPVARIABLE_DATA]: (state, action) => {
        const viewIndex = state.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == action.compId;
        });
        return state.setIn(['viewItems', viewIndex, action.name], action.value);
    },
    [CREATE_MEDIACONTROL_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_MEDIACONTROL_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedItem')) {
                    if(e.getIn(['selectedItem', 'objId']) == action.objId) {
                        // replace
                        newState = newState.setIn(['viewItems', i, 'selectedItem'], fromJS(action.response.data.data[0]));
                    }
                }
            });
        }
        return state.merge(newState).merge({
            pending: false,
            error: false,
            dialogOpen: false,
            dialogType: ''
        });
    },
    [DELETE_MEDIACONTROL_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedItem')) {
                    if(e.getIn(['selectedItem', 'objId']) == action.objId) {
                        // replace
                        newState = newState.deleteIn(['viewItems', i, 'selectedItem']);
                    }
                }
            });
        }
        return state.merge(newState).merge({
            pending: false,
            error: false,
            dialogOpen: false,
            dialogType: ''
        });
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

