import { UserMenuSettings, AppMenuSettings } from '../app.constants';

class ApplicationMenuCtrl {
    constructor($mdDialog, Auth) {
        'ngInject';
        this.appmenu = AppMenuSettings;
        this.usermenu = UserMenuSettings;
        this._Auth = Auth;
    }
    $onInit(){
    }

}

let ApplicationMenu = {
    bindings: {
        user: '<'
    },
    transclude: false,
    controller: ApplicationMenuCtrl,
    templateUrl: 'layout/appmenu/appmenu.html'
};
export default ApplicationMenu;