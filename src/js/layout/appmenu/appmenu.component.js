import { UserMenuSettings, AppMenuSettings } from '../app.constants';
import { _connection } from '../../../services/api/api.constants'

class ApplicationMenuCtrl {
    constructor($mdDialog, AuthService, UserService, $mdSidenav, $state) {
        'ngInject';
        this.appmenu = AppMenuSettings
        this.usermenu = UserMenuSettings
        this._AuthService = AuthService
        this._$mdSidenav = $mdSidenav
        this.user = UserService.profile;
        this._$state = $state
        this.avatarUrl = /*_connection.server + */'/content/avatar/' + this.user.public.avatar;
        this.backgroundUrl = /*_connection.server + */'/content/background/' + this.user.public.background;
    }
    $onInit(){
    }

    toggleSlide(component){
        this._$mdSidenav(component).toggle().then(() => angular.noop);
    }

    checkAuth(role) {
        return this._AuthService.isAuthorized(role).then(()=> {return true}, ()=> {return false});
    }

}

let ApplicationMenu = {
    transclude: false,
    controller: ApplicationMenuCtrl,
    templateUrl: 'layout/appmenu/appmenu.html'
};
export default ApplicationMenu;