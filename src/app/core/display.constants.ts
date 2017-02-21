import { merge } from 'angular';

export class DisplayView  {
	constructor(private state: string){
		merge(
			this,
			_display_view[this.state],
			{
				header: {
					fullTitle: state+'.fullTitle',
					shortTitle: state+'.shortTitle'
				}
			}
		);
	}
}

export const DefaultTemplate = (component) => {
	return {
		"background": {
			component: "staminityBackground",
				bindings: {
				view: 'view.background'
			}
		},
		"header": {
			component: 'staminityHeader',
				bindings: {
				view: 'view.header'
			}
		},
		"application": {
			component: component,
				bindings: {
				view: 'view.application'
			}
		}
	};
};

export const _display_view = {
	// Настройка страницы: Стартовая страница ../welcome
	landingPage: {
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
				url: 'header/welcome.links.html',
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
		//style: 'welcome-page',
		//background: 'landing-background blur',
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
	api: {
		background: {
			style: 'dark-blue-grey',
			toolbar: true,
			size: '160'
		},
		header: {
			enabled: true,
			title: true,
			athletes: false,
			leftPanel: {
				url: 'header/appmenutoolbar.html',
				size: 30
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
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
				url: 'header/appmenutoolbar.html',
				size: 20
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
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
				url: 'header/appmenutoolbar.html',
				size: 20
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
				size: 20
			}
		},
		application: {
			style: 'app-page',
			margin: 20,
			size: 'grow'
		}
	},
	// Настройка страницы: Настройки пользователя ../dashboard
	dashboard: {
		fullTitle:'Атлеты',
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
				url: 'header/appmenutoolbar.html',
				size: 20
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
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
				url: 'header/appmenutoolbar.html',
				size: 20
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
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
				url: 'header/appmenutoolbar.html',
				size: 20
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
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
				url: 'header/appmenutoolbar.html',
				size: 20
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
				size: 20
			}
		},
		application: {
			style: 'app-page',
			margin: 20,
			size: 'grow'
		}
	},
	// Настройка страницы: Список пользователей /athletes
	athletes: {
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
				url: 'header/appmenutoolbar.html',
				size: 20
			},
			rightPanel: {
				url: 'header/usertoolbar.html',
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