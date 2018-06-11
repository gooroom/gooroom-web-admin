import { combineReducers } from 'redux';
import clientRegKeyModule from './clientRegKeyModule';
import clientProfileSetModule from './clientProfileSetModule';
import GrConfirmModule from './GrConfirmModule';
import GrClientSelectorModule from './GrClientSelectorModule';

export default combineReducers({
    clientRegKeyModule, clientProfileSetModule, GrConfirmModule, GrClientSelectorModule
});
