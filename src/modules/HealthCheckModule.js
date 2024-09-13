import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { requestPostJsonAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

// 액션 타입 정의
const COMMON_PENDING = 'healthCheck/COMMON_PENDING';
const COMMON_FAILURE = 'healthCheck/COMMON_FAILURE';
const GET_SERVER_LIST = 'healthCheck/GET_SERVER_LIST';
const REGIST_SERVER_SUCCESS = 'healthCheck/REGIST_SERVER_SUCCESS';

// 초기 상태 정의
const initialState = Map({
    repoServerList: List(),
});

// 액션 생성자 정의
export const getServerList = () => dispatch => {
    dispatch({ type: COMMON_PENDING });
    return requestPostAPI('health/getServerHealthList')
        .then(
            response => {
                dispatch({
                    type: GET_SERVER_LIST,
                    response: response
                });
                return response;
            }
        ).catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
            throw error;
        });
};

export const deleteRepoServer = (param) => dispatch => {
    dispatch({ type: COMMON_PENDING });

    return requestPostAPI('health/deleteRegisterRepoServer',  param )
        .then(response => {
            return dispatch(getServerList()); // 삭제 후 서버 목록 다시 가져오기
        })
        .catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
            throw error;
        });
};

export const registerRepoServer = (param) => dispatch => {
    dispatch({ type: COMMON_PENDING });

    // URL 체크 API 호출
    return requestPostAPI('health/checkRepoServerUrl', { url: param.url, dist: param.dist })
        .then(response => {
            if (response.data.status && response.data.status.result === 'success') {
                // URL이 유효한 경우에만 서버 등록 진행
                return requestPostAPI('health/registerRepoServer', param)
                    .then(
                        response => {
                            try {
                                if(response.data.status && response.data.status.result === 'success') {
                                    dispatch({
                                        type: REGIST_SERVER_SUCCESS,
                                        response: response
                                    });

                                }
                                return response;
                            } catch(error) {
                                dispatch({ type: COMMON_FAILURE, error: error });
                                return error;
                            }
                        }
                    ).catch(error => {
                        dispatch({ type: COMMON_FAILURE, error: error });
                        throw error;
                    });
            } else {
                // URL 체크 실패 시 처리
                const errorMsg = (response.data.status && response.data.status.message) || 'URL 체크 실패';
                dispatch({ type: COMMON_FAILURE, error: new Error(errorMsg) });
                return { error: true, message: errorMsg };
            }
        })
        .catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
            throw error;
        });
};

export const registerDbServer = (param) => dispatch => {
    dispatch({ type: COMMON_PENDING });

    // DB URL 체크 API 호출
    return requestPostJsonAPI('health/checkDbServerUrl', {
        url: param.url,
        port: param.port,
        dbType: param.dbType,
        username: param.username,
        password: param.password,
        sid:param.sid
    })
    .then(response => {
        if (response.data.status && response.data.status.result === 'success') {
            // URL이 유효한 경우에만 서버 등록 진행
            return requestPostJsonAPI('health/registerDbServer', param)
                .then(response => {
                    try {
                        if (response.data.status && response.data.status.result === 'success') {
                            dispatch({
                                type: REGIST_SERVER_SUCCESS,
                                response: response
                            });
                        }
                        return response;
                    } catch (error) {
                        dispatch({ type: COMMON_FAILURE, error: error });
                        return error;
                    }
                })
                .catch(error => {
                    dispatch({ type: COMMON_FAILURE, error: error });
                    throw error;
                });
        } else {
            // URL 체크 실패 시 처리
            const errorMsg = (response.data.status && response.data.status.message) || 'DB URL 체크 실패';
            dispatch({ type: COMMON_FAILURE, error: new Error(errorMsg) });
            return { error: true, message: errorMsg };
        }
    })
    .catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
        throw error;
    });

    // // URL 체크 API 호출
    // return requestPostJsonAPI('health/registerDbServer', param )
    //     .then(response => {
    //             try {
    //                 if(response.data.status && response.data.status.result === 'success') {
    //                     dispatch({
    //                         type: REGIST_SERVER_SUCCESS,
    //                         response: response
    //                     });

    //                 }
    //                 return response;
    //             } catch(error) {
    //                 dispatch({ type: COMMON_FAILURE, error: error });
    //                 return error;
    //             }
    //         }
    //     )
    //     .catch(error => {
    //         dispatch({ type: COMMON_FAILURE, error: error });
    //         throw error;
    //     });
};

// 리듀서 정의
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
    [GET_SERVER_LIST]: (state, action) => {
        const serverList = fromJS(action.response.data.data);  // Immutable로 변환
        return state.merge({
            pending: false,
            error: false,
            serverList: serverList  // 서버 목록을 상태에 저장
        });
    },
    [REGIST_SERVER_SUCCESS]: (state, action) => {
        return state;
    },
}, initialState);
