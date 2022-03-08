import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GRUtils/GRRequester';

import { getDuplicateStringArray } from 'components/GRUtils/GRPortableUtils';
import { getInvalidEmailInJson, isEmpty } from 'components/GRUtils/GRValidationUtils';
import { toStringList } from 'components/GRUtils/GRPortableUtils';

import moment from 'moment';
import sha256 from 'sha-256-js';
import { formatDateToSimple } from 'components/GRUtils/GRDates';

import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';
import { isValidPassword } from 'components/GRUtils/GRValidationUtils';

export const PORTABLE_BULK = 'portableBulk';
const COMMON_PENDING = `${PORTABLE_BULK}/COMMON_PENDING`;
const COMMON_FAILURE = `${PORTABLE_BULK}/COMMON_FAILURE`;

const INIT_BULK = `${PORTABLE_BULK}/INIT_BULK`;
const SET_CSVITEMS_SUCCESS = `${PORTABLE_BULK}/SET_CSVITEMS_SUCCESS`;
const SET_CSVITEMS_FAILURE = `${PORTABLE_BULK}/SET_CSVITEMS_FAILURE`;

const SET_PASSWD = `${PORTABLE_BULK}/SET_PASSWD`;
const SET_DATE = `${PORTABLE_BULK}/SET_DATE`;

const SET_STATUS_ALL = `${PORTABLE_BULK}/SET_STATUS_ALL`;

const CREATE_BULK_SUCCESS = `${PORTABLE_BULK}/CREATE_BULK_SUCCESS`;
const OPEN_CSV_GUIDE = `${PORTABLE_BULK}/OPEN_CSV_GUIDE`;
const INVALID_CSV = `${PORTABLE_BULK}/INVALID_CSV`

const initialState = {
  pending: false,
  error: null,
  resultMsg: '',

  /* csv */
  csvItems: [],
  invalidIds: [],
  invalidEmails: [],
  csvStatus: INPUT_STATUS.INIT,

  /* password */
  passwd: '',
  confirm: '',
  passwdStatus: INPUT_STATUS.INIT,

  /* date */
  beginDate: moment(new Date().toString()).format('YYYY-MM-DD'),
  endDate: moment(new Date().toString()).format('YYYY-MM-DD'),
  dateStatus: INPUT_STATUS.SUCCESS,

  isOpenCsvGuide: false,
};

const makeParameter = (module, params, adminId) => {
  return params.reduce((acc, cur, index) => {
    const userPw = sha256(cur.ID + sha256(cur.Password));
    const isoPw = module['passwd'];

    const obj = {
      [`portableListVO[${index}].userId`]: cur.ID,
      [`portableListVO[${index}].userNm`]: cur.Name,
      [`portableListVO[${index}].userPw`]: userPw,
      [`portableListVO[${index}].notiEmail`]: cur.Email,
      [`portableListVO[${index}].isoPw`]: isoPw,
      [`portableListVO[${index}].beginDt`]: formatDateToSimple(module['beginDate'], 'YYYY-MM-DD'),
      [`portableListVO[${index}].expiredDt`]: formatDateToSimple(module['endDate'], 'YYYY-MM-DD'),
      [`portableListVO[${index}].adminId`]: adminId,
      [`portableListVO[${index}].bulk`]: 1
    };

    return Object.assign(acc, obj);
  }, {});
}

export const initBulkState = () => dispatch => {
  return dispatch({ type: INIT_BULK });
}

export const openCsvGuide = (isOpen) => dispatch => {
  return dispatch({
    type: OPEN_CSV_GUIDE,
    isOpenCsvGuide: isOpen,
  });
}

export const setCsvStatus = (status) => dispatch => {
  return dispatch({
    type: INVALID_CSV,
    csvStatus: INPUT_STATUS.INVALID,
  })
}

export const uploadCsvItems = (items) => dispatch => {
  if (items.length === 0) {
    return dispatch({ type: SET_CSVITEMS_FAILURE });
  }

  const ids = items.map((item) => item.ID);
  const invalidIds = getDuplicateStringArray(ids);
  const invalidEmails = getInvalidEmailInJson(items, 'Email');

  const isValid = invalidIds.length === 0 && invalidEmails.length === 0
  if (!isValid) {
    return dispatch({
      type: SET_CSVITEMS_FAILURE,
      invalidIds: invalidIds,
      invalidEmails: invalidEmails,
    });
  }

  //return dispatch({ type: SET_CSVITEMS_SUCCESS, csvItems: items });

  return requestPostAPI('portable/checkUserId', {
      ids: toStringList(ids)
    }).then((response) => {
      if (response.data.status && response.data.status.result === 'success') {
        return dispatch ({
          type: SET_CSVITEMS_SUCCESS,
          csvItems: items,
        });
      } else if (response.data.status && response.data.status.result === 'fail') {
        return dispatch({
          type: SET_CSVITEMS_FAILURE,
          csvItems: items,
          error: response.data,
        });
//        dispatch({
//          type: SET_CSVITEMS_FAILURE,
//          invalidIds: [],
//          invalidEmails: [],
//          error: error,
//        });
      }
    }).catch(error => {
      dispatch({ type: COMMON_FAILURE, error: error });
    });
}

export const setPasswd = (passwd, confirm) => dispatch => {
  const param = {
    type: SET_PASSWD,
    passwd: passwd,
    confirm: confirm,
    status: INPUT_STATUS.SUCCESS,
  };

  if (isEmpty(passwd)) {
    param['status'] = INPUT_STATUS.EMPTY;
  } else if (!isValidPassword(passwd)) {
    param['status'] = INPUT_STATUS.INVALID;
  } else if (!isEmpty(confirm) && passwd !== confirm) {
    param['status'] = INPUT_STATUS.FAILURE;
  } else if (isEmpty(confirm)) {
    param['status'] = INPUT_STATUS.INIT;
  } else if (!isEmpty(confirm) && passwd === confirm) {
    param['status'] = INPUT_STATUS.SUCCESS;
  }

  return dispatch(param);
}

export const setDate = (module, date, isBegin) => dispatch => {
  let beginDate = date;
  let endDate = date;
  let status = INPUT_STATUS.SUCCESS;

  if (isBegin) {
    endDate = module['endDate'];
  } else {
    beginDate = module['beginDate'];
  }

  if (moment(moment(endDate)).isBefore(moment(beginDate))) {
    status = INPUT_STATUS.FAILURE;
  }

  return dispatch({
    type: SET_DATE,
    beginDate: beginDate,
    endDate: endDate,
    status: status,
  });
}

export const setStatusAll = (status) => dispatch => {
  dispatch({
    type: SET_STATUS_ALL,
    ...status,
  });
}

export const createBulkItems = (module, adminId) => dispatch => {
  dispatch({ type: COMMON_PENDING });

  return requestPostAPI('portable/registerPortableDataList', 
    makeParameter(module, module['csvItems'], adminId)
  ).then(
    (response) => {
      if (response.data.status && response.data.status.result === 'success') {
        dispatch({
          type: INIT_BULK,
          response: response,
        });
      } else {
        dispatch({
          type: COMMON_FAILURE,
          error: response,
        });
      }

      return response.data;
    }
  ).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error });
    throw error;
  });
}

const reducer = {
  [INIT_BULK]: (state, action) => {
    return initialState;
  },
  [COMMON_PENDING]: (state, action) => {
    return {
      ...state,
      pending: true,
      error: null,
    };
  },
  [COMMON_FAILURE]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: action.error,
      resultMsg: (action.error && action.error.status) ? action.error.status : '',
      errorObj: (action.error) ? action.error : '',
    };
  },
  [SET_CSVITEMS_SUCCESS]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: false,
      csvItems: action.csvItems,
      invalidIds: [],
      invalidEmails: [],
      csvStatus: INPUT_STATUS.SUCCESS,
    }
  },
  [SET_CSVITEMS_FAILURE]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: action.error,
      invalidIds: action.invalidIds,
      invalidEmails: action.invalidEmails,
      csvStatus: INPUT_STATUS.FAILURE,
    }
  },
  [SET_PASSWD]: (state, action) => {
    return {
      ...state,
      passwd: action.passwd,
      confirm: action.confirm,
      passwdStatus: action.status,
    }
  },
  [SET_DATE]: (state, action) => {
    return {
      ...state,
      beginDate: action.beginDate,
      endDate: action.endDate,
      dateStatus: action.status,
    }
  },
  [INVALID_CSV]: (state, action) => {
    return {
      ...state,
      csvStatus: action.csvStatus,
    }
  },
  [SET_STATUS_ALL]: (state, action) => {
    return {
      ...state,
      csvStatus: action.csvStatus,
      passwdStatus: action.passwdStatus,
      dateStatus: action.dateStatus,
    }
  },
  [CREATE_BULK_SUCCESS]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: null,
    }
  },
  [OPEN_CSV_GUIDE]: (state, action) => {
    return {
      ...state,
      isOpenCsvGuide: action.isOpenCsvGuide,
    }
  },
}

export default handleActions(reducer, initialState);