import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

const GET_CLIENT_LIST_PENDING = 'clientManage/GET_LIST_PENDING';
const GET_CLIENT_LIST_SUCCESS = 'clientManage/GET_LIST_SUCCESS';
const GET_CLIENT_LIST_FAILURE = 'clientManage/GET_LIST_FAILURE';

const GET_GROUP_LIST_PENDING = 'groupManage/GET_LIST_PENDING';
const GET_GROUP_LIST_SUCCESS = 'groupManage/GET_LIST_SUCCESS';
const GET_GROUP_LIST_FAILURE = 'groupManage/GET_LIST_FAILURE';



// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        jobStatus: 'ALL',
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'PROFILE_NO',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },
    targetListData: [],
    targetListParam: {
        jobNo: '',
        orderDir: 'desc',
        orderColumn: 'PROFILE_NO',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {},

    informOpen: false,
};


// ...
export const readJobManageList = (param) => dispatch => {

    const resetParam = {
        jobStatus: param.jobStatus,
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: GET_GROUP_LIST_PENDING});
    return requestPostAPI('readJobListPaged', resetParam).then(
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

// view Job Inform
export const showJobInform222 = (param) => dispatch => {
    return dispatch({
        type: SHOW_JOBINFORM_DATA,
        payload: param
    });
};

export const showJobInform = (param) => dispatch => {

    const resetParam = {
        jobNo: param.selectedItem.jobNo,
        page: 0,
        start: 0,
        length: 10,
        orderColumn: '',
        orderDir: ''
    };

    dispatch({
        type: SHOW_JOBINFORM_DATA,
        payload: param
    });

    dispatch({type: GET_TARGET_LIST_PENDING});
    return requestPostAPI('readClientListInJob', resetParam).then(
        (response) => {
            dispatch({
                type: GET_TARGET_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_TARGET_LIST_FAILURE,
            payload: error
        });
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

// export const changeParamValue = (param) => dispatch => {
//     return dispatch({
//         type: CHG_PROFILESET_PARAM,
//         payload: param
//     });
// };


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
    [SHOW_JOBINFORM_DATA]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            informOpen: true
        };
    },

    [GET_TARGET_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_TARGET_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;

        let tempListParam = state.targetListParam;
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
            targetListData: data,
            targetListParam: tempListParam
        };
    },
    [GET_TARGET_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
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
    // [CHG_PROFILESET_PARAM]: (state, action) => {
    //     return {
    //         ...state,
    //         [action.payload.name]: action.payload.value
    //     }
    // },
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



