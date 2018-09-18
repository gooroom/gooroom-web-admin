import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

const GET_DESKTOP_LIST_SUCCESS = 'clientDesktopConfig/GET_LIST_SUCCESS';
const GET_DESKTOP_SUCCESS = 'clientDesktopConfig/GET_DESKTOP_SUCCESS';
const CREATE_DESKTOP_SUCCESS = 'clientDesktopConfig/CREATE_DESKTOP_SUCCESS';
const EDIT_DESKTOP_SUCCESS = 'clientDesktopConfig/EDIT_DESKTOP_SUCCESS';
const DELETE_DESKTOP_SUCCESS = 'clientDesktopConfig/DELETE_DESKTOP_SUCCESS';

const SHOW_DESKTOP_INFORM = 'clientDesktopConfig/SHOW_DESKTOP_INFORM';
const SHOW_DESKTOP_DIALOG = 'clientDesktopConfig/SHOW_DESKTOP_DIALOG';
const CHG_STORE_DATA = 'clientDesktopConfig/CHG_STORE_DATA';

const SET_SELECTED_OBJ = 'clientDesktopConfig/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'clientDesktopConfig/SET_EDITING_ITEM_VALUE';

const COMMON_PENDING = 'clientDesktopConfig/COMMON_PENDING';
const COMMON_FAILURE = 'clientDesktopConfig/COMMON_FAILURE';

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

    selectedViewItem: {
        objId: '',
        objNm: '',
        comment: '',
        hosts: '',
    },

    informOpen: false,
    dialogOpen: false,
    dialogType: '',

};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_DESKTOP_DIALOG,
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
        type: SHOW_DESKTOP_INFORM,
        payload: param
    });
};

export const closeInform = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"informOpen",value:false}
    });
};

// ...
export const readClientDesktopConfigList = (param) => dispatch => {
    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopConfList', resetParam).then(
        (response) => {
            dispatch({
                type: GET_DESKTOP_LIST_SUCCESS,
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

export const getClientDesktopConfig = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDesktopConf', param).then(
        (response) => {
            dispatch({
                type: GET_DESKTOP_SUCCESS,
                compId: compId,
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
        HOSTS: param.hosts
    };
}

// create (add)
export const createClientHostNameData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createHostNameConf', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_DESKTOP_SUCCESS,
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
export const editClientHostNameData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateHostNameConf', makeParameter(param)).then(
        (response) => {
            dispatch({
                type: EDIT_DESKTOP_SUCCESS,
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
export const deleteClientHostNameData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteHostNameConf', param).then(
        (response) => {
            dispatch({
                type: DELETE_DESKTOP_SUCCESS,
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
            resultMsg: (action.payload.data && action.payload.data.status) ? action.payload.data.status.message : ''
        };
    },

    [GET_DESKTOP_LIST_SUCCESS]: (state, action) => {
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
    [GET_DESKTOP_SUCCESS]: (state, action) => {
        let editingItem = 'editingItem';
        if(action.compId && action.compId != '') {
            editingItem = action.compId + '__editingItem';
        }
        const { data } = action.payload.data;
        
        if(data && data.length > 0) {
            return {
                ...state,
                pending: false,
                error: false,
                [editingItem]: Object.assign({}, data[0])
            };
        } else {
            return {
                ...state,
                pending: false,
                error: false,
                [editingItem]: {objNm: '', objId: '', comment: ''}
            };
        }
    },
    [SHOW_DESKTOP_DIALOG]: (state, action) => {

        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedViewItem),
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_DESKTOP_INFORM]: (state, action) => {
        return {
            ...state,
            selectedViewItem: action.payload.selectedViewItem,
            informOpen: true,
        };
    },
    [SET_SELECTED_OBJ]: (state, action) => {
        return {
            ...state,
            selectedViewItem: action.payload.selectedViewItem
        }
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        const newEditingItem = getMergedObject(state.editingItem, {[action.payload.name]: action.payload.value});
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

    [CREATE_DESKTOP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_DESKTOP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [DELETE_DESKTOP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    }

}, initialState);

