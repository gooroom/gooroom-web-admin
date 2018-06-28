
import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';

const GET_LIST_PENDING = 'clientManage/GET_LIST_PENDING';
const GET_LIST_SUCCESS = 'clientManage/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'clientManage/GET_LIST_FAILURE';

const CREATE_CLIENT_PENDING = 'clientManage/CREATE_CLIENT_PENDING';
const CREATE_CLIENT_SUCCESS = 'clientManage/CREATE_CLIENT_SUCCESS';
const CREATE_CLIENT_FAILURE = 'clientManage/CREATE_CLIENT_FAILURE';

const EDIT_CLIENT_PENDING = 'clientManage/EDIT_CLIENT_PENDING';
const EDIT_CLIENT_SUCCESS = 'clientManage/EDIT_CLIENT_SUCCESS';
const EDIT_CLIENT_FAILURE = 'clientManage/EDIT_CLIENT_FAILURE';

const DELETE_CLIENT_PENDING = 'clientManage/DELETE_CLIENT_PENDING';
const DELETE_CLIENT_SUCCESS = 'clientManage/DELETE_CLIENT_SUCCESS';
const DELETE_CLIENT_FAILURE = 'clientManage/DELETE_CLIENT_FAILURE';

const SHOW_CLIENT_INFORM = 'clientManage/SHOW_CLIENT_INFORM';
const SHOW_CLIENT_DIALOG = 'clientManage/SHOW_CLIENT_DIALOG';
const CLOSE_CLIENT_DIALOG = 'clientManage/CLOSE_CLIENT_DIALOG';
const CHG_CLIENT_PARAM = 'clientManage/CHG_CLIENT_PARAM';

const SET_CLIENT_SELECTED = 'clientManage/SET_CLIENT_SELECTED';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

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

    // viewItem: {
    //     grpId: '',
    //     grpNm: '',
    //     comment: '',
    //     clientConfigId: '',
    //     isDefault: ''
    // },

    informOpen: false,
    dialogOpen: false,
    dialogType: '',

    selected: [],
};

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENT_DIALOG,
        payload: param
    });
};

export const closeDialog = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENT_DIALOG,
        payload: param
    });
};


// ...
export const readClientList = (param) => dispatch => {

    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: GET_LIST_PENDING});
    return requestPostAPI('readClientListPaged', resetParam).then(
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

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENT_INFORM,
        payload: param
    });
};


// create (add)
export const createClientGroupData = (param) => dispatch => {
    dispatch({type: CREATE_CLIENT_PENDING});
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
                    type: CREATE_CLIENT_FAILURE,
                    payload: response
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: CREATE_CLIENT_FAILURE,
            payload: error
        });
    });
};

// edit
export const editClientGroupData = (param) => dispatch => {
    dispatch({type: EDIT_CLIENT_PENDING});
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
            type: EDIT_CLIENT_FAILURE,
            payload: error
        });
    });
};

// delete
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: DELETE_CLIENT_PENDING});
    return requestPostAPI('deleteClientGroup', param).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENT_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: DELETE_CLIENT_FAILURE,
            payload: error
        });
    });
};

export const setSelectedItem = (param) => dispatch => {
    return dispatch({
        type: SET_CLIENT_SELECTED,
        payload: param
    });
};

export const changeParamValue = (param) => dispatch => {
    return dispatch({
        type: CHG_CLIENT_PARAM,
        payload: param
    });
};

export default handleActions({

    [GET_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_LIST_SUCCESS]: (state, action) => {
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
    [GET_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
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
    [CLOSE_CLIENT_DIALOG]: (state, action) => {
        return {
            ...state,
            dialogOpen: action.payload.dialogOpen
        }
    },

    [CREATE_CLIENT_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [CREATE_CLIENT_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [CREATE_CLIENT_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [EDIT_CLIENT_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [EDIT_CLIENT_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_CLIENT_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [DELETE_CLIENT_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
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
    [DELETE_CLIENT_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true,
            resultMsg: action.payload.data.status.message
        };
    },

    [CHG_CLIENT_PARAM]: (state, action) => {
        const newSelectedItem = getMergedListParam(state.selectedItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            selectedItem: newSelectedItem
        }
    },
    
    [SET_CLIENT_SELECTED]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem
        }
    }


}, initialState);



