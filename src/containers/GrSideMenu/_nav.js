export default {
  items: [
    {
      name: '단말관리',
      url: '/clients',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '단말통합관리',
          url: '/clients/clientmastermanage/GRM0101/단말통합관리',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '등록관리',
          url: '/clients/clientmanage/GRM0102/등록관리',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '그룹관리',
          url: '/clients/clientgroupmanage/GRM0103/그룹관리',
          icon: 'icon-folder',
          level: 2,
        }, {
          name: '???패키지관리',
          url: '/package/packagemanage/GRM0104/패키지관리',
          icon: 'icon-layers',
          level: 2,
        }, {
          name: '작업관리',
          url: '/jobs/jobmanage/GRM0105/작업관리',
          icon: 'icon-notebook',
          level: 2,
        },
      ]
    }, {
      name: '단말설정(NEW)',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '단말등록키',
          url: '/clientconfig/regkey/GRM0201/단말등록키',
          icon: 'icon-notebook',
          level: 2,
        }, {
          name: '단말프로파일',
          url: '/clientconfig/profileset/GRM0202/단말프로파일',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    },
    {
      name: '단말설정',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '???데스크톱환경',
          url: '/clientconfig/desktop/GRM0301/데스크톱환경',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '업데이트서버설정',
          url: '/clientconfig/update/GRM0302/업데이트서버설정',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: 'HOSTS설정',
          url: '/clientconfig/host/GRM0303/HOSTS설정',
          icon: 'icon-layers',
          level: 2,
        },
        {
          name: '단말정책설정',
          url: '/clientconfig/setting/GRM0304/단말정책설정',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    },
    {
      name: '사용자정책관리',
      url: '/userconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '정책통합관리',
          url: '/userconfig/totalmng/GRM0401/정책통합관리',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '매체제어정책관리',
          url: '/userconfig/media/GRM0402/매체제어정책관리',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '브라우저제어정책관리',
          url: '/userconfig/browser/GRM0403/브라우저제어정책관리',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '단말보안정책관리',
          url: '/userconfig/security/GRM0404/단말보안정책관리',
          icon: 'icon-layers',
          level: 2,
        },
      ]
    },
    {
      name: '사용자관리',
      url: '/user',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '조직관리',
          url: '/user/deptmanage/GRM0501/조직관리',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '사용자계정관리',
          url: '/user/usermanage/GRM0502/사용자계정관리',
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
    },
    {
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
