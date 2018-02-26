import { IComponentController, IComponentOptions, ILocationService} from "angular";
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

    static $inject = ["AuthService", "$state", "SessionService", "DisplayService", '$mdMedia', '$location'];

    constructor(private AuthService: IAuthService,
                private $state: StateService,
                private SessionService: SessionService,
                private display: DisplayService,
                private $mdMedia: any,
                private $location: ILocationService) {

    }

    get user(): IUserProfile {
        return this.SessionService.getUser();
    }

    go() {
        if (this.AuthService.isAuthenticated()) {
            this.$state.go(this.$mdMedia('gt-sm') ? "initialisation" : "calendar");
        } else {
            this.$state.go("signup", {search: this.$location.search()});
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
