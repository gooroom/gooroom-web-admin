import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

const GET_JOB_LIST_PENDING = 'jobManage/GET_LIST_PENDING';
const GET_JOB_LIST_SUCCESS = 'jobManage/GET_LIST_SUCCESS';
const GET_JOB_LIST_FAILURE = 'jobManage/GET_LIST_FAILURE';

const SHOW_JOBINFORM_DATA = 'jobManage/SHOW_JOBINFORM_DATA';

const GET_TARGET_LIST_PENDING = 'jobManage/GET_TARGETLIST_PENDING';
const GET_TARGET_LIST_SUCCESS = 'jobManage/GET_TARGETLIST_SUCCESS';
const GET_TARGET_LIST_FAILURE = 'jobManage/GET_TARGETLIST_FAILURE';


// const CREATE_PROFILESET_DATA_PENDING = 'jobManage/CREATE_DATA_PENDING';
// const CREATE_PROFILESET_DATA_SUCCESS = 'jobManage/CREATE_DATA_SUCCESS';
// const CREATE_PROFILESET_DATA_FAILURE = 'jobManage/CREATE_DATA_FAILURE';

// const EDIT_PROFILESET_DATA_PENDING = 'jobManage/EDIT_DATA_PENDING';
// const EDIT_PROFILESET_DATA_SUCCESS = 'jobManage/EDIT_DATA_SUCCESS';
// const EDIT_PROFILESET_DATA_FAILURE = 'jobManage/EDIT_DATA_FAILURE';

// const DELETE_PROFILESET_DATA_PENDING = 'jobManage/DELETE_DATA_PENDING';
// const DELETE_PROFILESET_DATA_SUCCESS = 'jobManage/DELETE_DATA_SUCCESS';
// const DELETE_PROFILESET_DATA_FAILURE = 'jobManage/DELETE_DATA_FAILURE';

// const CREATE_PROFILESET_JOB_PENDING = 'jobManage/CREATE_JOB_PENDING';
// const CREATE_PROFILESET_JOB_SUCCESS = 'jobManage/CREATE_JOB_SUCCESS';
// const CREATE_PROFILESET_JOB_FAILURE = 'jobManage/CREATE_JOB_FAILURE';

// const CLOSE_PROFILESET_DATA = 'clientProfileSetPopup/CLOSE_PROFILESET_DATA';
// const CHG_PROFILESET_PARAM = 'clientProfileSetPopup/CHG_PROFILESET_PARAM';
// const SET_PROFILESET_SELECTED = 'clientProfileSetPopup/SET_PROFILESET_SELECTED';


// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    jobStatusOptionList: [
        { id: "R", value: "R", label: "작업전" },
        { id: "D", value: "D", label: "작업중" },
        { id: "C", value: "C", label: "작업완료" },
        { id: "ALL", value: "ALL", label: "전체" }
    ],

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

    selectedViewItem: {},

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

    dispatch({type: GET_JOB_LIST_PENDING});
    return requestPostAPI('readJobListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_JOB_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_JOB_LIST_FAILURE,
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
        jobNo: param.selectedViewItem.jobNo,
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

    [GET_JOB_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_JOB_LIST_SUCCESS]: (state, action) => {
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
    [GET_JOB_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },
    [SHOW_JOBINFORM_DATA]: (state, action) => {
        return {
            ...state,
            selectedViewItem: action.payload.selectedViewItem,
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
    //         selectedViewItem: action.payload.selectedViewItem
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



