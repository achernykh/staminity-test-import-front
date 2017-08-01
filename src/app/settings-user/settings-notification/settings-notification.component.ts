import './settings-notification.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class SettingsNotificationCtrl implements IComponentController {

    public notifications: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const SettingsNotificationComponent:IComponentOptions = {
    bindings: {
        notifications: '<',
        onChange: '&'
    },
    require: {
        //component: '^component'
    },
    controller: SettingsNotificationCtrl,
    template: require('./settings-notification.component.html') as string
};

export default SettingsNotificationComponent;