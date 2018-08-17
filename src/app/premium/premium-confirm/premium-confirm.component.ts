import './premium-confirm.component.scss';
import {IComponentController, IComponentOptions} from "angular";

class PremiumConfirmCtr implements IComponentController {

}

export const PremiumConfirmComponent:IComponentOptions = {
    bindings: {
        bill: '=',
        onEvent: '&'
    },
    controller: PremiumConfirmCtr,
    template: require('./premium-confirm.component.html') as string
};