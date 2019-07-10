import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'noticePublishExtension/COMMON_PENDING';
const COMMON_FAILURE = 'noticePublishExtension/COMMON_FAILURE';

const SHOW_NOTICE_PUBLISH_EXTENSION_INFO = 'noticePublishExtension/SHOW_NOTICE_PUBLISH_EXTENSION_INFO';
const CLOSE_NOTICE_PUBLISH_EXTENSION_INFO = 'noticePublishExtension/CLOSE_NOTICE_PUBLISH_EXTENSION_INFO';

const CREATE_NOTICE_PUBLISH_TARGET_SUCCESS = 'noticePublishExtension/CREATE_NOTICE_PUBLISH_TARGET_SUCCESS';
const GET_NOTICE_PUBLISH_TARGET_LISTPAGED_SUCCESS = 'noticePublishExtension/GET_NOTICE_PUBLISH_TARGET_LISTPAGED_SUCCESS';

const CREATE_NOTICE_INSTANT_ALARM_SUCCESS = 'noticePublishExtension/CREATE_NOTICE_INSTANT_ALARM_SUCCESS';
const GET_NOTICE_INSTANT_ALARM_LISTPAGED_SUCCESS = 'noticePublishExtension/GET_NOTICE_INSTANT_ALARM_LISTPAGED_SUCCESS';

const initialState = commonHandleActions.getCommonInitialState('', 'desc', {}, {rowsPerPage: 5});

export const showNoticePublishExtensionInfo = (param) => dispatch => {
    return dispatch({
        type: SHOW_NOTICE_PUBLISH_EXTENSION_INFO,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('noticePublishId') : '',
        viewItem: param.viewItem
    });
};

export const closeNoticePublishExtensionInfo = (param) => dispatch => {
    return dispatch({
        type: CLOSE_NOTICE_PUBLISH_EXTENSION_INFO,
        compId: param.compId
    });
};

export const createNoticePublishTarget = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createNoticePublishTarget', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_NOTICE_PUBLISH_TARGET_SUCCESS,
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

export const readNoticePublishTargetListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId, 'listParam_NPT'])) ? 
    module.getIn(['viewItems', compId, 'listParam_NPT']).merge(extParam) : 
    module.get('defaultListParam').merge(extParam);

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readNoticePublishTargetListPaged', {
        noticePublishId: newListParam.get('noticePublishId'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_NOTICE_PUBLISH_TARGET_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readNoticePublishTargetList = (extParam) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readNoticePublishTargetList', {
        noticePublishId: extParam.noticePublishId
    }).then(
        (response) => response.data
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const createNoticeInstantAlarm = (param) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('createNoticeInstantAlarm', param).then(
        (response) => {
            try {
                if(response.data.status.result === 'success') {
                    dispatch({
                        type: CREATE_NOTICE_INSTANT_ALARM_SUCCESS,
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

export const readNoticeInstantAlarmListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId, 'listParam_NIA'])) ? 
    module.getIn(['viewItems', compId, 'listParam_NIA']).merge(extParam) : 
    module.get('defaultListParam').merge(extParam);

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readNoticeInstantAlarmListPaged', {
        noticePublishId: newListParam.get('noticePublishId'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_NOTICE_INSTANT_ALARM_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
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
    [SHOW_NOTICE_PUBLISH_EXTENSION_INFO]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_NOTICE_PUBLISH_EXTENSION_INFO]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },
    [CREATE_NOTICE_PUBLISH_TARGET_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [GET_NOTICE_PUBLISH_TARGET_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleCustomListPagedAction(state, action, 'NPT');
    },
    [CREATE_NOTICE_INSTANT_ALARM_SUCCESS]: (state, action) => {
        return state.merge({
            pending: false, error: false
        });
    },
    [GET_NOTICE_INSTANT_ALARM_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleCustomListPagedAction(state, action, 'NIA');
    }
}, initialState);

