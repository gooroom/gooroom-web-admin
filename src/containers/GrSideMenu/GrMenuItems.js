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
          name: '단말정보',
          url: '/clients/clientmanage/GRM0102/단말정보',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '단말그룹',
          url: '/clients/clientgroupmanage/GRM0103/단말그룹',
          icon: 'icon-folder',
          level: 2,
        }, {
          name: '단말등록키',
          url: '/clientconfig/regkey/GRM0201/단말등록키',
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
          url: '/package/packagemanage/GRM0104/패키지관리',
          icon: 'icon-layers',
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
          name: '조직정보',
          url: '/user/deptmanage/GRM0501/조직정보',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '사용자정보',
          url: '/user/usermanage/GRM0502/사용자정보',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '???사용자롤관리',
          url: '/user/role/GRM0503/사용자롤관리',
          icon: 'icon-layers',
          level: 2,
        },
      ]
    }, {
      name: '단말사용정책',
      url: '/userconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '통합관리',
          url: '/userconfig/totalmng/GRM0401/통합관리',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '매체제어정책',
          url: '/userconfig/media/GRM0402/매체제어정책',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '브라우저제어정책',
          url: '/userconfig/browser/GRM0403/브라우저제어정책',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '단말보안정책',
          url: '/userconfig/security/GRM0404/단말보안정책',
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
          url: '/desktopconfig/desktop/GRM0301/데스크톱정보',
          icon: 'icon-wrench',
          level: 2,
        }
      ]
    }, {
      name: '작업',
      url: '/jobs',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '작업정보',
          url: '/jobs/jobmanage/GRM0105/작업정보',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '기타정책',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '업데이트서버',
          url: '/clientconfig/update/GRM0302/업데이트서버',
          icon: 'icon-folder',
          level: 2,
        }, {
          name: 'HOSTS',
          url: '/clientconfig/host/GRM0303/HOSTS',
          icon: 'icon-layers',
          level: 2,
        }, {
          name: '단말정책',
          url: '/clientconfig/setting/GRM0304/단말정책',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '단말설정(NEW)',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '프로파일정보',
          url: '/clientconfig/profileset/GRM0202/프로파일정보',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    }, {
      name: '???테스트',
      url: '/test',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '???컴포넌트테스트',
          url: '/test/components/GRM0991/컴포넌트테스트',
          icon: 'icon-wrench',
          level: 2,
        }
      ]
    }
  ]
};
