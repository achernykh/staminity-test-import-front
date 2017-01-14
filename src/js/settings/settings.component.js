import {
	_NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
	_PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD, _country_list
} from './settings.const.js'

class SettingsCtrl {
	constructor(UserService, AuthService, SystemMessageService, ActionMessageService, $locale, $http, $mdDialog, dialogs, AthleteSelectorService) {
		'ngInject'
		console.log('$locale', $locale)
		this._NAVBAR = _NAVBAR
		this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
		this._DELIVERY_METHOD = _DELIVERY_METHOD
		this._PRIVACY_LEVEL = _PRIVACY_LEVEL
		this._LANGUAGE = _LANGUAGE
		this._UNITS = _UNITS
		this._country_list = _country_list;
		this._UserService = UserService;
		this._AuthService = AuthService;
		this._SystemMessageService = SystemMessageService
		this._ActionMessageService = ActionMessageService
		this._$http = $http
		this._$mdDialog = $mdDialog
		this.dialogs = dialogs
		
		this.user.public = this.user.public || {}
		this.user.personal = this.user.personal || {}
		
		this.user = Object.assign(this.user, {
			externalDataProviders: {
				GarminConnect: {
					login: 'chernykh@me.com',
					password: 'garmin',
					lastSync: new Date(),
					startDate: new Date(),
					enabled: true
				},
				Strava: {
					/*lastSync: Date;
					 startDate: Date;*/
					enabled: false
				},
				PolarFlow: {
					/*login?: string;
					 password?: string;
					 lastSync?: Date;
					 startDate?: Date;*/
					enabled: false
				},
				MoveCount: {
					/*login?: string;
					 password?: string;
					 lastSync?: Date;
					 startDate?: Date;*/
					enabled: false
				}
			}
		}, {
			billing: {
				tariffs: [
					{
						code: 'Базовый',
						status: '',
						enabled: true,
						editable: false
					},
					{
						code: 'Премиум',
						status: 'Подкючен до 30.12.16',
						enabled: true,
						editable: true
					},
					{
						code: 'Тренер',
						status: 'Подкоючен за счет клуба ЦПС ТЕМП',
						enabled: true,
						editable: false
					},
					{
						code: 'Клуб',
						status: 'Пробный период до 30.01.17',
						enabled: false,
						editable: false
					}
				],
				bills: [
					{
						amount: '106',
						start: new Date(),
						end: new Date(),
						status: 'new'
					},
					{
						amount: '1072',
						start: new Date(),
						end: new Date(),
						status: 'ready'
					},
					{
						amount: '360',
						start: new Date(),
						end: new Date(),
						status: 'complete'
					}
				]
			}
		})

		//this._athlete$ = AthleteSelectorService._athlete$
		//	.subscribe((athlete)=> console.log('SettingsCtrl new athlete=', athlete))
		// Смена атлета тренера в основном окне приложения, необходмо перезагрузить все данные
	}

	$onInit() {
		"use strict";
		console.log('settings=', this)
	}

	changeUnit(units){
		this.user.display.units = units;
		this.displayForm.$dirty = true;
	}

	changefirstDayOfWeek(number){
		this.user.display.firstDayOfWeek = number;
		this.displayForm.$dirty = true;
	}

	countrySearch(query) {
		return query ?
			Object.keys(this._country_list['ru']).filter((key)=> {
				return this._country_list['ru'][key].toLowerCase().indexOf(query.toLowerCase()) === 0
			}) : this._country_list
	}

	citySearch(query) {

		let api = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
		let language = 'ru'
		let key = 'AIzaSyAOt7X5dgVmvxcx3WCVZ0Swm3CyfzDDTcM'
		let request = {
			method: 'GET',
			url: `${api}?input=${query}&types=(cities)&language=${language}&key=${key}`,
			headers: {
				'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description',
				'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
				'Access-Control-Allow-Origin': '*'
			}
		}

		return this._$http(request)
			.then((result)=> {
				console.log('citySearch result:', result.predictions)
				return result.predictions
			}, (error) => {
				console.log('citySearch error:', error)
				return []
			})
	}

	isDirty() {
		return this.publicForm && this.publicForm.$dirty ||
			this.personalFirstForm && this.personalFirstForm.$dirty || 
			this.personalSecondForm && this.personalSecondForm.$dirty ||
			this.privateForm && this.privateForm.$dirty ||
			this.displayForm && this.displayForm.$dirty ||
			this.notificationsForm && this.notificationsForm.$dirty ||
			this.privacyForm && this.privacyForm.$dirty
	}

	isValid() {
		return this.publicForm && this.publicForm.$valid ||
			this.personalFirstForm && this.personalFirstForm.$valid || 
			this.personalSecondForm && this.personalSecondForm.$valid ||
			this.privateForm && this.privateForm.$valid ||
			this.displayForm && this.displayForm.$valid ||
			this.notificationsForm && this.notificationsForm.$valid ||
			this.privacyForm && this.privacyForm.$valid
	}

	update(form) {
		var profile = {
			userId: this.user.userId,
			revision: this.user.revision
		};
		for (var name in form) {
			if (form[name]) {
				profile[name] = this.user[name];
				console.log('settings ctrl => update profile form: ', name);
				if (name == "personal") {
					this[name + 'FirstForm'].$setPristine();
					this[name + 'SecondForm'].$setPristine();
				} else
					this[name + 'Form'].$setPristine();
			}
		}
		console.log('settings ctrl => update profile form: ', profile);
		this._UserService.putProfile(profile)
			.then((success)=> {
				console.log('success=', success)
				this._ActionMessageService.simple(success)
				this.user.revision = success.value.revision
			}, (error)=> {
				//this._SystemMessageService.show(error)
				this._ActionMessageService.simple(error)
			});
	}

	get language() {

	}

	set language(id) {

	}

	get firstDayOfWeek() {
		return ((this.user.display.hasOwnProperty('firstDayOfWeek')) && moment.weekdays(this.user.display.firstDayOfWeek)) || null
	}

	set firstDayOfWeek(number) {
		this.user.display.firstDayOfWeek = number;
		this.displayForm.$dirty = true;
	}

	log() {
		console.log('settings=', this)
	}

	weekdays(day) {
		return moment.weekdays(day)
	}

	showProviderSettings(ev, service, provider) {
		console.log('provider settings =', typeof ev, service, provider)

		if(provider.enabled) {
			this._$mdDialog.show({
				controller: DialogController,
				controllerAs: '$ctrl',
				templateUrl: 'settings/dialogs/provider.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					service: service,
					provider: provider
				},
				bindToController: true,
				clickOutsideToClose: true,
				escapeToClose: true,
				fullscreen: false // Only for -xs, -sm breakpoints.
			})
				.then((answer) => {
					this.status = 'You said the information was "' + answer + '".';
				}, () => {
					// Если диалог открывается по вызову ng-change
					if (typeof ev === 'undefined') provider.enabled = false
					this.status = 'You cancelled the dialog.';
				})
		}
	}

	showPasswordChange(ev) {
		//console.log('provider settings =', typeof ev, service, provider)

		//if(provider.enabled) {
			this._$mdDialog.show({
				controller: DialogController,
				controllerAs: '$ctrl',
				templateUrl: 'settings/dialogs/changepassword.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				bindToController: true,
				clickOutsideToClose: true,
				escapeToClose: true,
				fullscreen: false // Only for -xs, -sm breakpoints.
			})
				.then((password) => {
					console.log(`You said the information was ${password}.`);
					this._AuthService.setPassword(password)
						.then((response) => {
							console.log(response)
							this._SystemMessageService.show(response.title, response.status, )
						}, (error) => {
							console.log(error)
						})
				}, () => {
					// Если диалог открывается по вызову ng-change
					if (typeof ev === 'undefined') provider.enabled = false
					this.status = 'You cancelled the dialog.';
				})
		//}
	}

	uploadAvatar () {
		this.dialogs.uploadPicture()
		.then((picture) => this._UserService.postProfileAvatar(picture))
		.then((user) => { this.user = user })
	}
	
	uploadBackground () {
		this.dialogs.uploadPicture()
		.then((picture) => this._UserService.postProfileBackground(picture))
		.then((user) => { this.user = user })
	}
}

function DialogController($scope, $mdDialog) {
	'ngInject'
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}


let Settings = {
	bindings: {
		view: '<',
		user: '<'
	},
	transclude: false,
	controller: SettingsCtrl,
	templateUrl: "settings/settings.html"
}

export default Settings
