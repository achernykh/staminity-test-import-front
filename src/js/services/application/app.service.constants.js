const ViewConstants = {
  welcome: {
    style: 'welcome-page',
    background: 'landing-background',
    header: {
      title: {
        show: false
      },
      toolbar: false,
      leftPanel: {
        url: null,
        size: 20
      },
      rightPanel: {
        url: 'layout/application/header/welcome.links.html',
        size: 80
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
    style: 'welcome-page',
    background: 'application-dark',
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
  }
  /*calendar: {
    style: 'app-page',
    background: 'application-light',
    header: {
      title: {
        show: true
      },
      toolbar: true,
      leftPanel: {
        url: 'layout/application/header/appmenutoolbar.html',
        size: 20
      },
      rightPanel: {
        url: 'layout/application/header/usertoolbar.html',
        size: 20
      }
    },
    frame: {
      size: 'grow',
      margin: '5'
    },
    athletes: {
      show: true
    }
  }*/
};
export default ViewConstants
