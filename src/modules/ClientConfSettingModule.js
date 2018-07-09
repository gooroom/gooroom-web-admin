import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';

const GET_CONFSETTING_LIST_PENDING = 'clientConfSetting/GET_LIST_PENDING';
const GET_CONFSETTING_LIST_SUCCESS = 'clientConfSetting/GET_LIST_SUCCESS';
const GET_CONFSETTING_LIST_FAILURE = 'clientConfSetting/GET_LIST_FAILURE';

const CREATE_CONFSETTING_PENDING = 'clientConfSetting/CREATE_CONFSETTING_PENDING';
const CREATE_CONFSETTING_SUCCESS = 'clientConfSetting/CREATE_CONFSETTING_SUCCESS';
const CREATE_CONFSETTING_FAILURE = 'clientConfSetting/CREATE_CONFSETTING_FAILURE';

const EDIT_CONFSETTING_PENDING = 'clientConfSetting/EDIT_CONFSETTING_PENDING';
const EDIT_CONFSETTING_SUCCESS = 'clientConfSetting/EDIT_CONFSETTING_SUCCESS';
const EDIT_CONFSETTING_FAILURE = 'clientConfSetting/EDIT_CONFSETTING_FAILURE';

const DELETE_CONFSETTING_PENDING = 'clientConfSetting/DELETE_CONFSETTING_PENDING';
const DELETE_CONFSETTING_SUCCESS = 'clientConfSetting/DELETE_CONFSETTING_SUCCESS';
const DELETE_CONFSETTING_FAILURE = 'clientConfSetting/DELETE_CONFSETTING_FAILURE';

const SHOW_CONFSETTING_INFORM = 'clientConfSetting/SHOW_CONFSETTING_INFORM';
const SHOW_CONFSETTING_DIALOG = 'clientConfSetting/SHOW_CONFSETTING_DIALOG';
const CHG_STORE_DATA = 'clientConfSetting/CHG_STORE_DATA';

const SET_SELECTED_OBJ = 'clientConfSetting/SET_SELECTED_OBJ';
const SET_SELECTED_VALUE = 'clientConfSetting/SET_SELECTED_VALUE';
const SET_SELECTED_NTP_VALUE = 'clientConfSetting/SET_SELECTED_NTP_VALUE';

const ADD_NTPADDRESS_ITEM = 'clientConfSetting/ADD_NTPADDRESS_ITEM';
const DELETE_NTPADDRESS_ITEM = 'clientConfSetting/DELETE_NTPADDRESS_ITEM';

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
        comment: '',
        useHypervisor: false,
        pollingTime: '',
        selectedNtpIndex: -1,
        ntpAddress: ['']
    },

    viewItem: {
        objId: '',
        objNm: '',
        useHypervisor: false,
        comment: ''
    },

    informOpen: false,
    dialogOpen: false,
    dialogType: '',

};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_DIALOG,
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
        type: SHOW_CONFSETTING_INFORM,
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

export const setSelectedItemObj = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_OBJ,
        payload: param
    });
};

export const setSelectedItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_VALUE,
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
    dispatch({type: CREATE_CONFSETTING_PENDING});
    return requestPostAPI('createClientConf', makeParameter(param)).then(
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
    return requestPostAPI('updateClientConf', makeParameter(param)).then(
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
    return requestPostAPI('deleteClientConf', param).then(
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
        // console.log('action : ', action);
        // console.log('state : ', state);
        const newSelectedItem = getMergedListParam(state.selectedItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_CONFSETTING_INFORM]: (state, action) => {
        return {
            ...state,
            viewItem: action.payload.selectedItem,
            informOpen: true,
        };
    },
    [SET_SELECTED_OBJ]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem
        }
    },
    [SET_SELECTED_VALUE]: (state, action) => {
        const newSelectedItem = getMergedListParam(state.selectedItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [SET_SELECTED_NTP_VALUE]: (state, action) => {
        let newNtpAddress = state.selectedItem.ntpAddress;
        newNtpAddress[action.payload.index] = action.payload.value;
        const newSelectedItem = getMergedListParam(state.selectedItem, {'ntpAddress': newNtpAddress});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [CHG_STORE_DATA]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    },
    [ADD_NTPADDRESS_ITEM]: (state, action) => {
        let newNtpAddress = state.selectedItem.ntpAddress;
        newNtpAddress.push('');
        const newSelectedItem = getMergedListParam(state.selectedItem, {'ntpAddress': newNtpAddress});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    [DELETE_NTPADDRESS_ITEM]: (state, action) => {
        
        let newNtpAddress = state.selectedItem.ntpAddress;
        newNtpAddress.splice(action.payload.index, 1);
        let newSelectedItem = getMergedListParam(state.selectedItem, {'ntpAddress': newNtpAddress});

        // changed selected ntp addres index
        if(state.selectedItem.selectedNtpIndex == action.payload.index) {
            newSelectedItem = getMergedListParam(newSelectedItem, {'selectedNtpIndex': -1});
        } else if(state.selectedItem.selectedNtpIndex > action.payload.index) {
            newSelectedItem = getMergedListParam(newSelectedItem, {'selectedNtpIndex': (state.selectedItem.selectedNtpIndex - 1)});
        }

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

