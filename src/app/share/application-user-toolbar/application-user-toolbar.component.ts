import {IComponentController, IComponentOptions, IPromise} from "angular";
import AuthService from "../../auth/auth.service";
import "./application-user-toolbar.component.scss";
import { ChatDialogService } from "../../chat";

class ApplicationUserToolbarCtrl implements IComponentController {

    data: any;
    onEvent: (response: Object) => IPromise<void>;
    static $inject = ["AuthService", "ChatDialog"];

    constructor(private AuthService: AuthService, private chatDialog: ChatDialogService) {

    }

    $onInit() {

    }

    chat(e: Event): void {
        this.chatDialog.open(e).then(_ => {});
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
