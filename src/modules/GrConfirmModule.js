import { handleActions } from 'redux-actions';

const SHOW_CONFIRM = 'grConfirm/SHOW_CONFIRM';
const CLOSE_CONFIRM = 'grConfirm/CLOSE_CONFIRM';
const ACTION_CONFIRM = 'grConfirm/ACTION_CONFIRM';
// ...

export const showConfirm = (param) => dispatch => {
    return dispatch({
        type: SHOW_CONFIRM,
        payload: param
    });
};

export const closeWithCallbackConfirm = (param) => dispatch => {

    console.log('closeWithCallbackConfirm.....');

    // if(param.confirmResult) {
    //     dispatch({type: ACTION_CONFIRM, payload: param});
    // }
    // if(state.handleConfirmResult) {
    //     state.handleConfirmResult(action.payload.confirmResult);
    // }

    // return dispatch(
    //     {type: ACTION_CONFIRM, payload: param}
    // ).then(() => ({
    //     type: CLOSE_CONFIRM,
    //     payload: param
    // }));


    // return dispatch({
    //     type: CLOSE_CONFIRM,
    //     payload: param
    // });

// return dispatch({
//     type: ACTION_CONFIRM,
//     payload: param
// });

    if(param.confirmResult) {
        console.log('closeWithCallbackConfirm.... CALL callback !');
        //actionConfirm(param);
        dispatch({
            type: CLOSE_CONFIRM,
            payload: param
        }).then(() => dispatch({
            type: ACTION_CONFIRM,
            payload: param
        }));
    } else {
    //closeConfirm(param);
    console.log('closeWithCallbackConfirm.... CLOSE CONFIRM !');
    dispatch({
        type: CLOSE_CONFIRM,
        payload: param
    });
    }

};

export const closeConfirm = (param) => dispatch => {
    console.log('closeConfirm.....');
    return dispatch({
        type: CLOSE_CONFIRM,
        payload: param
    });
};

export const actionConfirm = (param) => dispatch => {
    console.log('actionConfirm.....', param);
    // return dispatch({
    //     type: ACTION_CONFIRM,
    //     payload: param
    // });
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

        console.log('CLOSE_CONFIRM.....');
        // console.log('CLOSE_CONFIRM...action ', action);

        // if(state.handleConfirmResult) {
        //     state.handleConfirmResult(action.payload.confirmResult);
        // }
        return {
            ...state,
            confirmOpen: false
        }
    },
    [ACTION_CONFIRM]: (state, action) => {
        console.log('ACTION_CONFIRM..... ', state.handleConfirmResult);
        state.handleConfirmResult(true);
        return {
            ...state,
        }
    },

}, initialState);



