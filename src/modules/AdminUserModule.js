import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import sha256 from 'sha-256-js';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'adminUser/COMMON_PENDING';
const COMMON_FAILURE = 'adminUser/COMMON_FAILURE';

const CHG_LISTPARAM_DATA = 'adminUser/CHG_LISTPARAM_DATA';
const SET_EDITING_ITEM_VALUE = 'adminUser/SET_EDITING_ITEM_VALUE';

const GET_ADMINUSER_LISTPAGED_SUCCESS = 'adminUser/GET_ADMINUSER_LISTPAGED_SUCCESS';

const CREATE_ADMINUSER_SUCCESS = 'adminUser/CREATE_ADMINUSER_SUCCESS';
const EDIT_ADMINUSER_SUCCESS = 'adminUser/EDIT_ADMINUSER_SUCCESS';
const DELETE_ADMINUSER_SUCCESS = 'adminUser/DELETE_ADMINUSER_SUCCESS';

const SHOW_ADMINUSER_INFORM = 'adminUser/SHOW_ADMINUSER_INFORM';
const CLOSE_ADMINUSER_INFORM = 'adminUser/CLOSE_ADMINUSER_INFORM';
const SHOW_ADMINUSER_DIALOG = 'adminUser/SHOW_ADMINUSER_DIALOG';
const CLOSE_ADMINUSER_DIALOG = 'adminUser/CLOSE_ADMINUSER_DIALOG';

const SHOW_ADMINCONN_DIALOG = 'adminUser/SHOW_ADMINCONN_DIALOG';
const CLOSE_ADMINCONN_DIALOG = 'adminUser/CLOSE_ADMINCONN_DIALOG';
const EDIT_ADMINCONN_SUCCESS = 'adminUser/EDIT_ADMINCONN_SUCCESS';
const GET_ADMINCONN_IPLIST_SUCCESS = 'adminUser/GET_ADMINCONN_IPLIST_SUCCESS';
const SET_ADMINCONN_IP_VALUE = 'adminUser/SET_ADMINCONN_IP_VALUE';
const ADD_ADMINCONN_IP_ITEM = 'adminUser/ADD_ADMINCONN_IP_ITEM';
const DELETE_ADMINCONN_IP_ITEM = 'adminUser/DELETE_ADMINCONN_IP_ITEM';

// ...
const initialState = commonHandleActions.getCommonInitialState('chAdminNm', 'asc', {}, {status: 'STAT010', keyword: ''});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_ADMINUSER_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_ADMINUSER_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_ADMINUSER_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('userId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_ADMINUSER_INFORM,
        compId: param.compId
    });
};

// ...
export const readAdminUserListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readAdminUserListPaged', {
        keyword: newListParam.get('keyword'),
        status: newListParam.get('status'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_ADMINUSER_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        name: param.name,
        value: param.value
    });
};

export const changeListParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_LISTPARAM_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
};

const makeParameter = (po) => {
    return {
        adminId: po.get('adminId'),
        adminPw: (po.get('adminPw') !== '') ? sha256(po.get('adminId') + sha256(po.get('adminPw'))) : '',
        adminNm: po.get('adminNm'),

        isClientAdmin: (po.get('isClientAdmin') !== undefined) ? po.get('isClientAdmin') : '0',
        clientAdd: (po.get('clientAdd') !== undefined) ? po.get('clientAdd') : '0',
        clientDelete: (po.get('clientDelete') !== undefined) ? po.get('clientDelete') : '0',
        clientMove: (po.get('clientMove') !== undefined) ? po.get('clientMove') : '0',
        clientRule: (po.get('clientRule') !== undefined) ? po.get('clientRule') : '0',

        isUserAdmin: (po.get('isUserAdmin') !== undefined) ? po.get('isUserAdmin') : '0',
        userAdd: (po.get('userAdd') !== undefined) ? po.get('userAdd') : '0',
        userDelete: (po.get('userDelete') !== undefined) ? po.get('userDelete') : '0',
        userMove: (po.get('userMove') !== undefined) ? po.get('userMove') : '0',
        userRule: (po.get('userRule') !== undefined) ? po.get('userRule') : '0',

        isRuleAdmin: (po.get('isRuleAdmin') !== undefined) ? po.get('isRuleAdmin') : '0',
        ruleEdit: (po.get('ruleEdit') !== undefined) ? po.get('ruleEdit') : '0',
        ruleUser: (po.get('ruleUser') !== undefined) ? po.get('ruleUser') : '0',
        ruleClient: (po.get('ruleClient') !== undefined) ? po.get('ruleClient') : '0',

        isDesktopAdmin: (po.get('isDesktopAdmin') !== undefined) ? po.get('isDesktopAdmin') : '0',
        desktopEdit: (po.get('desktopEdit') !== undefined) ? po.get('desktopEdit') : '0',
        desktopUser: (po.get('desktopUser') !== undefined) ? po.get('desktopUser') : '0',
        desktopClient: (po.get('desktopClient') !== undefined) ? po.get('desktopClient') : '0',

        isNoticeAdmin: (po.get('isNoticeAdmin') !== undefined) ? po.get('isNoticeAdmin') : '0',
        noticeEdit: (po.get('noticeEdit') !== undefined) ? po.get('noticeEdit') : '0',
        noticeUser: (po.get('noticeUser') !== undefined) ? po.get('noticeUser') : '0',
        noticeClient: (po.get('noticeClient') !== undefined) ? po.get('noticeClient') : '0',

        connIps: (po.get('connIps') !== undefined) ? po.get('connIps').toJS() : [],
        grpInfoList: (po.get('grpInfoList') !== undefined) ? po.get('grpInfoList').toJS() : [],
        deptInfoList: (po.get('deptInfoList') !== undefined) ? po.get('deptInfoList').toJS() : []
    };
}

// create (add)
export const createAdminUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});

    return requestPostAPI('createAdminUser', makeParameter(param.itemObj)).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_ADMINUSER_SUCCESS,
                        response: response
                    });
                }    
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// edit
export const editAdminUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateAdminUserData', makeParameter(param.itemObj)).then(
        (response) => {
                // change selected object
                requestPostAPI('readAdminUserData', {'adminId': param.itemObj.get('adminId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_ADMINUSER_SUCCESS,
                            adminId: param.itemObj.get('adminId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete
export const deleteAdminUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteAdminUserData', param).then(
        (response) => {
            dispatch({
                type: DELETE_ADMINUSER_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};



export const showConnDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_ADMINCONN_DIALOG
    });
};

export const closeConnDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_ADMINCONN_DIALOG
    });
};

export const addAdminConnIp = () => dispatch => {
    return dispatch({
        type: ADD_ADMINCONN_IP_ITEM
    });
}

export const deleteAdminConnIp = (index) => dispatch => {
    return dispatch({
        type: DELETE_ADMINCONN_IP_ITEM,
        index: index
    });
}

export const setAdminConnIpValue = (param) => dispatch => {
    return dispatch({
        type: SET_ADMINCONN_IP_VALUE,
        index: param.index,
        value: param.value
    });
};

// read allow ip
export const readGpmsAvailableNetwork = () => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readGpmsAvailableNetwork').then(
        (response) => {
            dispatch({
                type: GET_ADMINCONN_IPLIST_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// save allow ip.
export const updateAdminAddress = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateAdminAddress', param).then(
        (response) => {
            dispatch({
                type: EDIT_ADMINCONN_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};


export default handleActions({

    [COMMON_PENDING]: (state, action) => {
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },

    [GET_ADMINUSER_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },  
    [SHOW_ADMINUSER_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_ADMINUSER_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_ADMINUSER_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_ADMINUSER_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CREATE_ADMINUSER_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [EDIT_ADMINUSER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
        // console.log('newState :::: ', newState);
        // return commonHandleActions.handleCloseInformAction(newState, action);
    },
    [DELETE_ADMINUSER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'userId');
    },

    [SHOW_ADMINCONN_DIALOG]: (state, action) => {
        return state.merge({connDialogOpen: true});
    },
    [CLOSE_ADMINCONN_DIALOG]: (state, action) => {
        return state.merge({connDialogOpen: false});
    },
    [GET_ADMINCONN_IPLIST_SUCCESS]: (state, action) => {
        return state.merge({gpmsAllowIps: action.response.data.data});
    }, 
    [EDIT_ADMINCONN_SUCCESS]: (state, action) => {
        return state;
    },
    [SET_ADMINCONN_IP_VALUE]: (state, action) => {
        const newGpmsAllowIps = state.get('gpmsAllowIps').set(action.index, action.value);
        return state.set('gpmsAllowIps', newGpmsAllowIps);
    },
    [ADD_ADMINCONN_IP_ITEM]: (state, action) => {
        const newGpmsAllowIps = state.get('gpmsAllowIps').push('');
        return state.set('gpmsAllowIps', newGpmsAllowIps);
    },
    [DELETE_ADMINCONN_IP_ITEM]: (state, action) => {
        const newGpmsAllowIps = state.get('gpmsAllowIps').delete(action.index);
        return state.set('gpmsAllowIps', newGpmsAllowIps);
    }        

}, initialState);

