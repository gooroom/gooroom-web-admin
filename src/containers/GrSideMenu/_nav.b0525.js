export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      level: 1,
      badge: {
        variant: 'info',
        text: 'NEW'
      }
    },
    {
      name: '구름관리서버설정',
      url: '/master',
      icon: 'icon-settings',
      level: 1,
      children: [
        {
          name: '도메인관리',
          url: '/master/domain',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '관리자관리',
          url: '/master/admin',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '서버정보설정',
          url: '/master/server',
          icon: 'icon-layers',
          level: 2,
        },
      ]
    },
    {
      name: '단말관리',
      url: '/clients',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '등록관리',
          url: '/clients/clientmanage',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '그룹관리',
          url: '/clients/clientgroupmanage',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '패키지관리',
          url: '/package/packagemanage',
          icon: 'icon-layers',
          level: 2,
        },
        {
          name: '작업관리',
          url: '/jobs/jobmanage',
          icon: 'icon-notebook',
          level: 2,
        },
      ]
    },
    {
      name: '단말설정',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '데스크톱환경',
          url: '/clientconfig/desktop',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '업데이트서버설정',
          url: '/clientconfig/update',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: 'HOSTS설정',
          url: '/clientconfig/host',
          icon: 'icon-layers',
          level: 2,
        },
        {
          name: '단말정책설정',
          url: '/clientconfig/setting',
          icon: 'icon-notebook',
          level: 2,
        },
        {
          name: '단말등록키',
          url: '/clientconfig/regkey',
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
          name: '매체제어정책관리',
          url: '/userconfig/media',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '브라우저제어정책관리',
          url: '/userconfig/browser',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '단말보안정책관리',
          url: '/userconfig/security',
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
          url: '/user/deptmanage',
          icon: 'icon-wrench',
          level: 2,
        },
        {
          name: '사용자계정관리',
          url: '/user/usermanage',
          icon: 'icon-folder',
          level: 2,
        },
        {
          name: '사용자롤관리',
          url: '/user/role',
          icon: 'icon-layers',
          level: 2,
        },
      ]
    },
  ]
};
