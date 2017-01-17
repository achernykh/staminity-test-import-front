import { IComponentOptions, IComponentController, ILocationService} from 'angular';
import { UserMenuSettings } from '../application-menu/application-menu.constants';
import {IUserProfile} from "../../../../api/user/user.interface";
import UserService from "../../../js/services/user/user.service";

class UserMenuCtrl implements IComponentController{

    private menu: Array<any> = UserMenuSettings;
    private user: IUserProfile;

    static $inject = ['$mdSidenav','$location','UserService'];

    constructor(
        private $mdSidenav: any,
        private $location: ILocationService,
        private UserService: UserService) {
        this.user = UserService.profile;
    }

    getAvatar() {
  //      return
    }

    onUserMenu($mdOpenMenu, ev){
        let originatorEv = ev;
        $mdOpenMenu(ev);
    }


}

let UserMenuComponent:IComponentOptions = {
    bindings: {
        id: '<'
    },
    transclude: false,
    controller: UserMenuCtrl,
    template: require('./user-menu.template.html') as string
};
export default UserMenuComponent;