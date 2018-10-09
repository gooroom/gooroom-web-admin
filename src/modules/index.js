import { combineReducers } from 'redux';

import GlobalModule from './GlobalModule';

import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';

import ClientGroupModule from './ClientGroupModule';
import ClientPackageModule from './ClientPackageModule';
import UserModule from './UserModule';
import DeptModule from './DeptModule';

import ClientManageModule from './ClientManageModule';

import JobManageModule from './JobManageModule';
import GrConfirmModule from './GrConfirmModule';
import CommonOptionModule from './CommonOptionModule';

import ClientConfSettingModule from './ClientConfSettingModule';
import ClientDesktopConfigModule from './ClientDesktopConfigModule';
import ClientHostNameModule from './ClientHostNameModule';
import ClientUpdateServerModule from './ClientUpdateServerModule';

import MediaRuleModule from './MediaRuleModule';
import BrowserRuleModule from './BrowserRuleModule';
import SecurityRuleModule from './SecurityRuleModule';

import ClientMasterManageModule from './ClientMasterManageModule';

import DesktopAppModule from './DesktopAppModule';

import AdminModule from './AdminModule';


export default combineReducers({

    GlobalModule,
    
    ClientRegKeyModule, 
    ClientProfileSetModule,

    ClientConfSettingModule,
    ClientDesktopConfigModule,
    ClientHostNameModule,
    ClientUpdateServerModule,

    MediaRuleModule,
    BrowserRuleModule,
    SecurityRuleModule,

    ClientMasterManageModule,
    
    ClientManageModule,
    ClientGroupModule,
    ClientPackageModule,
    UserModule,
    DeptModule,

    JobManageModule, 
    
    GrConfirmModule,
    CommonOptionModule,

    DesktopAppModule,

    AdminModule

});
