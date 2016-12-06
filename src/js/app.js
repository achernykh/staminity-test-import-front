import appConfig from './config/app.config.js'
import appRun from './config/app.run.js'

import './layout'
import './landingpage'
import './auth'
import './calendar'
import './user'
import './club'
import './users'
import './requests'
import './settings'
import './config/app.templates'
import './services'

let authToken = {token: "75cbd20b-4729-f57a-96d0-f37c6cbfa50a", userId: 4}
let userProfile1 = {
	userId: 4,
	revision: 1,
	public: {
		firstName: 'Евгений',
		lastName: 'Хабаров'
	},
	personal: {
		sex: 'M',
		birthday: new Date(),
		country: 'Russia',
		city: 'Moscow',
		about: 'Занимаюсь триатлоном с 2014 года ...',
		activity: ['run', 'swim', 'bike', 'triathlon'],
		email: 'chernykh@me.com',
	},
	private: {
		weight: 74,
		height: 183,
		level: 10,
		extEmail: 'chernykh.home@gmail.com',
		phone: '+79251154116'
	},
	display: {
		language: "ru",
		timezone: -12.0,
		calendar: 'gregorian',
		firstDayOfWeek: 7
	},
	trainingZones: [
		{
			type: "heartRate",
			activity: [
				{
					name: "default",
					unit: "bpm",
					zones: [
						{
							code: "recovery",
							valueTo: 140,
							validFrom: 0,
							valueFrom: 0
						},
						{
							code: "endurance",
							valueTo: 160,
							validFrom: 0,
							valueFrom: 141
						},
						{
							code: "tempo",
							valueTo: 171,
							validFrom: 0,
							valueFrom: 161
						},
						{
							code: "maximum",
							valueTo: 1000,
							validFrom: 0,
							valueFrom: 172
						}
					],
					thresholds: [
						{
							code: "HRmin",
							value: 56,
							validFrom: 0
						},
						{
							code: "FTHR",
							value: 192,
							validFrom: 0
						},
						{
							code: "HRmax",
							value: 210,
							validFrom: 0
						}
					]
				},
				{
					name: "running",
					unit: "bpm",
					zones: [
						{
							code: "recovery",
							valueTo: 138,
							validFrom: 0,
							valueFrom: 0
						},
						{
							code: "endurance",
							valueTo: 152,
							validFrom: 0,
							valueFrom: 138
						},
						{
							code: "tempo",
							valueTo: 173,
							validFrom: 0,
							valueFrom: 153
						},
						{
							code: "maximum",
							valueTo: 1000,
							validFrom: 0,
							valueFrom: 173
						}
					],
					thresholds: [
						{
							code: "АЭП",
							value: 150,
							validFrom: 0
						},
						{
							code: "АНПg",
							value: 179,
							validFrom: 0
						}
					]
				}
			]
		},
		{
			type: "paceSpeed",
			activity: [
				{
					name: "default",
					unit: "min/km",
					zones: [
						{
							code: "recovery",
							valueTo: 6,
							validFrom: 0,
							valueFrom: 10
						},
						{
							code: "endurance",
							valueTo: 5,
							validFrom: 0,
							valueFrom: 5.590000152587891
						},
						{
							code: "tempo",
							valueTo: 4,
							validFrom: 0,
							valueFrom: 4.590000152587891
						},
						{
							code: "maximum",
							valueTo: 0,
							validFrom: 0,
							valueFrom: 3.5899999141693115
						}
					]
				},
				{
					name: "running",
					unit: "min/km",
					zones: [
						{
							code: "recovery",
							valueTo: 4.300000190734863,
							validFrom: 0,
							valueFrom: 10
						},
						{
							code: "endurance",
							valueTo: 4,
							validFrom: 0,
							valueFrom: 4.289999961853027
						},
						{
							code: "tempo",
							valueTo: 3.200000047683716,
							validFrom: 0,
							valueFrom: 3.5899999141693115
						},
						{
							code: "maximum",
							valueTo: 0,
							validFrom: 0,
							valueFrom: 3.200000047683716
						}
					]
				}
			]
		},
		{
			type: "power",
			activity: [
				{
					name: "default",
					unit: "watt",
					zones: [
						{
							code: "recovery",
							valueTo: 140,
							validFrom: 0,
							valueFrom: 0
						},
						{
							code: "endurance",
							valueTo: 160,
							validFrom: 0,
							valueFrom: 141
						},
						{
							code: "tempo",
							valueTo: 171,
							validFrom: 0,
							valueFrom: 161
						},
						{
							code: "maximum",
							valueTo: 1000,
							validFrom: 0,
							valueFrom: 172
						}
					],
					thresholds: [
						{
							code: "FTPpower",
							value: 235,
							validFrom: 0
						}
					]
				}
			]
		}
	],
	externalService: [],
	privacy: [
		// Профиль: персональная информация
		{
			name: "personalInfo",
			setup: 10		// все = 10, подписчики = 20, группы = 30, тренер = 40, я = 100
		},
		// Профиль: сводная статистика по тренировкам
		{
			name: "personalSummary",
			setup: 20
		},
		// Тренировка: сводная информация
		{
			name: "activitySummary",
			setup: 30
		},
		// Тренировка: детальная фактическая информация
		{
			name: "activityActualDetails",
			setup: 40
		},
		// Тренировка: план и сравнение план/факт
		{
			name: "activityPlanDetails",
			setup: 50
		}
	],
	subscriptions: [
		{
			code: 'user'
		},
		{
			code: 'proUser'
		}
	],
	notifications: [{
		group: "act",
		events: [{"web": true, "name": "completedActivityByFriend", "email": true, "phone": true}, {
			web: true,
			name: "completedActivityByFollowing",
			email: true,
			phone: true
		}, {web: true, "name": "modifiedActivityByUser", "email": true, "phone": true}]
	}, {
		"group": "billing",
		"events": [{"web": true, "name": "scheduledSubscriptionRenewal", "email": true, "phone": true}]
	}, {
		"group": "group",
		"events": [{"web": true, "name": "requestedGroupMembership", "email": true, "phone": true}, {
			"web": true,
			"name": "receivedGroupInvitation",
			"email": true,
			"phone": true
		}, {"web": true, "name": "acceptedGroupMembership", "email": true, "phone": true}, {
			"web": true,
			"name": "declinedGroupMembership",
			"email": true,
			"phone": true
		}]
	}, {
		"group": "sync",
		"events": [{"web": true, "name": "completedInitialProviderSync", "email": true, "phone": true}, {
			"web": true,
			"name": "uploadedActivityByProvider",
			"email": true,
			"phone": true
		}]
	}, {
		"group": "userProfile",
		"events": [{"web": true, "name": "zonesChangedByTrainer", "email": true, "phone": true}, {
			"web": true,
			"name": "zonesInconsistsBySystemAnalisys",
			"email": true,
			"phone": true
		}, {"web": true, "name": "zonesChangedByAthelete", "email": true, "phone": true}]
	}],
	"subscriptions": [{"code": "user", "validThrough": "2026-07-07T10:15:29.599777"}, {
		"code": "proUser",
		"validThrough": "2019-04-02T10:15:29.599777"
	}],

}
let userProfile2 = {
	userId: 5,
	revision: 1,
	public: {
		firstName: 'Александр',
		lastName: 'Черных'
	},
	personal: {
		sex: 'M',
		birthday: new Date(),
		country: 'Russia',
		city: 'Moscow',
		about: 'Занимаюсь триатлоном с 2014 года ...',
		activity: ['run', 'swim', 'bike', 'triathlon'],
		email: 'chernykh@me.com',
	},
	private: {
		weight: 74,
		height: 183,
		level: 10,
		extEmail: 'chernykh.home@gmail.com',
		phone: '+79251154116'
	},
	display: {
		language: "ru",
		timezone: -12.0,
		calendar: 'gregorian',
		firstDayOfWeek: 7
	},
	trainingZones: [
		{
			type: "heartRate",
			activity: [
				{
					name: "default",
					unit: "bpm",
					zones: [
						{
							code: "recovery",
							valueTo: 140,
							validFrom: 0,
							valueFrom: 0
						},
						{
							code: "endurance",
							valueTo: 160,
							validFrom: 0,
							valueFrom: 141
						},
						{
							code: "tempo",
							valueTo: 171,
							validFrom: 0,
							valueFrom: 161
						},
						{
							code: "maximum",
							valueTo: 1000,
							validFrom: 0,
							valueFrom: 172
						}
					],
					thresholds: [
						{
							code: "HRmin",
							value: 56,
							validFrom: 0
						},
						{
							code: "FTHR",
							value: 192,
							validFrom: 0
						},
						{
							code: "HRmax",
							value: 210,
							validFrom: 0
						}
					]
				},
				{
					name: "running",
					unit: "bpm",
					zones: [
						{
							code: "recovery",
							valueTo: 138,
							validFrom: 0,
							valueFrom: 0
						},
						{
							code: "endurance",
							valueTo: 152,
							validFrom: 0,
							valueFrom: 138
						},
						{
							code: "tempo",
							valueTo: 173,
							validFrom: 0,
							valueFrom: 153
						},
						{
							code: "maximum",
							valueTo: 1000,
							validFrom: 0,
							valueFrom: 173
						}
					],
					thresholds: [
						{
							code: "АЭП",
							value: 150,
							validFrom: 0
						},
						{
							code: "АНПg",
							value: 179,
							validFrom: 0
						}
					]
				}
			]
		},
		{
			type: "paceSpeed",
			activity: [
				{
					name: "default",
					unit: "min/km",
					zones: [
						{
							code: "recovery",
							valueTo: 6,
							validFrom: 0,
							valueFrom: 10
						},
						{
							code: "endurance",
							valueTo: 5,
							validFrom: 0,
							valueFrom: 5.590000152587891
						},
						{
							code: "tempo",
							valueTo: 4,
							validFrom: 0,
							valueFrom: 4.590000152587891
						},
						{
							code: "maximum",
							valueTo: 0,
							validFrom: 0,
							valueFrom: 3.5899999141693115
						}
					]
				},
				{
					name: "running",
					unit: "min/km",
					zones: [
						{
							code: "recovery",
							valueTo: 4.300000190734863,
							validFrom: 0,
							valueFrom: 10
						},
						{
							code: "endurance",
							valueTo: 4,
							validFrom: 0,
							valueFrom: 4.289999961853027
						},
						{
							code: "tempo",
							valueTo: 3.200000047683716,
							validFrom: 0,
							valueFrom: 3.5899999141693115
						},
						{
							code: "maximum",
							valueTo: 0,
							validFrom: 0,
							valueFrom: 3.200000047683716
						}
					]
				}
			]
		},
		{
			type: "power",
			activity: [
				{
					name: "default",
					unit: "watt",
					zones: [
						{
							code: "recovery",
							valueTo: 140,
							validFrom: 0,
							valueFrom: 0
						},
						{
							code: "endurance",
							valueTo: 160,
							validFrom: 0,
							valueFrom: 141
						},
						{
							code: "tempo",
							valueTo: 171,
							validFrom: 0,
							valueFrom: 161
						},
						{
							code: "maximum",
							valueTo: 1000,
							validFrom: 0,
							valueFrom: 172
						}
					],
					thresholds: [
						{
							code: "FTPpower",
							value: 235,
							validFrom: 0
						}
					]
				}
			]
		}
	],
	externalService: [],
	privacy: [
		// Профиль: персональная информация
		{
			name: "personalInfo",
			setup: 10		// все = 10, подписчики = 20, группы = 30, тренер = 40, я = 100
		},
		// Профиль: сводная статистика по тренировкам
		{
			name: "personalSummary",
			setup: 20
		},
		// Тренировка: сводная информация
		{
			name: "activitySummary",
			setup: 30
		},
		// Тренировка: детальная фактическая информация
		{
			name: "activityActualDetails",
			setup: 40
		},
		// Тренировка: план и сравнение план/факт
		{
			name: "activityPlanDetails",
			setup: 50
		}
	],
	subscriptions: [
		{
			code: 'user'
		},
		{
			code: 'proUser'
		}
	],
	notifications: [{
		group: "act",
		events: [{"web": true, "name": "completedActivityByFriend", "email": true, "phone": true}, {
			web: true,
			name: "completedActivityByFollowing",
			email: true,
			phone: true
		}, {web: true, "name": "modifiedActivityByUser", "email": true, "phone": true}]
	}, {
		"group": "billing",
		"events": [{"web": true, "name": "scheduledSubscriptionRenewal", "email": true, "phone": true}]
	}, {
		"group": "group",
		"events": [{"web": true, "name": "requestedGroupMembership", "email": true, "phone": true}, {
			"web": true,
			"name": "receivedGroupInvitation",
			"email": true,
			"phone": true
		}, {"web": true, "name": "acceptedGroupMembership", "email": true, "phone": true}, {
			"web": true,
			"name": "declinedGroupMembership",
			"email": true,
			"phone": true
		}]
	}, {
		"group": "sync",
		"events": [{"web": true, "name": "completedInitialProviderSync", "email": true, "phone": true}, {
			"web": true,
			"name": "uploadedActivityByProvider",
			"email": true,
			"phone": true
		}]
	}, {
		"group": "userProfile",
		"events": [{"web": true, "name": "zonesChangedByTrainer", "email": true, "phone": true}, {
			"web": true,
			"name": "zonesInconsistsBySystemAnalisys",
			"email": true,
			"phone": true
		}, {"web": true, "name": "zonesChangedByAthelete", "email": true, "phone": true}]
	}],
	"subscriptions": [{"code": "user", "validThrough": "2026-07-07T10:15:29.599777"}, {
		"code": "proUser",
		"validThrough": "2019-04-02T10:15:29.599777"
	}],

}

sessionStorage.setItem('authToken', JSON.stringify(authToken))
sessionStorage.setItem('userProfile#4', JSON.stringify(userProfile1))
sessionStorage.setItem('userProfile#5', JSON.stringify(userProfile2))

const requires = [
    'ngMaterial',
    'ngAnimate',
    'ngMessages',
    'pascalprecht.translate',
    'ngWebSocket',
    'ui.router',
    'duScroll',
    'ui.scroll',
    'ui.scroll.jqlite',
    'dndLists',
    'hm.readmore',
    'staminity.layout',
    'staminity.templates',
    'staminity.landing',
    'staminity.auth',
    'staminity.calendar',
    'staminity.user',
    'staminity.club',
    'staminity.users',
    'staminity.requests',
    'staminity.settings',
    'staminity.services'
]

angular
	.module('staminity.application', requires)
	.config(appConfig)
	.run(appRun)

angular.bootstrap(document, ['staminity.application'], {strictDi: true});
