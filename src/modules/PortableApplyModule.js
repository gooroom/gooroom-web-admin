import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';
import { toStringList } from 'components/GRUtils/GRPortableUtils';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import moment from 'moment';

const PORTABLE_APPLY = 'portableApply';

const COMMON_PENDING = `${PORTABLE_APPLY}/COMMON_PENDING`;
const COMMON_FAILURE = `${PORTABLE_APPLY}/COMMON_FAILURE}`;
const COMMON_SUCCESS = `${PORTABLE_APPLY}/COMMON_SUCCESS`
const REAPPROVE_STATUS = `${PORTABLE_APPLY}/REAPPROVE_STATUS`;
const GET_APPLY_LISTPAGED_SUCCESS = `${PORTABLE_APPLY}/GET_APPLY_LISTPAGED_SUCCESS`;
const APPROVE_ALL_APPLYINFO_SUCCESS = `${PORTABLE_APPLY}/APPROVE_ALL_APPLYINFO`;
const DELETE_APPLYINFO_SUCCESS = `${PORTABLE_APPLY}/DELETE_APPLYINFO_SUCCESS`;

const CHG_LISTPARAM_DATA = `${PORTABLE_APPLY}/CHG_LISTPARAM_DATA`;
const CHG_COMPDATA_VALUE = `${PORTABLE_APPLY}/CHG_COMPDATA_VALUE`;
const CHG_SEARCH_TYPE = `${PORTABLE_APPLY}/CHG_SEARCH_TYPE`;
const OPEN_IMAGE_PATH = `${PORTABLE_APPLY}/OPEN_IMAGE_PATH`;

const initialState = commonHandleActions.getCommonInitialState(
  'chRegDate',
  'desc',
  {}, {
    searchType: 'ALL',
    fromDate: null,
    toDate: null,
    reApproveCnt: 0,
    isOpenImagePath: false,
    imagePath: '',
});

export const openImagePathDetail = (isOpen, imagePath) => dispatch => {
  return dispatch({
    type: OPEN_IMAGE_PATH,
    isOpenImagePath: isOpen,
    imagePath: imagePath,
  })
}

export const readApplyListPaged = (module, extParam, { alertActions, compId, lang }) => dispatch => {
  const newListParam = (module.getIn(['viewItems', compId])) ? 
    module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
    module.get('defaultListParam');

  dispatch({type: COMMON_PENDING});
  return requestPostAPI('portable/readPortableDataListPaged', {
    page: newListParam.get('page'),
    start: newListParam.get('page') * newListParam.get('rowsPerPage'),
    length: newListParam.get('rowsPerPage'),
    orderColumn: newListParam.get('orderColumn'),
    orderDir: newListParam.get('orderDir'),
    keyword: newListParam.get('keyword'),
    searchType: newListParam.get('searchType'),
    fromDate: newListParam.get('fromDate') ? newListParam.get('fromDate') : formatDateToSimple('2020-01-01', 'YYYY-MM-DD'),
    toDate: newListParam.get('toDate') ? newListParam.get('toDate') : formatDateToSimple(new Date(), 'YYYY-MM-DD'),
    lang: lang,
    //adminId: 
  }).then(
    (response) => {
      if (response.data.status && response.data.status.result === 'fail') {
        //alertActions.showAlert({
        //  alertTitle: `code: ${response.data.status.resultCode}`,
        //  alertMsg: response.data.status.message,
        //});

      }

      dispatch({
        type: GET_APPLY_LISTPAGED_SUCCESS,
        compId: compId,
        listParam: newListParam,
        response: response,
      });

      return response.data;
    }
  ).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error });
  });
}

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
    });
}

export const changeSearchType = (param) => dispatch => {
  let payload = {
    type: CHG_SEARCH_TYPE,
    compId: param.compId,
    value: param.value,
  };

  if (param.value === 'chRegDate') {
    payload['fromDate'] = formatDateToSimple('2020-01-01', 'YYYY-MM-DD');
    payload['toDate'] = formatDateToSimple(new Date(), 'YYYY-MM-DD');
  }

  return dispatch (payload);
}

export const changeSearchDate = (module, param) => dispatch => {
  if (param.name === 'toDate') {
    const fromDate = module.getIn(['viewItems', param.compId, 'listParam', 'fromDate']);

    if (moment(fromDate).isAfter(param.value))
      param.value = fromDate;
      //return false;
  }

  dispatch({
    type: CHG_LISTPARAM_DATA,
    compId: param.compId,
    name: param.name,
    value: param.value
  });

  return true;
}

export const changeListParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_LISTPARAM_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
}

export const approvePortable = (module, ptgrId, compId) => dispatch => {
  dispatch ({ type: COMMON_PENDING });

  // 리스트로 변경
  return requestPostAPI(`portable/updateApprove`, {
    ptgrId: ptgrId
  }).then(response => {
    try {
      if (response.data && response.data.result === 'success') {
        dispatch({
          type: COMMON_SUCCESS,
        });
      }

      return response;
    } catch (error) {
      dispatch({ type: COMMON_FAILURE, error: error, });

      return error;
    }
  }).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error, });

    return error;
  });
}

export const reApproveStatus = (compId) => dispatch => {
  dispatch({ type: COMMON_PENDING })

  return requestPostAPI('portable/readReapproveStatus')
    .then(response => {
      try {
        let reApproveCnt = 0;

        if (response.data && response.data.status && response.data.status.result === 'success') {
          reApproveCnt = response.data.data[0];
        }

        dispatch({
          type: REAPPROVE_STATUS,
          data: reApproveCnt,
          compId: compId,
          response: response,
        });

        return response;
      } catch (error) {
        dispatch({ type: COMMON_FAILURE, error: error });

        return error;
      }
    });
}

export const reApproveAllPortable = (adminId) => dispatch => {
  dispatch({ type: COMMON_PENDING });

  return requestPostAPI('portable/updateAllApprove', {
    adminId: adminId
  }).then(response => {
    try {
      if (response.data && response.data.result === 'success') {
        dispatch ({
          type: APPROVE_ALL_APPLYINFO_SUCCESS,
          response: response,
        });
      }

      return response;
    } catch (error) {
      dispatch({ type: COMMON_FAILURE, error: error });

      return error;
    }
  }).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error });

    return error;
  });
}

export const deletePortable = (ptgrIds) => dispatch => {
  dispatch ({ type: COMMON_PENDING });

  //const ptgrIds = module.getIn(['viewItems', compId, 'checkedIds']);

  return requestPostAPI('portable/deletePortableDataList', {
    ids: ptgrIds ? toStringList(ptgrIds) : null,
  }).then(response => {
    try {
      if (response.data && response.data.result === 'success') {
        dispatch ({
          type: DELETE_APPLYINFO_SUCCESS,
          //compId: param.compId,
          //ptgrId: param.ptgrId,
          response: response,
        });
      }

      return response;
    } catch (error) {
      dispatch({ type: COMMON_FAILURE, error: error });

      return error;
    }
  }).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error });

    return error;
  });
}

export const reducer = {
  [COMMON_PENDING]: (state, action) => {
    return state.merge({ pending: true, error: false });
  },
  [COMMON_SUCCESS]: (state, action) => {
    return state.merge({ pending: false, error: false });
  },
  [COMMON_FAILURE]: (state, action) => {
    return state.merge({ pending: false, error: true,
      resultMsg: (action.error && action.error.status) ? action.error.status.message : '',
      errorObj: (action.error) ? action.error : ''
    });
  },
  [REAPPROVE_STATUS]: (state, action) => {
    return state.merge({reApproveCnt: action.data});
  },
  [CHG_COMPDATA_VALUE]: (state, action) => {
    return commonHandleActions.handleChangeCompValue(state, action);
  },
  [CHG_LISTPARAM_DATA]: (state, action) => {
    return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
  },
  [CHG_SEARCH_TYPE]: (state, action) => {
    return state.setIn(['viewItems', action.compId, 'listParam', 'fromDate'], action.fromDate)
                .setIn(['viewItems', action.compId, 'listParam', 'toDate'], action.toDate)
                .setIn(['viewItems', action.compId, 'listParam', 'keyword'], '')
                .setIn(['viewItems', action.compId, 'listParam', 'searchType'], action.value);
  },
  [GET_APPLY_LISTPAGED_SUCCESS]: (state, action) => {
    return commonHandleActions.handleListPagedAction(state, action);
  },
  [DELETE_APPLYINFO_SUCCESS]: (state, action) => {
    return state;
  },
  [OPEN_IMAGE_PATH]: (state, action) => {
    return state.merge({
      isOpenImagePath: action.isOpenImagePath,
      imagePath: action.imagePath,
    });
  },
}

export default handleActions(reducer, initialState);