import { element } from 'angular';
import { Subject } from "rxjs/Rx";
import { IUserProfile, IUserProfileShort } from "@api/user";
import DisplayService from "../../core/display.service";
import UserService from "../../core/user.service";
import { countriesList } from './user-settings.constants';
import { UserSettingsPasswordCtrl } from './user-settings-password/user-settings-password.dialog';

export class UserSettingsService {

    public updates = new Subject<IUserProfile | IUserProfileShort>();

    static $inject = ['$http', '$mdDialog', 'message', 'AuthService', 'DisplayService', 'UserService', 'SessionService'];

    constructor (
        private $http,
        private $mdDialog,
        private message,
        private authService,
        private displayService: DisplayService,
        private userService: UserService,
        private sessionService,
    ) {

    }

    /**
     * Уведомление об изменении UserProfile
     * @param userProfile: IUserProfile | IUserProfileShort
     */
    update (userProfile: IUserProfile | IUserProfileShort) {
        this.updates.next(userProfile);
    }

    /**
     * Сохранить изменения 
     * @param changes
     * @returns {Promise<any>}
     */
    saveSettings (changes) : Promise<any> {
        return this.userService.putProfile(changes)
        .then((userProfile) => {
            this.sessionService.updateUser(userProfile);
            this.update(userProfile);
            this.message.toastInfo('settingsSaveComplete');
        })
        .catch((error) => {

        });
    }

    /**
     * Сохранить изменения зон
     * @param changes
     * @returns {Promise<any>}
     */
    saveZones (changes) : Promise<any> {
        return this.userService.putProfile(changes)
        .then((userProfile) => {
            let { userId, revision, trainigZones } = changes;
            if (this.sessionService.isCurrentUserId(userId)) {
                this.sessionService.setUser(userProfile);
            }
            this.update(userProfile);
            this.message.toastInfo('settingsSaveComplete');
        })
        .catch((error) => {

        });
    }

    /**
     * Перезагрузить профиль 
     * @param userId?
     * @returns {Promise<any>}
     */
    reload (userId: number) {
        return this.userService.getProfile(userId || this.sessionService.getUserId())
        .then((userProfile) => {
            this.update(userProfile as any);
        })
        .catch((error) => {

        });
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
