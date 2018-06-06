
import { handleActions } from 'redux-actions';

import axios from 'axios';
import qs from 'qs';

function getPostAPI(param) {

    return axios({
        method: "post",
        url: "http://localhost:8080/gpms/readRegKeyInfoList",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        transformRequest: [
          function(data, headers) {
            return qs.stringify(data);
          }
        ],
        data: {
            keyword: param.keyword,
            page: param.page,
            start: param.page * param.rowsPerPage,
            length: param.rowsPerPage,
            orderColumn: param.orderColumn,
            orderDir: param.orderDir,
          },
        withCredentials: true
      });
}

const GET_REGKEY_LIST_PENDING = 'clientRegKey/GET_REGKEY_LIST_PENDING';
const GET_REGKEY_LIST_SUCCESS = 'clientRegKey/GET_REGKEY_LIST_SUCCESS';
const GET_REGKEY_LIST_FAILURE = 'clientRegKey/GET_REGKEY_LIST_FAILURE';
// ...


//export const readClientRegkeyList = createAction(READ_REGKEY_DATA_LIST);
export const readClientRegkeyList = (param) => dispatch => {

    dispatch({type: GET_REGKEY_LIST_PENDING});

    return getPostAPI(param).then(

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

// ...

const initialState = {
    pending: false,
    error: false,
    listData: [],

    keyword: '',
    orderDir: 'asc',
    orderColumn: '',
    selected: [],
    page: 0,
    rowsPerPage: 5,
    rowsTotal: 0,
    rowsFiltered: 0
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

    // ,
    // [READ_REGKEY_DATA_LIST]: (state, action) => {
    //     console.log('..READ_REGKEY_DATA_LIST..', state);
    //     return {
    //         regkeydata: [
    //                                          {
    //                         "regKeyNo": "1111",
    //                         "validDate": 1527692400000,
    //                         "expireDate": 1861801200000,
    //                         "modDate": 1527040667000,
    //                         "modUserId": "",
    //                         "ipRange": "200.0.0.*",
    //                         "comment": "테스트 등록 키"
    //                     }
        // ]
        // }
    //}
}, initialState);