import { combineReducers } from 'redux';
import clientRegKeyModule from './clientRegKeyModule';
import clientProfileSetModule from './clientProfileSetModule';

export default combineReducers({
    clientRegKeyModule, clientProfileSetModule
});
