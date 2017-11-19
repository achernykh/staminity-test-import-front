import './profile-template.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IUserProfile } from "../../../../../api/user/user.interface";

class ApplicationProfileTemplateCtrl implements IComponentController {

    public user: IUserProfile;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['$mdMedia'];

    constructor(
        private $mdMedia: any,
    ) {

    }

    $onInit() {

    }
}

const ApplicationProfileTemplateComponent:IComponentOptions = {
    bindings: {
        user: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ApplicationProfileTemplateCtrl,
    template: require('./profile-template.component.html') as string
};

export default ApplicationProfileTemplateComponent;