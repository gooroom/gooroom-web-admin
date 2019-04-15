import { handleActions } from 'redux-actions';
import { List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'dept/COMMON_PENDING';
const COMMON_FAILURE = 'dept/COMMON_FAILURE';

const GET_DEPT_LIST_SUCCESS = 'dept/GET_DEPT_LIST_SUCCESS';
const GET_DEPT_LISTPAGED_SUCCESS = 'dept/GET_DEPT_LISTPAGED_SUCCESS';
const GET_DEPT_SUCCESS = 'dept/GET_DEPT_SUCCESS';

const GET_DEPT_TREECHILD_SUCCESS = 'dept/GET_CLIENTGROUP_TREECHILD_SUCCESS';
const CHG_TREEDATA_VALUE = 'dept/CHG_TREEDATA_VALUE';

const CREATE_DEPT_SUCCESS = 'dept/CREATE_DEPT_SUCCESS';
const EDIT_DEPT_SUCCESS = 'dept/EDIT_DEPT_SUCCESS';
const DELETE_DEPT_SUCCESS = 'dept/DELETE_DEPT_SUCCESS';

const SHOW_DEPT_INFORM = 'dept/SHOW_DEPT_INFORM';
const CLOSE_DEPT_INFORM = 'dept/CLOSE_DEPT_INFORM';
const SHOW_DEPT_DIALOG = 'dept/SHOW_DEPT_DIALOG';
const CLOSE_DEPT_DIALOG = 'dept/CLOSE_DEPT_DIALOG';

const SHOW_MULTIDEPT_DIALOG = 'dept/SHOW_MULTIDEPT_DIALOG';
const CLOSE_MULTIDEPT_DIALOG = 'dept/CLOSE_MULTIDEPT_DIALOG';

const SET_EDITING_ITEM_VALUE = 'dept/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'dept/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'dept/CHG_COMPDATA_VALUE';
const CHG_COMPDATA_OBJECT = 'dept/CHG_COMPDATA_OBJECT';

const CHG_STORE_DATA = 'dept/CHG_STORE_DATA';
const ADD_USERINDEPT_SUCCESS = 'dept/ADD_USERINDEPT_SUCCESS';
const DELETE_USERINDEPT_SUCCESS = 'dept/DELETE_USERINDEPT_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId', 'desc', {dialogTabValue: 0});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_DEPT_DIALOG,
        viewItem: param.viewItem,
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
        selectId: (param.viewItem) ? param.viewItem.get('deptId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_DEPT_INFORM,
        compId: param.compId
    });
};

export const showMultiDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_MULTIDEPT_DIALOG
    });
};

export const closeMultiDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_MULTIDEPT_DIALOG
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
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readDeptListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        (module.getIn(['viewItems', compId, 'listParam', 'rowsPerPage']) !== undefined ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam').merge(extParam).merge(module.getIn(['viewItems', compId, 'listParam']))) :
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
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readChildrenDeptList = (compId, deptCd, index) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readChildrenDeptList', {
        deptCd: deptCd
    }).then(
        (response) => {
            dispatch({
                type: GET_DEPT_TREECHILD_SUCCESS,
                compId: compId,
                index: index,
                response: response
            });
        }
    ).catch(error => {
        console.log('error : ', error);
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};


export const getDeptInfo = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readDeptData', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_DEPT_SUCCESS,
                compId: compId,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
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

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
        targetType: param.targetType
    });
};

export const changeCompVariableObject = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_OBJECT,
        compId: param.compId,
        valueObj: param.valueObj
    });
};

export const changeStoreData = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        name: param.name,
        value: param.value
    });
};

export const changeTreeDataVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_TREEDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
};

const makeParameter = (param) => {
    return {
        deptCd: param.deptCd,
        deptNm: param.deptNm,
        uprDeptCd: param.uprDeptCd,
        
        optYn: (param.optYn && param.optYn != '') ? param.optYn : 'Y',
        sortOrder: (param.sortOrder && param.sortOrder != '') ? param.sortOrder : '1',

        browserRuleId: (param.browserRuleId == '-') ? '' : param.browserRuleId,
        mediaRuleId: (param.mediaRuleId == '-') ? '' : param.mediaRuleId,
        securityRuleId: (param.securityRuleId == '-') ? '' : param.securityRuleId,
        filteredSoftwareRuleId: (param.filteredSoftwareRuleId == '-') ? '' : param.filteredSoftwareRuleId,
        desktopConfId: (param.desktopConfId == '-') ? '' : param.desktopConfId,

        paramIsInherit: (param.paramIsInherit) ? param.paramIsInherit : false
    };
}

// create (add)
export const createDeptInfo = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createDeptInfo', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_DEPT_SUCCESS
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
export const editDeptInfo = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptInfo', makeParameter(param)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // change selected object
                requestPostAPI('readDeptData', {'deptCd': param.deptCd}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_DEPT_SUCCESS,
                            objId: param.objId,
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
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// add user in dept
export const createUsersInDept = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createUsersInDept', itemObj).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: ADD_USERINDEPT_SUCCESS
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

// delete user in dept
export const deleteUsersInDept = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteUsersInDept', itemObj).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: DELETE_USERINDEPT_SUCCESS
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

// edit multi dept rule once.
export const editMultiDeptRule = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateRuleForDepts', param).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                dispatch({
                    type: EDIT_DEPT_SUCCESS,
                    response: response
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
    [GET_DEPT_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'deptCd');
    }, 
    [GET_DEPT_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [GET_DEPT_TREECHILD_SUCCESS]: (state, action) => {
        const compId = action.compId;
        const index = action.index;
        const data = action.response.data;
        if(data && data.length > 0) {

            const resData = fromJS(data.map(x => {
                let node = {
                    key: x.key,
                    depth: x.level,
                    disabled: false,
                    title: x.title,
                    children: (x.hasChildren) ? [] : null,
                    regDate: x.regDt,
                    modDate: x.modDt,
                    comment: x.comment,
                    userCount: x.userCount,
                    userTotalCount: x.userTotalCount,
                    _shouldRender: true
                };
                if (index !== undefined) {
                    node["parentIndex"] = index;
                }
                return node;
            }));

            if(state.getIn(['viewItems', compId, 'treeComp', 'treeData'])) {
                if(index !== undefined) {
                    let newTreeData = state.getIn(['viewItems', compId, 'treeComp', 'treeData']);
                    newTreeData = newTreeData.setIn([index, 'children'], resData.map(d => (d.get('key'))));
                   
                    // data merge.
                    if(index === 0) {
                        // root
                        newTreeData = newTreeData.filter((e, i) => (i === 0));
                    } else {
                        // 1. delete children
                        const parentIndex = newTreeData.getIn([index, 'parentIndex']);
                        let nextSiblings = newTreeData.map((e, i) => {
                            if(e.get('parentIndex') !== undefined && e.get('parentIndex') <= parentIndex && i > index) {
                                return i;
                            } else {
                                return -1;
                            }
                        });

                        nextSiblings = nextSiblings.filter(e => (e > -1));
                        if(nextSiblings && nextSiblings.size > 0) {
                            newTreeData = newTreeData.filter((e, i) => !(i > index && i < nextSiblings.get(0)));
                        } else {
                            newTreeData = newTreeData.filter((e, i) => (i <= index));
                        }
                    }

                    // 2. insert new child data
                    //newTreeData = newTreeData.splice.apply(newTreeData, [index + 1, 0].concat(resData));
                    newTreeData = newTreeData.splice(index+1, newTreeData.size-(index+1)).concat(resData).concat(newTreeData.splice(0, index+1))

                    // 3. reset parent index 
                    newTreeData = newTreeData.map((obj, i) => {
                        if (i > index + resData.size && obj.get('parentIndex') > 0) {
                            if(obj.get('parentIndex') > index) {
                                obj = obj.set('parentIndex', obj.get('parentIndex') + resData.size);
                            }
                        }
                        return obj;
                    });
    
                    // reset expandedListItems values for adding nodes.
                    const expandedListItems = state.getIn(['viewItems', compId, 'treeComp', 'expandedListItems']);
                    const newExpandedListItems = (expandedListItems) ? expandedListItems.map(obj => {
                        if(obj > index) {
                            return obj + resData.size;
                        } else {
                            return obj;
                        }
                    }) : [];
    
                    return state.setIn(['viewItems', compId, 'treeComp', 'treeData'], newTreeData)
                                .setIn(['viewItems', compId, 'treeComp', 'expandedListItems'], newExpandedListItems);
                } else {
                    // root node
                    return state.mergeIn(['viewItems', compId, 'treeComp', 'treeData', 0], {
                        comment: resData.getIn([0, 'comment']),
                        modDate: resData.getIn([0, 'modDate']),
                        regDate: resData.getIn([0, 'regDate']),
                        title: resData.getIn([0, 'title'])
                    });
                }
            } else {
                return state.setIn(['viewItems', compId, 'treeComp', 'treeData'], resData);
            }
        } else  {
            return state.deleteIn(['viewItems', compId, 'treeComp', 'treeData']);
        }
    },
    [GET_DEPT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, 'deptCd');
    },
    [SHOW_DEPT_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_DEPT_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_DEPT_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_DEPT_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SHOW_MULTIDEPT_DIALOG]: (state, action) => {
        return state.merge({
            multiDialogOpen: true, multiDialogType: action.multiDialogType
        });
    },
    [CLOSE_MULTIDEPT_DIALOG]: (state, action) => {
        return state.delete('editingItem').merge({
            multiDialogOpen: false
        });
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [CHG_COMPDATA_OBJECT]: (state, action) => {
        const oldValue = state.getIn(['viewItems', action.compId]);
        if(oldValue) {
            return state.setIn(['viewItems', action.compId], oldValue.merge(fromJS(action.valueObj)));
        } else {
            return state.setIn(['viewItems', action.compId], fromJS(action.valueObj));
        }        
    },
    [CHG_TREEDATA_VALUE]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'treeComp', action.name], action.value);
    },
    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({
            [action.name]: action.value
        });
    },
    [CREATE_DEPT_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_DEPT_SUCCESS]: (state, action) => {
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
    [DELETE_DEPT_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'deptCd');
    },
    [ADD_USERINDEPT_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [DELETE_USERINDEPT_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    }

}, initialState);

