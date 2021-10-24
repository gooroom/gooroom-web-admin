
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
    selectedUserStatus: { statusId: '', statusVal: '', statusNm: '' },

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

    adminTypeData: [
        { typeId: "S", typeVal: "S", typeNm: "lbTotalAdmin" },
        { typeId: "A", typeVal: "A", typeNm: "lbSiteAdmin" },
        { typeId: "P", typeVal: "P", typeNm: "lbPartAdmin" },
        { typeId: "ALL", typeVal: "ALL", typeNm: "stAll" },
    ],
    selectedAdminType: { typeId: '', typeNm: '' },

    jobStatusData: [
        { statusId: "R", statusVal: "R", statusNm: "stBeforeJob" },
        { statusId: "D", statusVal: "D", statusNm: "stRunningJob" },
        { statusId: "C", statusVal: "C", statusNm: "stCompJob" }
    ],
    selectedJobStatus: {
        statusIds: ["R", "D"]
    },

    jobTypeData: [
        { typeId: "all", typeNm: "stAll" },
        { typeId: "append_contents_etc_hosts", typeNm: "lbHostFileChg" },
        { typeId: "get_password_cycle", typeNm: "lbPwdCycleSet" },
        { typeId: "get_screen_time", typeNm: "lbScreenSaverTimeSet" },
        { typeId: "get_media_config", typeNm: "lbMediaRuleConf" },
        { typeId: "get_browser_config", typeNm: "lbBrowserRuleConf" },
        { typeId: "get_update_operation", typeNm: "lbUpdateOprSet" },
        { typeId: "get_app_list", typeNm: "lbSoftwareRestrictionPolicy" },
        { typeId: "get_log_config", typeNm: "lbLogConfChg" },
        { typeId: "get_controlcenter_items", typeNm: "lbCtrlCenterItems" },
        { typeId: "get_policykit_config", typeNm: "lbPolicyKitConf" },
        { typeId: "get_account_config", typeNm: "lbAccountConf" },
        { typeId: "get_polkit_admin_config", typeNm: "lbPolkyAdminConf" },
        { typeId: "set_noti", typeNm: "lbNotice" },
        { typeId: "set_multiple_login_msg", typeNm: "lbMultiLoginMsg" },
        { typeId: "install_or_upgrade_package", typeNm: "lbInstallOrUpgradePackage" },
        { typeId: "remove_package", typeNm: "lbRemovePackage" },
        { typeId: "upgrade_all", typeNm: "lbUpgradeAll" },
        { typeId: "insert_all_packages_to_server", typeNm: "lbInsertAllPackageToServer" },
        { typeId: "profiling", typeNm: "lbProfiling" },
        { typeId: "profiling_packages", typeNm: "lbProfilingPackages" },
        { typeId: "set_homefolder_operation", typeNm: "lbSetHomefolderOperation" },
    ],

    logLevelNotifyData: [
        { levelNo: "0", levelId: "None", levelVal: "none", levelNm: "stNoUse" },
        { levelNo: "4", levelId: "Error", levelVal: "err", levelNm: "stNoticeLevel" }
    ],
    logLevelNotifyExeData: [
        { levelNo: "0", levelId: "None", levelVal: "none", levelNm: "stNoUse" },
        { levelNo: "6", levelId: "Notice", levelVal: "notice", levelNm: "stNoticeLevel" }
    ],
    logLevelShowData: [
        { levelNo: "0", levelId: "None", levelVal: "none", levelNm: "stNoUse" },
        { levelNo: "7", levelId: "Information", levelVal: "info", levelNm: "stShowLevel" }
    ],
    logLevelTransmitData: [
        { levelNo: "0", levelId: "None", levelVal: "none", levelNm: "stNoUse" },
        { levelNo: "7", levelId: "Information", levelVal: "info", levelNm: "stTranmitLevel" }
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
    ],
    noticePublishStatusData: [
        { statusId: "ACTIVE", statusVal: "STAT010", statusNm: "Active" },
        { statusId: "INACTIVE", statusVal: "STAT021", statusNm: "Inactive" }
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



