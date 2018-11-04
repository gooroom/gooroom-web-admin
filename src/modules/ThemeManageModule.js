import { handleActions } from 'redux-actions';

import { requestPostAPI, requestMultipartFormAPI } from 'components/GRUtils/GRRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'themeManage/COMMON_PENDING';
const COMMON_FAILURE = 'themeManage/COMMON_FAILURE';

const CHG_LISTPARAM_DATA = 'themeManage/CHG_LISTPARAM_DATA';
const SET_EDITING_ITEM_VALUE = 'themeManage/SET_EDITING_ITEM_VALUE';
const SET_EDITING_ITEM_OBJECT = 'themeManage/SET_EDITING_ITEM_OBJECT';

const GET_THEMEMANAGE_LISTPAGED_SUCCESS = 'themeManage/GET_THEMEMANAGE_LISTPAGED_SUCCESS';

const CREATE_THEMEMANAGE_SUCCESS = 'themeManage/CREATE_THEMEMANAGE_SUCCESS';
const EDIT_THEMEMANAGE_SUCCESS = 'themeManage/EDIT_THEMEMANAGE_SUCCESS';
const DELETE_THEMEMANAGE_SUCCESS = 'themeManage/DELETE_THEMEMANAGE_SUCCESS';

const SHOW_THEMEMANAGE_DIALOG = 'themeManage/SHOW_THEMEMANAGE_DIALOG';
const CLOSE_THEMEMANAGE_DIALOG = 'themeManage/CLOSE_THEMEMANAGE_DIALOG';


// ...
const initialState = commonHandleActions.getCommonInitialState('chThemeNm', 'asc', {});

export const showDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_THEMEMANAGE_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_THEMEMANAGE_DIALOG
    });
};

// ...
export const readThemeListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readThemeListPaged', {
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_THEMEMANAGE_LISTPAGED_SUCCESS,
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

export const setEditingItemObject = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_OBJECT,
        param: param
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

const makeParameter = (param) => {
    return {
        themeId: param.get('themeId'),
        themeNm: param.get('themeNm'),
        themeCmt: param.get('themeCmt'),

        cloud_storage: (param.get('cloud_storage')) ? param.get('cloud_storage') : '',

        wallpaperFile: (param.get('wallpaperFile')) ? param.get('wallpaperFile') : ''
    };
}

// create (add)
export const createThemeData = (paramObject) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestMultipartFormAPI('createThemeData', paramObject).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_THEMEMANAGE_SUCCESS,
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
export const editThemeData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateThemeData', param).then(
        (response) => {
            dispatch({
                type: EDIT_THEMEMANAGE_SUCCESS,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// delete
export const deleteThemeData = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('deleteThemeData', param).then(
        (response) => {
            dispatch({
                type: DELETE_THEMEMANAGE_SUCCESS,
                response: response
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
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },

    [GET_THEMEMANAGE_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },  
    [SHOW_THEMEMANAGE_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_THEMEMANAGE_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [SET_EDITING_ITEM_OBJECT]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge(action.param)
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CREATE_THEMEMANAGE_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [EDIT_THEMEMANAGE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    },
    [DELETE_THEMEMANAGE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleDeleteSuccessAction(state, action, 'userId');
    }

}, initialState);

