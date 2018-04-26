import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import DisplayService from "../../../core/display.service";
import './user-settings-display.component.scss';
import MessageService from "@app/core/message.service";

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
        private displayService: DisplayService,
        private dialogs: any,
        private message: MessageService,
        private $mdDialog: any,
    ) {

    }   

    get locale () : string {
        return this.owner.display.language;
    }

    set locale (locale: string) {
        this.displayService.setLocale(locale)
            .then(_ => this.message.toastInfo('settingsSaveComplete'), e => e && this.message.toastError(e));
    }

    get timezone () {
        return this.owner.display.timezone;
    }

    set timezone (timezone: string) {
        this.displayService.setTimezone(timezone)
            .then(_ => this.message.toastInfo('settingsSaveComplete'), e => e && this.message.toastError(e));
    }

    get units () : string {
        return this.owner.display.units;
    }

    set units (units: string) {
        this.displayService.setUnits(units)
            .then(_ => this.message.toastInfo('settingsSaveComplete'), e => e && this.message.toastError(e));;
    }

    get firstDayOfWeek () {
        return this.owner.display.firstDayOfWeek;
    }

    set firstDayOfWeek (firstDayOfWeek: number) {
        this.displayService.setFirstDayOfWeek(firstDayOfWeek)
            .then(_ => this.message.toastInfo('settingsSaveComplete'), e => e && this.message.toastError(e));
    }

    weekdays (day: number) : string[] {
        return moment.weekdays(day);
    }

    getTimezoneTitle () : string {
        let timezone = this.timezone;
        return (timezone && `(GMT${momentTimezone.tz(timezone).format('Z')}) ${timezone}`) || null;
    }

    getDateFormat () : string {
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