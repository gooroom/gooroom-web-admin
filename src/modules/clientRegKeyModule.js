import {
    createAction,
    handleActions
} from 'redux-actions';

import axios from 'axios';


function getPostAPI(postId) {
    return axios.get('https://jsonplaceholder.typicode.com/posts/${postId}');
}


const READ_REGKEY_DATA_LIST = 'regkey/READ_DATA_LIST';
// ...

//export const readClientRegkeyList = createAction(READ_REGKEY_DATA_LIST);
export const readClientRegkeyList = (postId) => ({
    type: READ_REGKEY_DATA_LIST,
    payload: getPostAPI(postId)
});

// ...

const initialState = {
    regkeydata: []
};


export default handleActions({
    [READ_REGKEY_DATA_LIST]: (state, action) => {
        console.log('..READ_REGKEY_DATA_LIST..', state);

        return {
            regkeydata: [
                                             {
                            "regKeyNo": "1111",
                            "validDate": 1527692400000,
                            "expireDate": 1861801200000,
                            "modDate": 1527040667000,
                            "modUserId": "",
                            "ipRange": "200.0.0.*",
                            "comment": "테스트 등록 키"
                        }
]
        }
    }
}, initialState);