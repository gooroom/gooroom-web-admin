import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GrUtils/GrRequester';

const GET_JOB_LIST_PENDING = 'jobManage/GET_LIST_PENDING';
const GET_JOB_LIST_SUCCESS = 'jobManage/GET_LIST_SUCCESS';
const GET_JOB_LIST_FAILURE = 'jobManage/GET_LIST_FAILURE';

const SHOW_JOBINFORM_DATA = 'jobManage/SHOW_JOBINFORM_DATA';

const GET_TARGET_LIST_PENDING = 'jobManage/GET_TARGETLIST_PENDING';
const GET_TARGET_LIST_SUCCESS = 'jobManage/GET_TARGETLIST_SUCCESS';
const GET_TARGET_LIST_FAILURE = 'jobManage/GET_TARGETLIST_FAILURE';



// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        jobStatus: 'ALL',
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'PROFILE_NO',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },
    targetListData: [],
    targetListParam: {
        jobNo: '',
        orderDir: 'desc',
        orderColumn: 'PROFILE_NO',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {},

    informOpen: false,
};




export default handleActions({



}, initialState);



