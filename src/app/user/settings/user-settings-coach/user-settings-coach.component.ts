import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsService } from '../user-settings.service';
import DisplayService from "../../../core/display.service";
import { UserSettingsCoachDatamodel } from './user-settings-coach.datamodel';
import { countriesList } from '../user-settings.constants';
import { isCoachProfileComplete } from './user-settings-coach.functions';
import './user-settings-coach.component.scss';

class UserSettingsCoachCtrl {
    
    // bind
    currentUser: IUserProfile;    
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsCoachDatamodel(profile);
    };

    // public
    datamodel: UserSettingsCoachDatamodel;
    form: any;
    countriesList = countriesList;
    countrySearchText: string;

    static $inject = ['DisplayService', 'dialogs', 'message', 'UserSettingsService', 'quillConfig', '$scope'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
        private quillConfig: any,
        private $scope: any,
    ) {
        window['UserSettingsCoachCtrl'] = this;
    }

    /**
     * Сохранить 
     */
    submit () {
        this.userSettingsService.saveSettings(this.datamodel.toUserProfile())
        .then((result) => {
            this.form.$setPristine(true);
        }, (error) => {

        });
    }
 
    /**
     * Формат даты
     * @returns {string}
     */
    getDateFormat () : string { 
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

    /**
     * Заполнен ли профиль
     * @returns {boolean}
     */
    isProfileComplete () : boolean {
        return isCoachProfileComplete(this.currentUser);
    }
}

export const UserSettingsCoachComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsCoachCtrl,
    template: require('./user-settings-coach.component.html') as string
} as any;