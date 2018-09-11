import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

const CHG_STORE_DATA = 'clientMasterManage/CHG_STORE_DATA';

// ...
const initialState = Map({
    pending: false,
    error: false,
    resultMsg: '',

    isClientInformOpen: false,
    isGroupInformOpen: false,

    clientConfigId: Map({
        objId: ''
    }),
    desktopConfigId: Map({
        objId: ''
    }),
    hostNameConfigId: Map({
        objId: ''
    }),
    updateServerConfigId: Map({
        objId: ''
    })
});

export const showClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"isGroupInformOpen",value:true}
    });
};

export const closeClientGroupInform = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"isGroupInformOpen",value:false}
    });
};

export const showClientManageInform = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"isClientInformOpen",value:true}
    });
};

export const closeClientManageInform = (param) => dispatch => {
    return dispatch({
        type: CHG_STORE_DATA,
        payload: {name:"isClientInformOpen",value:false}
    });
};


export default handleActions({

    [CHG_STORE_DATA]: (state, action) => {
        return state.merge({
            [action.payload.name]: action.payload.value
        });
    }

}, initialState);



