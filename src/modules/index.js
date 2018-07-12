import { combineReducers } from 'redux';

import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';
import ClientConfSettingModule from './ClientConfSettingModule';

import ClientGroupCompModule from './ClientGroupCompModule';

import ClientManageCompModule from './ClientManageCompModule';

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
    
    ClientManageCompModule,
    ClientGroupCompModule,

    JobManageModule, 
    
    GrConfirmModule,
    CommonOptionModule

});
