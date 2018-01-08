import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import UserService from "../../../core/user.service";
import { UserSettingsFitDatamodel } from './user-settings-fit.datamodel';
import './user-settings-fit.component.scss';

class UserSettingsFitCtrl {
    
    // bind
    currentUser: IUserProfile;    
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsFitDatamodel(profile);
    };

    // public
    datamodel: UserSettingsFitDatamodel;
    activities = ['run', 'swim', 'bike', 'triathlon', 'ski'];
    form: any;

    static $inject = ['UserService', 'dialogs', 'message'];

    constructor (
        private userService: UserService,
        private dialogs: any,
        private message: any,
    ) {
        
    }

    /**
     * Сохранить 
     */
    submit () {
        this.userService.putProfile(this.datamodel.toUserProfile())
        .then((result) => {

        }, (error) => {

        });
    }

    /**
     * Выбран ли вид спорта
     * @param activity: string
     * @returns {boolean}
     */
    isActivityChecked (activity: string) : boolean {
        return this.datamodel.activity.indexOf(activity) !== -1;
    }

    /**
     * Переключатель вида спорта
     * @param activity: string
     */
    toggleActivity (activity: string) {
        this.form.$setDirty();
        if (this.isActivityChecked(activity)) {
            let index = this.datamodel.activity.indexOf(activity);
            this.datamodel.activity.splice(index, 1);
        } else {
            this.datamodel.activity.push(activity);
        }
    }
}

export const UserSettingsFitComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsFitCtrl,
    template: require('./user-settings-fit.component.html') as string
} as any;