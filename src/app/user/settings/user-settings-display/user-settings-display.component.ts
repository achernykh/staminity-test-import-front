import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-display.component.scss';

class UserSettingsDisplayCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    // public
    unitsOptions = ["metric", "imperial"];
    timeZones = momentTimezone.tz.names().map((z) => ({ 
        title: `(GMT${momentTimezone.tz(z).format('Z')}) ${z}`, 
        name: z, 
        offset: momentTimezone.tz(z).offset 
    })); 

    static $inject = ['DisplayService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private displayService: any,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
    ) {

    }   

    get locale () : string {
        return this.displayService.getLocale();
    }

    set locale (locale: string) {
        this.displayService.setLocale(locale);
    }

    get timezone () {
        return this.displayService.getTimezone();
    }

    set timezone (timezone: string) {
        this.displayService.setTimezone(timezone);
    }

    get units () : string {
        return this.displayService.getUnits();
    }

    set units (units: string) {
        this.displayService.setUnits(units);
    }

    get firstDayOfWeek () {
        return this.displayService.getFirstDayOfWeek();
    }

    set firstDayOfWeek (firstDayOfWeek: number) {
        this.displayService.setFirstDayOfWeek(firstDayOfWeek);
    }

    weekdays (day) {
        return moment.weekdays(day);
    }

    getTimezoneTitle () {
        let timezone = this.timezone;
        return (timezone && `(GMT${momentTimezone.tz(timezone).format('Z')}) ${timezone}`) || null;
    }

    getDateFormat () {
        return moment().format('L');
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