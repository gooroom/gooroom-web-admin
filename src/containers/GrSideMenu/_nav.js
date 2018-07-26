export default {
  items: [
    {
      name: '단말관리',
      url: '/clients',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '통합관리',
          url: '/clients/clientmastermanage/GRM0101',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '등록관리',
          url: '/clients/clientmanage/GRM0102',
          icon: 'icon-wrench',
          level: 2,
        }, {
          name: '그룹관리',
          url: '/clients/clientgroupmanage/GRM0103',
          icon: 'icon-folder',
          level: 2,
        }, {
          name: '???패키지관리',
          url: '/package/packagemanage/GRM0104',
          icon: 'icon-layers',
          level: 2,
        }, {
          name: '작업관리',
          url: '/jobs/jobmanage/GRM0105',
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
          url: '/clientconfig/regkey/GRM0201',
          icon: 'icon-notebook',
          level: 2,
        }, {
          name: '단말프로파일',
          url: '/clientconfig/profileset/GRM0202',
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
          url: '/clientconfig/desktop',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '업데이트서버설정',
          url: '/clientconfig/update/GRM0302',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: 'HOSTS설정',
          url: '/clientconfig/host/GRM0303',
          icon: 'icon-layers',
          level: 2,
        },
        {
          name: '단말정책설정',
          url: '/clientconfig/setting/GRM0304',
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
          name: '???매체제어정책관리',
          url: '/userconfig/media/GRM0401',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '???브라우저제어정책관리',
          url: '/userconfig/browser/GRM0402',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '???단말보안정책관리',
          url: '/userconfig/security/GRM0403',
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
          url: '/user/deptmanage/GRM0501',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '사용자계정관리',
          url: '/user/usermanage/GRM0502',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '???사용자롤관리',
          url: '/user/role/GRM0503',
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
          url: '/test/components',
          icon: 'icon-wrench',
          level: 2,
        }
      ]
    }
  ]
};
