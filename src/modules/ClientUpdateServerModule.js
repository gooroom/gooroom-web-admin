import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';

const GET_CONFIG_LIST_SUCCESS = 'clientConfig/GET_LIST_SUCCESS';
const CREATE_CONFIG_SUCCESS = 'clientConfig/CREATE_CONFIG_SUCCESS';
const EDIT_CONFIG_SUCCESS = 'clientConfig/EDIT_CONFIG_SUCCESS';
const DELETE_CONFIG_SUCCESS = 'clientConfig/DELETE_CONFIG_SUCCESS';

const SHOW_CONFIG_INFORM = 'clientConfig/SHOW_CONFIG_INFORM';
const SHOW_CONFIG_DIALOG = 'clientConfig/SHOW_CONFIG_DIALOG';
const CHG_STORE_DATA = 'clientConfig/CHG_STORE_DATA';

const SET_SELECTED_OBJ = 'clientConfig/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'clientConfig/SET_EDITING_ITEM_VALUE';
const SET_SELECTED_NTP_VALUE = 'clientConfig/SET_SELECTED_NTP_VALUE';

const ADD_NTPADDRESS_ITEM = 'clientConfig/ADD_NTPADDRESS_ITEM';
const DELETE_NTPADDRESS_ITEM = 'clientConfig/DELETE_NTPADDRESS_ITEM';

const COMMON_PENDING = 'clientConfig/COMMON_PENDING';
const COMMON_FAILURE = 'clientConfig/COMMON_FAILURE';

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
        rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {
        objId: '',
        objNm: '',
        comment: '',
        useHypervisor: false,
        pollingTime: '',
        selectedNtpIndex: -1,
        ntpAddress: ['']
    },

    informOpen: false,
    dialogOpen: false,
    dialogType: '',

};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFIG_DIALOG,
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
        type: SHOW_CONFIG_INFORM,
        payload: param
    });
};

export const closeInform = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"informOpen",value:false}
    });
};

export const addNtpAddress = () => dispatch => {
    return dispatch({
        type: ADD_NTPADDRESS_ITEM
    });
}

export const deleteNtpAddress = (index) => dispatch => {
    return dispatch({
        type: DELETE_NTPADDRESS_ITEM,
        payload: {index:index}
    });
}

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

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_CONFIG_LIST_SUCCESS,
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

export const setSelectedItemObj = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_OBJ,
        payload: param
    });
};

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        payload: param
    });
};

export const setSelectedNtpValue = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_NTP_VALUE,
        payload: param
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: param
    });
};

const makeParameter = (param) => {
    return {
        objId: param.objId,
        objName: param.objNm,
        objComment: param.comment,
        AGENTPOLLINGTIME: param.pollingTime,
        USEHYPERVISOR: param.useHypervisor,
        NTPSELECTADDRESS: (param.selectedNtpIndex > -1) ? param.ntpAddress[param.selectedNtpIndex] : '',
        NTPADDRESSES: param.ntpAddress
    };
}

// create (add)
export const createClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientConf', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CONFIG_SUCCESS,
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
export const editClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientConf', makeParameter(param)).then(
        (response) => {
            dispatch({
                type: EDIT_CONFIG_SUCCESS,
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
export const deleteClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientConf', param).then(
        (response) => {
            dispatch({
                type: DELETE_CONFIG_SUCCESS,
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

    [GET_CONFIG_LIST_SUCCESS]: (state, action) => {
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
    [SHOW_CONFIG_DIALOG]: (state, action) => {
        // console.log('action : ', action);
        // console.log('state : ', state);
        // ///////// const newSelectedItem = getMergedListParam(state.selectedItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedItem),
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_CONFIG_INFORM]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            informOpen: true,
        };
    },
    [SET_SELECTED_OBJ]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem
        }
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        const newEditingItem = getMergedListParam(state.editingItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [SET_SELECTED_NTP_VALUE]: (state, action) => {
        let newNtpAddress = state.editingItem.ntpAddress;
        newNtpAddress[action.payload.index] = action.payload.value;
        const newEditingItem = getMergedListParam(state.editingItem, {'ntpAddress': newNtpAddress});
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
    [ADD_NTPADDRESS_ITEM]: (state, action) => {
        let newNtpAddress = state.editingItem.ntpAddress;
        newNtpAddress.push('');
        const newEditingItem = getMergedListParam(state.editingItem, {'ntpAddress': newNtpAddress});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [DELETE_NTPADDRESS_ITEM]: (state, action) => {
        
        let newNtpAddress = state.editingItem.ntpAddress;
        newNtpAddress.splice(action.payload.index, 1);
        let newEditingItem = getMergedListParam(state.editingItem, {'ntpAddress': newNtpAddress});

        // changed selected ntp addres index
        if(state.editingItem.selectedNtpIndex == action.payload.index) {
            newEditingItem = getMergedListParam(newEditingItem, {'selectedNtpIndex': -1});
        } else if(state.editingItem.selectedNtpIndex > action.payload.index) {
            newEditingItem = getMergedListParam(newEditingItem, {'selectedNtpIndex': (state.editingItem.selectedNtpIndex - 1)});
        }

        return {
            ...state,
            editingItem: newEditingItem
        }
    },

    [CREATE_CONFIG_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_CONFIG_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [DELETE_CONFIG_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
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
            resultMsg: action.payload.data.status.message
        };
    },

}, initialState);

