import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'totalRule/COMMON_PENDING';
const COMMON_FAILURE = 'totalRule/COMMON_FAILURE';

const GET_CLIENTRULE_SUCCESS = 'totalRule/GET_CLIENTRULE_SUCCESS';


const GET_CONFSETTING_SUCCESS = 'clientConfSetting/GET_CONFSETTING_SUCCESS';
const GET_HOSTNAME_SUCCESS = 'clientHostName/GET_HOSTNAME_SUCCESS';
const GET_UPDATESERVER_SUCCESS = 'clientUpdateServer/GET_UPDATESERVER_SUCCESS';

const GET_BROWSERRULE_SUCCESS = 'browserRule/GET_BROWSERRULE_SUCCESS';
const GET_MEDIACONTROL_SUCCESS = 'mediaRule/GET_MEDIACONTROL_SUCCESS';
const GET_SOFTWAREFILTER_SUCCESS = 'softwareFilter/GET_SOFTWAREFILTER_SUCCESS';
const GET_SECURITYRULE_SUCCESS = 'securityRule/GET_SECURITYRULE_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chConfId');

export const getClientRuleByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientRuleByGroupId', {'groupId': param.groupId}).then(
        (response) => {
            
            // dispatch({
            //     type: GET_CLIENTRULE_SUCCESS,
            //     compId: compId,
            //     target: 'GROUP',
            //     response: response
            // });

            if(response.data && response.data.CLIENTCONF) {
                const resObj = response.data.CLIENTCONF;
                dispatch({
                    type: GET_CONFSETTING_SUCCESS,
                    compId: compId,
                    data: (resObj.data) ? resObj.data : null,
                    extend: (resObj.extend) ? resObj.extend : null,
                    target: 'GROUP'
                });
            }

            if(response.data && response.data.HOST) {
                const resObj = response.data.HOST;
                dispatch({
                    type: GET_HOSTNAME_SUCCESS,
                    compId: compId,
                    data: (resObj.data) ? resObj.data : null,
                    extend: (resObj.extend) ? resObj.extend : null,
                    target: 'GROUP'
                });
            }

            if(response.data && response.data.UPDATE) {
                const resObj = response.data.UPDATE;
                dispatch({
                    type: GET_UPDATESERVER_SUCCESS,
                    compId: compId,
                    data: (resObj.data) ? resObj.data : null,
                    extend: (resObj.extend) ? resObj.extend : null,
                    target: 'GROUP'
                });
            }

            if(response.data && response.data.BROWSER) {
                const resObj = response.data.BROWSER;
                dispatch({
                    type: GET_BROWSERRULE_SUCCESS,
                    compId: compId,
                    data: (resObj.data) ? resObj.data : null,
                    extend: (resObj.extend) ? resObj.extend : null,
                    target: 'GROUP'
                });
            }

            if(response.data && response.data.MEDIA) {
                const resObj = response.data.MEDIA;
                dispatch({
                    type: GET_MEDIACONTROL_SUCCESS,
                    compId: compId,
                    data: (resObj.data) ? resObj.data : null,
                    extend: (resObj.extend) ? resObj.extend : null,
                    target: 'GROUP'
                });
            }

            if(response.data && response.data.SECURITY) {
                const resObj = response.data.SECURITY;
                dispatch({
                    type: GET_SECURITYRULE_SUCCESS,
                    compId: compId,
                    data: (resObj.data) ? resObj.data : null,
                    extend: (resObj.extend) ? resObj.extend : null,
                    target: 'GROUP'
                });
            }

            if(response.data && response.data.SWFILTER) {
                const resObj = response.data.SWFILTER;
                dispatch({
                    type: GET_SOFTWAREFILTER_SUCCESS,
                    compId: compId,
                    data: (resObj.data) ? resObj.data : null,
                    extend: (resObj.extend) ? resObj.extend : null,
                    target: 'GROUP'
                });
            }

        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const getAllClientRuleByGroupId = (param) => dispatch => {
    const compId = param.compId;
    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readAllClientRuleByGroupId', {'groupId': param.groupId}).then(
        (response) => {

            console.log('response.data ::::: ', response.data);
            dispatch({type: COMMON_PENDING});

            // if(response.data && response.data.CLIENTCONF) {
            //     const resObj = response.data.CLIENTCONF;
            //     dispatch({
            //         type: GET_CONFSETTING_SUCCESS,
            //         compId: compId,
            //         data: (resObj.data) ? resObj.data : null,
            //         extend: (resObj.extend) ? resObj.extend : null,
            //         target: 'GROUP'
            //     });
            // }

            // if(response.data && response.data.HOST) {
            //     const resObj = response.data.HOST;
            //     dispatch({
            //         type: GET_HOSTNAME_SUCCESS,
            //         compId: compId,
            //         data: (resObj.data) ? resObj.data : null,
            //         extend: (resObj.extend) ? resObj.extend : null,
            //         target: 'GROUP'
            //     });
            // }

            // if(response.data && response.data.UPDATE) {
            //     const resObj = response.data.UPDATE;
            //     dispatch({
            //         type: GET_UPDATESERVER_SUCCESS,
            //         compId: compId,
            //         data: (resObj.data) ? resObj.data : null,
            //         extend: (resObj.extend) ? resObj.extend : null,
            //         target: 'GROUP'
            //     });
            // }

            // if(response.data && response.data.BROWSER) {
            //     const resObj = response.data.BROWSER;
            //     dispatch({
            //         type: GET_BROWSERRULE_SUCCESS,
            //         compId: compId,
            //         data: (resObj.data) ? resObj.data : null,
            //         extend: (resObj.extend) ? resObj.extend : null,
            //         target: 'GROUP'
            //     });
            // }

            // if(response.data && response.data.MEDIA) {
            //     const resObj = response.data.MEDIA;
            //     dispatch({
            //         type: GET_MEDIACONTROL_SUCCESS,
            //         compId: compId,
            //         data: (resObj.data) ? resObj.data : null,
            //         extend: (resObj.extend) ? resObj.extend : null,
            //         target: 'GROUP'
            //     });
            // }

            // if(response.data && response.data.SECURITY) {
            //     const resObj = response.data.SECURITY;
            //     dispatch({
            //         type: GET_SECURITYRULE_SUCCESS,
            //         compId: compId,
            //         data: (resObj.data) ? resObj.data : null,
            //         extend: (resObj.extend) ? resObj.extend : null,
            //         target: 'GROUP'
            //     });
            // }

            // if(response.data && response.data.SWFILTER) {
            //     const resObj = response.data.SWFILTER;
            //     dispatch({
            //         type: GET_SOFTWAREFILTER_SUCCESS,
            //         compId: compId,
            //         data: (resObj.data) ? resObj.data : null,
            //         extend: (resObj.extend) ? resObj.extend : null,
            //         target: 'GROUP'
            //     });
            // }

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
            resultMsg: (action.error.data && action.error.data.status) ? action.error.data.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [GET_CLIENTRULE_SUCCESS]: (state, action) => {

        return state; // commonHandleActions.handleGetObjectAction(state, action.compId, action.response.data.data, action.response.data.extend, action.target, 'objId');
    }

}, initialState);

