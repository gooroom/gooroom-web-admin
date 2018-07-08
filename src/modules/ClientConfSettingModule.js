import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';

const GET_CONFSETTING_LIST_PENDING = 'clientConfSetting/GET_LIST_PENDING';
const GET_CONFSETTING_LIST_SUCCESS = 'clientConfSetting/GET_LIST_SUCCESS';
const GET_CONFSETTING_LIST_FAILURE = 'clientConfSetting/GET_LIST_FAILURE';

const CREATE_CONFSETTING_NEWKEY = 'clientConfSetting/CREATE_CONFSETTING_NEWKEY';
const CREATE_CONFSETTING_PENDING = 'clientConfSetting/CREATE_CONFSETTING_PENDING';
const CREATE_CONFSETTING_SUCCESS = 'clientConfSetting/CREATE_CONFSETTING_SUCCESS';
const CREATE_CONFSETTING_FAILURE = 'clientConfSetting/CREATE_CONFSETTING_FAILURE';

const EDIT_CONFSETTING_PENDING = 'clientConfSetting/EDIT_CONFSETTING_PENDING';
const EDIT_CONFSETTING_SUCCESS = 'clientConfSetting/EDIT_CONFSETTING_SUCCESS';
const EDIT_CONFSETTING_FAILURE = 'clientConfSetting/EDIT_CONFSETTING_FAILURE';

const DELETE_CONFSETTING_PENDING = 'clientConfSetting/DELETE_CONFSETTING_PENDING';
const DELETE_CONFSETTING_SUCCESS = 'clientConfSetting/DELETE_CONFSETTING_SUCCESS';
const DELETE_CONFSETTING_FAILURE = 'clientConfSetting/DELETE_CONFSETTING_FAILURE';

const SHOW_CONFSETTING_DIALOG = 'clientConfSetting/SHOW_CONFSETTING_DIALOG';
const CLOSE_CONFSETTING_DIALOG = 'clientConfSetting/CLOSE_CONFSETTING_DIALOG';
const CHG_SELECTED_DATA = 'clientConfSetting/CHG_SELECTED_DATA';

const CONFSETTING_COMMON_PENDING = 'clientConfSetting/CONFSETTING_COMMON_PENDING';
const CONFSETTING_COMMON_FAILURE = 'clientConfSetting/CONFSETTING_COMMON_FAILURE';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chConfId',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {
        objId: '',
        objNm: '',
        osProtect: false,
        comment: ''
    },

    dialogOpen: false,
    dialogType: '',

};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_DIALOG,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_DIALOG,
        payload: param
    });
};

// ...
export const readClientConfSettingList = (param) => dispatch => {
    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: GET_CONFSETTING_LIST_PENDING});
    return requestPostAPI('readClientConfListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_CONFSETTING_LIST_FAILURE,
            payload: error
        });
    });
};

export const changeSelectedItemValue = (param) => dispatch => {
    console.log('changeSelectedItemValue : ', param);
    return dispatch({
        type: CHG_SELECTED_DATA,
        payload: param
    });
};

export const generateClientConfSetting = (param) => dispatch => {
    dispatch({type: CONFSETTING_COMMON_PENDING});
    return requestPostAPI('generateConfSettingNumber', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CONFSETTING_NEWKEY,
                        payload: response.data.data[0]
                    });
                }
            } catch(ex) {
                dispatch({
                    type: CONFSETTING_COMMON_FAILURE,
                    payload: error
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: CONFSETTING_COMMON_FAILURE,
            payload: error
        });
    });
};

// create (add)
export const createClientConfSettingData = (param) => dispatch => {
    dispatch({type: CREATE_CONFSETTING_PENDING});
    return requestPostAPI('createClientConf', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CONFSETTING_SUCCESS,
                        payload: response
                    });
                }    
            } catch(ex) {
                dispatch({
                    type: CREATE_CONFSETTING_FAILURE,
                    payload: response
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: CREATE_CONFSETTING_FAILURE,
            payload: error
        });
    });
};

// edit
export const editClientConfSettingData = (param) => dispatch => {
    dispatch({type: EDIT_CONFSETTING_PENDING});
    return requestPostAPI('editConfSettingData', param).then(
        (response) => {
            dispatch({
                type: EDIT_CONFSETTING_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: EDIT_CONFSETTING_FAILURE,
            payload: error
        });
    });
};

// delete
export const deleteClientConfSettingData = (param) => dispatch => {
    dispatch({type: DELETE_CONFSETTING_PENDING});
    return requestPostAPI('deleteConfSettingData', param).then(
        (response) => {
            dispatch({
                type: DELETE_CONFSETTING_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: DELETE_CONFSETTING_FAILURE,
            payload: error
        });
    });
};


export default handleActions({

    [GET_CONFSETTING_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_CONFSETTING_LIST_SUCCESS]: (state, action) => {
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
    [GET_CONFSETTING_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },
    [SHOW_CONFSETTING_DIALOG]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            dialogOpen: action.payload.dialogOpen,
            dialogType: action.payload.dialogType,
        };
    },
    [CLOSE_CONFSETTING_DIALOG]: (state, action) => {
        return {
            ...state,
            dialogOpen: action.payload.dialogOpen
        }
    },
    [CHG_SELECTED_DATA]: (state, action) => {
        const newSelectedItem = getMergedListParam(state.selectedItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [CREATE_CONFSETTING_NEWKEY]: (state, action) => {
        const newSelectedItem = getMergedListParam(state.selectedItem, {objId: action.payload.key});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [CREATE_CONFSETTING_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [CREATE_CONFSETTING_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [CREATE_CONFSETTING_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },
    [CONFSETTING_COMMON_PENDING]: (state, action) => {
        return {
            ...state
        }
    },
    [CONFSETTING_COMMON_FAILURE]: (state, action) => {
        return {
            ...state
        }
    },
    [EDIT_CONFSETTING_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [EDIT_CONFSETTING_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_CONFSETTING_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },
    [DELETE_CONFSETTING_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [DELETE_CONFSETTING_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [DELETE_CONFSETTING_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

}, initialState);

