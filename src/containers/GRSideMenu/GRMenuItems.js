export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard/GRM0901/Dashboard',
      icon: 'icon-screen-desktop',
      level: 1
    }, {
      name: '통계',
      url: '/statistic/GRM0902/통계',
      icon: 'icon-screen-desktop',
      level: 1
    }, {
      name: '단말',
      url: '/clients',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '통합관리',
          url: '/clients/clientmastermanage/GRM0101/통합관리',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '단말등록키',
          url: '/clientconfig/regkey/GRM0104/단말등록키',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '소프트웨어',
      url: '/package',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '패키지관리',
          url: '/package/packagemanage/GRM0201/패키지관리',
          icon: 'icon-layers',
          level: 2,
        },
        {
          name: '프로파일정보',
          url: '/clientconfig/profileset/GRM0202/프로파일정보',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '사용자',
      url: '/user',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '사용자통합관리',
          url: '/user/usermastermanage/GRM0301/사용자통합관리',
          icon: 'icon-wrench',
          level: 2,
        }
      ]
    }, {
      name: '단말사용정책',
      url: '/userconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '매체제어정책',
          url: '/userconfig/media/GRM0401/매체제어정책',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '브라우저제어정책',
          url: '/userconfig/browser/GRM0402/브라우저제어정책',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '단말보안정책',
          url: '/userconfig/security/GRM0403/단말보안정책',
          icon: 'icon-layers',
          level: 2,
        },
      ]
    }, {
      name: '데스크톱',
      url: '/desktopconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '데스크톱정보',
          url: '/desktopconfig/desktopconf/GRM0501/데스크톱정보',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '데스크톱앱관리',
          url: '/desktopconfig/desktopapp/GRM0502/데스크톱앱관리',
          icon: 'icon-wrench',
          level: 2,
        },
      ]
    }, {
      name: '작업',
      url: '/jobs',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '작업정보',
          url: '/jobs/jobmanage/GRM0601/작업정보',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '단말정책',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '업데이트서버',
          url: '/clientconfig/update/GRM0701/업데이트서버',
          icon: 'icon-folder',
          level: 2,
        }, {
          name: 'HOSTS',
          url: '/clientconfig/host/GRM0702/HOSTS',
          icon: 'icon-layers',
          level: 2,
        }, {
          name: '단말설정',
          url: '/clientconfig/setting/GRM0703/단말설정',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '시스템관리',
      url: '/system',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '관리자계정관리',
          url: '/system/adminusermng/GRM0901/관리자계정관리',
          icon: 'icon-notebook',
          level: 2,
        },
        {
          name: '구름관리서버설정',
          url: '/system/serverurl/GRM0902/구름관리서버설정',
          icon: 'icon-notebook',
          level: 2,
        },
        {
          name: '클라우드서비스연동',
          url: '/system/cloudservicemng/GRM0903/클라우드서비스연동',
          icon: 'icon-notebook',
          level: 2,
        },
        {
          name: '테마관리',
          url: '/system/thememng/GRM0904/테마관리',
          icon: 'icon-notebook',
          level: 2,
        },
        
      ]
    }
  ]
};
