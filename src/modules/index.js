import { combineReducers } from 'redux';

import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';
import ClientConfSettingModule from './ClientConfSettingModule';
import ClientGroupModule from './ClientGroupModule';
import ClientManageModule from './ClientManageModule';
import JobManageModule from './JobManageModule';
import GrConfirmModule from './GrConfirmModule';
import CommonOptionModule from './CommonOptionModule';

import ClientHostNameModule from './ClientHostNameModule';
import ClientUpdateServerModule from './ClientUpdateServerModule';

import ClientMasterManageModule from './ClientMasterManageModule';


export default combineReducers({

    ClientRegKeyModule, 
    ClientProfileSetModule,
    ClientConfSettingModule,

    ClientHostNameModule,
    ClientUpdateServerModule,

    ClientMasterManageModule,
    
    ClientManageModule,
    ClientGroupModule, 
    JobManageModule, 
    
    GrConfirmModule,
    CommonOptionModule

});
