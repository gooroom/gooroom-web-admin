import { combineReducers } from 'redux';
import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';
import JobManageModule from './JobManageModule';
import GrConfirmModule from './GrConfirmModule';

export default combineReducers({
    ClientRegKeyModule, ClientProfileSetModule, JobManageModule, GrConfirmModule
});
