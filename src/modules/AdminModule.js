import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'admin/COMMON_PENDING';
const COMMON_FAILURE = 'admin/COMMON_FAILURE';

const GET_VIOLATED_LIST_SUCCESS = 'admin/GET_VIOLATED_LIST_SUCCESS';
const GET_VIOLATED_COUNT_SUCCESS = 'admin/GET_VIOLATED_COUNT_SUCCESS';

const GET_ADMIN_INFO = 'admin/GET_ADMIN_INFO';
const SET_LOGOUT = 'admin/SET_LOGOUT';
const SHOW_CONFIRM = 'admin/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'admin/CLOSE_CONFIRM';
const SET_EDITING_ITEM_VALUE = 'admin/SET_EDITING_ITEM_VALUE';

const SHOW_PROTECTLIST_DIALOG = 'admin/SHOW_PROTECTLIST_DIALOG';
const CLOSE_PROTECTLIST_DIALOG = 'admin/CLOSE_PROTECTLIST_DIALOG';

const SET_REDIRECT_PAGE_VALUE = 'admin/SET_REDIRECT_PAGE_VALUE';

// ...

// ...
const initialState = commonHandleActions.getCommonInitialState('', '', {
    adminId: '',
    adminName: '',
    adminTp: '',
    deptInfoList: [],
    grpInfoList: [],                
    email: '',
    isEnableAlarm: '',
    pollingCycle: 0
});

export const showViolatedListDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_PROTECTLIST_DIALOG
    });
};

export const closeViolatedListDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_PROTECTLIST_DIALOG
    });
};

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        name: param.name,
        value: param.value
    });
};

export const readViolatedClientCount = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readViolatedClientCount', {
    }).then(
        (response) => {
            dispatch({
                type: GET_VIOLATED_COUNT_SUCCESS,
                compId: 'ROOT',
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readViolatedClientList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readViolatedClientList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_VIOLATED_LIST_SUCCESS,
                compId: 'ROOT',
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getAdminInfo = (param) => dispatch => {
    return requestPostAPI('readCurrentAdminUserData').then(
        (response) => {
            dispatch({
                type: GET_ADMIN_INFO,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const logout = (param) => dispatch => {
    return requestPostAPI('logout', {
        temp: 'dump'
    }).then(
        (response) => {
            dispatch({
                type: SET_LOGOUT
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// edit
export const editAdminInfoData = (itemObj) => dispatch => {

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateCurrentAdminUserData', { pollingCycle: itemObj.editPollingCycle }).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // change selected object
                requestPostAPI('readCurrentAdminUserData').then(
                    (response) => {
                        dispatch({
                            type: GET_ADMIN_INFO,
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });
            } else {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const redirectPage = (param) => dispatch => {
    return dispatch({
        type: SET_REDIRECT_PAGE_VALUE,
        address: param.address
    });
};

export default handleActions({

    [COMMON_PENDING]: (state, action) => {
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [GET_ADMIN_INFO]: (state, action) => {
        const adminInfo = (action.response.data && action.response.data.data && action.response.data.data.length > 0) ? action.response.data.data[0] : null;
        if(adminInfo) {
            return state.merge({
                adminId: adminInfo.adminId,
                adminName: adminInfo.adminNm,
                adminTp: adminInfo.adminTp,
                deptInfoList: adminInfo.deptInfoList,
                grpInfoList: adminInfo.grpInfoList,
                pollingCycle: adminInfo.pollingCycle
            });
        } else {
            return state.merge({
                adminId: '',
                adminName: '',
                adminTp: '',
                deptInfoList: [],
                grpInfoList: [],
                pollingCycle: ''
            });
        }
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({[action.name]: action.value});
    },
    [SET_LOGOUT]: (state, action) => {
        return state;
    },
    [GET_VIOLATED_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    },
    [GET_VIOLATED_COUNT_SUCCESS]: (state, action) => {
        const violatedCount = (action.response.data && action.response.data.data && action.response.data.data.length > 0) ? action.response.data.data[0] : null;
        return state.merge({'violatedCount': violatedCount});
    },
    [SHOW_PROTECTLIST_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: true,
            dialogType: action.dialogType
        });
    },
    [CLOSE_PROTECTLIST_DIALOG]: (state, action) => {
        return state.merge({
            dialogOpen: false,
            dialogType: ''
        });
    },
    [SET_REDIRECT_PAGE_VALUE]: (state, action) => {
        return state.merge({
            redirectAddress: action.address,
            isNeedRedirect: true,
            dialogOpen: false,
            dialogType: ''
        });
    },

}, initialState);



