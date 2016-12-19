import { _NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
         _PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD, _country_list } from './settings.const.js'

class SettingsCtrl {
    constructor(UserService, SystemMessageService, ActionMessageService, $locale, $http) {
      'ngInject'
        console.log('$locale',$locale)
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
        this._LANGUAGE = _LANGUAGE
        this._UNITS = _UNITS
        this._country_list = _country_list;
        this._UserService = UserService
        this._SystemMessageService = SystemMessageService
        this._ActionMessageService = ActionMessageService
        this._$http = $http
    }
    $onInit() {
        "use strict";
        console.log('settings=', this)
    }

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    countrySearch (query) {
        return query ?
            Object.keys(this._country_list['ru']).filter((key)=> {
                return this._country_list['ru'][key].toLowerCase().indexOf(query.toLowerCase()) === 0
            }) : this._country_list

        //    deferred;
        /*if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }*/
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
                        .then((result)=>{
                            console.log('citySearch result:',result.predictions)
                            return result.predictions
                        }, (error) => {
                            console.log('citySearch error:', error)
                            return []
                        })
    }

    isDirty(){
        return  this.publicForm.$dirty ||
                this.personalFirstForm.$dirty || this.personalSecondForm.$dirty ||
                this.privateForm.$dirty ||
                this.notificationsForm.$dirty ||
                this.privacyForm.$dirty


    }

    isValid(){
        return  this.publicForm.$valid ||
                this.personalFirstForm.$valid || this.personalSecondForm.$valid ||
                this.privateForm.$valid ||
                this.notificationsForm.$valid ||
                this.privacyForm.$valid
    }

    update(form){
        var profile = {
            userId: this.user.userId,
            revision: this.user.revision
        };
        for (var name in form) {
            if (form[name]){
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
            .then((success)=>{
                console.log('success=',success)
                this._ActionMessageService.simple(success)
                this.user.revision = success.value.revision
            },(error)=>{
                //this._SystemMessageService.show(error)
                this._ActionMessageService.simple(error)
            });
    }

    get language() {

    }

    set language(id) {

    }

    get firstDayOfWeek() {
      //return moment.weekdays(this.user.display.firstDayOfWeek)
    }

    set firstDayOfWeek(day) {
      //console.log('firstDayOfWeek', day)
      //this.user.display.firstDayOfWeek = day
    }

    log(){
        console.log('settings=', this)
    }

    weekdays(day) {
      return moment.weekdays(day)
    }

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
