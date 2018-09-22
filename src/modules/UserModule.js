
import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

const COMMON_PENDING = 'user/COMMON_PENDING';
const COMMON_FAILURE = 'user/COMMON_FAILURE';

const GET_USER_LISTPAGED_SUCCESS = 'user/GET_USER_LISTPAGED_SUCCESS';
const GET_LISTALL_SUCCESS = 'user/GET_LISTALL_SUCCESS';
const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
const EDIT_USER_SUCCESS = 'user/EDIT_USER_SUCCESS';
const DELETE_USER_SUCCESS = 'user/DELETE_USER_SUCCESS';

const SHOW_USER_INFORM = 'user/SHOW_USER_INFORM';
const CLOSE_USER_INFORM = 'user/CLOSE_USER_INFORM';
const SHOW_USER_DIALOG = 'user/SHOW_USER_DIALOG';
const CLOSE_USER_DIALOG = 'user/CLOSE_USER_DIALOG';

const SET_EDITING_ITEM_VALUE = 'user/SET_EDITING_ITEM_VALUE';

const CHG_VIEWITEM_DATA = 'user/CHG_VIEWITEM_DATA';


const CHG_LISTPARAM_DATA = 'user/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'user/CHG_COMPVARIABLE_DATA';
const CHG_STORE_DATA = 'user/CHG_STORE_DATA';

// ...
const initialState = Map({
    pending: false,
    error: false,
    resultMsg: '',

    defaultListParam: Map({
        status: '',
        keyword: '',
        orderDir: 'asc',
        orderColumn: 'chUserName',
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
        type: SHOW_USER_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_USER_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_USER_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = () => dispatch => {
    return dispatch({
        type: CLOSE_USER_INFORM,
        compId: param.compId
    });
};

export const readUserListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUserListPaged', {
        status: newListParam.get('status'),
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_USER_LISTPAGED_SUCCESS,
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
export const createUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createUser', {
        userId: param.userId,
        userPasswd: param.userPassword,
        userNm: param.userNm
    }).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_USER_SUCCESS,
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
export const editUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateUserData', {
        userId: param.userId,
        userPasswd: param.userPassword,
        userNm: param.userNm
    }).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                requestPostAPI('readUserData', {'userId': item.get('userId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_USER_SUCCESS,
                            userId: item.get('userId'),
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
            payload: error
        });
    });
};

// delete
export const deleteUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteUserData', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: DELETE_USER_SUCCESS,
                compId: param.compId,
                userId: param.userId
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};


// export const getUserData = (param) => dispatch => {
//     dispatch({type: COMMON_PENDING});
//     return requestPostAPI('readUserData', param).then(
//         (response) => {
//             dispatch({
//                 type: GET_USER_SUCCESS,
//                 compId: param.compId,
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
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            ex:  (action.ex) ? action.ex : ''
        });
    },

    [GET_USER_LISTPAGED_SUCCESS]: (state, action) => {

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
    [SHOW_USER_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.selectedViewItem,
            dialogOpen: true,
            dialogType: action.dialogType,
        });
    },
    [CLOSE_USER_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SHOW_USER_INFORM]: (state, action) => {
        return state
                .setIn(['viewItems', action.compId, 'selectedViewItem'], action.selectedViewItem)
                .setIn(['viewItems', action.compId, 'informOpen'], true);
    },
    [CLOSE_USER_INFORM]: (state, action) => {
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
    [CREATE_USER_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_USER_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedViewItem')) {
                    if(e.getIn(['selectedViewItem', 'userId']) == action.grpId) {
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
    [DELETE_USER_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                if(e.get('selectedViewItem')) {
                    if(e.getIn(['selectedViewItem', 'userId']) == action.grpId) {
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








    // [GET_USER_SUCCESS]: (state, action) => {
    //     let COMP_ID = '';
    //     if(action.compId && action.compId != '') {
    //         COMP_ID = action.compId;
    //     }
    //     const { data } = action.payload.data;
    //     let oldViewItems = [];
    //     if(state.viewItems) {
    //         oldViewItems = state.viewItems;

    //         const viewItem = oldViewItems.find((element) => {
    //             return element._COMPID_ == COMP_ID;
    //         });

    //         // 이전에 해당 콤프정보가 없으면 신규로 등록
    //         if(!viewItem) {
    //             oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedViewItem': data[0]}));
    //         }

    //         // 같은 오브젝트를 가지고 있는 콤프정보들을 모두 변경 한다.
    //         oldViewItems = oldViewItems.map((element) => {
    //             if(element.selectedViewItem && (element.selectedViewItem.objId == data[0].objId)) {
    //                 return Object.assign(element, {'selectedViewItem': data[0]});
    //             } else {
    //                 return element;
    //             }
    //         });

    //     } else {
    //         oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedViewItem': data[0]}));
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
    // },
    
    
    // [CHG_VIEWITEM_DATA]: (state, action) => {

    //     const COMP_ID = action.payload.compId;

    //     let oldViewItems = [];
    //     if(state.viewItems) {
    //         oldViewItems = state.viewItems;
    //         const viewItem = oldViewItems.find((element) => {
    //             return element._COMPID_ == COMP_ID;
    //         });
            
    //         if(viewItem) {
    //             Object.assign(viewItem, {
    //                 [action.payload.name]: action.payload.value
    //             });
    //         } else {
    //             oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
    //                 [action.payload.name]: action.payload.value
    //             }));
    //         }

    //     } else {
    //         oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
    //             [action.payload.name]: action.payload.value
    //         }));
    //     }

    //     return {
    //         ...state,
    //         viewItems: oldViewItems
    //     }
    // },

    
    

}, initialState);

