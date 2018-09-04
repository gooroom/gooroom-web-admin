import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

const COMMON_PENDING = 'groupComp/COMMON_PENDING';
const COMMON_FAILURE = 'groupComp/COMMON_FAILURE';

const GET_LIST_SUCCESS = 'groupComp/GET_LIST_SUCCESS';
const CREATE_CLIENTGROUP_SUCCESS = 'groupComp/CREATE_CLIENTGROUP_SUCCESS';
const EDIT_CLIENTGROUP_SUCCESS = 'groupComp/EDIT_CLIENTGROUP_SUCCESS';
const DELETE_CLIENTGROUP_SUCCESS = 'groupComp/DELETE_CLIENTGROUP_SUCCESS';

const SHOW_CLIENTGROUP_INFORM = 'groupComp/SHOW_CLIENTGROUP_INFORM';
const SHOW_CLIENTGROUP_DIALOG = 'groupComp/SHOW_CLIENTGROUP_DIALOG';

const SET_SELECTED_OBJ = 'groupComp/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'groupComp/SET_EDITING_ITEM_VALUE';

const CHG_STORE_DATA = 'groupComp/CHG_STORE_DATA';

// ...
const initialState = Map({
    pending: false,
    error: false,
    resultMsg: '',

    defaultListParam: Map({
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'chGrpNm',
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: List([5, 10, 25]),
        rowsTotal: 0,
        rowsFiltered: 0
    }),

    informOpen: false,
    dialogOpen: false,
    dialogType: ''
});

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

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        payload: param
    });
};

export const closeClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"informOpen", value:false}
    });
};

export const readClientGroupList = (param) => dispatch => {
    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientGroupListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_LIST_SUCCESS,
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

export const setSelectedItemObj = (param) => dispatch => {
    const compId = param.compId;
    return dispatch({
        type: SET_SELECTED_OBJ,
        compId: compId,
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
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CLIENTGROUP_SUCCESS,
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


export default handleActions({

    [COMMON_PENDING]: (state, action) => {
        return state.merge({
            pending: true, 
            error: false
        });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({
            pending: false, 
            error: true,
            resultMsg: (action.payload.data && action.payload.data.status) ? action.payload.data.status.message : ''
        });
    },

    [GET_LIST_SUCCESS]: (state, action) => {

        const COMP_ID = (action.compId) ? action.compId : '';
        const { data, recordsFiltered, recordsTotal, draw, rowLength } = action.payload.data;

        let oldViewItems = List([0]);
        if(state.get('viewItems')) {
            oldViewItems = state.get('viewItems');
            let viewItem = oldViewItems.find((element) => {
                return element.get('_COMPID_') == COMP_ID;
            });

            if(viewItem) {
                viewItem = viewItem.merge({
                    'listData': List(data),
                    'listParam': viewItem.get('listParam').merge({
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10)
                    })
                });
            } else {
                // 현재 콤프아이디로 데이타 없음. -> 추가 함
                oldViewItems = oldViewItems.push(Map({
                    '_COMPID_': COMP_ID,
                    'listData': List(data),
                    'listParam': state.get('defaultListParam').merge({
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10)
                    })
                }));
            }
        } else {
            oldViewItems = oldViewItems.set(0, Map({
                '_COMPID_': COMP_ID,
                'listData': List(data),
                'listParam': state.get('defaultListParam').merge({
                    rowsFiltered: parseInt(recordsFiltered, 10),
                    rowsTotal: parseInt(recordsTotal, 10),
                    page: parseInt(draw, 10),
                    rowsPerPage: parseInt(rowLength, 10)
                })
            }));
        }

        return state.merge({
            pending: false, 
            error: false,
            viewItems: oldViewItems
        });
    },
    [SHOW_CLIENTGROUP_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.payload.selectedItem,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        });
    },
    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {

        const COMP_ID = action.payload.compId;
        let oldViewItems = [];
        if(state.get('viewItems')) {
            const newViewItems = state.get('viewItems').map((element) => {
                if(element.get('_COMPID_') == COMP_ID) {
                    return element.set('selectedItem', Map(action.payload.selectedItem));
                } else {
                    return element;
                }
            });
            return state.merge({
                viewItems: newViewItems,
                informOpen: true
            });
        }
        return state;

        // return {
        //     ...state,
        //     viewItems: oldViewItems,
        //     informOpen: true,
        // };

    },
    [SET_SELECTED_OBJ]: (state, action) => {

        const COMP_ID = action.payload.compId;
        let viewItems = [];
        if(state.viewItems) {
            viewItems = state.viewItems;
            const viewItem = viewItems.find((element) => {
                return element._COMPID_ == COMP_ID;
            });
            if(viewItem) {
                Object.assign(viewItem, {
                    'selectedItem': action.payload.selectedItem,
                    'checkItems': action.payload.selectedItem
                });
            } else {
                viewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                    'selectedItem': action.payload.selectedItem,
                    'checkItems': action.payload.selectedItem
                }));
            }
        } else {
            viewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, {
                'selectedItem': action.payload.selectedItem,
                'checkItems': action.payload.selectedItem
            }));
        }

        return {
            ...state,
            viewItems: viewItems,
            informOpen: true
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
        return state.merge({
            [action.payload.name]: action.payload.value
        });
    },
    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        });
    },
    [DELETE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        });
    },

}, initialState);

