export default {
  items: [
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
        }, {
          name: '패키지관리',
          url: '/package/packagemanage',
          icon: 'icon-layers',
          level: 2,
        }, {
          name: '작업관리',
          url: '/jobs/jobmanage',
          icon: 'icon-notebook',
          level: 2,
        },
      ]
    }, {
      name: '단말설정',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      level: 1,
      children: [
        {
          name: '단말등록키',
          url: '/clientconfig/regkey',
          icon: 'icon-notebook',
          level: 2,
        }, {
          name: '단말프로파일',
          url: '/clientconfig/profileset',
          icon: 'icon-notebook',
          level: 2,
        }
      ]
    },
  ]
};
