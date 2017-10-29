import './application-user-toolbar.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class ApplicationUserToolbarCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const ApplicationUserToolbarComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ApplicationUserToolbarCtrl,
    template: require('./application-user-toolbar.component.html') as string
};

export default ApplicationUserToolbarComponent;