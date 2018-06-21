import { combineReducers } from 'redux';
import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';
import ClientGroupModule from './ClientGroupModule';
import JobManageModule from './JobManageModule';
import GrConfirmModule from './GrConfirmModule';

export default combineReducers({
    ClientRegKeyModule, ClientProfileSetModule, 
    ClientGroupModule, 
    JobManageModule, 
    GrConfirmModule
});
