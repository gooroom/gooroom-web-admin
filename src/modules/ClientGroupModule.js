import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'groupComp/COMMON_PENDING';
const COMMON_FAILURE = 'groupComp/COMMON_FAILURE';

const GET_LIST_SUCCESS = 'groupComp/GET_LIST_SUCCESS';
const CREATE_CLIENTGROUP_SUCCESS = 'groupComp/CREATE_CLIENTGROUP_SUCCESS';
const EDIT_CLIENTGROUP_SUCCESS = 'groupComp/EDIT_CLIENTGROUP_SUCCESS';
const DELETE_CLIENTGROUP_SUCCESS = 'groupComp/DELETE_CLIENTGROUP_SUCCESS';

const SHOW_CLIENTGROUP_INFORM = 'groupComp/SHOW_CLIENTGROUP_INFORM';
const CLOSE_CLIENTGROUP_INFORM = 'groupComp/CLOSE_CLIENTGROUP_INFORM';
const SHOW_CLIENTGROUP_DIALOG = 'groupComp/SHOW_CLIENTGROUP_DIALOG';

const SET_SELECTED_OBJ = 'groupComp/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'groupComp/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'groupComp/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'groupComp/CHG_COMPVARIABLE_DATA';
const CHG_STORE_DATA = 'groupComp/CHG_STORE_DATA';

// ...
const initialState = Map({
    pending: false,
    error: false,
    resultMsg: '',

    defaultListParam: Map({
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chGrpNm',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: List([5, 10, 25]),
        rowsTotal: 0,
        rowsFiltered: 0
    }),

    dialogOpen: false,
    dialogType: ''
});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_DIALOG,
        selectedItem: param.selectedItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        name: 'dialogOpen',
        value: false
    });
};

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        compId: param.compId,
        selectedItem: param.selectedItem
    });
};

export const closeClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTGROUP_INFORM,
        compId: param.compId,
        selectedItem: param.selectedItem
    });
};

export const readClientGroupList = (module, compId, extParam) => dispatch => {

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
    return requestPostAPI('readClientGroupListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_LIST_SUCCESS,
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

export const setSelectedItemObj = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_OBJ,
        compId: param.compId,
        selectedItem: param.selectedItem
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

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        name: param.name,
        value: param.value
    });
};

// create (add)
export const createClientGroupData = (item) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientGroup', {
        groupName: item.get('grpNm'),
        groupComment: item.get('comment'),
        clientConfigId: item.get('clientConfigId'),
        isDefault: item.get('isDefault')
    }).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CLIENTGROUP_SUCCESS,
                        response: response
                    });
                }
            } catch(ex) {
                dispatch({
                    type: COMMON_FAILURE,
                    error: null,
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
export const editClientGroupData = (item) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroup', {
        groupId: item.get('grpId'),
        groupName: item.get('grpNm'),
        groupComment: item.get('comment'),
        desktopConfigId: item.get('desktopConfigId'),
        clientConfigId: item.get('clientConfigId'),
        hostNameConfigId: item.get('hostNameConfigId'),
        updateServerConfigId: item.get('updateServerConfigId')
    }).then(
        (response) => {

            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                requestPostAPI('readClientGroupData', {'groupId': item.get('grpId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CLIENTGROUP_SUCCESS,
                            grpId: item.get('grpId'),
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
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientGroup', {'groupId': param.grpId}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTGROUP_SUCCESS,
                compId: param.compId,
                grpId: param.grpId
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
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            ex:  (action.ex) ? action.ex : ''
        });
    },

    [GET_LIST_SUCCESS]: (state, action) => {
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
    [SHOW_CLIENTGROUP_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.selectedItem,
            dialogOpen: true,
            dialogType: action.dialogType,
        });
    },
    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {
        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });
            return state
                    .setIn(['viewItems', viewIndex, 'informOpen'], true)
                    .setIn(['viewItems', viewIndex, 'selectedItem'], Map(action.selectedItem));
        }
        return state;
    },
    [CLOSE_CLIENTGROUP_INFORM]: (state, action) => {
        const COMP_ID = action.compId;
        if(state.get('viewItems')) {
            const newViewItems = state.get('viewItems').map((element) => {
                if(element.get('_COMPID_') == COMP_ID) {
                    return element.delete('selectedItem', Map(action.selectedItem)).set('informOpen', false);
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
    [SET_SELECTED_OBJ]: (state, action) => {
        const COMP_ID = action.compId;
        if(state.get('viewItems')) {
            const newViewItems = state.get('viewItems').map((element) => {
                if(element.get('_COMPID_') == COMP_ID) {
                    return element.set('selectedItem', Map(action.selectedItem)).set('informOpen', true);
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
    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({
            [action.name]: action.value
        });
    },
    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedItem')) {
                    if(e.getIn(['selectedItem', 'grpId']) == action.grpId) {
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
    [DELETE_CLIENTGROUP_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedItem')) {
                    if(e.getIn(['selectedItem', 'grpId']) == action.grpId) {
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

}, initialState);

