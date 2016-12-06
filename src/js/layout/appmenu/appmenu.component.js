import { UserMenuSettings, AppMenuSettings } from '../app.constants';

class ApplicationMenuCtrl {
    constructor($mdDialog, AuthService, UserService, $mdSidenav, $state) {
        'ngInject';
        this.appmenu = AppMenuSettings
        this.usermenu = UserMenuSettings
        this._AuthService = AuthService
        this._$mdSidenav = $mdSidenav
        this._$state = $state
        this.user = UserService.getCurrentUser();
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