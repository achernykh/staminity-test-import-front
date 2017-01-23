import {
	_NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
	_PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD, _country_list
} from './settings-club.constants'

import './settings-club.component.scss';

class SettingsClubCtrl {
	constructor($scope, GroupService,ActionMessageService, $locale, $http, dialogs) {
		console.log('$locale', $locale)
		this._NAVBAR = _NAVBAR
		this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
		this._DELIVERY_METHOD = _DELIVERY_METHOD
		this._PRIVACY_LEVEL = _PRIVACY_LEVEL
		this._LANGUAGE = _LANGUAGE
		this._UNITS = _UNITS
		this._country_list = _country_list
		
		this.$scope = $scope
		this.GroupService = GroupService
		this.dialogs = dialogs
		this._ActionMessageService = ActionMessageService
		this._$http = $http
	}

	$onInit(){
		this.club.public = this.club.public || {}
		this.club.public.activityTypes = this.club.public.activityTypes || []
		console.log('clubsettings', this)
	}

	countrySearch(query) {
		return query ?
			Object.keys(this._country_list['ru']).filter((key) => this._country_list['ru'][key].toLowerCase().indexOf(query.toLowerCase()) === 0) : this._country_list
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
		return this.publicForm && this.publicForm.$dirty 
	}

	isValid() {
		return this.publicForm && this.publicForm.$valid
	}

	update () {
		this.GroupService.putProfile(this.club)
			.then((result) => {
				this.club = result
			}, (error) => {
				this._ActionMessageService.simple(error)
			});
	}

	weekdays (day) {
		return moment.weekdays(day)
	}
	
	uploadAvatar () {
		this.dialogs.uploadPicture()
		.then((picture) => this.GroupService.postProfileAvatar(this.club.groupId, picture))
		.then((club) => { this.club = club })
	}
	
	uploadBackground () {
		this.dialogs.uploadPicture()
		.then((picture) => this.GroupService.postProfileBackground(this.club.groupId, picture))
		.then((club) => { this.club = club })
	}
}
SettingsClubCtrl.$inject = ['$scope','GroupService','ActionMessageService','$locale','$http','dialogs'];

let SettingsClubComponent = {
	bindings: {
		view: '<',
		club: '<'
	},
	transclude: false,
	controller: SettingsClubCtrl,
	template: require("./settings-club.component.html")
}

export default SettingsClubComponent
