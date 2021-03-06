import { IComponentController, IComponentOptions} from "angular";
import {IAuthService} from "../../auth/auth.service";
import {SocketService} from "../../core";
import "./background.template.scss";

class BackgroundCtrl implements IComponentController {

    private internetStatus: boolean = true;
    static $inject = ["SocketService", "AuthService"];

    constructor(private socket: SocketService, private auth: IAuthService) {
        this.socket.connections.subscribe((status) => this.internetStatus = !!status || !this.auth.isAuthenticated());
    }

}

const BackgroundComponent: IComponentOptions = {
    bindings: {
        view: "<",
    },
    transclude: false,
    controller: BackgroundCtrl,
    template: require("./background.template.html") as string,
};

export default BackgroundComponent;
