import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

const COMMON_PENDING = 'clientHostName/COMMON_PENDING';
const COMMON_FAILURE = 'clientHostName/COMMON_FAILURE';

const GET_HOSTNAME_LIST_SUCCESS = 'clientHostName/GET_LIST_SUCCESS';
const GET_HOSTNAME_SUCCESS = 'clientHostName/GET_HOSTNAME_SUCCESS';
const CREATE_HOSTNAME_SUCCESS = 'clientHostName/CREATE_HOSTNAME_SUCCESS';
const EDIT_HOSTNAME_SUCCESS = 'clientHostName/EDIT_HOSTNAME_SUCCESS';
const DELETE_HOSTNAME_SUCCESS = 'clientHostName/DELETE_HOSTNAME_SUCCESS';

const SHOW_HOSTNAME_INFORM = 'clientHostName/SHOW_HOSTNAME_INFORM';
const SHOW_HOSTNAME_DIALOG = 'clientHostName/SHOW_HOSTNAME_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientHostName/SET_EDITING_ITEM_VALUE';

const CHG_VIEWITEM_DATA = 'clientHostName/CHG_VIEWITEM_DATA';
const CHG_STORE_DATA = 'clientHostName/CHG_STORE_DATA';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    defaultListParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chConfId',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
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
                compId: param.compId,
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

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readHostNameConf', param).then(
        (response) => {
            dispatch({
                type: GET_HOSTNAME_SUCCESS,
                compId: param.compId,
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

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        payload: param
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_VIEWITEM_DATA,
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

        let COMP_ID = '';
        if(action.compId && action.compId != '') {
            COMP_ID = action.compId;
        }

        const { data, recordsFiltered, recordsTotal, draw, rowLength } = action.payload.data;

        let oldViewItems = [];
        if(state.viewItems) {

            oldViewItems = state.viewItems;
            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });

            if(viewItem) {

                Object.assign(viewItem, {
                    'listData': data,
                    'listParam': Object.assign({}, viewItem.listParam, {
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10)
                    })
                });

            } else {

                // 현재 콤프아이디로 데이타 없음. -> 추가 함
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                    'listData': data,
                    'listParam': {
                        keyword: '',
                        orderDir: 'desc',
                        orderColumn: 'chConfId',
                        rowsPerPageOptions: [5, 10, 25],
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10)
                    }
                }));

            }
        } else {

            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                'listData': data,
                'listParam': Object.assign({}, state.defaultListParam, {
                    rowsFiltered: parseInt(recordsFiltered, 10),
                    rowsTotal: parseInt(recordsTotal, 10),
                    page: parseInt(draw, 10),
                    rowsPerPage: parseInt(rowLength, 10)
                })
            }));

        }

        return {
            ...state,
            pending: false,
            error: false,
            viewItems: oldViewItems
        };
    },  
    [GET_HOSTNAME_SUCCESS]: (state, action) => {
        let COMP_ID = '';
        if(action.compId && action.compId != '') {
            COMP_ID = action.compId;
        }
        const { data } = action.payload.data;
        let oldViewItems = [];
        if(state.viewItems) {
            oldViewItems = state.viewItems;

            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });

            // 이전에 해당 콤프정보가 없으면 신규로 등록
            if(!viewItem) {
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedItem': data[0]}));
            }

            // 같은 오브젝트를 가지고 있는 콤프정보들을 모두 변경 한다.
            oldViewItems = oldViewItems.map((element) => {
                if(element.selectedItem && (element.selectedItem.objId == data[0].objId)) {
                    return Object.assign(element, {'selectedItem': data[0]});
                } else {
                    return element;
                }
            });

        } else {
            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {'selectedItem': data[0]}));
        }

        if(data && data.length > 0) {
            return {
                ...state,
                pending: false,
                error: false,
                viewItems: oldViewItems
            };
        } else {
            return {
                ...state,
                pending: false,
                error: false,
                viewItems: oldViewItems
            };
        }
    },
    [SHOW_HOSTNAME_DIALOG]: (state, action) => {

        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedItem),
            editingCompId: action.payload.compId,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_HOSTNAME_INFORM]: (state, action) => {

        const COMP_ID = action.payload.compId;

        let oldViewItems = [];
        if(state.viewItems) {
            oldViewItems = state.viewItems;
            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });
            if(viewItem) {
                Object.assign(viewItem, {
                    'selectedItem': action.payload.selectedItem
                });
            } else {
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                    'selectedItem': action.payload.selectedItem
                }));
            }
        } else {
            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                'selectedItem': action.payload.selectedItem
            }));
        }

        return {
            ...state,
            viewItems: oldViewItems,
            informOpen: true,
        };
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
    [CHG_VIEWITEM_DATA]: (state, action) => {

        const COMP_ID = action.payload.compId;

        let oldViewItems = [];
        if(state.viewItems) {
            oldViewItems = state.viewItems;
            const viewItem = oldViewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });
            
            if(viewItem) {
                Object.assign(viewItem, {
                    [action.payload.name]: action.payload.value
                });
            } else {
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                    [action.payload.name]: action.payload.value
                }));
            }

        } else {
            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                [action.payload.name]: action.payload.value
            }));
        }

        return {
            ...state,
            viewItems: oldViewItems
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

