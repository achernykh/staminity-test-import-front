import './user-menu.component.scss';
import { IComponentController, IComponentOptions, ILocationService} from "angular";
import {StateService} from "@uirouter/angularjs";
import { Subject } from "rxjs/Rx";
import {IUserProfile} from "../../../../api";
import { getUser, SessionService } from "../../core";
import DisplayService from "../../core/display.service";
import { UserMenuSettings } from "../application-menu/application-menu.constants";
import { OmniService } from "../omni/omni.service";

class UserMenuCtrl implements IComponentController {

    private menu: any[] = UserMenuSettings;
    private user: IUserProfile;
    private destroy = new Subject();

    static $inject = ["$mdSidenav", "$mdMedia", "$location", "SessionService", "$state", "DisplayService", "OmniService"];

    constructor(
        private $mdSidenav: any,
        private $mdMedia,
        private $location: ILocationService,
        private SessionService: SessionService,
        private $state: StateService,
        private display: DisplayService,
        private omni: OmniService
    ) {
        SessionService.getObservable()
        .takeUntil(this.destroy)
        .map(getUser)
        .subscribe((userProfile) => {
            this.user = userProfile;
        });
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    onUserMenu($mdOpenMenu, ev) {
        const originatorEv = ev;
        $mdOpenMenu(ev);
    }

    omniOpen(e: Event) {
        this.omni.open(e).then(_=>{});
    }

    transitionToState(url) {
        if (this.$state.current.name === url) {
            return;
        }
        if (url.includes("http")) {
            window.open(url);
        } else {
            if (url !== "user" && url !== "settings/user") {
                this.$state.go(url);
            } else {
                this.$state.go(url, {uri: this.user.public.uri});
            }
        }
    }
}

const UserMenuComponent: IComponentOptions = {
    bindings: {
        id: "<",
    },
    transclude: false,
    controller: UserMenuCtrl,
    template: require("./user-menu.template.html") as string,
};
export default UserMenuComponent;
