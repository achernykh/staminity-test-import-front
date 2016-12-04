const ViewConstants = {
  // Настройка страницы: Стартовая страница ../welcome
  welcome: {
    background: {
      style: 'application-light', //'landing-background',
      toolbar: false,
      size: '160'
    },
    header: {
      enabled: true,
      title: false,
      athletes: false,
      leftPanel: {
        url: null,
        size: 20
      },
      rightPanel: {
        //url: 'layout/application/header/welcome.links.html',
        size: 80
      }
    },
    application: {
      style: 'welcome-page',
      margin: 'auto',
      size: 80
    }
  },
  signup: {
    style: 'welcome-page',
    background: 'landing-background blur',
    header: {
      title: {
        show: false
      },
      toolbar: false,
      leftPanel: {
        url: 'layout/application/header/backbar.html',
        size: 50
      },
      rightPanel: {
        url: null,
        size: 50
      }
    },
    frame: {
      size: 'none',
      margin: 'auto'
    },
    athletes: {
      show: false
    }
  },
  signin: {
    background: {
      style: 'dark-blue-grey',
      toolbar: true,
      size: '160'
    },
    header: {
      enabled: true,
      title: false,
      athletes: false,
      leftPanel: {
        url: 'layout/application/header/backbar.html',
        size: 30
      },
      rightPanel: {
        url: null,
        size: 30
      }
    },
    application: {
      style: 'app-page',
      margin: 20,
      size: 'grow'
    }
  },
  // Настройка страницы: Календарь ../calendar
  calendar: {
    background: {
      style: 'application-light',
      toolbar: true,
      size: '160'
    },
    header: {
      enabled: true,
      title: true,
      athletes: true,
      leftPanel: {
        url: 'layout/application/header/appmenutoolbar.html',
        size: 20
      },
      rightPanel: {
        url: 'layout/application/header/usertoolbar.html',
        size: 20
      }
    },
    application: {
      style: 'app-page',
      margin: 2,
      size: 'grow'
    }
  },
  // Настройка страницы: Настройки пользователя ../settings
  settings: {
    background: {
      style: 'light-grey',
      toolbar: true,
      size: '160'
    },
    header: {
      enabled: true,
      title: true,
      athletes: true,
      leftPanel: {
        url: 'layout/application/header/appmenutoolbar.html',
        size: 20
      },
      rightPanel: {
        url: 'layout/application/header/usertoolbar.html',
        size: 20
      }
    },
    application: {
      style: 'app-page',
      margin: 20,
      size: 'grow'
    }
  },
  // Настройка страницы: Профиль пользователя /user
  user: {
    background: {
      style: 'light-grey',
      toolbar: true,
      size: '160'
    },
    header: {
      enabled: true,
      title: true,
      athletes: true,
      leftPanel: {
        url: 'layout/application/header/appmenutoolbar.html',
        size: 20
      },
      rightPanel: {
        url: 'layout/application/header/usertoolbar.html',
        size: 20
      }
    },
    application: {
      style: 'app-page',
      margin: 20,
      size: 'grow'
    }
  },
  // Настройка страницы: Профиль тренрского клуба /club
  club: {
    background: {
      style: 'light-grey',
      toolbar: true,
      size: '160'
    },
    header: {
      enabled: true,
      title: true,
      athletes: true,
      leftPanel: {
        url: 'layout/application/header/appmenutoolbar.html',
        size: 20
      },
      rightPanel: {
        url: 'layout/application/header/usertoolbar.html',
        size: 20
      }
    },
    application: {
      style: 'app-page',
      margin: 20,
      size: 'grow'
    }
  },
  // Настройка страницы: Список пользователей /users
  users: {
    background: {
      style: 'light-grey',
      toolbar: true,
      size: '160'
    },
    header: {
      enabled: true,
      title: true,
      athletes: true,
      leftPanel: {
        url: 'layout/application/header/appmenutoolbar.html',
        size: 20
      },
      rightPanel: {
        url: 'layout/application/header/usertoolbar.html',
        size: 20
      }
    },
    application: {
      style: 'app-page',
      margin: 20,
      size: 'grow'
    }
  }
};
export default ViewConstants
