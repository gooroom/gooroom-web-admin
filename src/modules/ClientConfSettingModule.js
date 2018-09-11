import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'clientConfSetting/COMMON_PENDING';
const COMMON_FAILURE = 'clientConfSetting/COMMON_FAILURE';

const GET_CONFSETTING_LIST_SUCCESS = 'clientConfSetting/GET_CONFSETTING_LIST_SUCCESS';
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

const SET_SELECTED_NTP_VALUE = 'clientConfSetting/SET_SELECTED_NTP_VALUE';
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
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_DIALOG,
        payload: param
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_INFORM,
        payload: param
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_INFORM,
        payload: param
    });
};

export const readClientConfSettingList = (module, compId, extParam) => dispatch => {

    let newListParam;
    if(module.get('viewItems')) {
        const viewIndex = module.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == compId;
        });
        newListParam = module.getIn(['viewItems', viewIndex, 'listParam']).merge(extParam);
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
                type: GET_CONFSETTING_LIST_SUCCESS,
                compId: compId,
                listParam: newListParam,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            payload: error
        });
    });
};

export const getClientConfSetting = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConf', param).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_SUCCESS,
                compId: compId,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            payload: error
        });
    });
};

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        payload: param
    });
};

export const changeListParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_LISTPARAM_DATA,
        payload: param
    });
};

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPVARIABLE_DATA,
        payload: param
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
export const createClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientConf', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CONFSETTING_SUCCESS,
                        payload: response
                    });
                }    
            } catch(ex) {
                dispatch({
                    type: COMMON_FAILURE,
                    payload: response
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            payload: error
        });
    });
};

// edit
export const editClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientConf', makeParameter(param)).then(
        (response) => {
            dispatch({
                type: EDIT_CONFSETTING_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            payload: error
        });
    });
};

// delete
export const deleteClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientConf', param).then(
        (response) => {
            dispatch({
                type: DELETE_CONFSETTING_SUCCESS,
                param: param,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            payload: error
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
        payload: {index:index}
    });
}

export const setSelectedNtpValue = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_NTP_VALUE,
        payload: param
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
            resultMsg: (action.payload.data && action.payload.data.status) ? action.payload.data.status.message : ''
        });
    },

    [GET_CONFSETTING_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = action.payload.data;

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
        console.log('GET_CONFSETTING_SUCCESS ...... ', action);

        const { data } = action.payload.data;
        if(state.get('viewItems')) {

        } else {
            return state.set('viewItems', List([Map({
                '_COMPID_': action.compId,
                'selectedItem': fromJS(data[0])
            })]));
        }

    //     const COMP_ID = (action.compId && action.compId != '') ? action.compId : '';
    //     const { data } = action.payload.data;
    //     let oldViewItems = [];

    //     if(state.viewItems) {
    //         oldViewItems = state.viewItems;
    //         const viewItem = oldViewItems.find((element) => {
    //             return element._COMPID_ == COMP_ID;
    //         });

    //         // 이전에 해당 콤프정보가 없으면 신규로 등록
    //         if(!viewItem) {
    //             oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedItem': data[0]}));
    //         }

    //         // 같은 오브젝트를 가지고 있는 콤프정보들을 모두 변경 한다.
    //         oldViewItems = oldViewItems.map((element) => {
    //             if(element.selectedItem && (element.selectedItem.objId == data[0].objId)) {
    //                 return Object.assign(element, {'selectedItem': data[0]});
    //             } else if(element._COMPID_ == COMP_ID) {
    //                 return Object.assign(element, {'selectedItem': data[0]});
    //             } else {
    //                 return element;
    //             }
    //         });

    //     } else {
    //         oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedItem': data[0]}));
    //     }

    //     if(data && data.length > 0) {
    //         return {
    //             ...state,
    //             pending: false,
    //             error: false,
    //             viewItems: oldViewItems
    //         };
    //     } else {
    //         return {
    //             ...state,
    //             pending: false,
    //             error: false,
    //             viewItems: oldViewItems
    //         };
    //     }
    },
    [SHOW_CONFSETTING_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.payload.selectedItem,
            dialogOpen: true,
            dialogType: action.payload.dialogType
        });
    },
    [CLOSE_CONFSETTING_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SHOW_CONFSETTING_INFORM]: (state, action) => {
        const COMP_ID = action.payload.compId;
        if(state.get('viewItems')) {
            const newViewItems = state.get('viewItems').map((element) => {
                if(element.get('_COMPID_') == COMP_ID) {
                    return element.set('selectedItem', Map(action.payload.selectedItem)).set('informOpen', true);
                } else {
                    return element;
                }
            });
            return state.merge({
                viewItems: newViewItems
            });
        }
        return state;
    },
    [CLOSE_CONFSETTING_INFORM]: (state, action) => {
        const COMP_ID = action.payload.compId;
        if(state.get('viewItems')) {
            const newViewItems = state.get('viewItems').map((element) => {
                if(element.get('_COMPID_') == COMP_ID) {
                    return element.delete('selectedItem', Map(action.payload.selectedItem)).set('informOpen', false);
                } else {
                    return element;
                }
            });
            return state.merge({
                viewItems: newViewItems
            });
        }
        return state;
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.payload.name]: action.payload.value})
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        const viewIndex = state.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == action.payload.compId;
        });
        return state.setIn(['viewItems', viewIndex, 'listParam', action.payload.name], action.payload.value);
    },
    [CHG_COMPVARIABLE_DATA]: (state, action) => {
        const viewIndex = state.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == action.payload.compId;
        });
        return state.setIn(['viewItems', viewIndex, action.payload.name], action.payload.value);
    },
    [CREATE_CONFSETTING_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CONFSETTING_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false,
            dialogOpen: false,
            dialogType: ''
        });
    },
    [DELETE_CONFSETTING_SUCCESS]: (state, action) => {
        const viewIndex = state.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == action.param.compId;
        });
        if(action.param.objId == state.getIn(['viewItems', viewIndex, 'selectedItem', 'objId'])) {
            state = state.setIn(['viewItems', viewIndex, 'informOpen'], false).deleteIn(['viewItems', viewIndex, 'selectedItem']);
        }
        return state.merge({
            pending: false,
            error: false,
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SET_SELECTED_NTP_VALUE]: (state, action) => {
        const newNtpAddress = state.getIn(['editingItem', 'ntpAddress']).set(action.payload.index, action.payload.value);
        return state.setIn(['editingItem', 'ntpAddress'], newNtpAddress);
    },
    [ADD_NTPADDRESS_ITEM]: (state, action) => {
        const newNtpAddress = (state.getIn(['editingItem', 'ntpAddress'])) ? state.getIn(['editingItem', 'ntpAddress']).push('') : List(['']);
        return state.setIn(['editingItem', 'ntpAddress'], newNtpAddress);
    },
    [DELETE_NTPADDRESS_ITEM]: (state, action) => {
        const newNtpAddress = state.getIn(['editingItem', 'ntpAddress']).delete(action.payload.index);
        return state.setIn(['editingItem', 'ntpAddress'], newNtpAddress);
    },

}, initialState);

