
import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GRUtils/GRRequester';

import { getMergedObject } from 'components/GRUtils/GRCommonUtils';

const GET_CLIENTGROUPITEMS_PENDING = 'commonOption/GET_CLIENTGROUPITEMS_PENDING';
const GET_CLIENTGROUPITEMS_SUCCESS = 'commonOption/GET_CLIENTGROUPITEMS_SUCCESS';
const GET_CLIENTGROUPITEMS_FAILURE = 'commonOption/GET_CLIENTGROUPITEMS_FAILURE';

const CHG_VALUE_SELECT = 'commonOption/CHG_VALUE_SELECT';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listDataForClientGroupSelect: [],
    selectedClientGroup: {
        grpIds: []
    },

    userStatusData: [
        { statusId: "NORMAL", statusVal: "STAT010", statusNm: "stNormal" },
        { statusId: "DELETE", statusVal: "STAT020", statusNm: "stDelete" },
        { statusId: "ALL", statusVal: "ALL", statusNm: "stAll" }
    ],
    selectedUserStatus: { statusId: "NORMAL", statusVal: "STAT010", statusNm: "stNormal" },

    clientStatusData: [
        { statusId: "NORMAL", statusVal: "NORMAL", statusNm: "stNormalClient" },
        { statusId: "SECURE", statusVal: "SECURE", statusNm: "stViolatedClient" },
        { statusId: "REVOKED", statusVal: "REVOKED", statusNm: "stRevokedClient" },
        { statusId: "ONLINE", statusVal: "ONLINE", statusNm: "stOnlineClient" },
        { statusId: "ALL", statusVal: "ALL", statusNm: "stAll" }
    ],
    selectedClientStatus: {
        statusId: '',
        statusNm: '',
        statusVal: ''
    },

    jobStatusData: [
        { statusId: "R", statusVal: "R", statusNm: "stBeforeJob" },
        { statusId: "D", statusVal: "D", statusNm: "stRunningJob" },
        { statusId: "C", statusVal: "C", statusNm: "stCompJob" }
    ],
    selectedJobStatus: {
        statusIds: ["R", "D"]
    },

    logLevelData: [
        { levelNo: "0", levelId: "None", levelVal: "none", levelNm: "stNoUse" },
        { levelNo: "1", levelId: "Emergency", levelVal: "emerg", levelNm: "stEmergLevel" },
        { levelNo: "2", levelId: "Alert", levelVal: "alert", levelNm: "stAlertLevel" },
        { levelNo: "3", levelId: "Critical", levelVal: "crit", levelNm: "stCritLevel" },
        { levelNo: "4", levelId: "Error", levelVal: "err", levelNm: "stErrLevel" },
        { levelNo: "5", levelId: "Warning", levelVal: "warnning", levelNm: "stWarningLevel" },
        { levelNo: "6", levelId: "Notice", levelVal: "notice", levelNm: "stNoticeLevel" },
        { levelNo: "7", levelId: "Informational", levelVal: "info", levelNm: "stInfoLevel" },
        { levelNo: "8", levelId: "Debug", levelVal: "debug", levelNm: "stDebugLevel" }
    ],
    protectionTypeData: [
        { typeId: "ALL", typeVal: "ALL", typeNm: "stAll" },
        { typeId: "MEDIA", typeVal: "MEDIA", typeNm: "stMediaProctect" },
        { typeId: "OS", typeVal: "OS", typeNm: "stOSProctect" },
        { typeId: "EXE", typeVal: "EXE", typeNm: "stExeProctect" },
        { typeId: "BOOT", typeVal: "BOOT", typeNm: "stBootProctect" },
        { typeId: "AGENT", typeVal: "AGENT", typeNm: "stAgentProctect" }
    ],
    generalLogTypeData: [
        { typeId: "ALL", typeVal: "ALL", typeNm: "stAll" },
        { typeId: "BROWSER", typeVal: "BROWSER", typeNm: "stBrowser" },
        { typeId: "AGENT", typeVal: "AGENT", typeNm: "stAgent" }
    ]

};

export const readClientGroupListAll = (param) => dispatch => {
    dispatch({type: GET_CLIENTGROUPITEMS_PENDING});
    return requestPostAPI('readClientGroupList', {}).then(
        (response) => {
            dispatch({
                type: GET_CLIENTGROUPITEMS_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_CLIENTGROUPITEMS_FAILURE,
            payload: error
        });
    });
};

export const changeSelectValue = (param) => dispatch => {
    return dispatch({
        type: CHG_VALUE_SELECT,
        payload: param
    });
};

export default handleActions({

    [GET_CLIENTGROUPITEMS_PENDING]: (state, action) => {
        return { ...state, pending: true, error: false };
    },
    [GET_CLIENTGROUPITEMS_SUCCESS]: (state, action) => {
        return { ...state, pending: false, error: false, listDataForClientGroupSelect: action.payload.data.data };
    },
    [GET_CLIENTGROUPITEMS_FAILURE]: (state, action) => {
        return { ...state, pending: false, error: true };
    },

    [CHG_VALUE_SELECT]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    },

}, initialState);



