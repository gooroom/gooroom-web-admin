import {
    handleActions
} from 'redux-actions';

import axios from 'axios';
import qs from 'qs';


function getPostAPI(postId) {
    //return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);

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
            searchKey: '',
            start: 1,
            length: 10,
            orderColumn: '',
            orderDir: '',
          },
        withCredentials: true
      });
}

const GET_REGKEY_LIST = 'clientRegKey/GET_REGKEY_LIST';
const GET_REGKEY_LIST_PENDING = 'clientRegKey/GET_REGKEY_LIST_PENDING';
const GET_REGKEY_LIST_SUCCESS = 'clientRegKey/GET_REGKEY_LIST_SUCCESS';
const GET_REGKEY_LIST_FAILURE = 'clientRegKey/GET_REGKEY_LIST_FAILURE';
// ...


//export const readClientRegkeyList = createAction(READ_REGKEY_DATA_LIST);
export const readClientRegkeyList = (postId) => ({
    type: GET_REGKEY_LIST,
    payload: getPostAPI(postId)
});

// ...

const initialState = {
    pending: false,
    error: false,
    data: {
        data: []
    },
    regkeydata: []
};


export default handleActions({

    [GET_REGKEY_LIST_PENDING]: (state, action) => {
        console.log('GET_REGKEY_LIST_PENDING');
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_REGKEY_LIST_SUCCESS]: (state, action) => {
        console.log('GET_REGKEY_LIST_SUCCESS');
        const { data } = action.payload.data;

        return {
            ...state,
            pending: false,
            data: {
                data: []
            }
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