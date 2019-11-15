export default {
  items: [
    {
      name: 'menuClient',
      id: 'clients',
      url: '/clients',
      level: 1,
      children: [
        {
          name: 'menuClientManage',
          id: 'GRM0101',
          url: '/clients/clientmastermanage/GRM0101/menuClientManage',
          level: 2,
        }, {
          name: 'menuClientSetup',
          id: 'GRM0703',
          url: '/clientconfig/setting/GRM0703/menuClientSetup',
          level: 2,
        }
      ]
    }, {
      name: 'menuUser',
      id: 'user',
      url: '/user',
      level: 1,
      children: [
        {
          name: 'menuUserManage',
          id: 'GRM0301',
          url: '/user/usermastermanage/GRM0301/menuUserManage',
          level: 2,
        }
      ]
    }, {
      name: 'menuUseRule',
      id: 'userconfig',
      url: '/userconfig',
      level: 1,
      children: [
        {
          name: 'menuMediaRuleManage',
          id: 'GRM0401',
          url: '/userconfig/media/GRM0401/menuMediaRuleManage',
          level: 2,
        },
        {
          name: 'menuBrowserRuleManage',
          id: 'GRM0402',
          url: '/userconfig/browser/GRM0402/menuBrowserRuleManage',
          level: 2,
        },
        {
          name: 'menuSecurityRuleManage',
          id: 'GRM0403',
          url: '/userconfig/security/GRM0403/menuSecurityRuleManage',
          level: 2,
        },
        {
          name: 'menuSoftwareRuleManage',
          id: 'GRM0404',
          url: '/userconfig/swfilter/GRM0404/menuSoftwareRuleManage',
          level: 2,
        },
        {
          name: 'menuCtrlCenterItemRuleManage',
          id: 'GRM0405',
          url: '/userconfig/ctrlcenteritem/GRM0405/menuCtrlCenterItemRuleManage',
          level: 2,
        },
        {
          name: 'menuPolicyKitRuleManage',
          id: 'GRM0406',
          url: '/userconfig/policykit/GRM0406/menuPolicyKitRuleManage',
          level: 2,
        },
      ]
    }, {
      name: 'menuDesktop',
      id: 'desktopconfig',
      url: '/desktopconfig',
      level: 1,
      children: [
        {
          name: 'menuDesktopManage',
          id: 'GRM0501',
          url: '/desktopconfig/desktopconf/GRM0501/menuDesktopManage',
          level: 2,
        }, {
          name: 'menuDesktopAppManage',
          id: 'GRM0502',
          url: '/desktopconfig/desktopapp/GRM0502/menuDesktopAppManage',
          level: 2,
        }, {
          name: 'menuCloudServiceManage',
          id: 'GRM0503',
          url: '/system/cloudservicemng/GRM0503/menuCloudServiceManage',
          level: 2,
        }, {
          name: 'menuThemeManage',
          id: 'GRM0504',
          url: '/system/thememng/GRM0504/menuThemeManage',
          level: 2,
        }
      ]
    }, {
      name: 'menuNotice',
      id: 'notices',
      url: '/notices',
      level: 1,
      children: [
        {
          name: 'menuNoticeManage',
          id: 'GRM0801',
          url: '/notices/noticemanage/GRM0801/menuNoticeManage',
          level: 2
        }
      ]
    }, {
      name: 'menuJob',
      id: 'jobs',
      url: '/jobs',
      level: 1,
      children: [
        {
          name: 'menuJobManage',
          id: 'GRM0601',
          url: '/jobs/jobmanage/GRM0601/menuJobManage',
          level: 2,
        }
      ]
    }
  ]
};
