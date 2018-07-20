import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';
import { setParameterForView } from 'views/Rules/HostName/ClientHostNameManageInform';

const GET_HOSTNAME_LIST_SUCCESS = 'clientHostName/GET_LIST_SUCCESS';
const GET_HOSTNAME_SUCCESS = 'clientHostName/GET_HOSTNAME_SUCCESS';
const CREATE_HOSTNAME_SUCCESS = 'clientHostName/CREATE_HOSTNAME_SUCCESS';
const EDIT_HOSTNAME_SUCCESS = 'clientHostName/EDIT_HOSTNAME_SUCCESS';
const DELETE_HOSTNAME_SUCCESS = 'clientHostName/DELETE_HOSTNAME_SUCCESS';

const SHOW_HOSTNAME_INFORM = 'clientHostName/SHOW_HOSTNAME_INFORM';
const SHOW_HOSTNAME_DIALOG = 'clientHostName/SHOW_HOSTNAME_DIALOG';
const CHG_STORE_DATA = 'clientHostName/CHG_STORE_DATA';

const SET_SELECTED_OBJ = 'clientHostName/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'clientHostName/SET_EDITING_ITEM_VALUE';

const COMMON_PENDING = 'clientHostName/COMMON_PENDING';
const COMMON_FAILURE = 'clientHostName/COMMON_FAILURE';

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
        hosts: '',
    },

    informOpen: false,
    dialogOpen: false,
    dialogType: '',

};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_HOSTNAME_DIALOG,
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
        type: SHOW_HOSTNAME_INFORM,
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
export const readClientHostNameList = (param) => dispatch => {
    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readHostNameConfListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_HOSTNAME_LIST_SUCCESS,
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

export const getClientHostName = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readHostNameConf', param).then(
        (response) => {
            dispatch({
                type: GET_HOSTNAME_SUCCESS,
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
                        type: CREATE_HOSTNAME_SUCCESS,
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
                type: EDIT_HOSTNAME_SUCCESS,
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
                type: DELETE_HOSTNAME_SUCCESS,
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

    [GET_HOSTNAME_LIST_SUCCESS]: (state, action) => {
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
    [GET_HOSTNAME_SUCCESS]: (state, action) => {
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
                [editingItem]: Object.assign({}, setParameterForView(data[0]))
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
    [SHOW_HOSTNAME_DIALOG]: (state, action) => {

        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedItem),
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_HOSTNAME_INFORM]: (state, action) => {
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

    [CREATE_HOSTNAME_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_HOSTNAME_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [DELETE_HOSTNAME_SUCCESS]: (state, action) => {
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

