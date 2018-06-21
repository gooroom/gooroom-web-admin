
import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

const GET_GROUP_LIST_PENDING = 'groupManage/GET_LIST_PENDING';
const GET_GROUP_LIST_SUCCESS = 'groupManage/GET_LIST_SUCCESS';
const GET_GROUP_LIST_FAILURE = 'groupManage/GET_LIST_FAILURE';

const SHOW_CLIENTGROUP_INFORM = 'groupManage/SHOW_CLIENTGROUP_INFORM';

const CHG_PARAM_VALUE = 'groupManage/CHG_PARAM_VALUE';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        keyword: '',
        orderDir: 'asc',
        orderColumn: 'chGrpNm',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [2, 5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {},
    informOpen: false,
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

export const showCreateDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_CREATE,
        payload: param
    });
};





// // create (add)
// export const createClientProfileSetData = (param) => dispatch => {
//     dispatch({type: CREATE_PROFILESET_DATA_PENDING});
//     return requestPostAPI('createProfileSet', param).then(
//         (response) => {
//             if(response.data.status.result && response.data.status.result === 'success') {
//                 dispatch({
//                     type: CREATE_PROFILESET_DATA_SUCCESS,
//                     payload: response
//                 });
//             } else {
//                 dispatch({
//                     type: CREATE_PROFILESET_DATA_FAILURE,
//                     payload: response
//                 });
//             }
//         }
//     ).catch(error => {
//         dispatch({
//             type: CREATE_PROFILESET_DATA_FAILURE,
//             payload: error
//         });
//     });
// };

// // edit
// export const editClientProfileSetData = (param) => dispatch => {
//     dispatch({type: EDIT_PROFILESET_DATA_PENDING});
//     return requestPostAPI('editProfileSetData', param).then(
//         (response) => {
//             dispatch({
//                 type: EDIT_PROFILESET_DATA_SUCCESS,
//                 payload: response
//             });
//         }
//     ).catch(error => {
//         dispatch({
//             type: EDIT_PROFILESET_DATA_FAILURE,
//             payload: error
//         });
//     });
// };

// // delete
// export const deleteClientProfileSetData = (param) => dispatch => {
//     dispatch({type: DELETE_PROFILESET_DATA_PENDING});
//     return requestPostAPI('deleteProfileSetData', param).then(
//         (response) => {
//             dispatch({
//                 type: DELETE_PROFILESET_DATA_SUCCESS,
//                 payload: response
//             });
//         }
//     ).catch(error => {
//         dispatch({
//             type: DELETE_PROFILESET_DATA_FAILURE,
//             payload: error
//         });
//     });
// };

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


// export const setSelectedItem = (param) => dispatch => {
//     return dispatch({
//         type: SET_PROFILESET_SELECTED,
//         payload: param
//     });
// };


// export const closeDialog = (param) => dispatch => {
//     return dispatch({
//         type: CLOSE_PROFILESET_DATA,
//         payload: param
//     });
// };

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

    
    
    // [CREATE_PROFILESET_DATA_PENDING]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: true,
    //         error: false
    //     };
    // },
    // [CREATE_PROFILESET_DATA_SUCCESS]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: false,
    //         error: false,
    //     };
    // },
    // [CREATE_PROFILESET_DATA_FAILURE]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: false,
    //         error: true,
    //         resultMsg: action.payload.data.status.message
    //     };
    // },

    [CHG_PARAM_VALUE]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    },
    
    // [SET_PROFILESET_SELECTED]: (state, action) => {
    //     return {
    //         ...state,
    //         selectedItem: action.payload.selectedItem
    //     }
    // },
    // [CREATE_PROFILESET_JOB_PENDING]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: true,
    //         error: false
    //     };
    // },
    // [CREATE_PROFILESET_JOB_SUCCESS]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: false,
    //         error: false,
    //     };
    // },
    // [CREATE_PROFILESET_JOB_FAILURE]: (state, action) => {
    //     return {
    //         ...state,
    //         pending: false,
    //         error: true
    //     };
    // },


}, initialState);



