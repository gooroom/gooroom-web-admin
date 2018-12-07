
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
        { statusId: "NORMAL", statusVal: "STAT010", statusNm: "정상" },
        { statusId: "DELETE", statusVal: "STAT020", statusNm: "삭제" },
        { statusId: "ALL", statusVal: "ALL", statusNm: "전체" }
    ],
    selectedUserStatus: { statusId: "NORMAL", statusVal: "STAT010", statusNm: "정상" },

    clientStatusData: [
        { statusId: "NORMAL", statusVal: "NORMAL", statusNm: "정상단말" },
        { statusId: "SECURE", statusVal: "SECURE", statusNm: "침해단말" },
        { statusId: "REVOKED", statusVal: "REVOKED", statusNm: "해지단말" },
        { statusId: "ONLINE", statusVal: "ONLINE", statusNm: "온라인" },
        { statusId: "ALL", statusVal: "ALL", statusNm: "전체" }
    ],
    selectedClientStatus: {
        statusId: '',
        statusNm: '',
        statusVal: ''
    },

    jobStatusData: [
        { statusId: "R", statusVal: "R", statusNm: "작업전" },
        { statusId: "D", statusVal: "D", statusNm: "작업중" },
        { statusId: "C", statusVal: "C", statusNm: "작업완료" }
    ],
    selectedJobStatus: {
        statusIds: ["R", "D"]
    },

    logLevelData: [
        { levelNo: "1", levelId: "Emergency", levelVal: "emerg", levelNm: "긴급" },
        { levelNo: "2", levelId: "Alert", levelVal: "alert", levelNm: "경보" },
        { levelNo: "3", levelId: "Critical", levelVal: "crit", levelNm: "위험" },
        { levelNo: "4", levelId: "Error", levelVal: "err", levelNm: "오류" },
        { levelNo: "5", levelId: "Warning", levelVal: "warnning", levelNm: "경고" },
        { levelNo: "6", levelId: "Notice", levelVal: "notice", levelNm: "알림" },
        { levelNo: "7", levelId: "Informational", levelVal: "info", levelNm: "정보" },
        { levelNo: "8", levelId: "Debug", levelVal: "debug", levelNm: "디버깅" },
        { levelNo: "9", levelId: "None", levelVal: "none", levelNm: "사용안함" }
    ],
    protectionTypeData: [
        { typeId: "ALL", typeVal: "ALL", typeNm: "전체" },
        { typeId: "MEDIA", typeVal: "MEDIA", typeNm: "매체보안" },
        { typeId: "OS", typeVal: "OS", typeNm: "운영체제보안" },
        { typeId: "EXE", typeVal: "EXE", typeNm: "실행보안" },
        { typeId: "BOOT", typeVal: "BOOT", typeNm: "부팅보안" },
        { typeId: "AGENT", typeVal: "AGENT", typeNm: "부팅보안" }
    ],
    generalLogTypeData: [
        { typeId: "ALL", typeVal: "ALL", typeNm: "전체" },
        { typeId: "BROWSER", typeVal: "BROWSER", typeNm: "브라우저" },
        { typeId: "AGENT", typeVal: "AGENT", typeNm: "에이전트" }
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



