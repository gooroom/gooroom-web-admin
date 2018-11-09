import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';

const COMMON_PENDING = 'softwareFilter/COMMON_PENDING';
const COMMON_FAILURE = 'softwareFilter/COMMON_FAILURE';

const GET_SOFTWAREFILTER_LIST_SUCCESS = 'softwareFilter/GET_SOFTWAREFILTER_LIST_SUCCESS';
const GET_SOFTWAREFILTER_LISTPAGED_SUCCESS = 'softwareFilter/GET_SOFTWAREFILTER_LISTPAGED_SUCCESS';
const GET_SOFTWAREFILTER_SUCCESS = 'softwareFilter/GET_SOFTWAREFILTER_SUCCESS';
const CREATE_SOFTWAREFILTER_SUCCESS = 'softwareFilter/CREATE_SOFTWAREFILTER_SUCCESS';
const EDIT_SOFTWAREFILTER_SUCCESS = 'softwareFilter/EDIT_SOFTWAREFILTER_SUCCESS';
const DELETE_SOFTWAREFILTER_SUCCESS = 'softwareFilter/DELETE_SOFTWAREFILTER_SUCCESS';

const SHOW_SOFTWAREFILTER_INFORM = 'softwareFilter/SHOW_SOFTWAREFILTER_INFORM';
const CLOSE_SOFTWAREFILTER_INFORM = 'softwareFilter/CLOSE_SOFTWAREFILTER_INFORM';
const SHOW_SOFTWAREFILTER_DIALOG = 'softwareFilter/SHOW_SOFTWAREFILTER_DIALOG';
const CLOSE_SOFTWAREFILTER_DIALOG = 'softwareFilter/CLOSE_SOFTWAREFILTER_DIALOG';

const SET_EDITING_ITEM_VALUE = 'softwareFilter/SET_EDITING_ITEM_VALUE';
const SET_EDITING_SWITEM_VALUE = 'softwareFilter/SET_EDITING_SWITEM_VALUE';

const CHG_LISTPARAM_DATA = 'softwareFilter/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'softwareFilter/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'softwareFilter/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'softwareFilter/DELETE_COMPDATA_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_SOFTWAREFILTER_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_SOFTWAREFILTER_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_SOFTWAREFILTER_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_SOFTWAREFILTER_INFORM,
        compId: param.compId
    });
};

export const readSoftwareFilterList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSoftwareFilterList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_SOFTWAREFILTER_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readSoftwareFilterListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSoftwareFilterListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_SOFTWAREFILTER_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getSoftwareFilter = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readSoftwareFilter', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_SOFTWAREFILTER_SUCCESS,
                    compId: compId,
                    response: response
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

export const getSoftwareFilterByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSoftwareFilterByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_SOFTWAREFILTER_SUCCESS,
                compId: compId,
                target: 'USER',
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getSoftwareFilterByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSoftwareFilterByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_SOFTWAREFILTER_SUCCESS,
                compId: compId,
                target: 'DEPT',
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getSoftwareFilterByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSoftwareFilterByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_SOFTWAREFILTER_SUCCESS,
                compId: compId,
                target: 'GROUP',
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

export const setEditingSoftwareItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_SWITEM_VALUE,
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

    // create software select list
    const swItems = param.get('SWITEM');
    let swList = List([]);
    SoftwareFilterDialog.SW_LIST.map(n => {
        if(swItems.get(n.tag) && swItems.get(n.tag) == 'allow') {
            swList = swList.push(n.tag);
        } 
    });

    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),

        swList: (swList) ? swList.toJS() : []
    };
}

// create (add)
export const createSoftwareFilterData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createSoftwareFilter', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_SOFTWAREFILTER_SUCCESS
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
export const editSoftwareFilterData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateSoftwareFilter', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // alarm ... success
                // change selected object
                requestPostAPI('readSoftwareFilter', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_SOFTWAREFILTER_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readSoftwareFilterList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_SOFTWAREFILTER_LIST_SUCCESS,
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
export const deleteSoftwareFilterData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteSoftwareFilter', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_SOFTWAREFILTER_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit
export const inheritSoftwareFilterData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConfInherit', {
            'objId': param.objId,
            'confType': 'FILTEREDSWRULE',
            'deptCd': param.deptCd
        }).then(
        (response) => {
            dispatch({
                type: EDIT_SOFTWAREFILTER_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const cloneSoftwareFilterData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClonedSoftwareFilter', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_SOFTWAREFILTER_SUCCESS,
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
    [GET_SOFTWAREFILTER_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_SOFTWAREFILTER_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_SOFTWAREFILTER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend, action.target, 'objId');
    },
    [SHOW_SOFTWAREFILTER_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_SOFTWAREFILTER_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_SOFTWAREFILTER_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_SOFTWAREFILTER_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [SET_EDITING_SWITEM_VALUE]: (state, action) => {
        return state.setIn(['editingItem', 'SWITEM', action.name], action.value);
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
    [CREATE_SOFTWAREFILTER_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_SOFTWAREFILTER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_SOFTWAREFILTER_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    },

}, initialState);

