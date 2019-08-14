import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'noticePublish/COMMON_PENDING';
const COMMON_FAILURE = 'noticePublish/COMMON_FAILURE';

const SHOW_NOTICE_PUBLISH_DIALOG = 'noticePublish/SHOW_NOTICE_PUBLISH_DIALOG';
const CLOSE_NOTICE_PUBLISH_DIALOG = 'noticePublish/CLOSE_NOTICE_PUBLISH_DIALOG';

const SHOW_NOTICE_PUBLISH_INFO = 'noticePublish/SHOW_NOTICE_PUBLISH_INFO';
const CLOSE_NOTICE_PUBLISH_INFO = 'noticePublish/CLOSE_NOTICE_PUBLISH_INFO';

const GET_NOTICE_PUBLISH_LISTPAGED_SUCCESS = 'noticePublish/GET_NOTICE_PUBLISH_LISTPAGED_SUCCESS';

const CREATE_NOTICE_PUBLISH_SUCCESS = 'noticePublish/CREATE_NOTICE_PUBLISH_SUCCESS';
const UPDATE_NOTICE_PUBLISH_SUCCESS = 'noticePublish/UPDATE_NOTICE_PUBLISH_SUCCESS';

const CHG_LISTPARAM_DATA = 'noticePublish/CHG_LISTPARAM_DATA';
const SET_EDITING_ITEM_VALUE = 'noticePublish/SET_EDITING_ITEM_VALUE';
const CHG_COMPDATA_VALUE = 'noticePublish/CHG_COMPDATA_VALUE';

const initialState = commonHandleActions.getCommonInitialState('chNoticePublishId', 'desc', {}, {rowsPerPage: 5});

export const showNoticePublishDialog = (param) => dispatch => {
    return dispatch({
        type: SHOW_NOTICE_PUBLISH_DIALOG,
        viewItem: param.viewItem,
        dialogType: param.dialogType
    });
};

export const closeNoticePublishDialog = () => dispatch => {
    return dispatch({
        type: CLOSE_NOTICE_PUBLISH_DIALOG
    });
};

export const showNoticePublishInfo = (param) => dispatch => {
    return dispatch({
        type: SHOW_NOTICE_PUBLISH_INFO,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('noticeId') : '',
        viewItem: param.viewItem
    });
};

export const closeNoticePublishInfo = (param) => dispatch => {
    return dispatch({
        type: CLOSE_NOTICE_PUBLISH_INFO,
        compId: param.compId
    });
};

export const setEditingItemValue = (param) => dispatch => {
    return dispatch({
        type: SET_EDITING_ITEM_VALUE,
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

export const readNoticePublishListPaged = (module, compId, extParam) => dispatch => {
    const newListParam =
        ((module.getIn(['viewItems', compId])) && module.getIn(['viewItems', compId, 'listParam'])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam').merge(extParam);

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readNoticePublishListPaged', {
        noticeId: newListParam.get('noticeId'),
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_NOTICE_PUBLISH_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// create
export const createNoticePublish = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createNoticePublish', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_NOTICE_PUBLISH_SUCCESS,
                        response: response
                    });
                    return response;
                }                    
            } catch(error) {
                dispatch({ type: COMMON_FAILURE, error: error });
            }
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// update
export const updateNoticePublish = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('updateNoticePublish', param).then(
        (response) => {
            dispatch({
                type: UPDATE_NOTICE_PUBLISH_SUCCESS,
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
    [SHOW_NOTICE_PUBLISH_DIALOG]: (state, action) => {
        return commonHandleActions.handleShowDialogAction(state, action);
    },
    [CLOSE_NOTICE_PUBLISH_DIALOG]: (state, action) => {
        return commonHandleActions.handleCloseDialogAction(state.set('dialogTabValue', 0), action);
    },
    [SHOW_NOTICE_PUBLISH_INFO]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_NOTICE_PUBLISH_INFO]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [SET_EDITING_ITEM_VALUE]: (state, action) => {
        return state.merge({
            editingItem: state.get('editingItem').merge({[action.name]: action.value})
        });
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [GET_NOTICE_PUBLISH_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [CREATE_NOTICE_PUBLISH_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [UPDATE_NOTICE_PUBLISH_SUCCESS]: (state, action) => {
        return commonHandleActions.handleEditSuccessAction(state, action);
    }
}, initialState);

