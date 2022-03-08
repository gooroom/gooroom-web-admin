
import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'userInfo/COMMON_PENDING';
const COMMON_FAILURE = 'userInfo/COMMON_FAILURE';

const GET_USER_INFO = 'userInfo/GET_USER_INFO';

const initialState = commonHandleActions.getCommonInitialState('', '', {
    userId: '',
    userName: '',
    userEmail: '',
    userDept: '',
});

export const getUserInfo = (param) => dispatch => {
    return requestPostAPI('readCurrentUserData').then(
        (response) => {
            dispatch({
                type: GET_USER_INFO,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const reducer = {
    [COMMON_PENDING]: (state, action) => {
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({ pending: false, error: true,
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [GET_USER_INFO]: (state, action) => {
        const userInfo = (action.response.data && action.response.data.data && action.response.data.data.length > 0) ? action.response.data.data[0] : null;
        if(userInfo) {
            return state.merge({
                userId: userInfo.userId,
                userName: userInfo.userNm,
                userEmail: userInfo.userEmail,
                userDept: userInfo.deptCd,
            });
        } else {
            return state.merge({
                userId: '',
                userName: '',
                userEmail: '',
                userDept: '',
            });
        }
    },
}

export default handleActions(reducer, initialState);