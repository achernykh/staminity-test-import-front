import { element } from 'angular';
import DisplayService from "../../core/display.service";
import { countriesList } from './user-settings.constants';
import { UserSettingsPasswordCtrl } from './user-settings-password/user-settings-password.dialog';

export class UserSettingsService {

    static $inject = ['$http', '$mdDialog', 'message', 'AuthService', 'DisplayService'];

    constructor (
        private $http,
        private $mdDialog,
        private message,
        private authService,
        private displayService: DisplayService,
    ) {

    }

    submitChanges () : Promise<any> {
        return Promise.resolve();
    }

    /**
     * Смена пароля
     * @returns {Promise<any>}
     */
    changePassword (event) : Promise<any> {        
        return this.$mdDialog.show({
            controller: UserSettingsPasswordCtrl,
            controllerAs: '$ctrl',
            template: require('./user-settings-password/user-settings-password.dialog.html'),
            parent: element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: false
        }).then((password) => {
            this.authService.setPassword(password)
            .then(() => {
                this.message.toastInfo('setPasswordSuccess');
            })
            .catch((info) => {
                this.message.systemWarning(info);
            });
        });
    }

    /**
     * Поиск страны
     * @param query: string
     * @returns {string[]}
     */
    countrySearch (query: string) : string[] {
        let countries = countriesList[this.displayService.getLocale()];
        let regexp = new RegExp(query, 'i');

        return query ? Object.keys(countries).filter((key) => ~countries[key].search(regexp)) : countries;
    }

    /**
     * Поиск города
     * @param query: string
     * @returns {Promise<any>}
     */
    citySearch (query: string) : Promise<any> {
        let language = this.displayService.getLocale();
        let api = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        let key = 'AIzaSyAOt7X5dgVmvxcx3WCVZ0Swm3CyfzDDTcM'
        let request = {
            method: 'GET',
            url: `${api}?input=${query}&types=(cities)&language=${language}&key=${key}`,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Origin': '*'
            }
        };

        return this.$http(request).then((result) => result.predictions, (error) => []);
    }
}
