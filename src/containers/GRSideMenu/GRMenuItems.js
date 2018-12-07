export default {
  items: [
    {
      name: 'Dashboard',
      id: 'dashboard',
      url: '/dashboard/GRM0901/Dashboard',
      level: 1
    }, {
      name: '통계',
      id: 'statistic',
      url: '/statistic',
      level: 1,
      children: [
        {
          name: '일별침해통계',
          id: 'GRM0931',
          url: '/statistic/dailyviolated/GRM0931/일별침해통계',
          level: 2,
        }, {
          name: '일별접속통계',
          id: 'GRM0932',
          url: '/statistic/dailyconnect/GRM0932/일별접속통계',
          level: 2,
        },
        {
          name: '단말등록통계',
          id: 'GRM0933',
          url: '/statistic/dailyregist/GRM0933/단말등록통계',
          level: 2,
        }, {
          name: '보안로그',
          id: 'GRM0935',
          url: '/log/secretlog/GRM0935/보안로그',
          level: 2,
        }
      ]
    }, {
      name: '단말',
      id: 'clients',
      url: '/clients',
      level: 1,
      children: [
        {
          name: '단말관리',
          id: 'GRM0101',
          url: '/clients/clientmastermanage/GRM0101/단말관리',
          level: 2,
        }, {
          name: '단말등록키',
          id: 'GRM0104',
          url: '/clientconfig/regkey/GRM0104/단말등록키',
          level: 2,
        },
        {
          name: '단말정책',
          id: 'clientconfig',
          url: '/clientconfig',
          level: 2,
          children: [
            {
              name: '단말설정',
              id: 'GRM0703',
              url: '/clientconfig/setting/GRM0703/단말설정',
              level: 3,
            }, {
              name: 'HOSTS',
              id: 'GRM0702',
              url: '/clientconfig/host/GRM0702/HOSTS',
              level: 3,
            }, {
              name: '업데이트서버',
              id: 'GRM0701',
              url: '/clientconfig/update/GRM0701/업데이트서버',
              level: 3,
            }
          ]
        }
      ]
    }, {
      name: '소프트웨어',
      id: 'package',
      url: '/package',
      level: 1,
      children: [
        {
          name: '패키지관리',
          id: 'GRM0201',
          url: '/package/packagemanage/GRM0201/패키지관리',
          level: 2,
        },
        {
          name: '프로파일정보',
          id: 'GRM0202',
          url: '/clientconfig/profileset/GRM0202/프로파일정보',
          level: 2,
        }
      ]
    }, {
      name: '사용자',
      id: 'user',
      url: '/user',
      level: 1,
      children: [
        {
          name: '사용자관리',
          id: 'GRM0301',
          url: '/user/usermastermanage/GRM0301/사용자관리',
          level: 2,
        }
      ]
    }, {
      name: '단말사용정책',
      id: 'userconfig',
      url: '/userconfig',
      level: 1,
      children: [
        {
          name: '매체제어정책',
          id: 'GRM0401',
          url: '/userconfig/media/GRM0401/매체제어정책',
          level: 2,
        },
        {
          name: '브라우저제어정책',
          id: 'GRM0402',
          url: '/userconfig/browser/GRM0402/브라우저제어정책',
          level: 2,
        },
        {
          name: '단말보안정책',
          id: 'GRM0403',
          url: '/userconfig/security/GRM0403/단말보안정책',
          level: 2,
        },
        {
          name: '소프트웨어제한정책',
          id: 'GRM0404',
          url: '/userconfig/swfilter/GRM0404/소프트웨어제한정책',
          level: 2,
        },
      ]
    }, {
      name: '데스크톱',
      id: 'desktopconfig',
      url: '/desktopconfig',
      level: 1,
      children: [
        {
          name: '데스크톱정보',
          id: 'GRM0501',
          url: '/desktopconfig/desktopconf/GRM0501/데스크톱정보',
          level: 2,
        },
        {
          name: '데스크톱앱관리',
          id: 'GRM0502',
          url: '/desktopconfig/desktopapp/GRM0502/데스크톱앱관리',
          level: 2,
        },
        {
          name: '클라우드서비스연동',
          id: 'GRM0503',
          url: '/system/cloudservicemng/GRM0503/클라우드서비스연동',
          level: 2,
        },
        {
          name: '테마관리',
          id: 'GRM0504',
          url: '/system/thememng/GRM0504/테마관리',
          level: 2,
        },
      ]
    }, {
      name: '작업',
      id: 'jobs',
      url: '/jobs',
      level: 1,
      children: [
        {
          name: '작업정보',
          id: 'GRM0601',
          url: '/jobs/jobmanage/GRM0601/작업정보',
          level: 2,
        }
      ]
    }
  ]
};
