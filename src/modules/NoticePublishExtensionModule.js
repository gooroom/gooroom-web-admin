import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'noticePublishExtension/COMMON_PENDING';
const COMMON_FAILURE = 'noticePublishExtension/COMMON_FAILURE';

const SHOW_NOTICE_PUBLISH_EXTENSION_INFO = 'noticePublishExtension/SHOW_NOTICE_PUBLISH_EXTENSION_INFO';
const CLOSE_NOTICE_PUBLISH_EXTENSION_INFO = 'noticePublishExtension/CLOSE_NOTICE_PUBLISH_EXTENSION_INFO';

const GET_NOTICE_PUBLISH_TARGET_LIST_SUCCESS = 'noticePublishExtension/GET_NOTICE_PUBLISH_TARGET_LIST_SUCCESS';
const GET_NOTICE_INSTANT_ALARM_LIST_SUCCESS = 'noticePublishExtension/GET_NOTICE_INSTANT_ALARM_LIST_SUCCESS';

const initialState = commonHandleActions.getCommonInitialState('', '', {}, {});

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

export const readNoticePublishTargetList = (module, compId, extParam) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readNoticePublishTargetList', {
        noticePublishId: extParam.noticePublishId
    }).then(
        (response) => {
            dispatch({
                type: GET_NOTICE_PUBLISH_TARGET_LIST_SUCCESS,
                compId: compId,
                targetType: 'NOTICE_PUBLISH_TARGET',
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readNoticeInstantAlarmList = (module, compId, extParam) => dispatch => {
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readNoticeInstantAlarmList', {
        noticePublishId: extParam.noticePublishId
    }).then(
        (response) => {
            dispatch({
                type: GET_NOTICE_INSTANT_ALARM_LIST_SUCCESS,
                compId: compId,
                targetType: 'NOTICE_INSTANT_ALARM',
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
    [GET_NOTICE_PUBLISH_TARGET_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    },
    [GET_NOTICE_INSTANT_ALARM_LIST_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListAction(state, action, 'objId');
    }
}, initialState);

