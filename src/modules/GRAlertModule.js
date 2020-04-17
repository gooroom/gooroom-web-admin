import { handleActions } from 'redux-actions';

const SHOW_ALERT = 'grAlert/SHOW_ALERT';
const CLOSE_ALERT = 'grAlert/CLOSE_ALERT';
// ...

export const showAlert = (param) => dispatch => {
    return dispatch({
        type: SHOW_ALERT,
        alertTitle: param.alertTitle,
        alertMsg: param.alertMsg,
        alertOpen: true,
        alertObject: param.alertObject
    });
};

export const closeConfirm = (param) => dispatch => {
    return dispatch({
        type: CLOSE_ALERT
    });
};

// ...
const initialState = {
    alertTitle: '',
    alertMsg: '',
    alertOpen: false,
    alertResult: false
};

export default handleActions({

    [SHOW_ALERT]: (state, action) => {
        return {
            ...state,
            alertTitle: action.alertTitle,
            alertMsg: action.alertMsg,
            alertOpen: action.alertOpen,
            alertObject: (action.alertObject) ? action.alertObject : null
        };
    },
    [CLOSE_ALERT]: (state, action) => {
        return {
            ...state,
            alertOpen: false
        }
    },

}, initialState);
