import { combineReducers } from 'redux';

import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';

import ClientGroupModule from './ClientGroupModule';
import UserModule from './UserModule';

import ClientManageModule from './ClientManageModule';

import JobManageModule from './JobManageModule';
import GrConfirmModule from './GrConfirmModule';
import CommonOptionModule from './CommonOptionModule';

import ClientConfSettingModule from './ClientConfSettingModule';
import ClientDesktopConfigModule from './ClientDesktopConfigModule';
import ClientHostNameModule from './ClientHostNameModule';
import ClientUpdateServerModule from './ClientUpdateServerModule';

import MediaControlSettingModule from './MediaControlSettingModule';
import BrowserRuleSettingModule from './BrowserRuleSettingModule';
import ClientSecuSettingModule from './ClientSecuSettingModule';

import ClientMasterManageModule from './ClientMasterManageModule';

import AdminModule from './AdminModule';


export default combineReducers({

    ClientRegKeyModule, 
    ClientProfileSetModule,

    ClientConfSettingModule,
    ClientDesktopConfigModule,
    ClientHostNameModule,
    ClientUpdateServerModule,

    MediaControlSettingModule,
    BrowserRuleSettingModule,
    ClientSecuSettingModule,

    ClientMasterManageModule,
    
    ClientManageModule,
    ClientGroupModule,
    UserModule,

    JobManageModule, 
    
    GrConfirmModule,
    CommonOptionModule,

    AdminModule

});
