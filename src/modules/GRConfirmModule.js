import { handleActions } from 'redux-actions';

const SHOW_CONFIRM = 'grConfirm/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'grConfirm/CLOSE_CONFIRM';
// ...

export const showConfirm = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFIRM,
        confirmTitle: param.confirmTitle,
        confirmMsg: param.confirmMsg,
        confirmCheckMsg: param.confirmCheckMsg,
        handleConfirmResult: param.handleConfirmResult,
        confirmOpen: true,
        confirmObject: param.confirmObject
    });
};

export const closeConfirm = (param) => dispatch => {
    return dispatch({
        type: CLOSE_CONFIRM
    });
};

// ...
const initialState = {
    confirmTitle: '',
    confirmMsg: '',
    confirmCheckMsg: '',
    handleConfirmResult: () => {},
    confirmOpen: false,
    confirmResult: false,
    confirmCheckResult: false,
    confirmObject: null
};


export default handleActions({

    [SHOW_CONFIRM]: (state, action) => {
        return {
            ...state,
            confirmTitle: action.confirmTitle,
            confirmMsg: action.confirmMsg,
            confirmCheckMsg: action.confirmCheckMsg,
            handleConfirmResult: action.handleConfirmResult,
            confirmOpen: action.confirmOpen,
            confirmObject: (action.confirmObject) ? action.confirmObject : null
        };
    },
    [CLOSE_CONFIRM]: (state, action) => {
        return {
            ...state,
            confirmOpen: false
        }
    },

}, initialState);



