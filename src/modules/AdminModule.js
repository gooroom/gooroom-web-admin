import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';

const GET_ADMIN_INFO = 'admin/GET_ADMIN_INFO';
const SHOW_CONFIRM = 'admin/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'admin/CLOSE_CONFIRM';
// ...

// ...
const initialState = Map({
    adminId: '',
    adminName: '',
    email: '',
    isEnableAlarm: '',
    pollingTime: 10
});


export const getAdminInfo = (param) => dispatch => {
    return dispatch({
        type: GET_ADMIN_INFO,
        userId: 'testadmin',
        userName: '홍길동',
        userEmail: 'admin@aaaa.com',
        isEnableAlarm: true,
        pollingTime: 22
    })
}


export default handleActions({

    [GET_ADMIN_INFO]: (state, action) => {
        return state.merge({
            adminId: action.userId,
            adminName: action.userName,
            email: action.userEmail,
            isEnableAlarm: action.isEnableAlarm,
            pollingTime: action.pollingTime
        }); 
    }

}, initialState);



