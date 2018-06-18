import { handleActions } from 'redux-actions';

import { requestPostAPI } from '../components/GrUtils/GrRequester';

const GET_CLIENTGROUP_LIST_PENDING = 'clientSelector/GET_CLIENTGROUP_LIST_PENDING';
const GET_CLIENTGROUP_LIST_SUCCESS = 'clientSelector/GET_CLIENTGROUP_LIST_SUCCESS';
const GET_CLIENTGROUP_LIST_FAILURE = 'clientSelector/GET_CLIENTGROUP_LIST_FAILURE';

const GET_CLIENT_LIST_PENDING = 'clientSelector/GET_CLIENT_LIST_PENDING';
const GET_CLIENT_LIST_SUCCESS = 'clientSelector/GET_CLIENT_LIST_SUCCESS';
const GET_CLIENT_LIST_FAILURE = 'clientSelector/GET_CLIENT_LIST_FAILURE';

const CHG_CLIENTGROUP_PROPERTY = 'clientSelector/CHG_CLIENTGROUP_PROPERTY';
// ...

export const readClientGroupList = (param) => dispatch => {
    dispatch({type: GET_CLIENTGROUP_LIST_PENDING});
    return requestPostAPI('readClientGroupList', param).then(
        (response) => {
            dispatch({
                type: GET_CLIENTGROUP_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_CLIENTGROUP_LIST_FAILURE,
            payload: error
        });
    });
};

export const readClientListByGroup = (param) => dispatch => {
    dispatch({type: GET_CLIENT_LIST_PENDING});
    return requestPostAPI('readClientListForGroups', param).then(
        (response) => {
            dispatch({
                type: GET_CLIENT_LIST_SUCCESS,
                payload: response
            });
        }
    ).catch(error => {
        dispatch({
            type: GET_CLIENT_LIST_FAILURE,
            payload: error
        });
    });
};

export const setValueByName = (param) => dispatch => {
    return dispatch({
        type: CHG_CLIENTGROUP_PROPERTY,
        payload: param
    });
};

// ...

const initialState = {

    pending: false,
    error: false,

    groupList: [],
    clientList: [],
    checkedGroup: [],
    checkedClient: []
};


export default handleActions({

    [GET_CLIENTGROUP_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_CLIENTGROUP_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;
        return {
            ...state,
            pending: false,
            error: false,
            groupList: data
        };
    },
    [GET_CLIENTGROUP_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },

    [GET_CLIENT_LIST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_CLIENT_LIST_SUCCESS]: (state, action) => {
        const { data, recordsFiltered, recordsTotal, draw, orderDir, orderColumn, rowLength } = action.payload.data;
        return {
            ...state,
            pending: false,
            error: false,
            clientList: data
        };
    },
    [GET_CLIENT_LIST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        };
    },

    [CHG_CLIENTGROUP_PROPERTY]: (state, action) => {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    }


}, initialState);



