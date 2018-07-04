
import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';

const GET_LIST_PENDING = 'groupManage/GET_LIST_PENDING';
const GET_LIST_SUCCESS = 'groupManage/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'groupManage/GET_LIST_FAILURE';

const GET_LISTALL_PENDING = 'groupManage/GET_LISTALL_PENDING';
const GET_LISTALL_SUCCESS = 'groupManage/GET_LISTALL_SUCCESS';
const GET_LISTALL_FAILURE = 'groupManage/GET_LISTALL_FAILURE';

const CREATE_CLIENTGROUP_PENDING = 'groupManage/CREATE_CLIENTGROUP_PENDING';
const CREATE_CLIENTGROUP_SUCCESS = 'groupManage/CREATE_CLIENTGROUP_SUCCESS';
const CREATE_CLIENTGROUP_FAILURE = 'groupManage/CREATE_CLIENTGROUP_FAILURE';

const EDIT_CLIENTGROUP_PENDING = 'groupManage/EDIT_CLIENTGROUP_PENDING';
const EDIT_CLIENTGROUP_SUCCESS = 'groupManage/EDIT_CLIENTGROUP_SUCCESS';
const EDIT_CLIENTGROUP_FAILURE = 'groupManage/EDIT_CLIENTGROUP_FAILURE';

const DELETE_CLIENTGROUP_PENDING = 'groupManage/DELETE_CLIENTGROUP_PENDING';
const DELETE_CLIENTGROUP_SUCCESS = 'groupManage/DELETE_CLIENTGROUP_SUCCESS';
const DELETE_CLIENTGROUP_FAILURE = 'groupManage/DELETE_CLIENTGROUP_FAILURE';

const SHOW_CLIENTGROUP_INFORM = 'groupManage/SHOW_CLIENTGROUP_INFORM';
const SHOW_CLIENTGROUP_DIALOG = 'groupManage/SHOW_CLIENTGROUP_DIALOG';
const CLOSE_CLIENTGROUP_DIALOG = 'groupManage/CLOSE_CLIENTGROUP_DIALOG';

const CHG_CLIENTGROUP_PARAM = 'groupManage/CHG_CLIENTGROUP_PARAM';
const CHG_STORE_DATA = 'groupManage/CHG_STORE_DATA';

const SET_CLIENTGROUP_SELECTED = 'groupManage/SET_CLIENTGROUP_SELECTED';

const SET_INITIAL_STORE = 'groupManage/SET_INITIAL_STORE';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    initParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chGrpNm',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [2, 5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    listData: [],
    listParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chGrpNm',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [2, 5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },
    listDataForSelect: [],
    selectedClientGroup: {
        grpId: '',
        grpNm: ''
    },

    selectedItem: {
        grpId: '',
        grpNm: '',
        comment: '',
        clientConfigId: '',
        isDefault: ''
    },

    viewItem: {
        grpId: '',
        grpNm: '',
        comment: '',
        clientConfigId: '',
        isDefault: ''
    },

    informOpen: false,
    dialogOpen: false,
    dialogType: '',
    
    selected: []
};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_DIALOG,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTGROUP_DIALOG,
        payload: param
    });
};


// ...
export const readClientGroupList = (param) => dispatch => {

    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: GET_LIST_PENDING});
    return requestPostAPI('readClientGroupListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_LIST_FAILURE,
            payload: error
        });
    });
};

export const readClientGroupListAll = (param) => dispatch => {

    dispatch({type: GET_LISTALL_PENDING});
    return requestPostAPI('readClientGroupList', {}).then(
        (response) => {
            dispatch({
                type: GET_LISTALL_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_LISTALL_FAILURE,
            payload: error
        });
    });
};

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        payload: param
    });
};


// create (add)
export const createClientGroupData = (param) => dispatch => {
    dispatch({type: CREATE_CLIENTGROUP_PENDING});
    return requestPostAPI('createClientGroup', {
        groupName: param.grpNm,
        groupComment: param.comment,
        clientConfigId: param.clientConfigId,
        isDefault: param.isDefault
    }).then(
        (response) => {
            if(response.data.status.result && response.data.status.result === 'success') {
                dispatch({
                    type: CREATE_CLIENTGROUP_SUCCESS,
                    payload: response
                });
            } else {
                dispatch({
                    type: CREATE_CLIENTGROUP_FAILURE,
                    payload: response
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: CREATE_CLIENTGROUP_FAILURE,
            payload: error
        });
    });
};

// edit
export const editClientGroupData = (param) => dispatch => {
    dispatch({type: EDIT_CLIENTGROUP_PENDING});
    return requestPostAPI('updateClientGroup', {
        groupId: param.grpId,
        groupName: param.grpNm,
        groupComment: param.comment,
        desktopConfigId: param.desktopConfigId,
        clientConfigId: param.clientConfigId,
        hostNameConfigId: param.hostNameConfigId,
        updateServerConfigId: param.updateServerConfigId
    }).then(
        (response) => {
            dispatch({
                type: EDIT_CLIENTGROUP_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: EDIT_CLIENTGROUP_FAILURE,
            payload: error
        });
    });
};

// delete
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: DELETE_CLIENTGROUP_PENDING});
    return requestPostAPI('deleteClientGroup', param).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTGROUP_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: DELETE_CLIENTGROUP_FAILURE,
            payload: error
        });
    });
};

export const setSelectedItem = (param) => dispatch => {
    return dispatch({
        type: SET_CLIENTGROUP_SELECTED,
        payload: param
    });
};

export const changeParamValue = (param) => dispatch => {
    return dispatch({
        type: CHG_CLIENTGROUP_PARAM,
        payload: param
    });
};

export const changeSelectValue = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: param
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: param
    });
};


export const setInitialize = (param) => dispatch => {
    //console.log('setInitialize...');
    return dispatch({
        type: SET_INITIAL_STORE,
        payload: param
    });
};



export default handleActions({

    [GET_LIST_PENDING]: (state, action) => {
        return { ...state, pending: true, error: false };
    },
    [GET_LIST_SUCCESS]: (state, action) => {
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
    [GET_LIST_FAILURE]: (state, action) => {
        return { ...state, pending: false, error: true };
    },

    [GET_LISTALL_PENDING]: (state, action) => {
        return { ...state, pending: true, error: false };
    },
    [GET_LISTALL_SUCCESS]: (state, action) => {
        return { ...state, pending: false, error: false, listDataForSelect: action.payload.data.data };
    },
    [GET_LISTALL_FAILURE]: (state, action) => {
        return { ...state, pending: false, error: true };
    },

    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {
        return {
            ...state,
            viewItem: action.payload.viewItem,
            informOpen: true
        };
    },
    [SHOW_CLIENTGROUP_DIALOG]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            dialogOpen: action.payload.dialogOpen,
            dialogType: action.payload.dialogType,
        };
    },
    [CLOSE_CLIENTGROUP_DIALOG]: (state, action) => {
        return {
            ...state,
            dialogOpen: action.payload.dialogOpen
        }
    },

    [CREATE_CLIENTGROUP_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [CREATE_CLIENTGROUP_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [EDIT_CLIENTGROUP_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_CLIENTGROUP_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [DELETE_CLIENTGROUP_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [DELETE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''   
        };
    },
    [DELETE_CLIENTGROUP_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [CHG_CLIENTGROUP_PARAM]: (state, action) => {
        const newSelectedItem = getMergedListParam(state.selectedItem, {[action.payload.name]: action.payload.value});
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

    [SET_CLIENTGROUP_SELECTED]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem
        }
    },

    [SET_INITIAL_STORE]: (state, action) => {
        let newInitialState = initialState;
        newInitialState.listParam = state.initParam;
        return initialState
    }


}, initialState);



