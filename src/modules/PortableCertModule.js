import { handleActions } from 'redux-actions';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

const PORTABLE_CERT = 'portableCert';

const COMMON_PENDING = `${PORTABLE_CERT}/COMMON_PENDING`;
const COMMON_FAILURE = `${PORTABLE_CERT}/COMMON_FAILURE}`;
const OPEN_CERT_DIALOG = `${PORTABLE_CERT}/OPEN_CERT_DIALOG`
const CLOSE_CERT_DIALOG = `${PORTABLE_CERT}/CLOSE_CERT_DIALOG`

const initialState = {
  isOpen: false,
  userId: '',
  createDate: null,
  transferDate: null,
  pending: true,
  error: null,
};

export const openCertDialog = (isOpen, certId, userId) => dispatch => {
  if (isOpen) {
    return requestPostAPI('portable/readCert', {
      certId: certId,
    }).then(response => {
      if (response && response.data && response.data.status.result === 'success') {
        const data = response.data.data[0];
        return dispatch({
          type: OPEN_CERT_DIALOG,
          isOpen: isOpen,
          userId: userId,
          createDate: data.createdDt,
          transferDate: data.transferDt,
        });
      } else {
        return dispatch({
          type: COMMON_FAILURE,
          error: response
        });
      }
    }).catch(error => {
      return dispatch({ type: COMMON_FAILURE, error: error });
    });
  } else {
    return dispatch({
      type: CLOSE_CERT_DIALOG,
      isOpen: isOpen,
    });
  }
}

export const reducer = {
  [COMMON_PENDING]: (state, action) => {
    return {
      ...state,
      pending: true,
      error: null,
    }
  },
  [COMMON_FAILURE]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: action.error,
    }
  },
  [OPEN_CERT_DIALOG]: (state, action) => {
    return {
      ...state,
      isOpen: action.isOpen,
      userId: action.userId,
      createDate: action.createDate,
      transferDate: action.transferDate,
    }
  },
  [CLOSE_CERT_DIALOG]: (state, action) => {
    return {
      ...state,
      isOpen: action.isOpen,
    }
  }
}

export default handleActions(reducer, initialState);