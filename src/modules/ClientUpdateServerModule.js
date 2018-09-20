import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'clientHostName/COMMON_PENDING';
const COMMON_FAILURE = 'clientHostName/COMMON_FAILURE';

const GET_UPDATESERVER_LIST_SUCCESS = 'clientUpdateServer/GET_UPDATESERVER_LIST_SUCCESS';
const GET_UPDATESERVER_LISTPAGED_SUCCESS = 'clientUpdateServer/GET_UPDATESERVER_LISTPAGED_SUCCESS';
const GET_UPDATESERVER_SUCCESS = 'clientUpdateServer/GET_UPDATESERVER_SUCCESS';
const CREATE_UPDATESERVER_SUCCESS = 'clientUpdateServer/CREATE_UPDATESERVER_SUCCESS';
const EDIT_UPDATESERVER_SUCCESS = 'clientUpdateServer/EDIT_UPDATESERVER_SUCCESS';
const DELETE_UPDATESERVER_SUCCESS = 'clientUpdateServer/DELETE_UPDATESERVER_SUCCESS';

const SHOW_UPDATESERVER_INFORM = 'clientUpdateServer/SHOW_UPDATESERVER_INFORM';
const CLOSE_UPDATESERVER_INFORM = 'clientUpdateServer/CLOSE_UPDATESERVER_INFORM';
const SHOW_UPDATESERVER_DIALOG = 'clientUpdateServer/SHOW_UPDATESERVER_DIALOG';
const CLOSE_UPDATESERVER_DIALOG = 'clientUpdateServer/CLOSE_UPDATESERVER_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientUpdateServer/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientUpdateServer/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'clientUpdateServer/CHG_COMPVARIABLE_DATA';

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
        type: SHOW_UPDATESERVER_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_UPDATESERVER_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_UPDATESERVER_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_UPDATESERVER_INFORM,
        compId: param.compId
    });
};

export const readClientUpdateServerList = (module, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUpdateServerConfList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_UPDATESERVER_LIST_SUCCESS,
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

export const readClientUpdateServerListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUpdateServerConfListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_UPDATESERVER_LISTPAGED_SUCCESS,
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

export const getClientUpdateServer = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUpdateServerConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_UPDATESERVER_SUCCESS,
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

const makeParameter = (itemObj) => {
    return {
        objId: itemObj.get('objId'),
        objName: itemObj.get('objNm'),
        objComment: itemObj.get('comment'),
        MAINOS: itemObj.get('mainos'),
        EXTOS: itemObj.get('extos'),
        PRIORITIES: itemObj.get('priorities')
    };
}

// create (add)
export const createClientUpdateServerData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createUpdateServerConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_UPDATESERVER_SUCCESS
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
export const editClientUpdateServerData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateUpdateServerConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readUpdateServerConf', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_UPDATESERVER_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                });

                // change object array for selector
                requestPostAPI('readUpdateServerConfList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_UPDATESERVER_LIST_SUCCESS,
                            compId: compId,
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
export const deleteClientUpdateServerData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteUpdateServerConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_UPDATESERVER_SUCCESS,
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
    [GET_UPDATESERVER_LIST_SUCCESS]: (state, action) => {
        const { data } = action.response.data;
        if(data && data.length > 0) {
            if(state.hasIn(['viewItems', action.compId])) {
                const beforeItemId = state.getIn(['viewItems', action.compId, 'selectedOptionItemId']);
                const pos = (beforeItemId) ? data.map((e) => (e.objId)).indexOf(beforeItemId) : -1;
                if(pos < 0) {
                    // no exist or selected id was deleted
                    return state
                        .setIn(['viewItems', action.compId, 'listAllData'], List(data.map((e) => {return Map(e)})))
                        .setIn(['viewItems', action.compId, 'selectedOptionItemId'], data[0].objId);
                } else {
                    // before exist and selected id is exist
                    return state
                        .setIn(['viewItems', action.compId, 'listAllData'], List(data.map((e) => {return Map(e)})))
                        .setIn(['viewItems', action.compId, 'selectedOptionItemId'], beforeItemId);
                }
            }

            return state.setIn(['viewItems', action.compId], Map({
                'listAllData': List(data.map((e) => {return Map(e)})),
                'selectedOptionItemId': data[0].objId
            }));
            
        } else {
            return state
            .deleteIn(['viewItems', action.compId, 'listAllData'])
            .deleteIn(['viewItems', action.compId, 'selectedOptionItemId']);
        }
    },
    [GET_UPDATESERVER_LISTPAGED_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = action.response.data;
        return state.setIn(['viewItems', action.compId], Map({
            'listData': List(data.map((e) => {return Map(e)})),
            'listParam': state.get('defaultListParam').merge({
                rowsFiltered: parseInt(recordsFiltered, 10),
                rowsTotal: parseInt(recordsTotal, 10),
                page: parseInt(draw, 10),
                rowsPerPage: parseInt(rowLength, 10),
                orderColumn: orderColumn,
                orderDir: orderDir
            })
        }));
    },
    [GET_UPDATESERVER_SUCCESS]: (state, action) => {
        const { data } = action.response.data;
        return state
                .setIn(['viewItems', action.compId, 'selectedViewItem'], fromJS(data[0]))
                .setIn(['viewItems', action.compId, 'informOpen'], true);
    },
    [SHOW_UPDATESERVER_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.selectedViewItem,
            dialogOpen: true,
            dialogType: action.dialogType
        });
    },
    [CLOSE_UPDATESERVER_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SHOW_UPDATESERVER_INFORM]: (state, action) => {
        return state
                .setIn(['viewItems', action.compId, 'selectedViewItem'], action.selectedViewItem)
                .setIn(['viewItems', action.compId, 'informOpen'], true);
    },
    [CLOSE_UPDATESERVER_INFORM]: (state, action) => {
        return state
                .setIn(['viewItems', action.compId, 'informOpen'], false)
                .deleteIn(['viewItems', action.compId, 'selectedViewItem']);
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
    [CREATE_UPDATESERVER_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_UPDATESERVER_SUCCESS]: (state, action) => {
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
    [DELETE_UPDATESERVER_SUCCESS]: (state, action) => {
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

