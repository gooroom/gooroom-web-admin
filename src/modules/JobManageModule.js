import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'jobManage/COMMON_PENDING';
const COMMON_FAILURE = 'jobManage/COMMON_FAILURE';


const GET_JOB_LISTPAGED_SUCCESS = 'jobManage/GET_LIST_SUCCESS';

const SHOW_JOB_INFORM = 'jobManage/SHOW_JOB_INFORM';
const CLOSE_JOB_INFORM = 'jobManage/CLOSE_JOB_INFORM';

const SET_EDITING_ITEM_VALUE = 'jobManage/SET_EDITING_ITEM_VALUE';

const CHG_LISTPARAM_DATA = 'jobManage/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'jobManage/CHG_COMPDATA_VALUE';
const CHG_STORE_DATA = 'jobManage/CHG_STORE_DATA';


// ...
const initialState = commonHandleActions.getCommonInitialState('chJobNo', 'desc');

export const showJobInform = (param) => dispatch => {
    return dispatch({
        type: SHOW_JOB_INFORM,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('jobId') : '',
        viewItem: param.viewItem
    });
};

export const closeJobInform = (param) => dispatch => {
    return dispatch({
        type: CLOSE_JOB_INFORM,
        compId: param.compId
    });
};

export const readJobManageListPaged = (module, compId, extParam) => dispatch => {
    const newListParam = (module.getIn(['viewItems', compId])) ? 
        module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
        module.get('defaultListParam');

    dispatch({type: COMMON_PENDING});
    return requestPostAPI('readJobListPaged', {
        jobStatus: newListParam.get('jobStatus'),
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

export const changeListParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_LISTPARAM_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
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
    [GET_JOB_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
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



}, initialState);

