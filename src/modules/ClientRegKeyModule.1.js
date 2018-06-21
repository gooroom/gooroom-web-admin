import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

const GET_REGKEY_LIST_PENDING = 'clientRegKey/GET_LIST_PENDING';
const GET_REGKEY_LIST_SUCCESS = 'clientRegKey/GET_LIST_SUCCESS';
const GET_REGKEY_LIST_FAILURE = 'clientRegKey/GET_LIST_FAILURE';


// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    listData: [],
    listParam: {
        keyword: '',
        orderDir: 'desc',
        orderColumn: 'PROFILE_NO',
        page: 0,
        rowsPerPage: 10,
        // rowsPerPageOptions: [5, 10, 25],
        rowsTotal: 0,
        rowsFiltered: 0
    },

    selectedItem: {
        regKeyNo: '',
        regKeyValidDate: '',
        regKeyExpireDate: ''
    },

    dialogOpen: false,

    keyword: '',
    orderDir: 'asc',
    orderColumn: '',
    selected: [],
    page: 0,
    rowsPerPage: 5,
    rowsTotal: 0,
    rowsFiltered: 0
};


// ...
export const readClientRegkeyList = (param) => dispatch => {

    dispatch({type: GET_REGKEY_LIST_PENDING});
    return requestPostAPI('readRegKeyInfoList', param).then(
        (response) => {
            dispatch({
                type: GET_REGKEY_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_REGKEY_LIST_FAILURE,
            payload: error
        });
    });
};



export default handleActions({

    [GET_REGKEY_LIST_PENDING]: (state, action) => {

        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_REGKEY_LIST_SUCCESS]: (state, action) => {

        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;
        return {
            ...state,
            pending: false,
            error: false,
            listData: data,
            rowsFiltered: parseInt(recordsFiltered, 10),
            rowsTotal: parseInt(recordsTotal, 10),
            selected: [],
            page: parseInt(draw, 10),
            rowsPerPage: parseInt(rowLength, 10)
        };
    },  
    [GET_REGKEY_LIST_FAILURE]: (state, action) => {
        console.log('GET_REGKEY_LIST_FAILURE');
        return {
            ...state,
            pending: false,
            error: true
        };
    }

}, initialState);