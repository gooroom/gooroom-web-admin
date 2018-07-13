
import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedObject } from '../components/GrUtils/GrCommonUtils';

const COMMON_PENDING = 'clientManageComp/COMMON_PENDING';
const COMMON_FAILURE = 'clientManageComp/COMMON_FAILURE';

const GET_LIST_SUCCESS = 'clientManageComp/GET_LIST_SUCCESS';
const CREATE_CLIENT_SUCCESS = 'clientManageComp/CREATE_CLIENT_SUCCESS';
const EDIT_CLIENT_SUCCESS = 'clientManageComp/EDIT_CLIENT_SUCCESS';
const DELETE_CLIENT_SUCCESS = 'clientManageComp/DELETE_CLIENT_SUCCESS';

const SHOW_CLIENT_INFORM = 'clientManageComp/SHOW_CLIENT_INFORM';
const SHOW_CLIENT_DIALOG = 'clientManageComp/SHOW_CLIENT_DIALOG';

const CHG_STORE_DATA = 'clientManageComp/CHG_STORE_DATA';
const GET_CLIENT_INFORM = 'clientManage/GET_CLIENT_INFORM';

const SET_SELECTED_OBJ = 'clientManageComp/SET_SELECTED_OBJ';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        clientType: 'ALL',
        groupId: '',
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'clientName',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {
        clientId: '',
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
        type: SHOW_CLIENT_DIALOG,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"dialogOpen",value:false}
    });
};


// ...
export const readClientList = (param) => dispatch => {

    const resetParam = {
        clientType: param.clientType,
        groupId: param.groupId,
        searchKey: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };
    const compId = param.compId;

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_LIST_SUCCESS,
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

export const getClientInform = (param) => dispatch => {

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientListPaged', param).then(
        (response) => {
            dispatch({
                type: GET_CLIENT_INFORM,
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

export const showClientManageInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENT_INFORM,
        payload: param
    });
};

export const closeClientManageInform = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"informOpen",value:false}
    });
};

// create (add)
export const createClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientGroup', {
        groupName: param.grpNm,
        groupComment: param.comment,
        clientConfigId: param.clientConfigId,
        isDefault: param.isDefault
    }).then(
        (response) => {
            if(response.data.status.result && response.data.status.result === 'success') {
                dispatch({
                    type: CREATE_CLIENT_SUCCESS,
                    payload: response
                });
            } else {
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
export const editClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
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
                type: EDIT_CLIENT_SUCCESS,
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
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientGroup', param).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENT_SUCCESS,
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
    const compId = param.compId;
    return dispatch({
        type: SET_SELECTED_OBJ,
        compId: compId,
        payload: param
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: param
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

    [GET_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;

        let listName = 'listData';
        let listParamName = 'listParam';
        let selectedName = 'listParam';
        let newListParam = {};

        if(action.compId && action.compId != '') {
            listName = action.compId + '__listData';
            listParamName = action.compId + '__listParam';
            selectedName = action.compId + '__selected';
            if(draw > 0) {
                newListParam = state[action.compId + '__listParam'];
            } else {
                newListParam = {
                    keyword: '',
                    orderDir: 'desc',
                    orderColumn: 'clientName',
                    page: 0,
                    rowsPerPage: 10,
                    rowsPerPageOptions: [5, 10, 25],
                    rowsTotal: 0,
                    rowsFiltered: 0
                };
            }            
        } else {
            newListParam = state.listParam;
        }

        Object.assign(newListParam, {
            rowsFiltered: parseInt(recordsFiltered, 10),
            rowsTotal: parseInt(recordsTotal, 10),
            page: parseInt(draw, 10),
            rowsPerPage: parseInt(rowLength, 10),
        });

        return {
            ...state,
            pending: false,
            error: false,
            [listName]: data,
            [listParamName]: newListParam,
            [selectedName]: (state[selectedName]) ? state[selectedName] : []
        };
    },

    [SHOW_CLIENT_INFORM]: (state, action) => {
        return {
            ...state,
            viewItem: action.payload.viewItem,
            informOpen: true
        };
    },
    [SHOW_CLIENT_DIALOG]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            dialogOpen: action.payload.dialogOpen,
            dialogType: action.payload.dialogType,
        };
    },

    [CREATE_CLIENT_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },

    [EDIT_CLIENT_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },

    [DELETE_CLIENT_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''   
        };
    },

    [SET_SELECTED_OBJ]: (state, action) => {

        let selectedItem = 'selectedItem';
        if(action.compId && action.compId != '') {
            selectedItem = action.compId + '__selectedItem';
        }

        return {
            ...state,
            [selectedItem]: action.payload.selectedItem
        }
    },

    [CHG_STORE_DATA]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    },

}, initialState);



