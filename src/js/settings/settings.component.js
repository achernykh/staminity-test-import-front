import { _NAVBAR, _DELIVERY_METHOD, _PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD } from './settings.const.js'

class SettingsCtrl {
    constructor() {
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
    }
    $onInit() {
        "use strict";
        console.log('settings=', this)
    }

}

let Settings = {
    bindings: {
        view: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: SettingsCtrl,
    templateUrl: "settings/settings.html"
}

export default Settings
