
import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

const GET_GROUP_LIST_PENDING = 'groupManage/GET_LIST_PENDING';
const GET_GROUP_LIST_SUCCESS = 'groupManage/GET_LIST_SUCCESS';
const GET_GROUP_LIST_FAILURE = 'groupManage/GET_LIST_FAILURE';

const CREATE_CLIENTGROUP_PENDING = 'groupManage/CREATE_CLIENTGROUP_PENDING';
const CREATE_CLIENTGROUP_SUCCESS = 'groupManage/CREATE_CLIENTGROUP_SUCCESS';
const CREATE_CLIENTGROUP_FAILURE = 'groupManage/CREATE_CLIENTGROUP_FAILURE';

const EDIT_CLIENTGROUP_PENDING = 'groupManage/EDIT_CLIENTGROUP_PENDING';
const EDIT_CLIENTGROUP_SUCCESS = 'groupManage/EDIT_CLIENTGROUP_SUCCESS';
const EDIT_CLIENTGROUP_FAILURE = 'groupManage/EDIT_CLIENTGROUP_FAILURE';

const DELETE_CLIENTGROUP_PENDING = 'groupManage/DELETE_CLIENTGROUP_PENDING';
const DELETE_CLIENTGROUP_SUCCESS = 'groupManage/DELETE_CLIENTGROUP_SUCCESS';
const DELETE_CLIENTGROUP_FAILURE = 'groupManage/DELETE_CLIENTGROUP_FAILURE';

const SHOW_CLIENTGROUP_INFORM = 'groupManage/SHOW_CLIENTGROUP_INFORM';
const TOGGLE_CLIENTGROUP_DIALOG = 'groupManage/TOGGLE_CLIENTGROUP_DIALOG';

const SET_CLIENTGROUP_SELECTED = 'groupManage/SET_CLIENTGROUP_SELECTED';

const TOGGLE_CLIENTGROUP_POPUP_SHOW = 'groupManage/TOGGLE_CLIENTGROUP_POPUP_SHOW';
const TOGGLE_CLIENTGROUP_POPUP_CLOSE = 'groupManage/TOGGLE_CLIENTGROUP_POPUP_CLOSE';

const CHG_PARAM_VALUE = 'groupManage/CHG_PARAM_VALUE';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chGrpNm',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [2, 5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {},
    informOpen: false,
    dialogOpen: false,
    dialogType: '',

    groupName: '',
    groupComment: '',
    clientConfigId: '',
    isDefault: ''
};


// ...
export const readClientGroupList = (param) => dispatch => {

    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: GET_GROUP_LIST_PENDING});
    return requestPostAPI('readClientGroupListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_GROUP_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_GROUP_LIST_FAILURE,
            payload: error
        });
    });
};

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        payload: param
    });
};

// export const showCreateDialog = (param) => dispatch => {
//     return dispatch({
//         type: TOGGLE_CLIENTGROUP_POPUP_SHOW,
//         payload: param
//     });
// };

// export const closeCreateDialog = (param) => dispatch => {
//     return dispatch({
//         type: TOGGLE_CLIENTGROUP_POPUP_CLOSE,
//         payload: param
//     });
// };

export const toggleCreateDialog = (param) => dispatch => {
    return dispatch({
        type: TOGGLE_CLIENTGROUP_DIALOG,
        payload: param
    });
};

export const toggleEditDialog = (param) => dispatch => {
    return dispatch({
        type: TOGGLE_CLIENTGROUP_DIALOG,
        payload: param
    });
};


// create (add)
export const createClientGroupData = (param) => dispatch => {
    dispatch({type: CREATE_CLIENTGROUP_PENDING});
    return requestPostAPI('createClientGroup', param).then(
        (response) => {
            if(response.data.status.result && response.data.status.result === 'success') {
                dispatch({
                    type: CREATE_CLIENTGROUP_SUCCESS,
                    payload: response
                });
            } else {
                dispatch({
                    type: CREATE_CLIENTGROUP_FAILURE,
                    payload: response
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: CREATE_CLIENTGROUP_FAILURE,
            payload: error
        });
    });
};

// edit
export const editClientGroupData = (param) => dispatch => {
    dispatch({type: EDIT_CLIENTGROUP_PENDING});
    return requestPostAPI('updateClientGroup', param).then(
        (response) => {
            dispatch({
                type: EDIT_CLIENTGROUP_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: EDIT_CLIENTGROUP_FAILURE,
            payload: error
        });
    });
};

// delete
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: DELETE_CLIENTGROUP_PENDING});
    return requestPostAPI('deleteClientGroup', param).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTGROUP_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: DELETE_CLIENTGROUP_FAILURE,
            payload: error
        });
    });
};

// // create profile job
// export const createClientProfileSetJob = (param) => dispatch => {
//     dispatch({type: CREATE_PROFILESET_JOB_PENDING});
//     return requestPostAPI('createProfileJob', param).then(
//         (response) => {
//             dispatch({
//                 type: CREATE_PROFILESET_JOB_SUCCESS,
//                 payload: response
//             });
//         }
//     ).catch(error => {
//         dispatch({
//             type: CREATE_PROFILESET_JOB_FAILURE,
//             payload: error
//         });
//     });
// };


export const setSelectedItem = (param) => dispatch => {
    return dispatch({
        type: SET_CLIENTGROUP_SELECTED,
        payload: param
    });
};

export const changeParamValue = (param) => dispatch => {
    return dispatch({
        type: CHG_PARAM_VALUE,
        payload: param
    });
};

export default handleActions({

    [GET_GROUP_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_GROUP_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;

        let tempListParam = state.listParam;
        Object.assign(tempListParam, {
            rowsFiltered: parseInt(recordsFiltered, 10),
            rowsTotal: parseInt(recordsTotal, 10),
            page: parseInt(draw, 10),
            rowsPerPage: parseInt(rowLength, 10),
        });

        return {
            ...state,
            pending: false,
            error: false,
            listData: data,
            listParam: tempListParam
        };
    },
    [GET_GROUP_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },

    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            informOpen: true
        };
    },
    [TOGGLE_CLIENTGROUP_DIALOG]: (state, action) => {
        return {
            ...state,
            dialogOpen: (action.payload.dialogOpen) ? true: false, 
            dialogType: (action.payload.dialogType) ? action.payload.dialogType: '',  
            groupName: (action.payload.groupName) ? action.payload.groupName: '', 
            groupComment: (action.payload.groupComment) ? action.payload.groupComment: '', 
            clientConfigId: (action.payload.clientConfigId) ? action.payload.clientConfigId: '', 
            isDefault: (action.payload.isDefault) ? action.payload.isDefault: '',
            selectedItem: (action.payload.selectedItem) ? action.payload.selectedItem: '',
        };
    },
    
    [CREATE_CLIENTGROUP_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [CREATE_CLIENTGROUP_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [EDIT_CLIENTGROUP_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_CLIENTGROUP_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [DELETE_CLIENTGROUP_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [DELETE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [DELETE_CLIENTGROUP_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [CHG_PARAM_VALUE]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    },
    
    [SET_CLIENTGROUP_SELECTED]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem
        }
    }


}, initialState);



