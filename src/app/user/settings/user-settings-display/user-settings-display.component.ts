import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-display.component.scss';

class UserSettingsDisplayCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    units = ["metric", "imperial"];

    static $inject = ['DisplayService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private displayService: any,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
    ) {

    }   

    getTimezoneTitle () {
        if (this.owner) {
            let timezone = this.owner.display.timezone;
            return (timezone && `(GMT${momentTimezone.tz(timezone).format('Z')}) ${timezone}`) || null;
        }
    }

    getDateFormat () {
        return moment().format('L');
    }

    changeLocale (locale) {
        this.owner.display.language = locale;
    }

    changeTimezone (name) {
        this.owner.display.timezone = name;
    }

    changeUnit (units) {
        this.owner.display.units = units;
    }

    getFirstDayOfWeek () {
        return this.owner && this.owner.display.firstDayOfWeek || 0;
    }

    setFirstDayOfWeek (number) {
        this.owner.display.firstDayOfWeek = number;
    }

    weekdays (day) {
        return moment.weekdays(day);
    }
}

export const UserSettingsDisplayComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsDisplayCtrl,
    template: require('./user-settings-display.component.html') as string
} as any;