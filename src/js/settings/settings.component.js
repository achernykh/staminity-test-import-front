import { _NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
         _PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD } from './settings.const.js'

class SettingsCtrl {
    constructor(UserService, SystemMessageService, ActionMessageService) {
      'ngInject'
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
        this._LANGUAGE = _LANGUAGE
        this._UNITS = _UNITS
        this._UserService = UserService
        this._SystemMessageService = SystemMessageService
        this._ActionMessageService = ActionMessageService
    }
    $onInit() {
        "use strict";
        console.log('settings=', this)
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
        var profile = {};
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
