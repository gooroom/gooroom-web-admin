import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientGroup/COMMON_PENDING';
const COMMON_FAILURE = 'clientGroup/COMMON_FAILURE';

const GET_CLIENTGROUP_LISTPAGED_SUCCESS = 'clientGroup/GET_CLIENTGROUP_LISTPAGED_SUCCESS';
const GET_CLIENTGROUP_SUCCESS = 'clientGroup/GET_CLIENTGROUP_SUCCESS';

const GET_CLIENTGROUP_TREECHILD_SUCCESS = 'clientGroup/GET_CLIENTGROUP_TREECHILD_SUCCESS';
const CHG_TREEDATA_VALUE = 'clientGroup/CHG_TREEDATA_VALUE';
const GET_CLIENTGROUP_NODE = 'clientGroup/GET_CLIENTGROUP_NODE';
const GET_CLIENTGROUP_NODELIST = 'clientGroup/GET_CLIENTGROUP_NODELIST';

const CREATE_CLIENTGROUP_SUCCESS = 'clientGroup/CREATE_CLIENTGROUP_SUCCESS';
const EDIT_CLIENTGROUP_SUCCESS = 'clientGroup/EDIT_CLIENTGROUP_SUCCESS';
const DELETE_CLIENTGROUP_SUCCESS = 'clientGroup/DELETE_CLIENTGROUP_SUCCESS';

const SHOW_CLIENTGROUP_INFORM = 'clientGroup/SHOW_CLIENTGROUP_INFORM';
const CLOSE_CLIENTGROUP_INFORM = 'clientGroup/CLOSE_CLIENTGROUP_INFORM';
const SHOW_CLIENTGROUP_DIALOG = 'clientGroup/SHOW_CLIENTGROUP_DIALOG';
const CLOSE_CLIENTGROUP_DIALOG = 'clientGroup/CLOSE_CLIENTGROUP_DIALOG';

const SHOW_GROUPRULE_DIALOG = 'clientGroup/SHOW_GROUPRULE_DIALOG';
const CLOSE_GROUPRULE_DIALOG = 'clientGroup/CLOSE_GROUPRULE_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientGroup/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientGroup/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientGroup/CHG_COMPDATA_VALUE';
const CHG_COMPDATA_OBJECT = 'clientGroup/CHG_COMPDATA_OBJECT';
const DELETE_COMPDATA_ITEM = 'clientGroup/DELETE_COMPDATA_ITEM';

const ADD_CLIENTINGROUP_SUCCESS = 'clientGroup/ADD_CLIENTINGROUP_SUCCESS';
const REMOVE_CLIENTINGROUP_SUCCESS = 'clientGroup/REMOVE_CLIENTINGROUP_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chGrpNm', 'asc', {dialogTabValue: 0});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTGROUP_DIALOG
    });
};

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CLIENTGROUP_INFORM,
        compId: param.compId,
        selectId: param.selectId,
        viewItem: param.viewItem
    });
};

export const closeClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CLIENTGROUP_INFORM,
        compId: param.compId
    });
};

export const showMultiDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_GROUPRULE_DIALOG
    });
};

export const closeMultiDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_GROUPRULE_DIALOG
    });
};

export const readClientGroupListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        (module.getIn(['viewItems', compId, 'listParam', 'rowsPerPage']) !== undefined ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam').merge(extParam).merge(module.getIn(['viewItems', compId, 'listParam']))) :
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientGroupListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTGROUP_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readChildrenClientGroupList = (compId, grpId, index) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readChildrenClientGroupList', {
        grpId: grpId
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTGROUP_TREECHILD_SUCCESS,
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


export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
        name: param.name,
        value: param.value
    });
};

export const getClientGroup = (param) => dispatch => {
    const compId = param.compId;
    if(param.groupId && param.groupId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readClientGroupData', {'groupId': param.groupId}).then(
            (response) => {
                dispatch({
                    type: GET_CLIENTGROUP_SUCCESS,
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
            itemName: 'viewItem'
        });      
    }
};

export const getClientGroupNode = (param) => dispatch => {
    const compId = param.compId;
    if(param.groupId && param.groupId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readClientGroupData', {'groupId': param.groupId}).then(
            (response) => {
                dispatch({
                    type: GET_CLIENTGROUP_NODE,
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
            itemName: 'viewItem'
        });      
    }
};

export const getClientGroupNodeList = (param) => dispatch => {
    const compId = param.compId;
    if(param.groupIds && param.groupIds.length > 0) {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readClientGroupNodeList', {'groupIds': param.groupIds}).then(
            (response) => {
                dispatch({
                    type: GET_CLIENTGROUP_NODELIST,
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
            itemName: 'viewItem'
        });      
    }
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
        groupId: param.groupId,
        groupName: param.groupName,
        groupComment: param.groupComment,
        uprGrpId: param.uprGrpId,
        
        clientConfigId: (param.clientConfigId == '-') ? '' : param.clientConfigId,
        hostNameConfigId: (param.hostNameConfigId == '-') ? '' : param.hostNameConfigId,
        updateServerConfigId: (param.updateServerConfigId == '-') ? '' : param.updateServerConfigId,
        browserRuleId: (param.browserRuleId == '-') ? '' : param.browserRuleId,
        mediaRuleId: (param.mediaRuleId == '-') ? '' : param.mediaRuleId,
        securityRuleId: (param.securityRuleId == '-') ? '' : param.securityRuleId,
        filteredSoftwareRuleId: (param.filteredSoftwareRuleId == '-') ? '' : param.filteredSoftwareRuleId,
        desktopConfId: (param.desktopConfId == '-') ? '' : param.desktopConfId
    };
}

// create (add)
export const createClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientGroup', makeParameter(param)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CLIENTGROUP_SUCCESS,
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
export const editClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroup', makeParameter(param)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {

                requestPostAPI('readClientGroupData', {'groupId': param.groupId}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CLIENTGROUP_SUCCESS,
                            grpId: param.groupId,
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
export const deleteClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientGroup', {'groupId': param.grpId}).then(
        (response) => {
            dispatch({
                type: DELETE_CLIENTGROUP_SUCCESS,
                compId: param.compId,
                grpId: param.grpId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete group selected
export const deleteSelectedClientGroupData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientGroupList', {
        'groupIds': param.grpIds,
        'isDeleteClient': ((param.isDeleteClient) ? param.isDeleteClient : false) ? 'Y' : 'N'
    }).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: DELETE_CLIENTGROUP_SUCCESS,
                        compId: param.compId,
                        grpId: param.grpId
                    });
                    return response.data;
                } else {
                    dispatch({ type: COMMON_FAILURE, error: response.data });
                    return response.data;
                }
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

// add clients in group
export const addClientsInGroup = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('addClientsInGroup', itemObj).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: ADD_CLIENTINGROUP_SUCCESS
                    });
                }
                return response.data;    
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete clients in group
export const removeClientsInGroup = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('removeClientsInGroup', itemObj).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: REMOVE_CLIENTINGROUP_SUCCESS
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

// edit multi group rule once.
export const editMultiGroupRule = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateRuleForGroups', param).then(
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
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [GET_CLIENTGROUP_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [GET_CLIENTGROUP_TREECHILD_SUCCESS]: (state, action) => {
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
                    clientCount: x.clientCount,
                    clientTotalCount: x.clientTotalCount,
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

            if(state.getIn(['viewItems', compId, 'treeComp', 'treeData'])) {
                if(index !== undefined) {
                    let newTreeData = state.getIn(['viewItems', compId, 'treeComp', 'treeData']);
                    newTreeData = newTreeData.deleteIn([index, 'children']);
                   
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

                    // 3. reset parent index 
                    newTreeData = newTreeData.map((obj, i) => {
                        if (i > index && obj.get('parentIndex') > 0) {
                            if(obj.get('parentIndex') > index) {
                                obj = obj.set('parentIndex', obj.get('parentIndex'));
                            }
                        }
                        return obj;
                    });
    
                    // reset expandedListItems values for adding nodes.
                    const expandedListItems = state.getIn(['viewItems', compId, 'treeComp', 'expandedListItems']);
                    const newExpandedListItems = (expandedListItems) ? expandedListItems.filter(obj => (obj !== index)) : [];
    
                    return state.setIn(['viewItems', compId, 'treeComp', 'treeData'], newTreeData)
                                .setIn(['viewItems', compId, 'treeComp', 'expandedListItems'], newExpandedListItems);
                } else {
                    // root node
                    return state.setIn(['viewItems', compId, 'treeComp', 'treeData'], []);
                }
            } else {
                return state.setIn(['viewItems', compId, 'treeComp', 'treeData'], []);
            }
        }
    },
    [GET_CLIENTGROUP_NODE]: (state, action) => {
        const compId = action.compId;
        const data = action.response.data.data;
        // get index
        if(data && data.length > 0) {
            const treeData = state.getIn(['viewItems', compId, 'treeComp', 'treeData']);
            const index = treeData.findIndex((e => (e.get('key') === data[0].grpId)));
            return state.mergeIn(['viewItems', compId, 'treeComp', 'treeData', index], Map({
                regDate: data[0].regDate,
                clientCount: data[0].clientCount,
                clientTotalCount: data[0].clientTotalCount,
                modDate: data[0].modDate,
                grpNm: data[0].grpNm,
                comment: data[0].comment
            }));
        } else  {
            return state;
        }
    },
    [GET_CLIENTGROUP_NODELIST]: (state, action) => {
        const compId = action.compId;
        const data = action.response.data.data;
        if(data && data.length > 0) {
            let newState = state;
            const treeData = state.getIn(['viewItems', compId, 'treeComp', 'treeData']);
            for(let i = 0; i < data.length; i++) {
                const index = treeData.findIndex((e => (e.get('key') === data[i].grpId)));
                newState = newState.mergeIn(['viewItems', compId, 'treeComp', 'treeData', index], Map({
                    regDate: data[i].regDate,
                    clientCount: data[i].clientCount,
                    clientTotalCount: data[i].clientTotalCount,
                    modDate: data[i].modDate,
                    grpNm: data[i].grpNm,
                    comment: data[i].comment
                }));
            }
            return newState;
        } else  {
            return state;
        }
    },
    [GET_CLIENTGROUP_SUCCESS]: (state, action) => {
        const compId = action.compId;
        const data = action.response.data.data;
        if(data && data.length > 0) {
            return state
                .setIn(['viewItems', compId, 'viewItem'], fromJS(data[0]))
                .setIn(['viewItems', compId, 'informOpen'], true);
        } else  {
            return state.deleteIn(['viewItems', compId]);
        }
    },
    [SHOW_CLIENTGROUP_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CLIENTGROUP_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_CLIENTGROUP_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CLIENTGROUP_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [SHOW_GROUPRULE_DIALOG]: (state, action) => {
        return state.merge({
            multiDialogOpen: true, multiDialogType: action.multiDialogType
        });
    },
    [CLOSE_GROUPRULE_DIALOG]: (state, action) => {
        return state.delete('editingItem').merge({
            multiDialogOpen: false
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
    [DELETE_COMPDATA_ITEM]: (state, action) => {
        return commonHandleActions.handleDeleteCompItem(state, action);
    },
    [CREATE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [EDIT_CLIENTGROUP_SUCCESS]: (state, action) => {
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
    [DELETE_CLIENTGROUP_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'grpId');
    },
    [ADD_CLIENTINGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [REMOVE_CLIENTINGROUP_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    }

}, initialState);

