import { handleActions } from 'redux-actions';
import { List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GrUtils/GrRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';


const COMMON_PENDING = 'dept/COMMON_PENDING';
const COMMON_FAILURE = 'dept/COMMON_FAILURE';

const GET_DEPT_LIST_SUCCESS = 'dept/GET_DEPT_LIST_SUCCESS';
const GET_DEPT_LISTPAGED_SUCCESS = 'dept/GET_DEPT_LISTPAGED_SUCCESS';
const GET_DEPT_SUCCESS = 'dept/GET_DEPT_SUCCESS';
const CREATE_DEPT_SUCCESS = 'dept/CREATE_DEPT_SUCCESS';
const EDIT_DEPT_SUCCESS = 'dept/EDIT_DEPT_SUCCESS';
const DELETE_DEPT_SUCCESS = 'dept/DELETE_DEPT_SUCCESS';

const SHOW_DEPT_INFORM = 'dept/SHOW_DEPT_INFORM';
const CLOSE_DEPT_INFORM = 'dept/CLOSE_DEPT_INFORM';
const SHOW_DEPT_DIALOG = 'dept/SHOW_DEPT_DIALOG';
const CLOSE_DEPT_DIALOG = 'dept/CLOSE_DEPT_DIALOG';

const SET_EDITING_ITEM_VALUE = 'dept/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'dept/CHG_LISTPARAM_DATA';
const CHG_COMPVARIABLE_DATA = 'dept/CHG_COMPVARIABLE_DATA';
const CHG_COMPVARIABLE_OBJECT = 'dept/CHG_COMPVARIABLE_OBJECT';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId', 'desc', {dialogTabValue: 0});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_DEPT_DIALOG,
        selectedViewItem: param.selectedViewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_DEPT_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_DEPT_INFORM,
        compId: param.compId,
        selectedViewItem: param.selectedViewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_DEPT_INFORM,
        compId: param.compId
    });
};

export const readDeptList = (module, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDeptList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_DEPT_LIST_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const readDeptListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDeptListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_DEPT_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const getDept = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDept', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: GET_DEPT_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

export const getDeptSettingByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDeptByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_DEPT_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
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

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPVARIABLE_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
};

export const changeCompVariableObject = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPVARIABLE_OBJECT,
        compId: param.compId,
        valueObj: param.valueObj
    });
};

const makeParameter = (param) => {
    return {
        deptCd: param.deptCd,
        deptNm: param.deptNm,
        uprDeptCd: param.uprDeptCd,

        optYn: 'Y', //param.get('deptCd'),
        sortOrder: 1, //param.get('deptCd'),

        desktopConfId: ''//param.get('deptCd')
    };
}

// create (add)
export const createDeptInfo = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createDeptInfo', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_DEPT_SUCCESS
                    });
                }    
            } catch(ex) {
                dispatch({
                    type: COMMON_FAILURE,
                    ex: ex
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

// edit
export const editDeptInfo = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readDept', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_DEPT_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                });

                // change object array for selector
                requestPostAPI('readDeptList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_DEPT_LIST_SUCCESS,
                            compId: compId,
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({
                        type: COMMON_FAILURE,
                        error: error
                    });
                });
            } else {
                // alarm ... fail
                dispatch({
                    type: COMMON_FAILURE,
                    error: error
                });
            }
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
        });
    });
};

// delete
export const deleteDeptInfo = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteDeptConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_DEPT_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({
            type: COMMON_FAILURE,
            error: error
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
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            ex: (action.ex) ? action.ex : ''
        });
    },
    [GET_DEPT_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action);
    }, 
    [GET_DEPT_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_DEPT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data);
    },
    [SHOW_DEPT_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_DEPT_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_DEPT_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_DEPT_INFORM]: (state, action) => {
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
    [CHG_COMPVARIABLE_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, action.name], action.value);
    },
    [CHG_COMPVARIABLE_OBJECT]: (state, action) => {
        const oldValue = state.getIn(['viewItems', action.compId]);
        if(oldValue) {
            return state.setIn(['viewItems', action.compId], oldValue.merge(fromJS(action.valueObj)));
        } else {
            return state.setIn(['viewItems', action.compId], fromJS(action.valueObj));
        }        
    },
    [CREATE_DEPT_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_DEPT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_DEPT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action);
    }

}, initialState);

