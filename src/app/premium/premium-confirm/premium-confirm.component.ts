import './premium-confirm.component.scss';
import {IComponentController, IComponentOptions} from "angular";

class PremiumConfirmCtrl implements IComponentController {

}

export const PremiumConfirmComponent:IComponentOptions = {
    bindings: {
        bill: '=',
        onEvent: '&'
    },
    controller: PremiumConfirmCtrl,
    template: require('./premium-confirm.component.html') as string
};