import './premium-dialog.component.scss';
import {IComponentOptions, IComponentController} from 'angular';

class PremiumDialogCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = [];

    constructor() {

    }

    $onInit(): void {

    }
}

export const PremiumDialogComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    controller: PremiumDialogCtrl,
    template: require('./premium-dialog.component.html') as string
};