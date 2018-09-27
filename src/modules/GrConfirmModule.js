import { handleActions } from 'redux-actions';

const SHOW_CONFIRM = 'grConfirm/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'grConfirm/CLOSE_CONFIRM';
// ...

export const showConfirm = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFIRM,
        confirmTitle: param.confirmTitle,
        confirmMsg: param.confirmMsg,
        handleConfirmResult: param.handleConfirmResult,
        confirmOpen: param.confirmOpen,
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
    handleConfirmResult: () => {},
    confirmOpen: false,
    confirmResult: false,
    confirmObject: null
};


export default handleActions({

    [SHOW_CONFIRM]: (state, action) => {
        return {
            ...state,
            confirmTitle: action.confirmTitle,
            confirmMsg: action.confirmMsg,
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



