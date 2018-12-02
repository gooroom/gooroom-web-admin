export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard/GRM0901/Dashboard',
      icon: 'icon-screen-desktop',
      level: 1
    }, {
      name: '통계',
      url: '/statistic',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '일별침해통계',
          url: '/statistic/dailyviolated/GRM0931/일별침해통계',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '일별접속통계',
          url: '/statistic/dailyconnect/GRM0932/일별접속통계',
          icon: 'icon-notebook',
          level: 2,
        },
        {
          name: '단말등록통계',
          url: '/statistic/dailyregist/GRM0933/단말등록통계',
          icon: 'icon-folder',
          level: 2,
        }, {
          name: '사용로그',
          url: '/log/generallog/GRM0934/사용로그',
          icon: 'icon-layers',
          level: 2,
        }, {
          name: '보안로그',
          url: '/log/secretlog/GRM0935/보안로그',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '단말',
      url: '/clients',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '단말관리',
          url: '/clients/clientmastermanage/GRM0101/단말관리',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '단말등록키',
          url: '/clientconfig/regkey/GRM0104/단말등록키',
          icon: 'icon-notebook',
          level: 2,
        },
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
          name: '사용자관리',
          url: '/user/usermastermanage/GRM0301/사용자관리',
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
        {
          name: '소프트웨어제한정책',
          url: '/userconfig/swfilter/GRM0404/소프트웨어제한정책',
          icon: 'icon-notebook',
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
        {
          name: '클라우드서비스연동',
          url: '/system/cloudservicemng/GRM0503/클라우드서비스연동',
          icon: 'icon-notebook',
          level: 2,
        },
        {
          name: '테마관리',
          url: '/system/thememng/GRM0504/테마관리',
          icon: 'icon-notebook',
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
    }
  ]
};
