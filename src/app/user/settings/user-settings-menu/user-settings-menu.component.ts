import './user-settings-menu.component.scss';
import {IComponentOptions, IComponentController, ILocationService} from 'angular';

export interface ISettingsMenuItem {
    hash: string,
    label: string,
    icon: string
};

class UserSettingsMenuCtrl implements IComponentController {
    
    // bind
    items: Array<ISettingsMenuItem>;
   
    // inject
    static $inject = ['$location'];

    constructor (private $location: ILocationService) {

    }

    go (item: ISettingsMenuItem) {
        this.$location.hash(item.hash);
    }
}

export const UserSettingsMenuComponent:IComponentOptions = {
    bindings: {
        items: '<',
    },
    controller: UserSettingsMenuCtrl,
    template: require('./user-settings-menu.component.html') as string
};