import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedObject } from '../components/GrUtils/GrCommonUtils';

const GET_PROFILESET_LIST_PENDING = 'clientProfileSet/GET_LIST_PENDING';
const GET_PROFILESET_LIST_SUCCESS = 'clientProfileSet/GET_LIST_SUCCESS';
const GET_PROFILESET_LIST_FAILURE = 'clientProfileSet/GET_LIST_FAILURE';

const CREATE_PROFILESET_DATA_PENDING = 'clientProfileSet/CREATE_DATA_PENDING';
const CREATE_PROFILESET_DATA_SUCCESS = 'clientProfileSet/CREATE_DATA_SUCCESS';
const CREATE_PROFILESET_DATA_FAILURE = 'clientProfileSet/CREATE_DATA_FAILURE';

const EDIT_PROFILESET_DATA_PENDING = 'clientProfileSet/EDIT_DATA_PENDING';
const EDIT_PROFILESET_DATA_SUCCESS = 'clientProfileSet/EDIT_DATA_SUCCESS';
const EDIT_PROFILESET_DATA_FAILURE = 'clientProfileSet/EDIT_DATA_FAILURE';

const DELETE_PROFILESET_DATA_PENDING = 'clientProfileSet/DELETE_DATA_PENDING';
const DELETE_PROFILESET_DATA_SUCCESS = 'clientProfileSet/DELETE_DATA_SUCCESS';
const DELETE_PROFILESET_DATA_FAILURE = 'clientProfileSet/DELETE_DATA_FAILURE';

const CREATE_PROFILESET_JOB_PENDING = 'clientProfileSet/CREATE_JOB_PENDING';
const CREATE_PROFILESET_JOB_SUCCESS = 'clientProfileSet/CREATE_JOB_SUCCESS';
const CREATE_PROFILESET_JOB_FAILURE = 'clientProfileSet/CREATE_JOB_FAILURE';

const SHOW_PROFILESET_DIALOG = 'clientProfileSet/SHOW_PROFILESET_DIALOG';
const CLOSE_PROFILESET_DIALOG = 'clientProfileSet/CLOSE_PROFILESET_DIALOG';
const CHG_PROFILESET_PARAM = 'clientProfileSet/CHG_PROFILESET_PARAM';
const SET_PROFILESET_SELECTED = 'clientProfileSet/SET_PROFILESET_SELECTED';



// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chProfileSetNo',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {
        profileNo: '',
        profileNm: '',
        profileCmt: '',
        clientId: '',
        clientNm: '',
        targetClientIds: '',
        targetClientIdArray: [],
        targetGroupIds: '',
        targetGroupIdArray: [],
        isRemoval: 'false'
    },

    dialogOpen: false,
    dialogType: '',

};


// ...
export const readClientProfileSetList = (param) => dispatch => {

    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: GET_PROFILESET_LIST_PENDING});
    return requestPostAPI('readProfileSetListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_PROFILESET_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_PROFILESET_LIST_FAILURE,
            payload: error
        });
    });
};

// create (add)
export const createClientProfileSetData = (param) => dispatch => {
    dispatch({type: CREATE_PROFILESET_DATA_PENDING});
    return requestPostAPI('createProfileSet', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_PROFILESET_DATA_SUCCESS,
                        payload: response
                    });
                }
            } catch(ex) {
                dispatch({
                    type: CREATE_PROFILESET_DATA_FAILURE,
                    payload: response
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: CREATE_PROFILESET_DATA_FAILURE,
            payload: error
        });
    });
};

// edit
export const editClientProfileSetData = (param) => dispatch => {
    dispatch({type: EDIT_PROFILESET_DATA_PENDING});
    return requestPostAPI('editProfileSetData', param).then(
        (response) => {
            dispatch({
                type: EDIT_PROFILESET_DATA_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: EDIT_PROFILESET_DATA_FAILURE,
            payload: error
        });
    });
};

// delete
export const deleteClientProfileSetData = (param) => dispatch => {
    dispatch({type: DELETE_PROFILESET_DATA_PENDING});
    return requestPostAPI('deleteProfileSetData', param).then(
        (response) => {
            dispatch({
                type: DELETE_PROFILESET_DATA_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: DELETE_PROFILESET_DATA_FAILURE,
            payload: error
        });
    });
};

// create profile job
export const createClientProfileSetJob = (param) => dispatch => {
    dispatch({type: CREATE_PROFILESET_JOB_PENDING});
    return requestPostAPI('createProfileJob', param).then(
        (response) => {
            dispatch({
                type: CREATE_PROFILESET_JOB_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: CREATE_PROFILESET_JOB_FAILURE,
            payload: error
        });
    });
};


export const setSelectedItem = (param) => dispatch => {
    return dispatch({
        type: SET_PROFILESET_SELECTED,
        payload: param
    });
};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_PROFILESET_DIALOG,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_PROFILESET_DIALOG,
        payload: param
    });
};

export const changeParamValue = (param) => dispatch => {
    return dispatch({
        type: CHG_PROFILESET_PARAM,
        payload: param
    });
};


export default handleActions({

    [GET_PROFILESET_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_PROFILESET_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;

        let tempListParam = state.listParam;
        Object.assign(tempListParam, {
            rowsFiltered: parseInt(recordsFiltered, 10),
            rowsTotal: parseInt(recordsTotal, 10),
            page: parseInt(draw, 10),
            rowsPerPage: parseInt(rowLength, 10)
        });

        return {
            ...state,
            pending: false,
            error: false,
            listData: data,
            listParam: tempListParam
        };
    },
    [GET_PROFILESET_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },
    [CREATE_PROFILESET_DATA_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [CREATE_PROFILESET_DATA_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [CREATE_PROFILESET_DATA_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },
    [SHOW_PROFILESET_DIALOG]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            dialogOpen: action.payload.dialogOpen,
            dialogType: action.payload.dialogType,
        };
    },
    [CLOSE_PROFILESET_DIALOG]: (state, action) => {
        return {
            ...state,
            dialogOpen: action.payload.dialogOpen
        }
    },
    [CHG_PROFILESET_PARAM]: (state, action) => {
        const newSelectedItem = getMergedObject(state.selectedItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [SET_PROFILESET_SELECTED]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem
        }
    },
    [CREATE_PROFILESET_JOB_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [CREATE_PROFILESET_JOB_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [CREATE_PROFILESET_JOB_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },

}, initialState);



