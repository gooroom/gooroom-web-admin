
import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'clientManageComp/COMMON_PENDING';
const COMMON_FAILURE = 'clientManageComp/COMMON_FAILURE';

const GET_LIST_SUCCESS = 'clientManageComp/GET_LIST_SUCCESS';
const CREATE_CLIENT_SUCCESS = 'clientManageComp/CREATE_CLIENT_SUCCESS';
const EDIT_CLIENT_SUCCESS = 'clientManageComp/EDIT_CLIENT_SUCCESS';
const DELETE_CLIENT_SUCCESS = 'clientManageComp/DELETE_CLIENT_SUCCESS';

const SHOW_CLIENT_INFORM = 'clientManageComp/SHOW_CLIENT_INFORM';
const CLOSE_CLIENT_INFORM = 'clientManageComp/CLOSE_CLIENT_INFORM';
const SHOW_CLIENT_DIALOG = 'clientManageComp/SHOW_CLIENT_DIALOG';

const SET_SELECTED_OBJ = 'clientManageComp/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'clientManageComp/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientManageComp/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'clientManageComp/CHG_COMPVARIABLE_DATA';
const CHG_STORE_DATA = 'clientManageComp/CHG_STORE_DATA';



const GET_CLIENT_INFORM = 'clientManage/GET_CLIENT_INFORM';


// ...
const initialState = Map({
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    defaultListParam: Map({
        clientType: 'ALL',
        groupId: '',
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'clientName',
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
        type: SHOW_CLIENT_DIALOG,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"dialogOpen",value:false}
    });
};

export const showClientManageInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENT_INFORM,
        payload: param
    });
};

export const closeClientManageInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENT_INFORM,
        payload: param
    });
};

// ...
export const readClientList = (module, compId, extParam, isResetSelectedParam) => dispatch => {

    let newListParam;
    if(module.get('viewItems')) {
        const viewIndex = module.get('viewItems').findIndex((e) => {
            return e.get('_COMPID_') == compId;
        });
        newListParam = module.getIn(['viewItems', viewIndex, 'listParam']).merge(extParam);
    } else {
        newListParam = module.get('defaultListParam');
    }
    const isResetSelected = (isResetSelectedParam) ? isResetSelectedParam : false;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientListPaged', {
        clientType: newListParam.get('clientType'),
        groupId: newListParam.get('groupId'),
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
                isResetSelected: isResetSelected,
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


// ??????????????????????
export const getClientInform = (param) => dispatch => {

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientListPaged', param).then(
        (response) => {
            dispatch({
                type: GET_CLIENT_INFORM,
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

// // create (add)
// export const createClientGroupData = (param) => dispatch => {
//     dispatch({type: COMMON_PENDING});
//     return requestPostAPI('createClientGroup', {
//         groupName: param.grpNm,
//         groupComment: param.comment,
//         clientConfigId: param.clientConfigId,
//         isDefault: param.isDefault
//     }).then(
//         (response) => {
//             if(response.data.status.result && response.data.status.result === 'success') {
//                 dispatch({
//                     type: CREATE_CLIENT_SUCCESS,
//                     payload: response
//                 });
//             } else {
//                 dispatch({
//                     type: COMMON_FAILURE,
//                     payload: response
//                 });
//             }
//         }
//     ).catch(error => {
//         dispatch({
//             type: COMMON_FAILURE,
//             payload: error
//         });
//     });
// };

// // edit
// export const editClientGroupData = (param) => dispatch => {
//     dispatch({type: COMMON_PENDING});
//     return requestPostAPI('updateClientGroup', {
//         groupId: param.grpId,
//         groupName: param.grpNm,
//         groupComment: param.comment,
//         desktopConfigId: param.desktopConfigId,
//         clientConfigId: param.clientConfigId,
//         hostNameConfigId: param.hostNameConfigId,
//         updateServerConfigId: param.updateServerConfigId
//     }).then(
//         (response) => {
//             dispatch({
//                 type: EDIT_CLIENT_SUCCESS,
//                 payload: response
//             });
//         }
//     ).catch(error => {
//         dispatch({
//             type: COMMON_FAILURE,
//             payload: error
//         });
//     });
// };

// // delete
// export const deleteClientGroupData = (param) => dispatch => {
//     dispatch({type: COMMON_PENDING});
//     return requestPostAPI('deleteClientGroup', param).then(
//         (response) => {
//             dispatch({
//                 type: DELETE_CLIENT_SUCCESS,
//                 payload: response
//             });
//         }
//     ).catch(error => {
//         dispatch({
//             type: COMMON_FAILURE,
//             payload: error
//         });
//     });
// };


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
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;

        if(state.get('viewItems')) {
            const viewIndex = state.get('viewItems').findIndex((e) => {
                return e.get('_COMPID_') == action.compId;
            });

            if(viewIndex > -1) {
                if(action.isResetSelected) {
                    state = state.setIn(['viewItems', viewIndex, 'selectedIds'], List([]));
                }
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
    [SHOW_CLIENT_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.payload.selectedItem,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        });
    },
    [SHOW_CLIENT_INFORM]: (state, action) => {
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
    [CLOSE_CLIENT_INFORM]: (state, action) => {
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

    // [EDIT_CLIENT_SUCCESS]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: false,
    //         error: false,
    //     };
    // },
    
    // [DELETE_CLIENT_SUCCESS]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: false,
    //         error: false,
    //         informOpen: false,
    //         dialogOpen: false,
    //         dialogType: ''   
    //     };
    // },

}, initialState);



