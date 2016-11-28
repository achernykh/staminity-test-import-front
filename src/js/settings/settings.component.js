import { _NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
         _PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD } from './settings.const.js'

class SettingsCtrl {
    constructor(User) {
      'ngInject'
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
        this._LANGUAGE = _LANGUAGE
        this._UNITS = _UNITS
        this._User = User
        this._currentUser = User.currentUser
    }
    $onInit() {
        "use strict";
        console.log('settings=', this)
    }

    get language() {

    }

    set language(id) {

    }

    get firstDayOfWeek() {
      return moment.weekdays(this.app.user.display.firstDayOfWeek)
    }

    set firstDayOfWeek(day) {
      console.log('firstDayOfWeek', day)
      this.app.user.display.firstDayOfWeek = day
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
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: SettingsCtrl,
    templateUrl: "settings/settings.html"
}

export default Settings
