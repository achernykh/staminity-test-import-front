import './application-user-toolbar.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import AuthService from "../../auth/auth.service";

class ApplicationUserToolbarCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['AuthService'];

    constructor(private AuthService: AuthService) {

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
        application: '^stApplicationFrame'
    },
    controller: ApplicationUserToolbarCtrl,
    template: require('./application-user-toolbar.component.html') as string
};

export default ApplicationUserToolbarComponent;