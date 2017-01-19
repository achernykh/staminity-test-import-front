import { IComponentOptions, IComponentController} from 'angular';
import { UserMenuSettings, AppMenuSettings } from './application-menu.constants';
//import { _connection } from '../../services/api/api.constants';
import {StateService} from "angular-ui-router";
import {IUserProfile} from "../../../../api/user/user.interface";

//noinspection TsLint
require('./application-menu.component.scss');

class ApplicationMenuCtrl implements IComponentController{

    private appmenu: Array<any> = AppMenuSettings;
    private usermenu: Array<any> = UserMenuSettings;
    private user: IUserProfile;

    static $inject = ['$mdSidenav','AuthService','UserService','$state'];

    constructor(
        private $mdSidenav: any,
        private AuthService: any,
        private UserService: any,
        private $state: StateService) {

        this.user = UserService.profile;
    }

    avatarUrl() {
        //return _connection.content + (this.user? '/content/user/avatar/' + this.user.public.avatar : '/assets/avatar/default.png')
    }

    backgroundUrl() {
        //return _connection.content + (this.user? '/content/user/background/' + this.user.public.background : '/assets/picture/pattern0.jpg')
    }

    toggleSlide(){
        this.$mdSidenav("appmenu").toggle().then(() => angular.noop);
    }

    checkAuth(role) {
        return this.AuthService.isAuthorized(role).then(()=> {return true;}, ()=> {return false;});
    }

}

let ApplicationMenuComponent: IComponentOptions = {
    transclude: false,
    controller: ApplicationMenuCtrl,
    template: require('./application-menu.component.html') as string
};
export default ApplicationMenuComponent;