import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';

const GET_REGKEY_LIST_PENDING = 'clientRegKey/GET_LIST_PENDING';
const GET_REGKEY_LIST_SUCCESS = 'clientRegKey/GET_LIST_SUCCESS';
const GET_REGKEY_LIST_FAILURE = 'clientRegKey/GET_LIST_FAILURE';

const CREATE_REGKEY_NEWKEY = 'clientRegKey/CREATE_REGKEY_NEWKEY';
const CREATE_REGKEY_PENDING = 'clientRegKey/CREATE_REGKEY_PENDING';
const CREATE_REGKEY_SUCCESS = 'clientRegKey/CREATE_REGKEY_SUCCESS';
const CREATE_REGKEY_FAILURE = 'clientRegKey/CREATE_REGKEY_FAILURE';

const EDIT_REGKEY_PENDING = 'clientRegKey/EDIT_REGKEY_PENDING';
const EDIT_REGKEY_SUCCESS = 'clientRegKey/EDIT_REGKEY_SUCCESS';
const EDIT_REGKEY_FAILURE = 'clientRegKey/EDIT_REGKEY_FAILURE';

const DELETE_REGKEY_PENDING = 'clientRegKey/DELETE_REGKEY_PENDING';
const DELETE_REGKEY_SUCCESS = 'clientRegKey/DELETE_REGKEY_SUCCESS';
const DELETE_REGKEY_FAILURE = 'clientRegKey/DELETE_REGKEY_FAILURE';

const SHOW_REGKEY_DIALOG = 'clientRegKey/SHOW_REGKEY_DIALOG';
const CLOSE_REGKEY_DIALOG = 'clientRegKey/CLOSE_REGKEY_DIALOG';
const CHG_REGKEY_PARAM = 'clientRegKey/CHG_REGKEY_PARAM';

const REGKEY_COMMON_PENDING = 'clientRegKey/REGKEY_COMMON_PENDING';
const REGKEY_COMMON_FAILURE = 'clientRegKey/REGKEY_COMMON_FAILURE';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chModDate',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {
        regKeyNo: '',
        validDate: '',
        expireDate: '',
        ipRange: '',
        comment: ''
    },

    dialogOpen: false,
    dialogType: '',
};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_REGKEY_DIALOG,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_REGKEY_DIALOG,
        payload: param
    });
};

// ...
export const readClientRegkeyList = (param) => dispatch => {
    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: GET_REGKEY_LIST_PENDING});
    return requestPostAPI('readRegKeyInfoList', resetParam).then(
        (response) => {
            dispatch({
                type: GET_REGKEY_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_REGKEY_LIST_FAILURE,
            payload: error
        });
    });
};

export const changeParamValue = (param) => dispatch => {
    return dispatch({
        type: CHG_REGKEY_PARAM,
        payload: param
    });
};

export const generateClientRegkey = (param) => dispatch => {
    dispatch({type: REGKEY_COMMON_PENDING});
    return requestPostAPI('generateRegKeyNumber', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_REGKEY_NEWKEY,
                        payload: response.data.data[0]
                    });
                }
            } catch(ex) {
                dispatch({
                    type: REGKEY_COMMON_FAILURE,
                    payload: error
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: REGKEY_COMMON_FAILURE,
            payload: error
        });
    });
};

// create (add)
export const createClientRegKeyData = (param) => dispatch => {
    dispatch({type: CREATE_REGKEY_PENDING});
    return requestPostAPI('createRegKeyData', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_REGKEY_SUCCESS,
                        payload: response
                    });
                }    
            } catch(ex) {
                dispatch({
                    type: CREATE_REGKEY_FAILURE,
                    payload: response
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: CREATE_REGKEY_FAILURE,
            payload: error
        });
    });
};

// edit
export const editClientRegKeyData = (param) => dispatch => {
    dispatch({type: EDIT_REGKEY_PENDING});
    return requestPostAPI('editRegKeyData', param).then(
        (response) => {
            dispatch({
                type: EDIT_REGKEY_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: EDIT_REGKEY_FAILURE,
            payload: error
        });
    });
};

// delete
export const deleteClientRegKeyData = (param) => dispatch => {
    dispatch({type: DELETE_REGKEY_PENDING});
    return requestPostAPI('deleteRegKeyData', param).then(
        (response) => {
            dispatch({
                type: DELETE_REGKEY_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: DELETE_REGKEY_FAILURE,
            payload: error
        });
    });
};


export default handleActions({

    [GET_REGKEY_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_REGKEY_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength } = action.payload.data;
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
    [GET_REGKEY_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },
    [SHOW_REGKEY_DIALOG]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            dialogOpen: action.payload.dialogOpen,
            dialogType: action.payload.dialogType,
        };
    },
    [CLOSE_REGKEY_DIALOG]: (state, action) => {
        return {
            ...state,
            dialogOpen: action.payload.dialogOpen
        }
    },
    [CHG_REGKEY_PARAM]: (state, action) => {
        const newSelectedItem = getMergedListParam(state.selectedItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [CREATE_REGKEY_NEWKEY]: (state, action) => {
        const newSelectedItem = getMergedListParam(state.selectedItem, {regKeyNo: action.payload.key});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [CREATE_REGKEY_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [CREATE_REGKEY_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [CREATE_REGKEY_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },
    [REGKEY_COMMON_PENDING]: (state, action) => {
        return {
            ...state
        }
    },
    [REGKEY_COMMON_FAILURE]: (state, action) => {
        return {
            ...state
        }
    },
    [EDIT_REGKEY_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [EDIT_REGKEY_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_REGKEY_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },
    [DELETE_REGKEY_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [DELETE_REGKEY_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [DELETE_REGKEY_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

}, initialState);

