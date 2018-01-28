import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsService } from '../user-settings.service';
import DisplayService from "../../../core/display.service";
import { UserSettingsCoachDatamodel } from './user-settings-agent.datamodel';
import { countriesList } from '../user-settings.constants';
import './user-settings-agent.component.scss';

class UserSettingsAgentCtrl {
    
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
}

export const UserSettingsAgentComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsAgentCtrl,
    template: require('./user-settings-agent.component.html') as string
} as any;