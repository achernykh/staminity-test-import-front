import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import {IComponentOptions, IComponentController, ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import DisplayService from "../../../core/display.service";
import './user-settings-calendars.component.scss';

class UserSettingsCalendarsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = [];

    constructor (
        
    ) {

    }

    /**
     * Url для iCal
     * @returns {string}
     */
    getICalLink () : string {
        const name = this.owner.private.iCal && this.owner.private.iCal[this.displayService.getLocale()];
        return name ? `https://app.staminity.com/ical/${name}` : 'user.settings.personalInfo.calendar.empty';
    }
}

export const UserSettingsCalendarsComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsCalendarsCtrl,
    template: require('./user-settings-calendars.component.html') as string
} as any;