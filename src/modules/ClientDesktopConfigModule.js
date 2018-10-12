import { handleActions } from 'redux-actions';
import { requestPostAPI } from 'components/GRUtils/GRRequester';

import { getMergedObject } from 'components/GRUtils/GRCommonUtils';
import * as commonHandleActions from 'modules/commons/commonHandleActions';

const GET_DESKTOP_LIST_SUCCESS = 'clientDesktopConfig/GET_LIST_SUCCESS';
const GET_DESKTOP_SUCCESS = 'clientDesktopConfig/GET_DESKTOP_SUCCESS';
const CREATE_DESKTOP_SUCCESS = 'clientDesktopConfig/CREATE_DESKTOP_SUCCESS';
const EDIT_DESKTOP_SUCCESS = 'clientDesktopConfig/EDIT_DESKTOP_SUCCESS';
const DELETE_DESKTOP_SUCCESS = 'clientDesktopConfig/DELETE_DESKTOP_SUCCESS';

const SHOW_DESKTOP_INFORM = 'clientDesktopConfig/SHOW_DESKTOP_INFORM';
const SHOW_DESKTOP_DIALOG = 'clientDesktopConfig/SHOW_DESKTOP_DIALOG';
const CHG_STORE_DATA = 'clientDesktopConfig/CHG_STORE_DATA';

const SET_SELECTED_OBJ = 'clientDesktopConfig/SET_SELECTED_OBJ';
const SET_EDITING_ITEM_VALUE = 'clientDesktopConfig/SET_EDITING_ITEM_VALUE';

const COMMON_PENDING = 'clientDesktopConfig/COMMON_PENDING';
const COMMON_FAILURE = 'clientDesktopConfig/COMMON_FAILURE';

// ...
const initialState = commonHandleActions.getCommonInitialState('ch');

export const getClientDesktopConfig = (param) => dispatch => {

};


export default handleActions({


}, initialState);

