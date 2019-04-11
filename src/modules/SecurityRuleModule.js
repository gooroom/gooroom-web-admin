import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'securityRule/COMMON_PENDING';
const COMMON_FAILURE = 'securityRule/COMMON_FAILURE';

const GET_SECURITYRULE_LIST_SUCCESS = 'securityRule/GET_SECURITYRULE_LIST_SUCCESS';
const GET_SECURITYRULE_LISTPAGED_SUCCESS = 'securityRule/GET_SECURITYRULE_LISTPAGED_SUCCESS';
const GET_SECURITYRULE_SUCCESS = 'securityRule/GET_SECURITYRULE_SUCCESS';
const CREATE_SECURITYRULE_SUCCESS = 'securityRule/CREATE_SECURITYRULE_SUCCESS';
const EDIT_SECURITYRULE_SUCCESS = 'securityRule/EDIT_SECURITYRULE_SUCCESS';
const DELETE_SECURITYRULE_SUCCESS = 'securityRule/DELETE_SECURITYRULE_SUCCESS';

const SHOW_SECURITYRULE_INFORM = 'securityRule/SHOW_SECURITYRULE_INFORM';
const CLOSE_SECURITYRULE_INFORM = 'securityRule/CLOSE_SECURITYRULE_INFORM';
const SHOW_SECURITYRULE_DIALOG = 'securityRule/SHOW_SECURITYRULE_DIALOG';
const CLOSE_SECURITYRULE_DIALOG = 'securityRule/CLOSE_SECURITYRULE_DIALOG';

const SET_EDITING_ITEM_VALUE = 'securityRule/SET_EDITING_ITEM_VALUE';
const SET_EDITING_NETWORK_VALUE = 'securityRule/SET_EDITING_NETWORK_VALUE';

const CHG_LISTPARAM_DATA = 'securityRule/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'securityRule/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'securityRule/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'securityRule/DELETE_COMPDATA_ITEM';

const ADD_NETWORK_ITEM = 'securityRule/ADD_NETWORK_ITEM';
const DELETE_NETWORK_ITEM = 'securityRule/DELETE_NETWORK_ITEM';

const UPWARD_NETWORK_ITEM = 'securityRule/UPWARD_NETWORK_ITEM';
const DOWNWARD_NETWORK_ITEM = 'securityRule/DOWNWARD_NETWORK_ITEM';
const UPWARD_SELECTEDNETWORK_ITEM = 'securityRule/UPWARD_SELECTEDNETWORK_ITEM';
const DOWNWARD_SELECTEDNETWORK_ITEM = 'securityRule/DOWNWARD_SELECTEDNETWORK_ITEM';


// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_SECURITYRULE_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_SECURITYRULE_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_SECURITYRULE_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_SECURITYRULE_INFORM,
        compId: param.compId
    });
};

export const readSecurityRuleList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readSecurityRuleListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getSecurityRule = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readSecurityRule', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_SECURITYRULE_SUCCESS,
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

export const getSecurityRuleByUserId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleByUserId', {'userId': param.userId}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_SUCCESS,
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

export const getSecurityRuleByDeptCd = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleByDeptCd', {'deptCd': param.deptCd}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_SUCCESS,
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

export const getSecurityRuleByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readSecurityRuleByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_SECURITYRULE_SUCCESS,
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

export const setEditingNetworkValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_NETWORK_VALUE,
        count: param.count,
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

    const networkItems = param.get('networkItems');
    let firewallNetworkItem = null;
    if(networkItems && networkItems.size > 0) {
        firewallNetworkItem = networkItems.map(e => {
            return (String(e.get('no'))).concat('|', e.get('direction'), '|', e.get('protocol'), '|', e.get('address'), '|', e.get('srcport'), '|', e.get('dstport'), '|', e.get('state'));
        })
    }

    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),

        screen_time: param.get('screenTime'),
        password_time: param.get('passwordTime'),
        package_handle: param.get('packageHandle'),
        global_network: (param.get('globalNetwork')) ? param.get('globalNetwork') : 'drop',
        firewall_network: (firewallNetworkItem) ? firewallNetworkItem.toJS() : null
    };
}

// create (add)
export const createSecurityRule = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createSecurityRule', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_SECURITYRULE_SUCCESS
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
export const editSecurityRule = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateSecurityRule', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // change selected object
                requestPostAPI('readSecurityRule', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_SECURITYRULE_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readSecurityRuleList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_SECURITYRULE_LIST_SUCCESS,
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
export const deleteSecurityRule = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteSecurityRule', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_SECURITYRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit - dept
export const inheritSecurityRuleDataForDept = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateDeptConfInherit', {
            'objId': param.objId,
            'confType': 'SECURITYRULE',
            'deptCd': param.deptCd
        }).then(
        (response) => {
            dispatch({
                type: EDIT_SECURITYRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit - group
export const inheritSecurityRuleDataForGroup = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroupConfInherit', {
            'objId': param.objId,
            'confType': 'SECURITYRULE',
            'grpId': param.grpId
        }).then(
        (response) => {
            dispatch({
                type: EDIT_SECURITYRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const cloneSecurityRuleData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('cloneSecurityRule', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_SECURITYRULE_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const addNetworkItem = (item) => dispatch => {
    return dispatch({
        type: ADD_NETWORK_ITEM,
        item: item
    });
}

export const deleteNetworkItem = (item) => dispatch => {
    return dispatch({
        type: DELETE_NETWORK_ITEM,
        item: item
    });
}

export const chgNetworkItemUpward = (id) => dispatch => {
    return dispatch({
        type: UPWARD_NETWORK_ITEM,
        id: id
    });
}

export const chgNetworkItemDownward = (id) => dispatch => {
    return dispatch({
        type: DOWNWARD_NETWORK_ITEM,
        id: id
    });
}

export const chgSelectedNetworkItemUpward = (ids) => dispatch => {
    return dispatch({
        type: UPWARD_SELECTEDNETWORK_ITEM,
        ids: ids
    });
}

export const chgSelectedNetworkItemDownward = (ids) => dispatch => {
    return dispatch({
        type: DOWNWARD_SELECTEDNETWORK_ITEM,
        ids: ids
    });
}



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
    [GET_SECURITYRULE_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_SECURITYRULE_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_SECURITYRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.data, action.extend, action.target, 'objId');
    },
    [SHOW_SECURITYRULE_DIALOG]: (state, action) => {
        // generate firewall data
        const netItems = action.viewItem.get('netItem');
        if(netItems && netItems.size > 0) {
            let networkItems = List([]);
            netItems.forEach(n => {
                const ns = n.split('|');
                networkItems = networkItems.push(Map({
                    no: ns[0],
                    direction: ns[1],
                    protocol: ns[2],
                    address: ns[3],
                    srcport: ns[4],
                    dstport: ns[5],
                    state: ns[6]
                }));
            });

            action.viewItem = action.viewItem.set('networkItems', networkItems);
        }

        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_SECURITYRULE_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_SECURITYRULE_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_SECURITYRULE_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [SET_EDITING_NETWORK_VALUE]: (state, action) => {

        let editingItem = state.get('editingItem');
        let newEditingItem = editingItem;
        if(editingItem.get('networkItems')) {
            let networkItems = editingItem.get('networkItems');
            if(networkItems.get(action.count)) {
                newEditingItem = editingItem.setIn(['networkItems', action.count, action.name], action.value);
            }
        }
        return state.set('editingItem', newEditingItem);
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
    [CREATE_SECURITYRULE_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });

    },
    [EDIT_SECURITYRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_SECURITYRULE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    },

    [ADD_NETWORK_ITEM]: (state, action) => {
        const newNetworkItems = state.getIn(['editingItem', 'networkItems']);
        if(newNetworkItems) {
            const itemSize = newNetworkItems.size;
            action.item.no = itemSize + 1;
            return state.setIn(['editingItem', 'networkItems'], newNetworkItems.push(action.item));
        } else {
            action.item.no = 1;
            return state.setIn(['editingItem', 'networkItems'], List([action.item]));
        }
    },
    [DELETE_NETWORK_ITEM]: (state, action) => {

        let newNetworkItems = state.getIn(['editingItem', 'networkItems']);
        if(action.item && action.item.length > 0) {

            const tempResult = newNetworkItems.filter(function (k, v) {
                let isExist = false;
                action.item.forEach(function(e) {
                    if(e == k.get('no')) {
                        isExist = true;
                    }
                });
                return !isExist;
            });

            if(tempResult && tempResult.size > 0) {
                // reset no value
                let count = 0;
                newNetworkItems = tempResult.map(e => {
                    return e.set('no', count++);
                });
            } else {
                newNetworkItems = List([]);
            }
        }
        
        return state
            .setIn(['editingItem', 'networkItems'], newNetworkItems)
            .setIn(['editingItem', 'selected'], List([]));
    },

    [UPWARD_NETWORK_ITEM]: (state, action) => {
        const aid = Number(action.id);
        if(aid <= 0) {
            return state;
        } else {
            const target = state.getIn(['editingItem', 'networkItems', aid]);
            const next = state.getIn(['editingItem', 'networkItems', (aid-1)]);

            let newState = state.setIn(['editingItem', 'networkItems', aid], next.set('no', aid));
            newState = newState.setIn(['editingItem', 'networkItems', (aid-1)], target.set('no', (aid-1)));
            newState = newState.setIn(['editingItem', 'selected'], List([]));
            return newState;
        }
    },
    [DOWNWARD_NETWORK_ITEM]: (state, action) => {
        const aid = Number(action.id);
        if(aid+1 >= state.getIn(['editingItem', 'networkItems']).size) {
            return state;
        } else {
            const target = state.getIn(['editingItem', 'networkItems', aid]);
            const next = state.getIn(['editingItem', 'networkItems', (aid+1)]);

            let newState = state.setIn(['editingItem', 'networkItems', aid], next.set('no', aid));
            newState = newState.setIn(['editingItem', 'networkItems', (aid+1)], target.set('no', (aid+1)));
            newState = newState.setIn(['editingItem', 'selected'], List([]));
            return newState;
        }
    },
    [UPWARD_SELECTEDNETWORK_ITEM]: (state, action) => {
        if(action.ids && action.ids.length > 0) {
            // sort (for seleted variable);
            action.ids.sort();
            let newState = state;
            let newSelected = [];

            for(var i = 0; i < action.ids.length; i++) {
                var id = action.ids[i];
                if(id > 0 && newSelected.indexOf(id-1) == -1) {
                    const target = newState.getIn(['editingItem', 'networkItems', id]);
                    const next = newState.getIn(['editingItem', 'networkItems', (id-1)]);
                    newState = newState.setIn(['editingItem', 'networkItems', id], next.set('no', id));
                    newState = newState.setIn(['editingItem', 'networkItems', (id-1)], target.set('no', (id-1)));
                    newSelected.push(id-1);
                } else {
                    newSelected.push(id);   
                }
            }
            newState = newState.setIn(['editingItem', 'selected'], List(newSelected));
            return newState;
        }
        return state;
    },
    [DOWNWARD_SELECTEDNETWORK_ITEM]: (state, action) => {
        if(action.ids && action.ids.length > 0) {
            // sort (for seleted variable);
            const maxItemSize = state.getIn(['editingItem', 'networkItems']).size;
            action.ids.sort();
            let newState = state;
            let newSelected = [];

            for(var i = action.ids.length-1; i >= 0; i--) {
                var id = action.ids[i];
                if(id < maxItemSize-1 && newSelected.indexOf(id+1) == -1) {
                    const target = newState.getIn(['editingItem', 'networkItems', id]);
                    const next = newState.getIn(['editingItem', 'networkItems', (id+1)]);
                    newState = newState.setIn(['editingItem', 'networkItems', id], next.set('no', id));
                    newState = newState.setIn(['editingItem', 'networkItems', (id+1)], target.set('no', (id+1)));
                    newSelected.push(id+1);
                } else {
                    newSelected.push(id);   
                }
            }
            newState = newState.setIn(['editingItem', 'selected'], List(newSelected));
            return newState;
        }
        return state;
    },


}, initialState);

