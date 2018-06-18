import { combineReducers } from 'redux';
import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';
import GrConfirmModule from './GrConfirmModule';

export default combineReducers({
    ClientRegKeyModule, ClientProfileSetModule, GrConfirmModule
});
