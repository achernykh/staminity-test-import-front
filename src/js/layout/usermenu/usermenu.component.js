import { UserMenuSettings } from '../app.constants.js';

class UserMenuCtrl {
    constructor($mdDialog, $location) {
        'ngInject';
        this._$location = $location;
        this.menu = UserMenuSettings;
    }

    getAvatar() {
        return
    }

    onUserMenu($mdOpenMenu, ev){
        let originatorEv = ev;
        $mdOpenMenu(ev);
    }
    goTo(link){
        this._$location.path('link');
    }
}

let UserMenu = {
    bindings: {
    },
    transclude: false,
    controller: UserMenuCtrl,
    templateUrl: 'layout/usermenu/usermenu.html'
};
export default UserMenu;