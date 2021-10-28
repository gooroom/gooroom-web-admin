import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientConfSetting/COMMON_PENDING';
const COMMON_FAILURE = 'clientConfSetting/COMMON_FAILURE';

const GET_CONFSETTING_LIST_SUCCESS = 'clientConfSetting/GET_CONFSETTING_LIST_SUCCESS';
const GET_CONFSETTING_LISTPAGED_SUCCESS = 'clientConfSetting/GET_CONFSETTING_LISTPAGED_SUCCESS';
const GET_CONFSETTING_SUCCESS = 'clientConfSetting/GET_CONFSETTING_SUCCESS';
const CREATE_CONFSETTING_SUCCESS = 'clientConfSetting/CREATE_CONFSETTING_SUCCESS';
const EDIT_CONFSETTING_SUCCESS = 'clientConfSetting/EDIT_CONFSETTING_SUCCESS';
const DELETE_CONFSETTING_SUCCESS = 'clientConfSetting/DELETE_CONFSETTING_SUCCESS';

const SHOW_CONFSETTING_INFORM = 'clientConfSetting/SHOW_CONFSETTING_INFORM';
const CLOSE_CONFSETTING_INFORM = 'clientConfSetting/CLOSE_CONFSETTING_INFORM';
const SHOW_CONFSETTING_DIALOG = 'clientConfSetting/SHOW_CONFSETTING_DIALOG';
const CLOSE_CONFSETTING_DIALOG = 'clientConfSetting/CLOSE_CONFSETTING_DIALOG';

const SET_EDITING_ITEM_VALUE = 'clientConfSetting/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'clientConfSetting/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientConfSetting/CHG_COMPDATA_VALUE';
const DELETE_COMPDATA = 'clientConfSetting/DELETE_COMPDATA';
const DELETE_COMPDATA_ITEM = 'clientConfSetting/DELETE_COMPDATA_ITEM';

const SET_WHITEIP_VALUE = 'clientConfSetting/SET_WHITEIP_VALUE';
const ADD_WHITEIP_ITEM = 'clientConfSetting/ADD_WHITEIP_ITEM';
const DELETE_WHITEIP_ITEM = 'clientConfSetting/DELETE_WHITEIP_ITEM';

// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_DIALOG
    });
};

export const showInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFSETTING_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('objId') : '',
        viewItem: param.viewItem,
        isEditable: param.isEditable
    });
};

export const closeInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFSETTING_INFORM,
        compId: param.compId
    });
};

export const readClientConfSettingList = (module, compId, targetType) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfList', {
    }).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_LIST_SUCCESS,
                compId: compId,
                targetType: targetType,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readClientConfSettingListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getClientConf = (param) => dispatch => {
    const compId = param.compId;
    if(param.objId && param.objId !== '') {
        dispatch({type: COMMON_PENDING});
        return requestPostAPI('readClientConf', {'objId': param.objId}).then(
            (response) => {
                dispatch({
                    type: GET_CONFSETTING_SUCCESS,
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
            itemName: 'viewItem'
        });      
    }
};

export const getClientConfByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientConfByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            dispatch({
                type: GET_CONFSETTING_SUCCESS,
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
    return {
        objId: param.get('objId'),
        objName: param.get('objNm'),
        objComment: param.get('comment'),
        adminType: param.get('adminType'),

        isDeleteLog: param.get('isDeleteLog'),
        logMaxSize: param.get('logMaxSize'),
        logMaxCount: param.get('logMaxCount'),
        systemKeepFree: param.get('systemKeepFree'),
        logRemainDate: param.get('logRemainDate'),

        transmit_boot: param.get('transmit_boot'),
        transmit_exe: param.get('transmit_exe'),
        transmit_os: param.get('transmit_os'),
        transmit_media: param.get('transmit_media'),
        transmit_agent: param.get('transmit_agent'),
        notify_boot: param.get('notify_boot'),
        notify_exe: param.get('notify_exe'),
        notify_os: param.get('notify_os'),
        notify_media: param.get('notify_media'),
        notify_agent: param.get('notify_agent'),
        show_boot: param.get('show_boot'),
        show_exe: param.get('show_exe'),
        show_os: param.get('show_os'),
        show_media: param.get('show_media'),
        show_agent: param.get('show_agent'),

        USEHOMERESET: param.get('useHomeReset'),
        ROOTALLOW: param.get('rootAllow'),
        SUDOALLOW: param.get('sudoAllow'),
        policykit_user: param.get('policykitUser'),
        WHITEIPALL: param.get('whiteIpAll'),
        WHITEIPS: (param.get('whiteIp')) ? param.get('whiteIp').toArray() : [],

        CLEANMODEALLOW: param.get('cleanModeAllow')
    };
}

// create (add)
export const createClientConfSettingData = (itemObj) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createClientConf', makeParameter(itemObj)).then(
        (response) => {
            try {
                if(response.data.status && response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_CONFSETTING_SUCCESS
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
export const editClientConfSettingData = (itemObj, compId) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientConf', makeParameter(itemObj)).then(
        (response) => {
            if(response && response.data && response.data.status && response.data.status.result == 'success') {
                // change selected object
                requestPostAPI('readClientConf', {'objId': itemObj.get('objId')}).then(
                    (response) => {
                        dispatch({
                            type: EDIT_CONFSETTING_SUCCESS,
                            objId: itemObj.get('objId'),
                            response: response
                        });
                    }
                ).catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                });

                // change object array for selector
                requestPostAPI('readClientConfList', {
                }).then(
                    (response) => {
                        dispatch({
                            type: GET_CONFSETTING_LIST_SUCCESS,
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
export const deleteClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteClientConf', {'objId': param.objId}).then(
        (response) => {
            dispatch({
                type: DELETE_CONFSETTING_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// rule inherit - group
export const inheritClientConfSettingDataForGroup = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateClientGroupConfInherit', {
            'objId': param.objId,
            'confType': 'CLIENTCONF',
            'grpId': param.grpId
        }).then(
        (response) => {
            dispatch({
                type: EDIT_CONFSETTING_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// clone rule
export const cloneClientConfSettingData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('cloneClientConf', {
            'objId': param.objId
        }).then(
        (response) => {
            dispatch({
                type: CREATE_CONFSETTING_SUCCESS,
                compId: param.compId,
                objId: param.objId
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const addWhiteIp = () => dispatch => {
    return dispatch({
        type: ADD_WHITEIP_ITEM
    });
}

export const deleteWhiteIp = (index) => dispatch => {
    return dispatch({
        type: DELETE_WHITEIP_ITEM,
        index: index
    });
}

export const setWhiteIpValue = (param) => dispatch => {
    return dispatch({
        type: SET_WHITEIP_VALUE,
        index: param.index,
        value: param.value
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
    [GET_CONFSETTING_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }, 
    [GET_CONFSETTING_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    }, 
    [GET_CONFSETTING_SUCCESS]: (state, action) => {
        return commonHandleActions.handleGetObjectAction(state, action.compId, action.data, action.extend, action.target, 'objId');
    },
    [SHOW_CONFSETTING_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_CONFSETTING_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state, action);
    },
    [SHOW_CONFSETTING_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_CONFSETTING_INFORM]: (state, action) => {
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
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [DELETE_COMPDATA]: (state, action) => {
        return state.deleteIn(['viewItems', action.compId]);
    },
    [DELETE_COMPDATA_ITEM]: (state, action) => {
        return commonHandleActions.handleDeleteCompItem(state, action);
    },
    [CREATE_CONFSETTING_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false,
            error: false
        });
    },
    [EDIT_CONFSETTING_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_CONFSETTING_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'objId');
    },
    [SET_WHITEIP_VALUE]: (state, action) => {
        const newWhiteIp = state.getIn(['editingItem', 'whiteIp']).set(action.index, action.value);
        return state.setIn(['editingItem', 'whiteIp'], newWhiteIp);
    },
    [ADD_WHITEIP_ITEM]: (state, action) => {
        const newWhiteIp = (state.getIn(['editingItem', 'whiteIp'])) ? state.getIn(['editingItem', 'whiteIp']).push('') : List(['']);
        return state.setIn(['editingItem', 'whiteIp'], newWhiteIp);
    },
    [DELETE_WHITEIP_ITEM]: (state, action) => {
        const newWhiteIp = state.getIn(['editingItem', 'whiteIp']).delete(action.index);
        return state.setIn(['editingItem', 'whiteIp'], newWhiteIp);
    },

}, initialState);

