import {
	_NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
	_PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD, _country_list
} from './settings-club.constants'

import './settings-club.component.scss';

class SettingsClubCtrl {

	constructor ($scope, GroupService, $locale, $http, dialogs, message) {
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
		this._$http = $http
		this.message = message
	}

	$onInit(){
		this.clubHotfix();
	}

	clubHotfix () {
		this.club.public = this.club.public || {}
		this.club.public.activityTypes = this.club.public.activityTypes || []
	}
	
	setClub (club) {
		this.club = club;
		this.clubHotfix();
		this.$scope.$apply();
	}

	countrySearch (query) {
		let search = (key) => this._country_list['ru'][key].toLowerCase().includes(query.toLowerCase())
		return query? Object.keys(this._country_list['ru']).filter(search) : this._country_list
	}

	citySearch (query) {
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

	isDirty () {
		return this.publicForm && this.publicForm.$dirty 
	}

	isValid () {
		return this.publicForm && this.publicForm.$valid
	}

	update () {
		this.GroupService.putProfile(this.club)
			.then((result) => {
				this.setClub(result)
				this.message.toastInfo('settingsClubSaveComplete')
			}, (error) => {
				this.message.toastError(error)
			});
	}

	weekdays (day) {
		return moment.weekdays(day)
	}
	
	uploadAvatar () {
		this.dialogs.uploadPicture()
		.then((picture) => this.GroupService.postProfileAvatar(this.club.groupId, picture))
        .then(club => club && this.setClub(club), error => { this.message.toastError(error); throw error; })
		.then(() => this.message.toastInfo('updateClubAvatar'))
	}
	
	uploadBackground () {
		this.dialogs.uploadPicture()
		.then((picture) => this.GroupService.postProfileBackground(this.club.groupId, picture))
		.then((club) => club && this.setClub(club), error => { this.message.toastError(error); throw error; })
		.then(() => this.message.toastInfo('updateclubBackgroundImage'))
	}

	toggleActivity (activity) {
		if (this.isActivityChecked(activity)) {
			let index = this.club.public.activityTypes.indexOf(activity);
			this.club.public.activityTypes.splice(index, 1);
		} else {
			this.club.public.activityTypes.push(activity);
		}
		this.publicForm.$setDirty();
	}

	isActivityChecked (activity) {
		return this.club.public.activityTypes.includes(activity)
	}
}
SettingsClubCtrl.$inject = ['$scope','GroupService','$locale','$http','dialogs','message'];

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
