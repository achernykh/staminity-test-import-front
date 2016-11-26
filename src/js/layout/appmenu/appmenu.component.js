import { UserMenuSettings, AppMenuSettings } from '../app.constants';

class ApplicationMenuCtrl {
    constructor($mdDialog, Auth, $mdSidenav) {
        'ngInject';
        this.appmenu = AppMenuSettings
        this.usermenu = UserMenuSettings
        this._Auth = Auth
        this._$mdSidenav = $mdSidenav
    }
    $onInit(){
    }

    toggleSlide(component){
        this._$mdSidenav(component).toggle().then(() => angular.noop);
    }

}

let ApplicationMenu = {
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: ApplicationMenuCtrl,
    templateUrl: 'layout/appmenu/appmenu.html'
};
export default ApplicationMenu;