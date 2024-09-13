import { handleActions } from "redux-actions";

import { requestPostAPI } from "components/GRUtils/GRRequester";
import * as commonHandleActions from "modules/commons/commonHandleActions";

const COMMON_PENDING = "dashboard/COMMON_PENDING";
const COMMON_FAILURE = "dashboard/COMMON_FAILURE";

const GET_RESOURCE_METRICS_SUCCESS = "dashboard/GET_RESOURCE_METRICS";

const initialState = commonHandleActions.getCommonInitialState("", "", {
  resourceMetricsInfo: Array(60).map((idx, elem) => {
      timeStamp: idx;
      value: 0;
      recv: 0;
      sent: 0;
    }),
  resourceType: 'cpu',
});

export const readResourceMetrics = (param) => (dispatch) => {
  return requestPostAPI("readResourceMetrics", param).then((response) => {
    dispatch({
      type: GET_RESOURCE_METRICS_SUCCESS,
      resourceType: param.resourceType,
      response: response,
    });
  }).catch(error => {
    dispatch({ type: COMMON_FAILURE, error: error });
  })
};

export default handleActions(
  {
    [COMMON_PENDING]: (state, action) => {
      return state.merge({ pending: true, error: false });
    },
    [COMMON_FAILURE]: (state, action) => {
      return state.merge({
        pending: false,
        error: true,
        resultMsg:
          action.error.data && action.error.data.status
            ? action.error.data.status.message
            : "",
        errorObj: action.error ? action.error : "",
      });
    },
    [GET_RESOURCE_METRICS_SUCCESS]: (state, action) => {
      const statusInfo =
        action.response.data && action.response.data.data
          ? action.response.data.data
          : null;
      
      const minuteLength = 60;
      const resourceType = action.resourceType;
      
      const initialResourceMetrics = Array.from({ length: minuteLength }, (elem, idx) => (
        resourceType === "net" 
          ? { timeStamp: idx, recv: null, sent: null }
          : { timeStamp: idx, value: null }
      ));
    

      if (statusInfo) {
        
        const reversed = initialResourceMetrics;
        statusInfo.map((entry, idx) => {
          const reverseIdx = minuteLength - idx - 1;
          
          if (resourceType === "net") {
            reversed[reverseIdx].recv = entry.recv;
            reversed[reverseIdx].sent = entry.sent;
          } else {
            reversed[reverseIdx].value = entry.value;
          }
        });

        return state.merge({
          resourceMetricsInfo: reversed,
          resourceType: resourceType,
        });
      } else {
        return state.merge({
          resourceMetricsInfo: initialResourceMetrics,
          resourceType: resourceType,
        })
      }
    },
  },
  initialState
);
