import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const COMMON_PENDING = 'clientPackageVersion/COMMON_PENDING';
const COMMON_FAILURE = 'clientPackageVersion/COMMON_FAILURE';
const CHG_LISTPARAM_DATA = 'clientPackageVersion/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'clientPackageVersion/CHG_COMPDATA_VALUE';
const GET_PACKAGEVERSION_LISTPAGED_SUCCESS = 'clientPackageVersion/GET_PACKAGEVERSION_LISTPAGED_SUCCESS';
const GET_PACKAGEVERSION_COMPARE_SUCCESS = 'clientPackageVersion/GET_PACKAGEVERSION_COMPARE_SUCCESS';
const SHOW_PACKAGE_VERSION = 'clientPackageVersion/SHOW_PACKAGE_VERSION';

// ...
// const initialState = commonHandleActions.getCommonInitialState('chPackageId', 'asc', { dialogTabValue: 0 });

const initialState = commonHandleActions.getCommonInitialState('', '', {
});

//버전 리스트 API
export const readPackageSpecList = (module, compId, extParam) => dispatch => {
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
    return requestPostAPI('readPackageSpecList', {
        keyword: newListParam.get('keyword')
    }).then(
        (response) => {
            dispatch({
                type: GET_PACKAGEVERSION_LISTPAGED_SUCCESS,
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

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
        targetType: param.targetType
    });
};

export const showPackageVersion = (param) => dispatch => {
    return dispatch({
        type: SHOW_PACKAGE_VERSION,
        compId: param.compId,
        selectId: (param.viewItem) ? param.viewItem.get('isoVer') : '',
        viewItem: param.viewItem
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
    [GET_PACKAGEVERSION_LISTPAGED_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [GET_PACKAGEVERSION_COMPARE_SUCCESS]: (state, action) => {
        return commonHandleActions.handleListPagedAction(state, action);
    },
    [SHOW_PACKAGE_VERSION]: (state, action) => {
        return commonHandleActions.handleShowInformAction(state, action);
    },
}, initialState);

