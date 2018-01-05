import {IComponentController, IComponentOptions, IPromise} from "angular";
import AuthService from "../../auth/auth.service";
import "./application-user-toolbar.component.scss";

class ApplicationUserToolbarCtrl implements IComponentController {

    data: any;
    onEvent: (response: Object) => IPromise<void>;
    static $inject = ["AuthService"];

    constructor (private AuthService: AuthService) {

    }

    $onInit () {

    }
}

const ApplicationUserToolbarComponent: IComponentOptions = {
    bindings: {
        data: "<",
        onEvent: "&",
    },
    require: {
        application: "^stApplicationFrame",
    },
    controller: ApplicationUserToolbarCtrl,
    template: require("./application-user-toolbar.component.html") as string,
};

export default ApplicationUserToolbarComponent;
