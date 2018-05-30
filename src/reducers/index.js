import * as types from '../actions/ActionTypes';
import { combineReducers } from 'redux';

const initialClientRegKeyState = {
    regKeyList: {
        dataList: [],
        options: {}
    }
};

function clientRegKey(state = initialClientRegKeyState, action) {

    console.log('==================================action=');
    console.log(action);

    switch(action.type) {

        case types.__READ_REGKEY_LIST:


            this.fetchData(0, this.state.rowsPerPage, this.state.orderBy, this.state.order);

            return {
                    regKeyList: {
                        dataList: [
                            {
                                "regKeyNo": "1fbc03b2-0da7-4456-a07b-38dabf6a280b",
                                "validDate": 1527692400000,
                                "expireDate": 1861801200000,
                                "modDate": 1527040667000,
                                "modUserId": "",
                                "ipRange": "200.0.0.*",
                                "comment": "테스트 등록 키"
                            },
                            {
                                "regKeyNo": "69d8f5e3-3a82-40c4-971b-2197082a44d8",
                                "validDate": 1527692399000,
                                "expireDate": 1546268400000,
                                "modDate": 1527488888000,
                                "modUserId": "",
                                "ipRange": "*",
                                "comment": "wfgeerywtrehwrthwtregersafver"
                            },
                            {
                                "regKeyNo": "eda6df66-d6b7-4699-89a1-9e2fcb129107",
                                "validDate": 1527692399000,
                                "expireDate": 1538060399000,
                                "modDate": 1527489046000,
                                "modUserId": "",
                                "ipRange": "*",
                                "comment": "fdsgfedgsretgertgsa"
                            }
                        ]
                    }
            }
        
        default:
            return state;
    }
};

const clientRegKeyReducers = combineReducers({
    clientRegKey
});

export default clientRegKeyReducers;

