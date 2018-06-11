import { combineReducers } from 'redux';
import clientRegKeyModule from './clientRegKeyModule';
import clientProfileSetModule from './clientProfileSetModule';
import GrConfirmModule from './GrConfirmModule';

export default combineReducers({
    clientRegKeyModule, clientProfileSetModule, GrConfirmModule
});
