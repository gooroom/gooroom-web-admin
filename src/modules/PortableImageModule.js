import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';
import { toStringList } from 'components/GRUtils/GRPortableUtils';
import { formatDateToSimple } from 'components/GRUtils/GRDates';
import moment from "moment";

const PORTABLE_IMAGE = 'portableImage';

const COMMON_PENDING = `${PORTABLE_IMAGE}/COMMON_PENDING`;
const COMMON_FAILURE = `${PORTABLE_IMAGE}/COMMON_FAILURE}`;
const GET_IMAGE_LISTPAGED_SUCCESS = `${PORTABLE_IMAGE}/GET_IMAGE_LISTPAGED_SUCCESS`;
const DELETE_IMAGE_SUCCESS = `${PORTABLE_IMAGE}/DELETE_IMAGE_SUCCESS`;

const CHG_LISTPARAM_DATA = `${PORTABLE_IMAGE}/CHG_LISTPARAM_DATA`;
const CHG_COMPDATA_VALUE = `${PORTABLE_IMAGE}/CHG_COMPDATA_VALUE`;
const CHG_SEARCH_TYPE = `${PORTABLE_IMAGE}/CHG_SEARCH_TYPE`;

const initialState = commonHandleActions.getCommonInitialState(
  'chRegDate',
  'desc',
  {}, {
    searchType: 'ALL',
    fromDate: null,
    toDate: null,
});

export const readImageListPaged = (module, extParam, {alertActions, compId, lang}) => dispatch => {
  const newListParam = (module.getIn(['viewItems', compId])) ? 
    module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
    module.get('defaultListParam');

  dispatch({type: COMMON_PENDING});
  return requestPostAPI('portable/readImageList', {
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
      if (response.data.status && response.data.status === 'fail') {
        alertActions.showAlert({
          alertTitle: `code: ${response.data.status.resultCode}`,
          alertMsg: response.data.status.message,
        });

        //throw response.data;
      }

      dispatch({
        type: GET_IMAGE_LISTPAGED_SUCCESS,
        compId: compId,
        listParam: newListParam,
        response: response,
      });

      return response.data;
    }
  ).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error });
  });
};

export const changeCompVariable = (param) => dispatch => {
    return dispatch({
        type: CHG_COMPDATA_VALUE,
        compId: param.compId,
        name: param.name,
        value: param.value,
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

export const changeSearchType = (param) => dispatch => {
  let payload = {
    type: CHG_SEARCH_TYPE,
    compId: param.compId,
    value: param.value,
  }

  if (param.value === 'chRegDate' || param.value === 'chCreateDate') {
    payload['fromDate'] = formatDateToSimple('2020-01-01', 'YYYY-MM-DD');
    payload['toDate'] = formatDateToSimple(new Date(), 'YYYY-MM-DD');
  }

  return dispatch (payload);
};

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

export const deleteImageInfo = (ids) => dispatch => {
  dispatch ({ type: COMMON_PENDING });

  return requestPostAPI('portable/deleteImageList', {
    ids: ids ? toStringList(ids) : null,
  }).then(response => {
    try {
      if (response.data && response.data.result === 'success') {
        dispatch ({
          type: DELETE_IMAGE_SUCCESS,
          //compId: param.compId,
          //imageId: param.imageId,
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
};

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
  [GET_IMAGE_LISTPAGED_SUCCESS]: (state, action) => {
    return commonHandleActions.handleListPagedAction(state, action);
  },
  [DELETE_IMAGE_SUCCESS]: (state, action) => {
    return state;
  },
};

export default handleActions(reducer, initialState);