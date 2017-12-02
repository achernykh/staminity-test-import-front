import {IComponentController, IComponentOptions, IPromise} from "angular";
import { IUserProfile } from "../../../../../api/user/user.interface";
import "./profile-template.component.scss";

class ApplicationProfileTemplateCtrl implements IComponentController {

    public user: IUserProfile;
    public onEvent: (response: Object) => IPromise<void>;
    public static $inject = ["$mdMedia"];

    constructor(
        private $mdMedia: any,
    ) {

    }

    public $onInit() {

    }
}

const ApplicationProfileTemplateComponent: IComponentOptions = {
    bindings: {
        user: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: ApplicationProfileTemplateCtrl,
    template: require("./profile-template.component.html") as string,
};

export default ApplicationProfileTemplateComponent;
