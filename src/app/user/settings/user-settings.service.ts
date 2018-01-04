import { element } from 'angular';
import { UserSettingsPasswordCtrl } from './user-settings-password/user-settings-password.dialog';

export class UserSettingsService {

    static $inject = ['$mdDialog', 'message', 'AuthService'];

    constructor (
        private $mdDialog,
        private message,
        private authService,
    ) {

    }

    /**
     * Смена пароля
     * @returns {Promise<any>}
     */
    changePassword (event): Promise<any> {        
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
}
