import { IComponentController, IComponentOptions} from "angular";
import {StateService} from "angular-ui-router";
import { Observable } from "rxjs/Observable";
import {IUserProfile} from "../../../../api";
import {IAuthService} from "../../auth/auth.service";
import {SessionService} from "../../core";
import DisplayService from "../../core/display.service";
import "./landingpage.component.scss";

class LandingPageCtrl implements IComponentController {

    private readonly slides: any = {
        athlete: ["lp-user-01.png", "lp-user-02.png", "lp-user-03.png"],
        coach: ["lp-coach-01.png"],
        club: ["lp-club-01.png"],
    };

    public static $inject = ["AuthService", "$state", "SessionService", "DisplayService"];

    constructor(private AuthService: IAuthService,
                private $state: StateService,
                private SessionService: SessionService,
                private display: DisplayService) {

    }

    get user(): IUserProfile {
        return this.SessionService.getUser();
    }

    public go() {
        if (this.AuthService.isAuthenticated()) {
            this.$state.go("calendar", {uri: this.user.public.uri});
        } else {
            this.$state.go("signup");
        }
    }

}

const LandingPageComponent: IComponentOptions = {
    bindings: {
        view: "<",
    },
    controller: LandingPageCtrl,
    template: require("./landingpage.component.html") as string,
};

export default LandingPageComponent;
