import { combineReducers } from 'redux';

import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';

import ClientGroupCompModule from './ClientGroupCompModule';

import ClientManageCompModule from './ClientManageCompModule';

import JobManageModule from './JobManageModule';
import GrConfirmModule from './GrConfirmModule';
import CommonOptionModule from './CommonOptionModule';

import ClientConfSettingModule from './ClientConfSettingModule';
import ClientDesktopConfigModule from './ClientDesktopConfigModule';
import ClientHostNameModule from './ClientHostNameModule';
import ClientUpdateServerModule from './ClientUpdateServerModule';

import ClientMasterManageModule from './ClientMasterManageModule';


export default combineReducers({

    ClientRegKeyModule, 
    ClientProfileSetModule,

    ClientConfSettingModule,
    ClientDesktopConfigModule,
    ClientHostNameModule,
    ClientUpdateServerModule,

    ClientMasterManageModule,
    
    ClientManageCompModule,
    ClientGroupCompModule,

    JobManageModule, 
    
    GrConfirmModule,
    CommonOptionModule

});
