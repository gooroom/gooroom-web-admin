import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

import CtrlCenterItemDialog from 'views/Rules/UserConfig/CtrlCenterItemDialog';

const COMMON_PENDING = 'ctrlCenterItem/COMMON_PENDING';
const COMMON_FAILURE = 'ctrlCenterItem/COMMON_FAILURE';

const GET_CTRLCENTERITEM_LIST_SUCCESS = 'ctrlCenterItem/GET_CTRLCENTERITEM_LIST_SUCCESS';
const GET_CTRLCENTERITEM_LISTPAGED_SUCCESS = 'ctrlCenterItem/GET_CTRLCENTERITEM_LISTPAGED_SUCCESS';
const GET_CTRLCENTERITEM_SUCCESS = 'ctrlCenterItem/GET_CTRLCENTERITEM_SUCCESS';
const CREATE_CTRLCENTERITEM_SUCCESS = 'ctrlCenterItem/CREATE_CTRLCENTERITEM_SUCCESS';
const EDIT_CTRLCENTERITEM_SUCCESS = 'ctrlCenterItem/EDIT_CTRLCENTERITEM_SUCCESS';
const DELETE_CTRLCENTERITEM_SUCCESS = 'ctrlCenterItem/DELETE_CTRLCENTERITEM_SUCCESS';

const SHOW_CTRLCENTERITEM_INFORM = 'ctrlCenterItem/SHOW_CTRLCENTERITEM_INFORM';
const CLOSE_CTRLCENTERITEM_INFORM = 'ctrlCenterItem/CLOSE_CTRLCENTERITEM_INFORM';
const SHOW_CTRLCENTERITEM_DIALOG = 'ctrlCenterItem/SHOW_CTRLCENTERITEM_DIALOG';
const CLOSE_CTRLCENTERITEM_DIALOG = 'ctrlCenterItem/CLOSE_CTRLCENTERITEM_DIALOG';

const SET_EDITING_ITEM_VALUE = 'ctrlCenterItem/SET_EDITING_ITEM_VALUE';
const SET_EDITING_CTRLCENTERITEM_VALUE = 'ctrlCenterItem/SET_EDITING_CTRLCENTERITEM_VALUE';

const CHG_LISTPARAM_DATA = 'ctrlCenterItem/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'ctrlCenterItem/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'ctrlCenterItem/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'ctrlCenterItem/DELETE_COMPDATA_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CTRLCENTERITEM_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CTRLCENTERITEM_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CTRLCENTERITEM_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem,
        isEditable: param.isEditable
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CTRLCENTERITEM_INFORM,
        compId: param.compId
    });
};

export const readCtrlCenterItemList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readCtrlCenterItemList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_CTRLCENTERITEM_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readCtrlCenterItemListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readCtrlCenterItemListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CTRLCENTERITEM_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getCtrlCenterItem = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readCtrlCenterItem', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_CTRLCENTERITEM_SUCCESS,
                    compId: compId,
                    data: (response.data.data) ? response.data.data : null,
                    extend: (response.data.extend) ? response.data.extend : null,
                    target: ''
                });
            }
        ).catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
        });
    } else {
        return dispatch({
            type: DELETE_COMPDATA_ITEM,
            compId: compId,
            name: 'viewItem'
        });      
    }

};

export const getCtrlCenterItemByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readCtrlCenterItemByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_CTRLCENTERITEM_SUCCESS,
                compId: compId,
                data: (response.data.data) ? response.data.data : null,
                extend: (response.data.extend) ? response.data.extend : null,
                target: 'USER'
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getCtrlCenterItemByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readCtrlCenterItemByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_CTRLCENTERITEM_SUCCESS,
                compId: compId,
                data: (response.data.data) ? response.data.data : null,
                extend: (response.data.extend) ? response.data.extend : null,
                target: 'DEPT'
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getCtrlCenterItemByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readCtrlCenterItemByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_CTRLCENTERITEM_SUCCESS,
                compId: compId,
                data: (response.data.data) ? response.data.data : null,
                extend: (response.data.extend) ? response.data.extend : null,
                target: 'GROUP'
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

export const setEditingCtrlCenterItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_CTRLCENTERITEM_VALUE,
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
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
        targetType: param.targetType
    });
};

export const deleteCompData = (param) => dispatch => {
    return dispatch({
        type: DELETE_COMPDATA,
        compId: param.compId
    });
};

export const deleteCompDataItem = (param) => dispatch => {
    return dispatch({
        type: DELETE_COMPDATA_ITEM,
        compId: param.compId,
        name: param.name,
        targetType: param.targetType
    });
};

const makeParameter = (param) => {

    const ctrlItems = param.get('CTRLITEM');
    let itemList = List([]);
    CtrlCenterItemDialog.ITEM_LIST.map(n => {
        if(ctrlItems.get(n.tag) && ctrlItems.get(n.tag) == 'allow') {
            itemList = itemList.push(n.tag);
        } 
    });

    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),
        adminType: param.get('adminType'),

        itemList: (itemList) ? itemList.toJS() : []
    };
}

// create (add)
export const createCtrlCenterItemData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createCtrlCenterItem', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CTRLCENTERITEM_SUCCESS
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
export const editCtrlCenterItemData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateCtrlCenterItem', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // change selected object
                requestPostAPI('readCtrlCenterItem', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CTRLCENTERITEM_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readCtrlCenterItemList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_CTRLCENTERITEM_LIST_SUCCESS,
                            compId: compId,
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

// delete
export const deleteCtrlCenterItemData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteCtrlCenterItem', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_CTRLCENTERITEM_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit -dept
export const inheritCtrlCenterItemDataForDept = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConfInherit', {
            'objId': param.objId,
            'confType': 'CTRLCENTERITEMRULE',
            'deptCd': param.deptCd
        }).then(
        (response) => {
            dispatch({
                type: EDIT_CTRLCENTERITEM_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit - group
export const inheritCtrlCenterItemDataForGroup = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroupConfInherit', {
            'objId': param.objId,
            'confType': 'CTRLCENTERITEMRULE',
            'grpId': param.grpId
        }).then(
        (response) => {
            dispatch({
                type: EDIT_CTRLCENTERITEM_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const cloneCtrlCenterItemData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('cloneCtrlCenterItem', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_CTRLCENTERITEM_SUCCESS,
                compId: param.compId,
                objId: param.objId
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
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [GET_CTRLCENTERITEM_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_CTRLCENTERITEM_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_CTRLCENTERITEM_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.data, action.extend, action.target, 'objId');
    },
    [SHOW_CTRLCENTERITEM_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CTRLCENTERITEM_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_CTRLCENTERITEM_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CTRLCENTERITEM_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [SET_EDITING_CTRLCENTERITEM_VALUE]: (state, action) => {
        return state.setIn(['editingItem', 'CTRLITEM', action.name], action.value);
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [DELETE_COMPDATA]: (state, action) => {
        return state.deleteIn(['viewItems', action.compId]);
    },
    [DELETE_COMPDATA_ITEM]: (state, action) => {
        return commonHandleActions.handleDeleteCompItem(state, action);
    },
    [CREATE_CTRLCENTERITEM_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CTRLCENTERITEM_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_CTRLCENTERITEM_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    },

}, initialState);

