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
          name: 'menuClientRule',
          id: 'clientconfig',
          url: '/clientconfig',
          level: 2,
          children: [
            {
              name: 'menuClientSetup',
              id: 'GRM0703',
              url: '/clientconfig/setting/GRM0703/menuClientSetup',
              level: 3,
            }
          ]
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
