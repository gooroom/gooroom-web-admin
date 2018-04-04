export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: '단말기',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: '단말관리',
      url: '/clients/clientmanage',
      icon: 'icon-wrench'
    },
    {
      name: '구름관리서버설정',
      url: '/master',
      icon: 'icon-settings',
      children: [
        {
          name: '도메인관리',
          url: '/master/domain',
          icon: 'icon-wrench'
        },
        {
          name: '관리자관리',
          url: '/master/admin',
          icon: 'icon-folder'
        },
        {
          name: '서버정보설정',
          url: '/master/server',
          icon: 'icon-layers'
        },
      ]
    },
    {
      name: '단말관리',
      url: '/clients',
      icon: 'icon-screen-desktop',
      children: [
        {
          name: '등록관리',
          url: '/clients/clientmanage',
          icon: 'icon-wrench'
        },
        {
          name: '그룹관리',
          url: '/clients/clientgroup',
          icon: 'icon-folder'
        },
        {
          name: '패키지관리',
          url: '/clients/packages',
          icon: 'icon-layers'
        },
        {
          name: '작업관리',
          url: '/clients/jobmanage',
          icon: 'icon-notebook'
        },
      ]
    },
    {
      name: '단말설정',
      url: '/clientconfig',
      icon: 'icon-screen-desktop',
      children: [
        {
          name: '데스크톱환경',
          url: '/clientconfig/desktop',
          icon: 'icon-wrench'
        },
        {
          name: '업데이트서버설정',
          url: '/clientconfig/update',
          icon: 'icon-folder'
        },
        {
          name: 'HOSTS설정',
          url: '/clientconfig/host',
          icon: 'icon-layers'
        },
        {
          name: '단말정책설정',
          url: '/clientconfig/setting',
          icon: 'icon-notebook'
        }
      ]
    },
    {
      name: '사용자정책관리',
      url: '/userconfig',
      icon: 'icon-screen-desktop',
      children: [
        {
          name: '매체제어정책관리',
          url: '/userconfig/media',
          icon: 'icon-wrench'
        },
        {
          name: '브라우저제어정책관리',
          url: '/userconfig/browser',
          icon: 'icon-folder'
        },
        {
          name: '단말보안정책관리',
          url: '/userconfig/security',
          icon: 'icon-layers'
        },
      ]
    },
  ]
};
