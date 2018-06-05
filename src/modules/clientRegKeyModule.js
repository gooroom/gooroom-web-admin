
import { handleActions } from 'redux-actions';

import axios from 'axios';
import qs from 'qs';

function getPostAPI(param) {
    console.log('param : ', param);

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
            searchKey: param.keyword,
            start: param.page * param.rowsPerPage,
            length: param.rowsPerPage,
            orderColumn: param.orderBy,
            orderDir: param.order,
          },
        withCredentials: true
      });
}

const GET_REGKEY_LIST_PENDING = 'clientRegKey/GET_REGKEY_LIST_PENDING';
const GET_REGKEY_LIST_SUCCESS = 'clientRegKey/GET_REGKEY_LIST_SUCCESS';
const GET_REGKEY_LIST_FAILURE = 'clientRegKey/GET_REGKEY_LIST_FAILURE';
// ...


//export const readClientRegkeyList = createAction(READ_REGKEY_DATA_LIST);
export const readClientRegkeyList = (postId) => dispatch => {

    dispatch({type: GET_REGKEY_LIST_PENDING});

    return getPostAPI(postId).then(
        (response) => {
            console.log('response: ', response);
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

    order: 'asc',
    orderBy: '',
    selected: [],
    page: 0,
    rowsPerPage: 5,
    rowsTotal: 0,
    rowsFiltered: 0
};


export default handleActions({

    [GET_REGKEY_LIST_PENDING]: (state, action) => {
        console.log('GET_REGKEY_LIST_PENDING  action ', action);

        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_REGKEY_LIST_SUCCESS]: (state, action) => {

        console.log('GET_REGKEY_LIST_SUCCESS (state) : ', state);
        console.log('GET_REGKEY_LIST_SUCCESS (action.payload) : ', action.payload);

        const { data, recordsFiltered, recordsTotal } = action.payload.data;
        console.log('GET_REGKEY_LIST_SUCCESS (recordsFiltered) : ' + recordsFiltered);
        console.log('GET_REGKEY_LIST_SUCCESS (recordsTotal) : ' + recordsTotal);

        

        return {
            ...state,
            pending: false,
            listData: data,
            rowsFiltered: parseInt(recordsFiltered, 10),
            rowsTotal: parseInt(recordsTotal, 10)
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