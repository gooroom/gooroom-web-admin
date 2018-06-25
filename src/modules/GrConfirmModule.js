import { handleActions } from 'redux-actions';

const SHOW_CONFIRM = 'grConfirm/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'grConfirm/CLOSE_CONFIRM';
// ...

export const showConfirm = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFIRM,
        payload: param
    });
};

export const closeConfirm = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFIRM,
        payload: param
    });
};

// ...
const initialState = {
    confirmTitle: '',
    confirmMsg: '',
    handleConfirmResult: () => {},
    confirmOpen: false,
    confirmResult: false
};


export default handleActions({

    [SHOW_CONFIRM]: (state, action) => {
        return {
            ...state,
            confirmTitle: action.payload.confirmTitle,
            confirmMsg: action.payload.confirmMsg,
            handleConfirmResult: action.payload.handleConfirmResult,
            confirmOpen: action.payload.confirmOpen
        };
    },
    [CLOSE_CONFIRM]: (state, action) => {
        return {
            ...state,
            confirmOpen: false
        }
    },

}, initialState);



