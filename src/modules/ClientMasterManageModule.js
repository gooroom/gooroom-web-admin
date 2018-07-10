
import { handleActions } from 'redux-actions';
import { requestPostAPI } from '../components/GrUtils/GrRequester';

import { getMergedListParam } from '../components/GrUtils/GrCommonUtils';

// ...
const initialState = {
    pending: false,
    error: false,
    resultMsg: '',

    clientConfig: {
        objId: ''
    },
    desktopConfigId: {
        objId: ''
    },
    hostNameConfigId: {
        objId: ''
    },
    updateServerConfigId: {
        objId: ''
    },
};


export default handleActions({

}, initialState);



