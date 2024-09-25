import { combineReducers } from 'redux';

import GRAlertModule from './GRAlertModule';
import GRConfirmModule from './GRConfirmModule';
import GlobalModule from './GlobalModule';

import ClientProfileSetModule from './ClientProfileSetModule';
import ClientRegKeyModule from './ClientRegKeyModule';

import ClientGroupModule from './ClientGroupModule';
import ClientPackageModule from './ClientPackageModule';
import ClientPackageSpecModule from './ClientPackageSpecModule';
import ClientPackageVersionModule from './ClientPackageVersionModule';
import DeptModule from './DeptModule';
import UserModule from './UserModule';
import UserReqModule from './UserReqModule';

import ClientManageModule from './ClientManageModule';

import CommonOptionModule from './CommonOptionModule';
import JobManageModule from './JobManageModule';

import ClientConfSettingModule from './ClientConfSettingModule';
import ClientHostNameModule from './ClientHostNameModule';
import ClientUpdateServerModule from './ClientUpdateServerModule';

import TotalRuleModule from './TotalRuleModule';

import BrowserRuleModule from './BrowserRuleModule';
import CtrlCenterItemModule from './CtrlCenterItemModule';
import MediaRuleModule from './MediaRuleModule';
import PolicyKitRuleModule from './PolicyKitRuleModule';
import SecurityRuleModule from './SecurityRuleModule';
import SoftwareFilterModule from './SoftwareFilterModule';

import ClientMasterManageModule from './ClientMasterManageModule';

import AdminUserModule from './AdminUserModule';
import DesktopAppModule from './DesktopAppModule';
import DesktopConfModule from './DesktopConfModule';
import GcspManageModule from './GcspManageModule';
import ThemeManageModule from './ThemeManageModule';

import AdminModule from './AdminModule';
import DailyClientCountModule from './DailyClientCountModule';
import DailyLoginCountModule from './DailyLoginCountModule';
import DailyViolatedModule from './DailyViolatedModule';
import GeneralLogModule from './GeneralLogModule';
import SecurityLogModule from './SecurityLogModule';

import ClientDashboardModule from './ClientDashboardModule';

import NoticeModule from './NoticeModule';
import NoticePublishExtensionModule from './NoticePublishExtensionModule';
import NoticePublishModule from './NoticePublishModule';
import SiteManageModule from './SiteManageModule';

import HealthCheckModule from './HealthCheckModule';
import ResourceMetricsModule from './ResourceMetricsModule';

/* for PTGR */
import PortableApplyModule from './PortableApplyModule';
import PortableBulkModule from './PortableBulkModule';
import PortableImageModule from './PortableImageModule';

import HealthModule from './HealthModule';
import PortableCertModule from './PortableCertModule';
import PortableUserApplyModule from './PortableUserApplyModule';
import PortableUserReviewModule from './PortableUserReviewModule';
import UserInfoModule from './UserInfoModule';

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
    CtrlCenterItemModule,
    PolicyKitRuleModule,

    ClientMasterManageModule,

    ClientManageModule,
    ClientGroupModule,
    ClientPackageModule,
    ClientPackageSpecModule,
    ClientPackageVersionModule,
    UserModule,
    UserReqModule,
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

    ClientDashboardModule,

    SiteManageModule,
    NoticeModule,
    NoticePublishModule,
    NoticePublishExtensionModule,

    HealthCheckModule,
    ResourceMetricsModule,

    PortableBulkModule,
    PortableApplyModule,
    PortableImageModule,
    PortableUserApplyModule,
    PortableUserReviewModule,
    UserInfoModule,
    PortableCertModule,

    HealthModule,
});
