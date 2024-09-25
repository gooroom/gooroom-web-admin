import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientPackageSpec/COMMON_PENDING';
const COMMON_FAILURE = 'clientPackageSpec/COMMON_FAILURE';
const GET_CLIENTPACKAGESPEC_LISTPAGED_SUCCESS = 'clientPackageSpec/GET_CLIENTPACKAGESPEC_LISTPAGED_SUCCESS';
const CHG_LISTPARAM_DATA = 'clientPackageSpec/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientPackageSpec/CHG_COMPDATA_VALUE';

const GET_PACKAGESPEC_LISTPAGED_SUCCESS = 'clientPackageSpec/GET_PACKAGESPEC_LISTPAGED_SUCCESS';

// ...
const initialState = commonHandleActions.getCommonInitialState('chPackageId', 'asc', { dialogTabValue: 0 });

// 소프트웨어 명세 단말별 정보 불러오는 API
export const readPackageSpecListPagedInClient = (module, compId, extParam) => dispatch => {
    let newListParam = Map({});

    if (module.getIn(['viewItems', compId])) {
        newListParam = module.getIn(['viewItems', compId, 'listParam']).merge(extParam)
    } else {
        newListParam = module.get('defaultListParam');
        if (extParam) {
            newListParam = newListParam.merge(extParam);
        }
    }

    dispatch({ type: COMMON_PENDING });
    return requestPostAPI('readPackageSpecListPagedInClient', {
        keyword: newListParam.get('keyword'),
        clientId: newListParam.get('clientId'),
        isFiltered: (newListParam.get('isFiltered')) ? newListParam.get('isFiltered') : false,
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTPACKAGESPEC_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                response: response
            });
        }
    ).catch(error => {
        dispatch({ type: COMMON_FAILURE, error: error });
    });
};

// 버전별 정보 리스트 API
export const readpackageSpecListPagedInVersion = (module, compId, extParam, extOption = { isResetSelect: false, isInitParam: false }) => dispatch => {
    let listParam = module.getIn(['viewItems', compId, 'listParam']);
    let newListParam = listParam ? listParam.merge(extParam) : module.get('defaultListParam').merge(extParam);
    if (extOption.isInitParam) {
        newListParam = module.get('defaultListParam').merge(extParam);
    }
    dispatch({ type: COMMON_PENDING });
    return requestPostAPI('readpackageSpecListPagedInVersion', {
        keyword: newListParam.get('keyword'),
        version: newListParam.get('version'),
        page: newListParam.get('page'),
        start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        length: newListParam.get('rowsPerPage'),
        orderColumn: newListParam.get('orderColumn'),
        orderDir: newListParam.get('orderDir')
    }).then(
        (response) => {
            dispatch({
                type: GET_CLIENTPACKAGESPEC_LISTPAGED_SUCCESS,
                compId: compId,
                listParam: newListParam,
                extOption: extOption,
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

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
        targetType: param.targetType
    });
};

export default handleActions({
    [COMMON_PENDING]: (state, action) => {
        return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
        return state.merge({
            pending: false, error: true,
            resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
            errorObj: (action.error) ? action.error : ''
        });
    },
    [CHG_LISTPARAM_DATA]: (state, action) => {
        return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
    },
    [CHG_COMPDATA_VALUE]: (state, action) => {
        return commonHandleActions.handleChangeCompValue(state, action);
    },
    [GET_CLIENTPACKAGESPEC_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },

    [GET_PACKAGESPEC_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
}, initialState);

