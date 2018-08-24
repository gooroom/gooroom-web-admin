import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

const COMMON_PENDING = 'mediaControlSetting/COMMON_PENDING';
const COMMON_FAILURE = 'mediaControlSetting/COMMON_FAILURE';

const GET_BROWSERRULE_LIST_SUCCESS = 'mediaControlSetting/GET_LIST_SUCCESS';
const GET_BROWSERRULE_SUCCESS = 'mediaControlSetting/GET_BROWSERRULE_SUCCESS';
const CREATE_BROWSERRULE_SUCCESS = 'mediaControlSetting/CREATE_BROWSERRULE_SUCCESS';
const EDIT_BROWSERRULE_SUCCESS = 'mediaControlSetting/EDIT_BROWSERRULE_SUCCESS';
const DELETE_BROWSERRULE_SUCCESS = 'mediaControlSetting/DELETE_BROWSERRULE_SUCCESS';

const SHOW_BROWSERRULE_INFORM = 'mediaControlSetting/SHOW_BROWSERRULE_INFORM';
const SHOW_BROWSERRULE_DIALOG = 'mediaControlSetting/SHOW_BROWSERRULE_DIALOG';

const SET_EDITING_ITEM_VALUE = 'mediaControlSetting/SET_EDITING_ITEM_VALUE';

const CHG_VIEWITEM_DATA = 'mediaControlSetting/CHG_VIEWITEM_DATA';
const CHG_STORE_DATA = 'mediaControlSetting/CHG_STORE_DATA';

const SET_WHITELIST_ITEM = 'mediaControlSetting/SET_WHITELIST_ITEM';
const ADD_WHITELIST_ITEM = 'mediaControlSetting/ADD_WHITELIST_ITEM';
const DELETE_WHITELIST_ITEM = 'mediaControlSetting/DELETE_WHITELIST_ITEM';


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
        type: SHOW_BROWSERRULE_DIALOG,
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
        type: SHOW_BROWSERRULE_INFORM,
        payload: param
    });
};

export const closeInform = () => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"informOpen",value:false}
    });
};

export const readBrowserRuleSettingList = (param) => dispatch => {

    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRuleListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_LIST_SUCCESS,
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

export const getBrowserRuleSetting = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readBrowserRule', param).then(
        (response) => {
            dispatch({
                type: GET_BROWSERRULE_SUCCESS,
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

        webSocket: param.webSocket,
        webWorker: param.webWorker,
        trustSetupId: param.trustSetupId,
        untrustSetupId: param.untrustSetupId,
        trustUrlList: (param.trustUrlList && param.trustUrlList.length > 0) ? param.trustUrlList : ''
    };
}

// create (add)
export const createBrowserRuleSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createBrowserRuleConf', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_BROWSERRULE_SUCCESS,
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
export const editBrowserRuleSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateBrowserRuleConf', makeParameter(param)).then(
        (response) => {
            dispatch({
                type: EDIT_BROWSERRULE_SUCCESS,
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
export const deleteBrowserRuleSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteBrowserRuleConf', param).then(
        (response) => {
            dispatch({
                type: DELETE_BROWSERRULE_SUCCESS,
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

export const addWhiteList = () => dispatch => {
    return dispatch({
        type: ADD_WHITELIST_ITEM
    });
}

export const deleteWhiteList = (index) => dispatch => {
    return dispatch({
        type: DELETE_WHITELIST_ITEM,
        payload: {index:index}
    });
}

export const setWhiteList = (param) => dispatch => {
    return dispatch({
        type: SET_WHITELIST_ITEM,
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

    [GET_BROWSERRULE_LIST_SUCCESS]: (state, action) => {

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
    [GET_BROWSERRULE_SUCCESS]: (state, action) => {
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
    [SHOW_BROWSERRULE_DIALOG]: (state, action) => {
        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedItem),
            editingCompId: action.payload.compId,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_BROWSERRULE_INFORM]: (state, action) => {

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
    [CREATE_BROWSERRULE_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_BROWSERRULE_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [DELETE_BROWSERRULE_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [SET_WHITELIST_ITEM]: (state, action) => {
        let newWhiteList = state.editingItem.trustUrlList;
        newWhiteList[action.payload.index] = action.payload.value;
        const newEditingItem = getMergedObject(state.editingItem, {'trustUrlList': newWhiteList});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [ADD_WHITELIST_ITEM]: (state, action) => {
        let newWhiteList = (state.editingItem.trustUrlList) ? state.editingItem.trustUrlList : [];
        newWhiteList.push('');
        const newEditingItem = getMergedObject(state.editingItem, {'trustUrlList': newWhiteList});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [DELETE_WHITELIST_ITEM]: (state, action) => {
        let newWhiteList = state.editingItem.trustUrlList;
        newWhiteList.splice(action.payload.index, 1);
        let newEditingItem = getMergedObject(state.editingItem, {'trustUrlList': newWhiteList});
        // changed selected ntp addres index
        if(state.editingItem.selectedNtpIndex == action.payload.index) {
            newEditingItem = getMergedObject(newEditingItem, {'selectedNtpIndex': -1});
        } else if(state.editingItem.selectedNtpIndex > action.payload.index) {
            newEditingItem = getMergedObject(newEditingItem, {'selectedNtpIndex': (state.editingItem.selectedNtpIndex - 1)});
        }
        return {
            ...state,
            editingItem: newEditingItem
        }
    },

}, initialState);

