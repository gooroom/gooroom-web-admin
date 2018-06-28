import { combineReducers } from 'redux';
import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';
import ClientGroupModule from './ClientGroupModule';
import ClientManageModule from './ClientManageModule';
import JobManageModule from './JobManageModule';
import GrConfirmModule from './GrConfirmModule';
import CommonOptionModule from './CommonOptionModule';


export default combineReducers({
    ClientRegKeyModule, 
    ClientProfileSetModule, 
    
    ClientManageModule,
    ClientGroupModule, 
    JobManageModule, 
    
    GrConfirmModule,
    CommonOptionModule

});
