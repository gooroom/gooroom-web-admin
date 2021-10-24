import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import sha256 from 'sha-256-js';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import * as commonHandleActions from 'modules/commons/commonHandleActions';
import { formatDateToSimple } from 'components/GRUtils/GRDates';

const COMMON_PENDING = 'user/COMMON_PENDING';
const COMMON_FAILURE = 'user/COMMON_FAILURE';

const SHOW_REQHIST_DIALOG = 'adminUser/SHOW_ADMINHIST_DIALOG';
const CLOSE_REQHIST_DIALOG = 'adminUser/CLOSE_ADMINHIST_DIALOG';

const GET_USER_REQ_LISTPAGED_SUCCESS = 'user/GET_USER_REQ_LISTPAGED_SUCCESS';
const GET_USER_REQ_LIST_SUCCESS = 'user/GET_USER_REQ_LIST_SUCCESS';
const GET_USER_REQ_SETTING_SUCCESS = 'user/GET_USER_REQ_SETTING_SUCCESS';

const APPROVE_USER_REQ_SUCCESS = 'user/APPROVE_USER_REQ_SUCCESS';
const REJECT_USER_REQ_SUCCESS = 'user/REJECT_USER_REQ_SUCCESS';
const REVOKE_USER_REQ_SUCCESS = 'user/REVOKE_USER_REQ_SUCCESS';

const GET_SERVER_CONF = 'user/GET_SERVER_CONF';
const CHG_LISTPARAM_DATA = 'user/CHG_LISTPARAM_DATA';
const CHG_COMPDATA_VALUE = 'user/CHG_COMPDATA_VALUE';

const SHOW_USER_INFORM = 'user/SHOW_USER_INFORM';
const CLOSE_USER_INFORM = 'user/CLOSE_USER_INFORM';

const initialState = commonHandleActions.getCommonInitialState('chReqSeq', 'asc', {}, {
        //status: 'STAT010', 
        keyword: ''
    }
  );

  
export const showHistDialog = (param) => dispatch => {
  return dispatch({
      type: SHOW_REQHIST_DIALOG,
      viewItem: param.viewItem
  });
};

export const closeHistDialog = () => dispatch => {
  return dispatch({
      type: CLOSE_REQHIST_DIALOG
  });
};

export const readUserReqListPaged = (module, compId, extParam) => dispatch => {
  const newListParam = (module.getIn(['viewItems', compId])) ? 
      module.getIn(['viewItems', compId, 'listParam']).merge(extParam) : 
      module.get('defaultListParam');

  dispatch({type: COMMON_PENDING});
  return requestPostAPI('readUserReqListPaged', {
      status: newListParam.get('status'),
      keyword: newListParam.get('keyword'),
      page: newListParam.get('page'),
      start: newListParam.get('page') * newListParam.get('rowsPerPage'),
      length: newListParam.get('rowsPerPage'),
      orderColumn: newListParam.get('orderColumn'),
      orderDir: newListParam.get('orderDir')
  }).then(
      (response) => {
          dispatch({
              type: GET_USER_REQ_LISTPAGED_SUCCESS,
              compId: compId,
              listParam: newListParam,
              response: response
          });
      }
  ).catch(error => {
      dispatch({ type: COMMON_FAILURE, error: error });
  });
};

export const readUserReqList = (param) => dispatch => {
  dispatch({type: COMMON_PENDING});
  return requestPostAPI('readUserReqList', { 'userId': param.userId }).then(
      (response) => {
          dispatch({
              type: GET_USER_REQ_LIST_SUCCESS,
              compId: param.compId,
              targetType: param.targetType,
              response: response
          });
      }
  ).catch(error => {
      dispatch({ type: COMMON_FAILURE, error: error });
  });
}

// approve
export const approveUserReq = (param) => dispatch => {
  dispatch({type: COMMON_PENDING});
  return requestPostAPI('approvalUserReq', {'reqSeqs': param.checkedIds.toArray()}).then(
      (response) => {
          try {
              if(response.data.status && response.data.status.result === 'success') {
                  dispatch({
                      type: APPROVE_USER_REQ_SUCCESS,
                      compId: param.compId
                  });
              }
              return response.data;
          } catch(error) {
              dispatch({ type: COMMON_FAILURE, error: error });
              return error;
          }
      }
  ).catch(error => {
      dispatch({ type: COMMON_FAILURE, error: error });
  });
};

// reject
export const rejectUserReq = (param) => dispatch => {
  dispatch({type: COMMON_PENDING});
  return requestPostAPI('denyUserReq', {'reqSeqs': param.checkedIds.toArray()}).then(
      (response) => {
          try {
              if(response.data.status && response.data.status.result === 'success') {
                  dispatch({
                      type: REJECT_USER_REQ_SUCCESS,
                      compId: param.compId
                  });
              }
              return response.data;
          } catch(error) {
              dispatch({ type: COMMON_FAILURE, error: error });
              return error;
          }
      }
  ).catch(error => {
      dispatch({ type: COMMON_FAILURE, error: error });
  });
};

// delete
export const revokeUserReq = (param) => dispatch => {
  dispatch({type: COMMON_PENDING});
  return requestPostAPI('revokeUsbPermissionFromAdmin', {'reqSeq': param.reqSeq}).then(
      (response) => {
          try {
              if(response.data.status && response.data.status.result === 'success') {
                  dispatch({
                      type: REVOKE_USER_REQ_SUCCESS,
                      compId: param.compId
                  });
              }
              return response.data;
          } catch(error) {
              dispatch({ type: COMMON_FAILURE, error: error });
              return error;
          }
      }
  ).catch(error => {
      dispatch({ type: COMMON_FAILURE, error: error });
  });
};

export const getServerConf = (param) => dispatch => {
  dispatch({type : COMMON_PENDING});
  return requestPostAPI('readCurrentMgServerConf', {}).then(
    (response) => {
      const { data } = response.data;
      if(data && data.length > 0) {
        dispatch({ // for user mstr spec
          type: GET_SERVER_CONF,
          compId: param.compId,
          value: data[0].maxMediaCnt
        });

        dispatch({ // for user req mstr
          type: GET_USER_REQ_SETTING_SUCCESS, 
          compId: param.compId,
          value: data[0]
        })
      }
    })
}

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

export const showInform = (param) => dispatch => {
  return dispatch({
      type: SHOW_USER_INFORM,
      compId: param.compId,
      selectId: (param.viewItem) ? param.viewItem.get('userId') : '',
      viewItem: param.viewItem
  });
};

export const closeInform = (param) => dispatch => {
  return dispatch({
      type: CLOSE_USER_INFORM,
      compId: param.compId
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
  [SHOW_REQHIST_DIALOG]: (state, action) => {
    return state.merge({
        editingItem: action.viewItem,
        histDialogOpen: true
    });
  },
  [CLOSE_REQHIST_DIALOG]: (state, action) => {
      return state.delete('editingItem').merge({
          histDialogOpen: false
      });
  },
  [GET_USER_REQ_LISTPAGED_SUCCESS]: (state, action) => {
      return commonHandleActions.handleListPagedAction(state, action);
  },
  [GET_USER_REQ_LIST_SUCCESS]: (state, action) => {
    return commonHandleActions.handleListAction(state, action, 'userId');
  },
  [APPROVE_USER_REQ_SUCCESS]: (state, action) => {
    return state;
  },
  [REJECT_USER_REQ_SUCCESS]: (state, action) => {
    return state;
  },
  [REVOKE_USER_REQ_SUCCESS]: (state, action) => {
    return state;
  },
  [GET_USER_REQ_SETTING_SUCCESS]: (state, action) => {
    return state.setIn(['viewItems', action.compId, 'listParam', 'serverConf'], action.value)
  },
  [GET_SERVER_CONF]: (state, action) => {
    return state.setIn(['viewItems', action.compId, 'userReqList', 'maxMediaCnt'], action.value)
  },
  [CHG_LISTPARAM_DATA]: (state, action) => {
    return state.setIn(['viewItems', action.compId, 'listParam', action.name], action.value);
  },
  [CHG_COMPDATA_VALUE]: (state, action) => {
    return commonHandleActions.handleChangeCompValue(state, action);
  },
  [SHOW_USER_INFORM]: (state, action) => {
    return commonHandleActions.handleShowInformAction(state, action);
  },
  [CLOSE_USER_INFORM]: (state, action) => {
      return commonHandleActions.handleCloseInformAction(state, action);
  },
}, initialState);