import './premium-wrapper.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import AuthService from "../../auth/auth.service";

class PremiumWrapperCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
   
    // inject
    static $inject = ['AuthService'];

    constructor(private authService: AuthService) {

    }

    get isPremium () {
        return this.authService.isPremiumAccount();
    }

    $onInit(): void {

    }
}

export const PremiumWrapperComponent:IComponentOptions = {
    bindings: {
        functionCode: '=',
        onEvent: '&'
    },
    controller: PremiumWrapperCtrl,
    template: require('./premium-wrapper.component.html') as string
};