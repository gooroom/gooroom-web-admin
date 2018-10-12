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
    }
  ]
};
