import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import DisplayService from "../../../core/display.service";
import { countriesList } from '../user-settings.constants';
import { UserSettingsService } from '../user-settings.service';
import { UserSettingsProfileDatamodel } from './user-settings-profile.datamodel';
import './user-settings-profile.component.scss';

class UserSettingsProfileCtrl {
    
    // bind
    currentUser: IUserProfile;    
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsProfileDatamodel(profile);
    };

    // public
    datamodel: UserSettingsProfileDatamodel;
    form: any;
    countriesList = countriesList;
    countrySearchText: string;

    static $inject = ['DisplayService', 'dialogs', 'message', 'UserSettingsService'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
    ) {

    }

    /**
     * Сохранить
     */
    submit () {
        this.userSettingsService.saveSettings(this.datamodel.toUserProfile())
        .then((result) => {

        }, (error) => {

        });
    }
 
    /**
     * Формат даты
     * @returns {string}
     */
    getDateFormat () { 
        return moment().localeData().longDateFormat('L'); 
    } 

    /**
     * Поиск страны
     * @param query: string
     * @returns {string[]}
     */
    countrySearch (query: string) : string[] {
        return this.userSettingsService.countrySearch(query);
    }

    /**
     * Поиск города
     * @param query: string
     * @returns {Promise<any>}
     */
    citySearch (query: string) : Promise<any> {
        return this.userSettingsService.citySearch(query);
    }

    /**
     * Название страны
     * @param key: string
     * @returns {string}
     */
    getCountryName (key: string) : string {
        return countriesList[this.displayService.getLocale()][key];
    }
}

export const UserSettingsProfileComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsProfileCtrl,
    template: require('./user-settings-profile.component.html') as string
} as any;