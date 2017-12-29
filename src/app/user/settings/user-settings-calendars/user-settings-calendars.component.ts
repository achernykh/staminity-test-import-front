import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import {IComponentOptions, IComponentController, ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-calendars.component.scss';

class UserSettingsCalendarsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['SyncAdaptorService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private syncAdaptorService: any,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
    ) {

    }

    getICalLink () : string {
        return this.owner.display.language && this.owner.private.iCal[this.owner.display.language] &&
            `https://app.staminity.com/ical/${this.owner.private.iCal[this.owner.display.language]}` ||
            'settings.personalInfo.calendar.empty';
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