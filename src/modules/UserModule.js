
import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import sha256 from 'sha-256-js';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';
import { formatDateToSimple } from 'components/GRUtils/GRDates';

const COMMON_PENDING = 'user/COMMON_PENDING';
const COMMON_FAILURE = 'user/COMMON_FAILURE';

const GET_USER_LISTPAGED_SUCCESS = 'user/GET_USER_LISTPAGED_SUCCESS';
const GET_LISTALL_SUCCESS = 'user/GET_LISTALL_SUCCESS';
const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
const EDIT_USER_SUCCESS = 'user/EDIT_USER_SUCCESS';
const DELETE_USER_SUCCESS = 'user/DELETE_USER_SUCCESS';

const SHOW_USER_INFORM = 'user/SHOW_USER_INFORM';
const CLOSE_USER_INFORM = 'user/CLOSE_USER_INFORM';
const SHOW_USER_DIALOG = 'user/SHOW_USER_DIALOG';
const CLOSE_USER_DIALOG = 'user/CLOSE_USER_DIALOG';
const SHOW_USERRULE_DIALOG = 'user/SHOW_USERRULE_DIALOG';
const CLOSE_USERRULE_DIALOG = 'user/CLOSE_USERRULE_DIALOG';

const SET_EDITING_ITEM_VALUE = 'user/SET_EDITING_ITEM_VALUE';
const SET_EDITING_ITEM_VALUES = 'user/SET_EDITING_ITEM_VALUES';

const CHG_LISTPARAM_DATA = 'user/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'user/CHG_COMPDATA_VALUE';

const CHG_STORE_DATA = 'user/CHG_STORE_DATA';
const CHG_LOGINTRIAL_RESET = 'user/CHG_LOGINTRIAL_RESET';

// ...
const initialState = commonHandleActions.getCommonInitialState('chUserNm', 'asc', 
    { 
        ruleDialogOpen: false,
        ruleDialogType: ''
    }, {
        status: 'STAT010', 
        deptCd: '', keyword: ''
    });

export const showDialog = (param, isRule) => dispatch => {
    if(isRule) {
        return dispatch({
            type: SHOW_USERRULE_DIALOG,
            viewItem: param.ruleSelectedViewItem,
            ruleDialogType: param.ruleDialogType
        });
    }
    return dispatch({
        type: SHOW_USER_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = (isRule) => dispatch => {
    if(isRule) {
        return dispatch({
            type: CLOSE_USERRULE_DIALOG
        });
    }
    return dispatch({
        type: CLOSE_USER_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_USER_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('userId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_USER_INFORM,
        compId: param.compId
    });
};

export const readUserListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    const deptCdParam = (newListParam.get('deptCd') && List(newListParam.get('deptCd')).size > 0) ? List(newListParam.get('deptCd')).join() : '';

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readUserListPagedInDept', {
        status: newListParam.get('status'),
        deptCd: deptCdParam,
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_USER_LISTPAGED_SUCCESS,
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

export const setEditingItemValues = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUES,
        values: param
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

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
        targetType: param.targetType
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        name: param.name,
        value: param.value
    });
};

export const resetLoginTrailCount = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateUserLoginTrialCount', {
        userId: param.userId
    }).then(
        (response) => {
            try {
                if(response && response.data) {
                    if(response.data.status && response.data.status.result === 'success') {
                        dispatch({
                            type: CHG_LOGINTRIAL_RESET
                        });
                    } else {
                        dispatch({ type: COMMON_FAILURE, error: response.data });
                    }
                    return response.data;
                }
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
                return error;
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

const makeParameter = (param) => {

    const isChangePasswd = (param.userPasswd && param.userPasswd != '') ? 'Y' : 'N';
    return {
        userId: param.userId,
        userPasswd: (param.userPasswd && param.userPasswd !== '') ? sha256(param.userId + sha256(param.userPasswd)) : '',

        userNm: param.userNm,
        userEmail: param.userEmail,
        deptCd: param.deptCd,
        isChangePasswd: isChangePasswd,
        passwordExpireDate: formatDateToSimple(param.passwordExpireDate, 'YYYY-MM-DD'),
        expireDate: formatDateToSimple(param.expireDate, 'YYYY-MM-DD'),
        loginTrial: param.loginTrial,

        browserRuleId: (param.browserRuleId == '-') ? '' : param.browserRuleId,
        mediaRuleId: (param.mediaRuleId == '-') ? '' : param.mediaRuleId,
        securityRuleId: (param.securityRuleId == '-') ? '' : param.securityRuleId,
        filteredSoftwareRuleId: (param.filteredSoftwareRuleId == '-') ? '' : param.filteredSoftwareRuleId,
        ctrlCenterItemRuleId: (param.ctrlCenterItemRuleId == '-') ? '' : param.ctrlCenterItemRuleId,
        policyKitRuleId: (param.policyKitRuleId == '-') ? '' : param.policyKitRuleId,
        desktopConfId: (param.desktopConfId == '-') ? '' : param.desktopConfId
    };
}


// create (add)
export const createUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createUserWithRule', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_USER_SUCCESS,
                        response: response
                    });
                }
                return response.data;
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
                return error;
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
        return error;
    });
};

// edit
export const editUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateUserData', makeParameter(param)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                dispatch({
                    type: EDIT_USER_SUCCESS
                });
            } else {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete
export const deleteUserData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteUserData', {'userId': param.userId}).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: DELETE_USER_SUCCESS,
                        compId: param.compId,
                        userId: param.userId
                    });
                }
                return response.data;
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
                return error;
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
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },

    [GET_USER_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [SHOW_USER_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_USER_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_USER_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_USER_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [SET_EDITING_ITEM_VALUES]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge(action.values)
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({
            [action.name]: action.value
        });
    },
    [CREATE_USER_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_USER_SUCCESS]: (state, action) => {
        let newState = state;
        if(newState.get('viewItems')) {
            newState.get('viewItems').forEach((e, i) => {
                newState = newState
                        .deleteIn(['viewItems', i, 'viewItem'])
                        .setIn(['viewItems', i, 'informOpen'], false)
                        .delete('editingItem')
                        .merge({
                            pending: false,
                            error: false,
                            dialogOpen: false,
                            dialogType: ''
                        });
            });
        }

        return newState;
    },
    [DELETE_USER_SUCCESS]: (state, action) => {
        return state;
    },
    [CHG_LOGINTRIAL_RESET]: (state, action) => {

    },
    [SHOW_USERRULE_DIALOG]: (state, action) => {
        return state.merge({
            editingItem: action.viewItem,
            ruleDialogOpen: true, ruleDialogType: action.ruleDialogType
        });
    },
    [CLOSE_USERRULE_DIALOG]: (state, action) => {
        return state.delete('editingItem').merge({
            ruleDialogOpen: false,
            ruleDialogType: ''
        });
    },

}, initialState);

