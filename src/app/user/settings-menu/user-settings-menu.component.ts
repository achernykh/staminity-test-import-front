import './user-settings-menu.component.scss';
import {IComponentOptions, IComponentController, ILocationService} from 'angular';

class UserSettingsMenuCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
   
    // inject
    static $inject = ['$location'];

    constructor (private $location: ILocationService) {

    }

    $onInit (): void {
    }
}

export const UserSettingsMenuComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    controller: UserSettingsMenuCtrl,
    template: require('./user-settings-menu.component.html') as string
};