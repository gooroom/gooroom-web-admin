import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'browserRule/COMMON_PENDING';
const COMMON_FAILURE = 'browserRule/COMMON_FAILURE';

const GET_BROWSERRULE_LIST_SUCCESS = 'browserRule/GET_BROWSERRULE_LIST_SUCCESS';
const GET_BROWSERRULE_SUCCESS = 'browserRule/GET_BROWSERRULE_SUCCESS';
const CREATE_BROWSERRULE_SUCCESS = 'browserRule/CREATE_BROWSERRULE_SUCCESS';
const EDIT_BROWSERRULE_SUCCESS = 'browserRule/EDIT_BROWSERRULE_SUCCESS';
const DELETE_BROWSERRULE_SUCCESS = 'browserRule/DELETE_BROWSERRULE_SUCCESS';

const SHOW_BROWSERRULE_INFORM = 'browserRule/SHOW_BROWSERRULE_INFORM';
const CLOSE_BROWSERRULE_INFORM = 'browserRule/CLOSE_BROWSERRULE_INFORM';
const SHOW_BROWSERRULE_DIALOG = 'browserRule/SHOW_BROWSERRULE_DIALOG';
const CLOSE_BROWSERRULE_DIALOG = 'browserRule/CLOSE_BROWSERRULE_DIALOG';

const SET_EDITING_ITEM_VALUE = 'browserRule/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'browserRule/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'browserRule/CHG_COMPVARIABLE_DATA';

const SET_WHITELIST_ITEM = 'browserRule/SET_WHITELIST_ITEM';
const ADD_WHITELIST_ITEM = 'browserRule/ADD_WHITELIST_ITEM';
const DELETE_WHITELIST_ITEM = 'browserRule/DELETE_WHITELIST_ITEM';


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
        type: SHOW_BROWSERRULE_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_BROWSERRULE_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_BROWSERRULE_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_BROWSERRULE_INFORM,
        compId: param.compId
    });
};

export const readBrowserRuleSettingList = (module, compId, extParam) => dispatch => {
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
    return requestPostAPI('readBrowserRuleListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_LIST_SUCCESS,
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

export const getBrowserRuleSetting = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_SUCCESS,
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

        webSocket: param.get('webSocket'),
        webWorker: param.get('webWorker'),
        trustSetupId: param.get('trustSetupId'),
        untrustSetupId: param.get('untrustSetupId'),
        trustUrlList: (param.get('trustUrlList')) ? param.get('trustUrlList').toArray() : []
    };
}

// create (add)
export const createBrowserRuleSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createBrowserRuleConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_BROWSERRULE_SUCCESS
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
export const editBrowserRuleSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateBrowserRuleConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                requestPostAPI('readBrowserRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_BROWSERRULE_SUCCESS,
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
export const deleteBrowserRuleSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteBrowserRuleConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_BROWSERRULE_SUCCESS,
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

export const addWhiteList = () => dispatch => {
    return dispatch({
        type: ADD_WHITELIST_ITEM
    });
}

export const deleteWhiteList = (index) => dispatch => {
    return dispatch({
        type: DELETE_WHITELIST_ITEM,
        index: index
    });
}

export const setWhiteList = (param) => dispatch => {
    return dispatch({
        type: SET_WHITELIST_ITEM,
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

    [GET_BROWSERRULE_LIST_SUCCESS]: (state, action) => {
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
    [GET_BROWSERRULE_SUCCESS]: (state, action) => {
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
    [SHOW_BROWSERRULE_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.selectedViewItem,
            dialogOpen: true,
            dialogType: action.dialogType
        });
    },
    [CLOSE_BROWSERRULE_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SHOW_BROWSERRULE_INFORM]: (state, action) => {
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
    [CLOSE_BROWSERRULE_INFORM]: (state, action) => {
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
    [CREATE_BROWSERRULE_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_BROWSERRULE_SUCCESS]: (state, action) => {
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
    [DELETE_BROWSERRULE_SUCCESS]: (state, action) => {
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
    [SET_WHITELIST_ITEM]: (state, action) => {
        const newWhiteList = state.getIn(['editingItem', 'trustUrlList']).set(action.index, action.value);
        return state.setIn(['editingItem', 'trustUrlList'], newWhiteList);
    },
    [ADD_WHITELIST_ITEM]: (state, action) => {
        const newWhiteList = (state.getIn(['editingItem', 'trustUrlList'])) ? state.getIn(['editingItem', 'trustUrlList']).push('') : List(['']);
        return state.setIn(['editingItem', 'trustUrlList'], newWhiteList);
    },
    [DELETE_WHITELIST_ITEM]: (state, action) => {
        const newWhiteList = state.getIn(['editingItem', 'trustUrlList']).delete(action.index);
        return state.setIn(['editingItem', 'trustUrlList'], newWhiteList);
    },

}, initialState);

