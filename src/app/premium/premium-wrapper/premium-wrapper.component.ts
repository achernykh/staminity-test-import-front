import './premium-wrapper.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import AuthService from "../../auth/auth.service";
import {PremiumDialogService} from "@app/premium/premium-dialog/premium-dialog.service";

class PremiumWrapperCtrl implements IComponentController {
    
    // bind
    functionCode: string;
    onEvent: (response: Object) => Promise<void>;
     
    // private
   
    // inject
    static $inject = ['AuthService', 'PremiumDialogService'];

    constructor(private authService: AuthService, private premiumDialogService: PremiumDialogService) {

    }

    get isPremium () {
        return this.authService.isPremiumAccount();
    }

    $onInit(): void {

    }

    try (e: Event): void {
        this.premiumDialogService.open(e, this.functionCode).then();
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