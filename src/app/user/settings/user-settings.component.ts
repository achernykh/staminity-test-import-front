import './user-settings.component.scss';
import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "../../../../api/user/user.interface";
import MessageService from "../../core/message.service";
import AuthService from "../../auth/auth.service";

class UserSettingsCtrl implements IComponentController {
    
    // bind
    currentUser: IUserProfile;
    onEvent: (response: Object) => Promise<void>;
     
    // private
    private owner: IUserProfile;
    private athletes: Array<IUserProfileShort>;

    // inject
    static $inject = ['$stateParams', '$location', '$mdMedia', 'message', 'AuthService'];

    constructor (
        private $stateParams: any,
        private $location: ILocationService,
        private $mdMedia: any,
        private message: MessageService,
        private auth: AuthService
    ) {

    }

    $onInit(): void {
        this.prepareRoles();
    }

    /**
     * Установка владельца
     * После смены владельца выполняется переустановка данных
     * @param user
     */
    setOwner (user: IUserProfile | IUserProfileShort): void {
        this.owner = user;
        this.$location.search('userId', this.owner.userId);
        this.setData();
    }

    setData (): void {

    }

    private prepareRoles (): void {
        if (this.currentUser.public.isCoach && this.currentUser.connections.hasOwnProperty('allAthletes')) {
            this.athletes = this.currentUser.connections.allAthletes.groupMembers;
        }
        if (this.$stateParams.userId && this.athletes &&
            this.athletes.some(a => a.userId === Number(this.$stateParams.userId))) {
            this.setOwner(this.athletes.filter(a => a.userId === Number(this.$stateParams.userId))[0]);
        } else {
            this.setOwner(this.currentUser);
        }
    }
}

export const UserSettingsComponent:IComponentOptions = {
    bindings: {
        currentUser: '<',
        onEvent: '&'
    },
    controller: UserSettingsCtrl,
    template: require('./user-settings.component.html') as string
};