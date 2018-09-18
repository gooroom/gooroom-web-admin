import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'clientSecuSetting/COMMON_PENDING';
const COMMON_FAILURE = 'clientSecuSetting/COMMON_FAILURE';

const GET_CLIENTSECU_LIST_SUCCESS = 'clientSecuSetting/GET_CLIENTSECU_LIST_SUCCESS';
const GET_CLIENTSECU_SUCCESS = 'clientSecuSetting/GET_CLIENTSECU_SUCCESS';
const CREATE_CLIENTSECU_SUCCESS = 'clientSecuSetting/CREATE_CLIENTSECU_SUCCESS';
const EDIT_CLIENTSECU_SUCCESS = 'clientSecuSetting/EDIT_CLIENTSECU_SUCCESS';
const DELETE_CLIENTSECU_SUCCESS = 'clientSecuSetting/DELETE_CLIENTSECU_SUCCESS';

const SHOW_CLIENTSECU_INFORM = 'clientSecuSetting/SHOW_CLIENTSECU_INFORM';
const CLOSE_CLIENTSECU_INFORM = 'clientSecuSetting/CLOSE_CLIENTSECU_INFORM';
const SHOW_CLIENTSECU_DIALOG = 'clientSecuSetting/SHOW_CLIENTSECU_DIALOG';
const CLOSE_CLIENTSECU_DIALOG = 'clientSecuSetting/CLOSE_CLIENTSECU_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientSecuSetting/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientSecuSetting/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'clientSecuSetting/CHG_COMPVARIABLE_DATA';


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
        type: SHOW_CLIENTSECU_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTSECU_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTSECU_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTSECU_INFORM,
        compId: param.compId
    });
};

export const readClientSecuSettingList = (module, compId, extParam) => dispatch => {

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
    return requestPostAPI('readClientSecuListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTSECU_LIST_SUCCESS,
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

export const getClientSecuSetting = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientSecuRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_CLIENTSECU_SUCCESS,
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

        screen_time: param.get('screenTime'),
        password_time: param.get('passwordTime'),
        package_handle: (param.get('packageHandle') == 'allow') ? 'allow' : 'disallow',
        state: (param.get('state') == 'allow') ? 'allow' : 'disallow'
    };
}

// create (add)
export const createClientSecuSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientSecuConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CLIENTSECU_SUCCESS
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
export const editClientSecuSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientSecuConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                requestPostAPI('readClientSecuRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CLIENTSECU_SUCCESS,
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
export const deleteClientSecuSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientSecuConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTSECU_SUCCESS,
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

    [GET_CLIENTSECU_LIST_SUCCESS]: (state, action) => {
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
    [GET_CLIENTSECU_SUCCESS]: (state, action) => {
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
    [SHOW_CLIENTSECU_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.selectedViewItem,
            dialogOpen: true,
            dialogType: action.dialogType
        });
    },
    [CLOSE_CLIENTSECU_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SHOW_CLIENTSECU_INFORM]: (state, action) => {
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
    [CLOSE_CLIENTSECU_INFORM]: (state, action) => {
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
    [CREATE_CLIENTSECU_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CLIENTSECU_SUCCESS]: (state, action) => {
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
    [DELETE_CLIENTSECU_SUCCESS]: (state, action) => {
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
    }

}, initialState);

