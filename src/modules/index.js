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

import TotalRuleModule from './TotalRuleModule';

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
import SecurityLogModule from './SecurityLogModule';
import GeneralLogModule from './GeneralLogModule';
import DailyViolatedModule from './DailyViolatedModule';
import DailyLoginCountModule from './DailyLoginCountModule';
import DailyClientCountModule from './DailyClientCountModule';

import DashboardModule from './DashboardModule';

import SiteManageModule from './SiteManageModule';
import NoticeModule from './NoticeModule';
import NoticePublishModule from './NoticePublishModule';
import NoticePublishExtensionModule from './NoticePublishExtensionModule';

export default combineReducers({

    GlobalModule,
    
    ClientRegKeyModule, 
    ClientProfileSetModule,

    ClientConfSettingModule,
    ClientHostNameModule,
    ClientUpdateServerModule,

    TotalRuleModule,
    
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

    AdminModule,
    SecurityLogModule,
    GeneralLogModule,
    DailyViolatedModule,
    DailyLoginCountModule,
    DailyClientCountModule,

    DashboardModule,

	SiteManageModule,
    NoticeModule,
    NoticePublishModule,
    NoticePublishExtensionModule

});
