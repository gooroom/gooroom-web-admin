import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'admin/COMMON_PENDING';
const COMMON_FAILURE = 'admin/COMMON_FAILURE';

const GET_PROTECTED_LIST_SUCCESS = 'admin/GET_PROTECTED_LIST_SUCCESS';

const GET_ADMIN_INFO = 'admin/GET_ADMIN_INFO';
const SET_LOGOUT = 'admin/SET_LOGOUT';
const SHOW_CONFIRM = 'admin/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'admin/CLOSE_CONFIRM';
const SET_EDITING_ITEM_VALUE = 'admin/SET_EDITING_ITEM_VALUE';
// ...

// ...
const initialState = commonHandleActions.getCommonInitialState('', '', {
    adminId: '',
    adminName: '',
    email: '',
    isEnableAlarm: '',
    pollingCycle: 0
});

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        name: param.name,
        value: param.value
    });
};

export const readProtectedClientList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readProtectedClientList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_PROTECTED_LIST_SUCCESS,
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
                // alarm ... success
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
                pollingCycle: adminInfo.pollingCycle
            });
        } else {
            return state.merge({
                adminId: '',
                adminName: '',
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
    [GET_PROTECTED_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    },

}, initialState);



