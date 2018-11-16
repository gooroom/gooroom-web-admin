import { combineReducers } from 'redux';

import GlobalModule from './GlobalModule';
import GRConfirmModule from './GRConfirmModule';
import GRAlertModule from './GRAlertModule';

import ClientRegKeyModule from './ClientRegKeyModule';
import ClientProfileSetModule from './ClientProfileSetModule';

import ClientGroupModule from './ClientGroupModule';
import ClientPackageModule from './ClientPackageModule';
import UserModule from './UserModule';
import DeptModule from './DeptModule';

import ClientManageModule from './ClientManageModule';

import JobManageModule from './JobManageModule';
import CommonOptionModule from './CommonOptionModule';

import ClientConfSettingModule from './ClientConfSettingModule';
import ClientHostNameModule from './ClientHostNameModule';
import ClientUpdateServerModule from './ClientUpdateServerModule';

import MediaRuleModule from './MediaRuleModule';
import BrowserRuleModule from './BrowserRuleModule';
import SecurityRuleModule from './SecurityRuleModule';
import SoftwareFilterModule from './SoftwareFilterModule';

import ClientMasterManageModule from './ClientMasterManageModule';

import DesktopAppModule from './DesktopAppModule';
import DesktopConfModule from './DesktopConfModule';
import AdminUserModule from './AdminUserModule';
import GcspManageModule from './GcspManageModule';
import ThemeManageModule from './ThemeManageModule';

import AdminModule from './AdminModule';


export default combineReducers({

    GlobalModule,
    
    ClientRegKeyModule, 
    ClientProfileSetModule,

    ClientConfSettingModule,
    ClientHostNameModule,
    ClientUpdateServerModule,

    MediaRuleModule,
    BrowserRuleModule,
    SecurityRuleModule,
    SoftwareFilterModule,

    ClientMasterManageModule,
    
    ClientManageModule,
    ClientGroupModule,
    ClientPackageModule,
    UserModule,
    DeptModule,

    JobManageModule, 
    
    GRConfirmModule,
    GRAlertModule,
    CommonOptionModule,

    DesktopAppModule,
    DesktopConfModule,
    AdminUserModule,
    GcspManageModule,
    ThemeManageModule,

    AdminModule

});
