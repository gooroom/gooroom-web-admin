import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

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
        payload: param
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"dialogOpen",value:false}
    });
};

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        payload: param
    });
};

export const closeClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTGROUP_INFORM,
        payload: param
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

export const setSelectedItemObj = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_OBJ,
        payload: param
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

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: param
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
            dispatch({
                type: EDIT_CLIENTGROUP_SUCCESS,
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
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientGroup', param).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTGROUP_SUCCESS,
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

    [GET_LIST_SUCCESS]: (state, action) => {
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
    [SHOW_CLIENTGROUP_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.payload.selectedItem,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        });
    },
    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {
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
    [CLOSE_CLIENTGROUP_INFORM]: (state, action) => {
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
    [SET_SELECTED_OBJ]: (state, action) => {
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
    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({
            [action.payload.name]: action.payload.value
        });
    },
    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        });
    },
    [DELETE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        });
    },

}, initialState);

