import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

const COMMON_PENDING = 'clientConfSetting/COMMON_PENDING';
const COMMON_FAILURE = 'clientConfSetting/COMMON_FAILURE';

const GET_CONFSETTING_LIST_SUCCESS = 'clientConfSetting/GET_LIST_SUCCESS';
const GET_CONFSETTING_SUCCESS = 'clientConfSetting/GET_CONFSETTING_SUCCESS';
const CREATE_CONFSETTING_SUCCESS = 'clientConfSetting/CREATE_CONFSETTING_SUCCESS';
const EDIT_CONFSETTING_SUCCESS = 'clientConfSetting/EDIT_CONFSETTING_SUCCESS';
const DELETE_CONFSETTING_SUCCESS = 'clientConfSetting/DELETE_CONFSETTING_SUCCESS';

const SHOW_CONFSETTING_INFORM = 'clientConfSetting/SHOW_CONFSETTING_INFORM';
const SHOW_CONFSETTING_DIALOG = 'clientConfSetting/SHOW_CONFSETTING_DIALOG';

const SET_SELECTED_OBJ = 'clientConfSetting/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'clientConfSetting/SET_EDITING_ITEM_VALUE';

const CHG_STORE_DATA = 'clientConfSetting/CHG_STORE_DATA';

const SET_SELECTED_NTP_VALUE = 'clientConfSetting/SET_SELECTED_NTP_VALUE';
const ADD_NTPADDRESS_ITEM = 'clientConfSetting/ADD_NTPADDRESS_ITEM';
const DELETE_NTPADDRESS_ITEM = 'clientConfSetting/DELETE_NTPADDRESS_ITEM';


// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    defaultOrderDir: 'desc',
    defaultOrderColumn: 'chConfId',
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

export const readClientConfSettingList = (param) => dispatch => {

    console.log('readClientConfSettingList param : ', param);

    const resetParam = {
        keyword: param.keyword,
        page: param.page,
        start: param.page * param.rowsPerPage,
        length: param.rowsPerPage,
        orderColumn: param.orderColumn,
        orderDir: param.orderDir
    };

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfListPaged', resetParam).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_LIST_SUCCESS,
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

export const getClientConfSetting = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConf', param).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_SUCCESS,
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
        compId: param.compId,
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
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientConf', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CONFSETTING_SUCCESS,
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
export const editClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientConf', makeParameter(param)).then(
        (response) => {
            dispatch({
                type: EDIT_CONFSETTING_SUCCESS,
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
export const deleteClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientConf', param).then(
        (response) => {
            dispatch({
                type: DELETE_CONFSETTING_SUCCESS,
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

export const setSelectedNtpValue = (param) => dispatch => {
    return dispatch({
        type: SET_SELECTED_NTP_VALUE,
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

    [GET_CONFSETTING_LIST_SUCCESS]: (state, action) => {

        let COMP_ID = '';
        if(action.compId && action.compId != '') {
            COMP_ID = action.compId;
        }

        const { data, recordsFiltered, recordsTotal, draw, rowLength } = action.payload.data;
        
        let oldViewItems = [];
        let newListParam = {};

        if(state.viewItems) {

            oldViewItems = state.viewItems;
            // 같은 콤프가 있는지 검사를 위한 사전 검사
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
                        orderColumn: 'chGrpNm',
                        rowsPerPageOptions: [5, 10, 25],
                        rowsFiltered: parseInt(recordsFiltered, 10),
                        rowsTotal: parseInt(recordsTotal, 10),
                        page: parseInt(draw, 10),
                        rowsPerPage: parseInt(rowLength, 10)
                    }
                }));

            }


            // if(draw > 0) {
            //     newListParam = state[action.compId + '__listParam'];
            // } else {
            //     newListParam = {
            //         keyword: '',
            //         orderDir: 'desc',
            //         orderColumn: 'chGrpNm',
            //         page: 0,
            //         rowsPerPage: 10,
            //         rowsPerPageOptions: [5, 10, 25],
            //         rowsTotal: 0,
            //         rowsFiltered: 0
            //     };
            // }            

            // oldViewItems = oldViewItems.map((element) => {
            //     if(element.objId == data[0].objId) {
            //         return Object.assign({}, {'_COMPID_': element._COMPID_}, data[0]);
            //     } else {
            //         return element;
            //     }
            // });

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
        

        // const { data, recordsFiltered, recordsTotal, draw, rowLength } = action.payload.data;
        
        // let listName = 'listData';
        // let listParamName = 'listParam';
        // let selectedName = 'listParam';
        // let newListParam = {};

        // if(action.compId && action.compId != '') {
        //     listName = action.compId + '__listData';
        //     listParamName = action.compId + '__listParam';
        //     selectedName = action.compId + '__selected';
        //     if(draw > 0) {
        //         newListParam = state[action.compId + '__listParam'];
        //     } else {
        //         newListParam = {
        //             keyword: '',
        //             orderDir: 'desc',
        //             orderColumn: 'chGrpNm',
        //             page: 0,
        //             rowsPerPage: 10,
        //             rowsPerPageOptions: [5, 10, 25],
        //             rowsTotal: 0,
        //             rowsFiltered: 0
        //         };
        //     }            
        // } else {
        //     newListParam = state.listParam;
        // }

        // Object.assign(newListParam, {
        //     rowsFiltered: parseInt(recordsFiltered, 10),
        //     rowsTotal: parseInt(recordsTotal, 10),
        //     page: parseInt(draw, 10),
        //     rowsPerPage: parseInt(rowLength, 10),
        // });

        // console.log('listName : ', listName);
        // console.log('listParamName : ', listParamName);
        // console.log('selectedName : ', selectedName);

        return {
            ...state,
            pending: false,
            error: false,
            viewItems: oldViewItems
        };

        // [listName]: data,
        // [listParamName]: newListParam,
        // [selectedName]: (state[selectedName]) ? state[selectedName] : []

    }, 
    [GET_CONFSETTING_SUCCESS]: (state, action) => {
        let COMP_ID = '';
        if(action.compId && action.compId != '') {
            COMP_ID = action.compId;
        }
        const { data } = action.payload.data;
        let oldViewItems = [];
        if(state.viewItems) {
            oldViewItems = state.viewItems;
            // 같은 콤프가 있는지 검사를 위한 사전 검사
            const hasEqualsCompId = oldViewItems.filter((element) => {
                return element._COMPID_ == COMP_ID;
            });

            if(!(hasEqualsCompId && hasEqualsCompId.length > 0)) {
                // 새로 등록
                oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, data[0]));
            }

            oldViewItems = oldViewItems.map((element) => {
                if(element.objId == data[0].objId) {
                    return Object.assign({}, {'_COMPID_': element._COMPID_}, data[0]);
                } else {
                    return element;
                }
            });

        } else {
            oldViewItems.push(Object.assign({}, {'_COMPID_': COMP_ID}, data[0]));
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
    [SHOW_CONFSETTING_DIALOG]: (state, action) => {
        return {
            ...state,
            editingItem: Object.assign({}, action.payload.selectedItem),
            editingCompId: action.payload.compId,
            dialogOpen: true,
            dialogType: action.payload.dialogType,
        };
    },
    [SHOW_CONFSETTING_INFORM]: (state, action) => {
        return {
            ...state,
            selectedItem: action.payload.selectedItem,
            informOpen: true
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
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        const newEditingItem = getMergedObject(state.editingItem, {[action.payload.name]: action.payload.value});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [CHG_STORE_DATA]: (state, action) => {

        let COMP_ID = '';
        if(action.compId && action.compId != '') {
            COMP_ID = action.compId;
        }

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
    [CREATE_CONFSETTING_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
        };
    },
    [EDIT_CONFSETTING_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [DELETE_CONFSETTING_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: false,
            informOpen: false,
            dialogOpen: false,
            dialogType: ''
        };
    },
    [SET_SELECTED_NTP_VALUE]: (state, action) => {
        let newNtpAddress = state.editingItem.ntpAddress;
        newNtpAddress[action.payload.index] = action.payload.value;
        const newEditingItem = getMergedObject(state.editingItem, {'ntpAddress': newNtpAddress});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [ADD_NTPADDRESS_ITEM]: (state, action) => {
        let newNtpAddress = state.editingItem.ntpAddress;
        newNtpAddress.push('');
        const newEditingItem = getMergedObject(state.editingItem, {'ntpAddress': newNtpAddress});
        return {
            ...state,
            editingItem: newEditingItem
        }
    },
    [DELETE_NTPADDRESS_ITEM]: (state, action) => {
        let newNtpAddress = state.editingItem.ntpAddress;
        newNtpAddress.splice(action.payload.index, 1);
        let newEditingItem = getMergedObject(state.editingItem, {'ntpAddress': newNtpAddress});
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

