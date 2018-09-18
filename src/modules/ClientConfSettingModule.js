import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

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
const CHG_COMPVARIABLE_DATA = 'clientConfSetting/CHG_COMPVARIABLE_DATA';

const SET_NTP_VALUE = 'clientConfSetting/SET_NTP_VALUE';
const ADD_NTPADDRESS_ITEM = 'clientConfSetting/ADD_NTPADDRESS_ITEM';
const DELETE_NTPADDRESS_ITEM = 'clientConfSetting/DELETE_NTPADDRESS_ITEM';

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
        type: SHOW_CONFSETTING_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_INFORM,
        compId: param.compId
    });
};

export const readClientConfSettingList = (module, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_LIST_SUCCESS,
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

export const readClientConfSettingListPaged = (module, compId, extParam) => dispatch => {
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
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const getClientConfSetting = (param) => dispatch => {
    const compId = param.compId;
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
    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),
        AGENTPOLLINGTIME: param.get('pollingTime'),
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
export const editClientConfSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientConf', makeParameter(itemObj)).then(
        (response) => {

            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                requestPostAPI('readClientConf', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CONFSETTING_SUCCESS,
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
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
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
    [GET_CONFSETTING_LIST_SUCCESS]: (state, action) => {
        const { data } = action.response.data;

        if(data && data.length > 0) {
            if(state.get('viewItems')) {
                const viewIndex = state.get('viewItems').findIndex((e) => {
                    return e.get('_COMPID_') == action.compId;
                });
                if(viewIndex > -1) {
                    return state
                            .setIn(['viewItems', viewIndex, 'listAllData'], List(data.map((e) => {return Map(e)})))
                            .setIn(['viewItems', viewIndex, 'selectedOptionItemId'], data[0].objId);
                } else {
                    return state.set('viewItems', state.get('viewItems').push(Map({
                        '_COMPID_': action.compId,
                        'listAllData': List(data.map((e) => {return Map(e)})),
                        'selectedOptionItemId': data[0].objId
                    })));
                }
            } else {
                return state.set('viewItems', List([Map({
                    '_COMPID_': action.compId,
                    'listAllData': List(data.map((e) => {return Map(e)})),
                    'selectedOptionItemId': data[0].objId
                })]));
            }
        } else {
            return state
            .deleteIn(['viewItems', viewIndex, 'listAllData'])
            .deleteIn(['viewItems', viewIndex, 'selectedOptionItemId']);
        }
    }, 
    [GET_CONFSETTING_LISTPAGED_SUCCESS]: (state, action) => {
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
    [GET_CONFSETTING_SUCCESS]: (state, action) => {
        const { data } = action.response.data;
        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });

            if(viewIndex < 0) {
                return state.set('viewItems', state.get('viewItems').push(Map({
                    '_COMPID_': action.compId,
                    'informOpen': true,
                    'selectedViewItem': fromJS(data[0])
                })));
            } else {
                return state
                    .setIn(['viewItems', viewIndex, 'selectedViewItem'], fromJS(data[0]))
                    .setIn(['viewItems', viewIndex, 'informOpen'], true);
            }
        } else {
            return state.set('viewItems', List([Map({
                '_COMPID_': action.compId,
                'selectedViewItem': fromJS(data[0]),
                'informOpen': true
            })]));
        }
    },
    [SHOW_CONFSETTING_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.selectedViewItem,
            dialogOpen: true,
            dialogType: action.dialogType
        });
    },
    [CLOSE_CONFSETTING_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SHOW_CONFSETTING_INFORM]: (state, action) => {
        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });
            if(viewIndex < 0) {
                return state.set('viewItems', state.get('viewItems').push(Map({
                    '_COMPID_': action.compId,
                    'informOpen': true,
                    'selectedViewItem': action.selectedViewItem
                })));
            } else {
                return state
                    .setIn(['viewItems', viewIndex, 'selectedViewItem'], action.selectedViewItem)
                    .setIn(['viewItems', viewIndex, 'informOpen'], true);
            }
        } else {
            // no occure this event
        }
        return state;
    },
    [CLOSE_CONFSETTING_INFORM]: (state, action) => {
        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });
            return state
                    .setIn(['viewItems', viewIndex, 'informOpen'], false)
                    .deleteIn(['viewItems', viewIndex, 'selectedViewItem'])
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
    [CREATE_CONFSETTING_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CONFSETTING_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedViewItem')) {
                    if(e.getIn(['selectedViewItem', 'objId']) == action.objId) {
                        // replace
                        newState = newState.setIn(['viewItems', i, 'selectedViewItem'], fromJS(action.response.data.data[0]));
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
    [DELETE_CONFSETTING_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedViewItem')) {
                    if(e.getIn(['selectedViewItem', 'objId']) == action.objId) {
                        // replace
                        newState = newState.deleteIn(['viewItems', i, 'selectedViewItem']);
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

