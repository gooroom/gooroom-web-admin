import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'dashboard/COMMON_PENDING';
const COMMON_FAILURE = 'dashboard/COMMON_FAILURE';

const GET_CLIENT_STATUS_INFO = 'dashboard/GET_CLIENT_STATUS_INFO';

const initialState = commonHandleActions.getCommonInitialState();

export const readClientStatusForDashboard = (param) => dispatch => {
    return requestPostAPI('readClientStatusForDashboard').then(
        (response) => {
            dispatch({
                type: GET_CLIENT_STATUS_INFO,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
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
    [GET_CLIENT_STATUS_INFO]: (state, action) => {
        const statusInfo = (action.response.data && action.response.data.data && action.response.data.data.length > 0) ? action.response.data.data[0] : null;
        if(statusInfo) {
            return state.merge({
                clientOnCount: statusInfo.onCount,
                clientOffCount: statusInfo.offCount,
                clientRevokeCount: statusInfo.revokeCount,
                clientTotalCount: statusInfo.totalCount
            });
        } else {
            return state.merge({
                clientOnCount: 0,
                clientOffCount: 0,
                clientRevokeCount: 0,
                clientTotalCount: 0
            });
        }
    }

}, initialState);



