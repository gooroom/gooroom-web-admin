
import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

const COMMON_PENDING = 'user/COMMON_PENDING';
const COMMON_FAILURE = 'user/COMMON_FAILURE';

const GET_USER_LIST_SUCCESS = 'user/GET_USER_LIST_SUCCESS';
const GET_LISTALL_SUCCESS = 'user/GET_LISTALL_SUCCESS';
const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
const EDIT_USER_SUCCESS = 'user/EDIT_USER_SUCCESS';
const DELETE_USER_SUCCESS = 'user/DELETE_USER_SUCCESS';

const SHOW_USER_INFORM = 'user/SHOW_USER_INFORM';
const SHOW_USER_DIALOG = 'user/SHOW_USER_DIALOG';

const SET_EDITING_ITEM_VALUE = 'user/SET_EDITING_ITEM_VALUE';

const CHG_VIEWITEM_DATA = 'user/CHG_VIEWITEM_DATA';

const CHG_STORE_DATA = 'user/CHG_STORE_DATA';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    defaultListParam: {
        keyword: '',
        orderDir: 'asc',
        orderColumn: 'chUserName',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    informOpen: false,
    dialogOpen: false,
    dialogType: '',
    
    selected: []
};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_USER_DIALOG,
        payload: param
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"dialogOpen",value:false}
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_USER_INFORM,
        payload: param
    });
};

export const closeInform = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"informOpen",value:false}
    });
};

export const readUserList = (param) => dispatch => {

    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUserListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_USER_LIST_SUCCESS,
                compId: param.compId,
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

export const readClientGroupListAll = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientGroupList', {}).then(
        (response) => {
            dispatch({
                type: GET_LISTALL_SUCCESS,
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

export const getUserData = (param) => dispatch => {

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUserData', param).then(
        (response) => {
            dispatch({
                type: GET_USER_SUCCESS,
                compId: param.compId,
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

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_VIEWITEM_DATA,
        payload: param
    });
};

const makeParameter = (param) => {
    return {
        userId: param.userId,
        userPasswd: param.userPassword,
        userNm: param.userName
    };
}

// create (add)
export const createUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createUser', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_USER_SUCCESS,
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
export const editUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateUserData', makeParameter(param)).then(
        (response) => {
            dispatch({
                type: EDIT_USER_SUCCESS,
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
export const deleteUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteUserData', param).then(
        (response) => {
            dispatch({
                type: DELETE_USER_SUCCESS,
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
        return { 
            ...state, 
            pending: true, 
            error: false 
        };
    },
    [COMMON_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: (action.payload.data && action.payload.data.status) ? action.payload.data.status.message : ''
        };
    },

    [GET_USER_LIST_SUCCESS]: (state, action) => {

        let COMP_ID = '';
        if(action.compId && action.compId != '') {
            COMP_ID = action.compId;
        }
        
        const { data, recordsFiltered, recordsTotal, draw, rowLength } = action.payload.data;

        let oldViewItems = [];
        if(state.viewItems) {

            oldViewItems = state.viewItems;
            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });

            if(viewItem) {

                Object.assign(viewItem, {
                    'listData': data,
                    'listParam': Object.assign({}, viewItem.listParam, {
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10)
                    })
                });

            } else {

                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                    'listData': data,
                    'listParam': {
                        keyword: '',
                        orderDir: 'desc',
                        orderColumn: 'chConfId',
                        rowsPerPageOptions: [5, 10, 25],
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10)
                    }
                }));

            }

        } else {

            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                'listData': data,
                'listParam': Object.assign({}, state.defaultListParam, {
                    rowsFiltered: parseInt(recordsFiltered, 10),
                    rowsTotal: parseInt(recordsTotal, 10),
                    page: parseInt(draw, 10),
                    rowsPerPage: parseInt(rowLength, 10)
                })
            }));

        }

        return {
            ...state,
            pending: false,
            error: false,
            viewItems: oldViewItems
        };
    },
    [GET_LISTALL_SUCCESS]: (state, action) => {
        return { 
            ...state, 
            pending: false, 
            error: false 
        };
    },
    [GET_USER_SUCCESS]: (state, action) => {
        let COMP_ID = '';
        if(action.compId && action.compId != '') {
            COMP_ID = action.compId;
        }
        const { data } = action.payload.data;
        let oldViewItems = [];
        if(state.viewItems) {
            oldViewItems = state.viewItems;

            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });

            // 이전에 해당 콤프정보가 없으면 신규로 등록
            if(!viewItem) {
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedItem': data[0]}));
            }

            // 같은 오브젝트를 가지고 있는 콤프정보들을 모두 변경 한다.
            oldViewItems = oldViewItems.map((element) => {
                if(element.selectedItem && (element.selectedItem.objId == data[0].objId)) {
                    return Object.assign(element, {'selectedItem': data[0]});
                } else {
                    return element;
                }
            });

        } else {
            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedItem': data[0]}));
        }

        if(data && data.length > 0) {
            return {
                ...state,
                pending: false,
                error: false,
                viewItems: oldViewItems
            };
        } else {
            return {
                ...state,
                pending: false,
                error: false,
                viewItems: oldViewItems
            };
        }
    },
    [SHOW_USER_DIALOG]: (state, action) => {

        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedItem),
            editingCompId: action.payload.compId,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_USER_INFORM]: (state, action) => {

        const COMP_ID = action.payload.compId;

        let oldViewItems = [];
        if(state.viewItems) {
            oldViewItems = state.viewItems;
            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });
            if(viewItem) {
                Object.assign(viewItem, {
                    'selectedItem': action.payload.selectedItem
                });
            } else {
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                    'selectedItem': action.payload.selectedItem
                }));
            }
        } else {
            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                'selectedItem': action.payload.selectedItem
            }));
        }

        return {
            ...state,
            viewItems: oldViewItems,
            informOpen: true,
        };
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        const newEditingItem = getMergedObject(state.editingItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [CHG_STORE_DATA]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    },
    [CHG_VIEWITEM_DATA]: (state, action) => {

        const COMP_ID = action.payload.compId;

        let oldViewItems = [];
        if(state.viewItems) {
            oldViewItems = state.viewItems;
            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });
            
            if(viewItem) {
                Object.assign(viewItem, {
                    [action.payload.name]: action.payload.value
                });
            } else {
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                    [action.payload.name]: action.payload.value
                }));
            }

        } else {
            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                [action.payload.name]: action.payload.value
            }));
        }

        return {
            ...state,
            viewItems: oldViewItems
        }
    },

    [CREATE_USER_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_USER_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [DELETE_USER_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },

}, initialState);

