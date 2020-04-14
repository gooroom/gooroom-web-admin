import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'jobManage/COMMON_PENDING';
const COMMON_FAILURE = 'jobManage/COMMON_FAILURE';
const SET_EDITING_ITEM_VALUE = 'jobManage/SET_EDITING_ITEM_VALUE';
const CHG_LISTPARAM_DATA = 'jobManage/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'jobManage/CHG_COMPDATA_VALUE';

const CHG_TARGET_LISTPARAM_DATA = 'jobManage/CHG_TARGET_LISTPARAM_DATA';

const GET_JOB_LISTPAGED_SUCCESS = 'jobManage/GET_JOB_LISTPAGED_SUCCESS';
const GET_JOBTARGET_LISTPAGED_SUCCESS = 'jobManage/GET_JOBTARGET_LISTPAGED_SUCCESS';

const SHOW_JOB_INFORM = 'jobManage/SHOW_JOB_INFORM';
const CLOSE_JOB_INFORM = 'jobManage/CLOSE_JOB_INFORM';

const SET_JOB_CANCEL = 'jobManage/SET_JOB_CANCEL';

// ...
const initialState = commonHandleActions.getCommonInitialState('chJobNo', 'desc', {}, {jobStatus: ['R', 'D']});

export const showJobInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_JOB_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('jobNo') : '',
        viewItem: param.viewItem
    });
};

export const closeJobInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_JOB_INFORM,
        compId: param.compId
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

export const readJobManageListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    const jobStatusParam = (newListParam.get('jobStatus') && List(newListParam.get('jobStatus')).size > 0) ? List(newListParam.get('jobStatus')).join() : '';

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readJobListPaged', {
        jobStatus: jobStatusParam,
        jobType: newListParam.get('jobType') !== 'all' ? newListParam.get('jobType') : '', 
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_JOB_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const readClientListInJobPaged = (module, compId, extParam) => dispatch => {

    const newListParam = (module.getIn(['viewItems', compId, 'listParam_target'])) ? 
        module.getIn(['viewItems', compId, 'listParam_target']).merge(extParam) : 
        module.get('defaultListParam').merge(extParam);

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readClientListInJobPaged', {
        jobNo: newListParam.get('jobNo'),
        keyword: newListParam.get('keyword'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_JOBTARGET_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

export const changeListParamData = (module, param) => dispatch => {
    if(param && param.isGetList) {
        dispatch({ type: CHG_LISTPARAM_DATA, compId: param.compId, name: param.name, value: param.value });

        const newListParam = (module.getIn(['viewItems', param.compId])) ? 
        module.getIn(['viewItems', param.compId, 'listParam']).merge({jobStatus: param.value}) : 
        module.get('defaultListParam');

        return requestPostAPI('readJobListPaged', {
            jobStatus: (param.value && param.value != '') ? param.value.join() : '',
            keyword: newListParam.get('keyword'),
            page: param.page,
            start: param.page * newListParam.get('rowsPerPage'),
            length: newListParam.get('rowsPerPage'),
            orderColumn: newListParam.get('orderColumn'),
            orderDir: newListParam.get('orderDir')
        }).then(
            (response) => {
                dispatch({
                    type: GET_JOB_LISTPAGED_SUCCESS,
                    compId: param.compId,
                    listParam: newListParam,
                    response: response
                });
            }
        ).catch(error => {
            dispatch({ type: COMMON_FAILURE, error: error });
        });

    } else {
        return dispatch({ type: CHG_LISTPARAM_DATA, compId: param.compId, name: param.name, value: param.value });    
    }
};

export const changeTargetListParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_TARGET_LISTPARAM_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
};

export const cancelJobRunning = (jobNo) => dispatch => {

    return requestPostAPI('updateJobToCancel', {
        jobNo: jobNo
    }).then(
        (response) => {
            dispatch({
                type: SET_JOB_CANCEL,
                jobNo: jobNo,
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
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [GET_JOB_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [GET_JOBTARGET_LISTPAGED_SUCCESS]: (state, action) => {
        const newState = commonHandleActions.handleCustomListPagedAction(state, action, 'target');
        return newState.deleteIn(['viewItems', action.compId, 'selectTargetObj']);
    },
    [SHOW_JOB_INFORM]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
    [CLOSE_JOB_INFORM]: (state, action) => {
        return commonHandleActions.handleCloseInformAction(state, action);
    },

    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_TARGET_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam_target', action.name], action.value);
    },



}, initialState);

