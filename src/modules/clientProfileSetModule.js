import { handleActions } from 'redux-actions';

import axios from 'axios';
import qs from 'qs';

function requestPostAPI(url, param) {

    return axios({
        method: "post",
        url: "http://localhost:8080/gpms/" + url,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        transformRequest: [
          function(data, headers) {
            return qs.stringify(data);
          }
        ],
        data: param,
        withCredentials: true
      });
}

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

const SHOW_PROFILESET_DATA = 'clientProfileSetPopup/SHOW_PROFILESET_DATA';
const CLOSE_PROFILESET_DATA = 'clientProfileSetPopup/CLOSE_PROFILESET_DATA';
const CHG_PROFILESET_PARAM = 'clientProfileSetPopup/CHG_PROFILESET_PARAM';
const SET_PROFILESET_SELECTED = 'clientProfileSetPopup/SET_PROFILESET_SELECTED';
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

    return requestPostAPI('readProfileSetList', resetParam).then(
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
            dispatch({
                type: CREATE_PROFILESET_DATA_SUCCESS,
                payload: response
            });
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

export const setSelectedItem = (param) => dispatch => {
    return dispatch({
        type: SET_PROFILESET_SELECTED,
        payload: param
    });
};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_PROFILESET_DATA,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_PROFILESET_DATA,
        payload: param
    });
};

export const changeParamValue = (param) => dispatch => {
    return dispatch({
        type: CHG_PROFILESET_PARAM,
        payload: param
    });
};

// ...

const initialState = {
    pending: false,
    error: false,
    listData: [],

    keyword: '',
    orderDir: 'asc',
    orderColumn: '',

    selectedItem: {
        profileNo: '',
        profileName: '',
        profileComment: ''
    },
    dialogOpen: false,

    profileName: '',
    profileComment: '',
    clientId: '',
    targetClient: [],

    page: 0,
    rowsPerPage: 5,
    rowsTotal: 0,
    rowsFiltered: 0
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
        return {
            ...state,
            pending: false,
            error: false,
            listData: data,
            rowsFiltered: parseInt(recordsFiltered, 10),
            rowsTotal: parseInt(recordsTotal, 10),
            page: parseInt(draw, 10),
            rowsPerPage: parseInt(rowLength, 10)
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
            error: true
        };
    },
    [SHOW_PROFILESET_DATA]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            dialogOpen: action.payload.dialogOpen,
            dialogType: action.payload.dialogType,
            profileName: ((action.payload.selectedItem) ? action.payload.selectedItem.profileName : ''),
            profileComment: ((action.payload.selectedItem) ? action.payload.selectedItem.profileComment : ''),
            clientId: ((action.payload.selectedItem) ? action.payload.selectedItem.clientId : '')
        };
    },
    [CLOSE_PROFILESET_DATA]: (state, action) => {
        return {
            ...state,
            dialogOpen: action.payload.dialogOpen
        }
    },
    [CHG_PROFILESET_PARAM]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    },
    [SET_PROFILESET_SELECTED]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem
        }
    }

}, initialState);



