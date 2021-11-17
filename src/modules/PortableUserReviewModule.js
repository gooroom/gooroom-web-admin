import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import moment from 'moment';

const PORTABLE_USER_REVIEW = 'portableReview';

const COMMON_PENDING = `${PORTABLE_USER_REVIEW}/COMMON_PENDING`;
const COMMON_FAILURE = `${PORTABLE_USER_REVIEW}/COMMON_FAILURE}`;
const GET_REVIEW_LISTPAGED_SUCCESS = `${PORTABLE_USER_REVIEW}/GET_REVIEW_LISTPAGED_SUCCESS`;

const CHG_LISTPARAM_DATA = `${PORTABLE_USER_REVIEW}/CHG_LISTPARAM_DATA`;
const CHG_COMPDATA_VALUE = `${PORTABLE_USER_REVIEW}/CHG_COMPDATA_VALUE`;
const CHG_SEARCH_TYPE = `${PORTABLE_USER_REVIEW}/CHG_SEARCH_TYPE`;

const initialState = commonHandleActions.getCommonInitialState(
  'chRegDate',
  'asc',
  {}, {
    searchType: 'ALL',
    fromDate: null,
    toDate: null,
});

export const readCert = (certId) => dispatch => {
  return requestPostAPI('portable/readCert', {
  certId: certId,
  }).then(response => {
    console.log(response);
  }).catch(error => {
    console.log(error);
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

export const readApplyListPaged = (module, extParam, { compId, lang }) => dispatch => {
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
    isUser: true,
  }).then(
    (response) => {
      dispatch({
        type: GET_REVIEW_LISTPAGED_SUCCESS,
        compId: compId,
        listParam: newListParam,
        response: response,
      });

      return response.data;
    }
  ).catch(error => {
    return dispatch({ type: COMMON_FAILURE, error: error });
  });
}

export const changeListParamData = (param) => dispatch => {
    return dispatch({
        type: CHG_LISTPARAM_DATA,
        compId: param.compId,
        name: param.name,
        value: param.value
    });
}

export const reducer = {
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
  [CHG_LISTPARAM_DATA]: (state, action) => {
    return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
  },
  [CHG_SEARCH_TYPE]: (state, action) => {
    return state.setIn(['viewItems', action.compId, 'listParam', 'fromDate'], action.fromDate)
                .setIn(['viewItems', action.compId, 'listParam', 'toDate'], action.toDate)
                .setIn(['viewItems', action.compId, 'listParam', 'keyword'], '')
                .setIn(['viewItems', action.compId, 'listParam', 'searchType'], action.value);
  },
  [GET_REVIEW_LISTPAGED_SUCCESS]: (state, action) => {
    return commonHandleActions.handleListPagedAction(state, action);
  },
}

export default handleActions(reducer, initialState);