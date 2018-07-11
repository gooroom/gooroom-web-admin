
import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';


const GET_LIST_SUCCESS = 'groupComp/GET_LIST_SUCCESS';
const GET_LISTALL_SUCCESS = 'groupComp/GET_LISTALL_SUCCESS';
const CREATE_CLIENTGROUP_SUCCESS = 'groupComp/CREATE_CLIENTGROUP_SUCCESS';
const EDIT_CLIENTGROUP_SUCCESS = 'groupComp/EDIT_CLIENTGROUP_SUCCESS';
const DELETE_CLIENTGROUP_SUCCESS = 'groupComp/DELETE_CLIENTGROUP_SUCCESS';

const SHOW_CLIENTGROUP_INFORM = 'groupComp/SHOW_CLIENTGROUP_INFORM';
const SHOW_CLIENTGROUP_DIALOG = 'groupComp/SHOW_CLIENTGROUP_DIALOG';

const SET_SELECTED_OBJ = 'groupComp/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'groupComp/SET_EDITING_ITEM_VALUE';

const CHG_STORE_DATA = 'groupComp/CHG_STORE_DATA';
const SET_INITIAL_STORE = 'groupComp/SET_INITIAL_STORE';

const COMMON_PENDING = 'groupComp/COMMON_PENDING';
const COMMON_FAILURE = 'groupComp/COMMON_FAILURE';


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

    selectedItem: {
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

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"dialogOpen",value:false}
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
    const compId = param.compId;

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientGroupListPaged', resetParam).then(
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

export const readClientGroupListAll = (param) => dispatch => {

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientGroupList', {}).then(
        (response) => {
            dispatch({
                type: GET_LISTALL_SUCCESS,
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

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        payload: param
    });
};

export const closeClientGroupInform = (param) => dispatch => {
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
                    type: CREATE_CLIENTGROUP_SUCCESS,
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
                type: EDIT_CLIENTGROUP_SUCCESS,
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
                type: DELETE_CLIENTGROUP_SUCCESS,
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


export const setInitialize = (param) => dispatch => {

    return dispatch({
        type: SET_INITIAL_STORE,
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
            resultMsg: action.payload
        };
    },

    [GET_LIST_SUCCESS]: (state, action) => {
        
        const { data, recordsFiltered, recordsTotal, draw, rowLength } = action.payload.data;

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
                    orderColumn: 'chGrpNm',
                    page: 0,
                    rowsPerPage: 10,
                    rowsPerPageOptions: [2, 5, 10, 25],
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

    [GET_LISTALL_SUCCESS]: (state, action) => {
        return { ...state, pending: false, error: false };
    },

    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            informOpen: true
        };
    },
    [SHOW_CLIENTGROUP_DIALOG]: (state, action) => {
        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedItem),
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },

    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },

    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
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

    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        const newEditingItem = getMergedListParam(state.editingItem, {[action.payload.name]: action.payload.value});
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

    [SET_SELECTED_OBJ]: (state, action) => {
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

