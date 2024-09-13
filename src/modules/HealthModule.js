import {
  grRequestGetAPI,
  requestPostAPI,
} from "components/GRUtils/GRRequester";
import { getCommonInitialState } from "./commons/commonHandleActions";
import { handleActions } from "redux-actions";

const COMMON_FAILURE = "gpmsmodule/COMMON_FAILURE";

const GET_GPMS_MODULE_STATUS = "gpmsmodule/GET_GPMS_MODULE_STATUS";
const GET_GPMS_MODULE_STATUS_ALL = "gpmsmodule/GET_GPMS_MODULE_STATUS_ALL";
const CONTROL_GPMS_MODULE = "gpmsmodule/CONTROL_GPMS_MODULE";

export const GPMSModuleType = {
  GKM: "GKM",
  GRM: "GRM",
  GLM: "GLM",
};

export const GPMSModuleStatusType = {
  ONLINE: "online",
  OFFLINE: "offline",
  ERROR: "error",
};

export const GPMSModuleActionType = {
  START: "start",
  SHUTDOWN: "shutdown",
  RESTART: "restart",
};

const initialData = Object.values(GPMSModuleType).reduce((acc, cur) => {
  acc[cur] = {
    moduleType: cur,
    lastActivatedTime: 0,
    moduleActionType: null,
    status: null,
  };
  return acc;
}, {});

const initialState = getCommonInitialState("", "").merge(...initialData);

export const getGPMSModuleStatus = (param) => (dispatch) => {
  const moduleType = param.toUpperCase();
  if (!Object.values(GPMSModuleType).includes(moduleType)) return;
  return grRequestGetAPI(`module/status/${param}`)
    .then((response) => {
      dispatch({
        type: GET_GPMS_MODULE_STATUS,
        response,
        moduleType,
      });
    })
    .catch((error) => {
      dispatch({
        type: COMMON_FAILURE,
        error,
        moduleType,
      });
    });
};

export const getGPMSModuleStatusALL = (param) => (dispatch) => {
  return grRequestGetAPI(`module/status`)
    .then((response) => {
      dispatch({
        type: GET_GPMS_MODULE_STATUS_ALL,
        response,
      });
    })
    .catch((error) => {
      dispatch({
        type: COMMON_FAILURE,
        error,
      });
    });
};

export const controlGPMSModule = (param) => (dispatch) => {
  return requestPostAPI("module/control", param)
    .then((response) => {
      dispatch({
        type: CONTROL_GPMS_MODULE,
        response,
        moduleType: param.moduleType,
      });
    })
    .catch((error) => {
      dispatch({
        type: CONTROL_GPMS_MODULE,
        error,
        moduleType: param.moduleType,
      });
    });
};

export default handleActions(
  {
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
    [GET_GPMS_MODULE_STATUS]: (state, action) => {
      const gpmsModuleInfo =
        action.response.data && action.response.data.data
          ? action.response.data.data[0]
          : null;
      if (gpmsModuleInfo) {
        return state.merge({
          [action.moduleType]: gpmsModuleInfo,
        });
      } else {
        return state.merge({
          [action.moduleType]: {
            moduleType: action.moduleType,
            lastActivatedTime: 0,
            moduleActionType: null,
            status: null,
          },
        });
      }
    },
    [GET_GPMS_MODULE_STATUS_ALL]: (state, action) => {
      const gpmsModuleInfo =
        action.response.data && action.response.data.data
          ? action.response.data.data
          : null;
      if (gpmsModuleInfo && gpmsModuleInfo.length > 0) {
        const parsedInfo = gpmsModuleInfo.reduce((acc, cur) => {
          const moduleName = cur.moduleType.toUpperCase();
          acc[moduleName] = cur;
          return acc;
        }, {});
        Object.keys(GPMSModuleType).forEach((moduleType) => {
          if (!Object.keys(parsedInfo).includes(moduleType)) {
            parsedInfo[moduleType] = {
              moduleType,
              lastActivatedTime: 0,
              moduleActionType: null,
              status: null,
            };
          }
        });
        return state.merge(parsedInfo);
      } else {
        const nullInfo = Object.keys(GPMSModuleType).reduce((acc, cur) => {
          acc[cur] = {
            moduleType: cur,
            lastActivatedTime: 0,
            moduleActionType: null,
            status: null,
          };
          return cur;
        }, {});
        return state.merge(nullInfo);
      }
    },
    [CONTROL_GPMS_MODULE]: (state, action) => {
      const gpmsControlResult =
        action.response.data && action.response.data.data
          ? action.response.data.status
          : null;
      if (gpmsControlResult) {
        return state.setIn([action.moduleType, "resStatus"], gpmsControlResult);
      } else {
        return state.setIn([action.moduleType, "resStatus"], {
          result: "",
          resultCode: "",
          message: "",
        });
      }
    },
  },
  initialState
);
