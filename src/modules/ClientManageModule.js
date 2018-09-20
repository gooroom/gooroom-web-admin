
import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

const COMMON_PENDING = 'clientManageComp/COMMON_PENDING';
const COMMON_FAILURE = 'clientManageComp/COMMON_FAILURE';

const GET_CLIENT_LISTPAGED_SUCCESS = 'clientManageComp/GET_CLIENT_LISTPAGED_SUCCESS';
const CREATE_CLIENT_SUCCESS = 'clientManageComp/CREATE_CLIENT_SUCCESS';
const EDIT_CLIENT_SUCCESS = 'clientManageComp/EDIT_CLIENT_SUCCESS';
const DELETE_CLIENT_SUCCESS = 'clientManageComp/DELETE_CLIENT_SUCCESS';

const SHOW_CLIENT_INFORM = 'clientManageComp/SHOW_CLIENT_INFORM';
const CLOSE_CLIENT_INFORM = 'clientManageComp/CLOSE_CLIENT_INFORM';
const SHOW_CLIENT_DIALOG = 'clientManageComp/SHOW_CLIENT_DIALOG';

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
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeClientManageInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENT_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

// ...
export const readClientListPaged = (module, compId, extParam, isResetSelectedParam) => dispatch => {

    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

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
                type: GET_CLIENT_LISTPAGED_SUCCESS,
                compId: compId,
                isResetSelected: isResetSelected,
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

    [GET_CLIENT_LISTPAGED_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.response.data;
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
    [SHOW_CLIENT_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.payload.selectedViewItem,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        });
    },
    [SHOW_CLIENT_INFORM]: (state, action) => {
        return state
                .setIn(['viewItems', action.compId, 'selectedViewItem'], action.selectedViewItem)
                .setIn(['viewItems', action.compId, 'informOpen'], true);
    },
    [CLOSE_CLIENT_INFORM]: (state, action) => {
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
    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({
            [action.name]: action.value
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



