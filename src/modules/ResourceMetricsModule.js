import { handleActions } from "redux-actions";

import { requestPostAPI } from "components/GRUtils/GRRequester";
import * as commonHandleActions from "modules/commons/commonHandleActions";

const COMMON_PENDING = "dashboard/COMMON_PENDING";
const COMMON_FAILURE = "dashboard/COMMON_FAILURE";

const GET_RESOURCE_METRICS_SUCCESS = "dashboard/GET_RESOURCE_METRICS";

const initialState = commonHandleActions.getCommonInitialState("", "", {
  resourceMetricsInfo: Array(60).map((idx, elem) => {
      timestamp: idx;
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
      
      const initialResourceMetrics = Array.from({ length: 60 }, (_, idx) => ({ timestamp: idx, value: 0 }));

      if (statusInfo) {
        const reversed = Array.from({ length: 60 }, (_, idx) => ({ timestamp: idx, value: 0 }));
        statusInfo.map((entry, idx) => {
          const reverseIdx = minuteLength - idx - 1;
          
          // reversed[reverseIdx].timestamp = entry.timeStamp;
          
          if (resourceType === "cpu") {
            // reversed[reverseIdx].value = entry.value;
            reversed[reverseIdx].value = Math.round((100 - entry.value) * 100) / 100;
          } else if (resourceType === "net_recv") {
            reversed[reverseIdx].value = Math.round(entry.recv * 0.001 * 100) / 100; //Bytes => MegaBytes
            // reversed[reverseIdx].recv = entry.recv ; 
          } else if (resourceType === "net_sent") {
            reversed[reverseIdx].value = Math.round(entry.sent * 0.001 * 100) / 100; //Bytes => MegaBytes
          }  else {
            reversed[reverseIdx].value = Math.round(entry.value * 100) / 100;
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
