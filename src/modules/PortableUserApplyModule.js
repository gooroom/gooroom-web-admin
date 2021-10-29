import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { Map, fromJS } from 'immutable';

import { isEmpty, isValidEmail } from 'components/GRUtils/GRValidationUtils';
import { INPUT_STATUS } from 'components/GRComponents/GRPortableConstants';

import moment from 'moment';
import sha256 from 'sha-256-js';
import { formatDateToSimple } from 'components/GRUtils/GRDates';

export const PORTABLE_USER_APPLY = 'portableClient';
const COMMON_PENDING = `${PORTABLE_USER_APPLY}/COMMON_PENDING`;
const COMMON_FAILURE = `${PORTABLE_USER_APPLY}/COMMON_FAILURE`;

const INIT_APPLY = `${PORTABLE_USER_APPLY}/INIT_APPLY`;
const SET_PASSWD = `${PORTABLE_USER_APPLY}/SET_PASSWD`;

const SET_DATE = `${PORTABLE_USER_APPLY}/SET_DATE`;

const SET_NOTI_GPMS = `${PORTABLE_USER_APPLY}/SET_NOTI_GPMS`
const SET_EMAIL = `${PORTABLE_USER_APPLY}/SET_EMAIL`;

const SET_STATUS_ALL = `${PORTABLE_USER_APPLY}/SET_STATUS_ALL`;

const initialState = {
  beginDate: moment(new Date().toString()).format('YYYY-MM-DD'),
  endDate: moment(new Date().toString()).format('YYYY-MM-DD'),
  dateStatus: INPUT_STATUS.SUCCESS,

  passwd: '',
  confirm: '',
  passwdStatus: INPUT_STATUS.INIT,

  email: '',
  emailStatus: INPUT_STATUS.INIT,
  notiType: '',
  hasApplied: false,
};

const makeParameter = (module, id) => {
  return Object.assign({
    ['userId']: id,
    ['isoPw']: module['passwd'],
    ['beginDt']: formatDateToSimple(module['beginDate']),
    ['expiredDt']: formatDateToSimple(module['endDate']),
    ['email']: module['email'],
    ['notiType']: module['notiType'],
  });
}

export const initClientApply = () => dispatch => {
  return dispatch ({ type: INIT_APPLY });
}

export const getHasApplied = () => dispatch => {

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

  if (moment(endDate).isBefore(beginDate)) {
    status = INPUT_STATUS.FAILURE;
  }

  return dispatch({
    type: SET_DATE,
    beginDate: beginDate,
    endDate: endDate,
    status: status,
  });
}

export const setPasswd = (passwd, confirm) => dispatch => {
  const param = {
    type: SET_PASSWD,
    passwd: passwd,
    confirm: confirm,
    status: INPUT_STATUS.INIT,
  };

  if (isEmpty(passwd)) {
    param['status'] = INPUT_STATUS.EMPTY;
  } else if (!isEmpty(confirm) && passwd !== confirm) {
    param['status'] = INPUT_STATUS.FAILURE;
  } else if (!isEmpty(confirm) && passwd === confirm) {
    param['status'] = INPUT_STATUS.SUCCESS;
  }

  return dispatch(param);
}

export const setEmail = (email) => dispatch => {
  const isValid = isValidEmail(email);
  let status = INPUT_STATUS.FAILURE;

  if (isValid) {
    status = INPUT_STATUS.SUCCESS;
  }

  dispatch({
    type: SET_EMAIL,
    email: email,
    status: status,
   });
}

export const setNotiType = (notiType) => dispatch => {
  dispatch({
    type: SET_NOTI_GPMS,
    notiType: notiType,
  })
}

export const setStatusAll = (status) => dispatch => {
  dispatch({
    type: SET_STATUS_ALL,
    ...status,
  })
}

export const registPortable = (module, id) => dispatch => {
  return requestPostAPI('portable/registerPortableData',
    makeParameter(module, id)
  ).then(
    (response) => {
      if (response.data && response.data.result === 'success') {
        dispatch ({
          type: INIT_APPLY,
        });
      } else if (response.data.status && response.data.status.result === 'fail') {
        throw dispatch({
          type: COMMON_FAILURE,
          error: response.data,
        })
      }

      return response;
  }).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error });
    throw error;
  });
}

const reducer = {
  [INIT_APPLY]: (state, action) => {
    return initialState;
  },
  [COMMON_PENDING]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: null,
    }
  },
  [COMMON_FAILURE]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: action.error,
      resultMsg: (action.error && action.error.status) ? action.error.status : '',
      errorObj: (action.error) ? action.error : '',
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
  [SET_PASSWD]: (state, action) => {
    return {
      ...state,
      passwd: action.passwd,
      confirm: action.confirm,
      passwdStatus: action.status,
    }
  },
  [SET_EMAIL]: (state, action) => {
    return {
      ...state,
      email: action.email,
      emailStatus: action.status,
    }
  },
  [SET_NOTI_GPMS]: (state, action) => {
    return {
      ...state,
      notiType: action.notiType,
    }
  },
  [SET_STATUS_ALL]: (state, action) => {
    return {
      ...state,
      emailStatus: action.emailStatus,
      passwdStatus: action.passwdStatus,
      dateStatus: action.dateStatus,
    }
  },
};

export default handleActions(reducer, initialState);