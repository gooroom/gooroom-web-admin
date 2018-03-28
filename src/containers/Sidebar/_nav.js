export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        text: 'NEW'
      }
    },
    // {
    //   title: true,
    //   name: '단말기',
    //   wrapper: {            // optional wrapper object
    //     element: '',        // required valid HTML5 element tag
    //     attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    //   },
    //   class: ''             // optional class names space delimited list for title item ex: "text-center"
    // },
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
    {
      name: '-----------',
      url: '/',
      icon: 'icon-star',
      variant: 'warning',
    },
    {
      name: 'Colors',
      url: '/theme/colors',
      icon: 'icon-drop',
    },
    {
      name: 'Typography',
      url: '/theme/typography',
      icon: 'icon-pencil',
    },
    {
      title: true,
      name: 'Components',
      wrapper: {
        element: '',
        attributes: {}
      },
    },
    {
      name: 'Base',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Breadcrumbs',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'icon-puzzle'
        },
        {
          name: 'Carousels',
          url: '/base/carousels',
          icon: 'icon-puzzle'
        },
        {
          name: 'Collapses',
          url: '/base/collapses',
          icon: 'icon-puzzle'
        },
        {
          name: 'Dropdowns',
          url: '/base/dropdowns',
          icon: 'icon-puzzle'
        },
        {
          name: 'Forms',
          url: '/base/forms',
          icon: 'icon-puzzle'
        },
        {
          name: 'Jumbotrons',
          url: '/base/jumbotrons',
          icon: 'icon-puzzle'
        },
        {
          name: 'List groups',
          url: '/base/list-groups',
          icon: 'icon-puzzle'
        },
        {
          name: 'Navs',
          url: '/base/navs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Paginations',
          url: '/base/paginations',
          icon: 'icon-puzzle'
        },
        {
          name: 'Popovers',
          url: '/base/popovers',
          icon: 'icon-puzzle'
        },
        {
          name: 'Progress Bar',
          url: '/base/progress-bar',
          icon: 'icon-puzzle'
        },
        {
          name: 'Switches',
          url: '/base/switches',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tables',
          url: '/base/tables',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tabs',
          url: '/base/tabs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tooltips',
          url: '/base/tooltips',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: 'Buttons',
      url: '/buttons',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Buttons',
          url: '/buttons/buttons',
          icon: 'icon-cursor'
        },
        {
          name: 'Button dropdowns',
          url: '/buttons/button-dropdowns',
          icon: 'icon-cursor'
        },
        {
          name: 'Button groups',
          url: '/buttons/button-groups',
          icon: 'icon-cursor'
        },
        {
          name: 'Social Buttons',
          url: '/buttons/social-buttons',
          icon: 'icon-cursor'
        }
      ]
    },
    {
      name: 'Charts',
      url: '/charts',
      icon: 'icon-pie-chart'
    },
    {
      name: 'Icons',
      url: '/icons',
      icon: 'icon-star',
      children: [
        {
          name: 'Flags',
          url: '/icons/flags',
          icon: 'icon-star',
          badge: {
            variant: 'default',
            text: 'NEW'
          }
        },
        {
          name: 'Font Awesome',
          url: '/icons/font-awesome',
          icon: 'icon-star',
          badge: {
            variant: 'secondary',
            text: '4.7'
          }
        },
        {
          name: 'Simple Line Icons',
          url: '/icons/simple-line-icons',
          icon: 'icon-star'
        }
      ]
    },
    {
      name: 'Notifications',
      url: '/notifications',
      icon: 'icon-bell',
      children: [
        {
          name: 'Alerts',
          url: '/notifications/alerts',
          icon: 'icon-bell'
        },
        {
          name: 'Badges',
          url: '/notifications/badges',
          icon: 'icon-bell'
        },
        {
          name: 'Modals',
          url: '/notifications/modals',
          icon: 'icon-bell'
        },
      ]
    },
    {
      name: 'Widgets',
      url: '/widgets',
      icon: 'icon-calculator',
      badge: {
        variant: 'default',
        text: 'NEW'
      }
    },
    {
      divider: true
    },
    {
      title: true,
      name: 'Extras'
    },
    {
      name: 'Pages',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'icon-star'
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'icon-star'
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'icon-star'
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'icon-star'
        }
      ]
    },
  ]
};
