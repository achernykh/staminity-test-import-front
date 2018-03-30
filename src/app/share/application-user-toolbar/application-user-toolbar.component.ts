import {IComponentController, IComponentOptions} from "angular";
import {StateService} from 'angular-ui-router';
import moment from 'moment/min/moment-with-locales.js';
import AuthService from "../../auth/auth.service";
import "./application-user-toolbar.component.scss";
import {ApplicationFrameCtrl} from "@app/share/application-frame/application-frame.component";
import * as _connection from "../../core/env.js";

class ApplicationUserToolbarCtrl implements IComponentController {

    data: any;
    onEvent: (response: Object) => Promise<void>;
    application: ApplicationFrameCtrl;
    private server: string = _connection.server;
    private readonly status: Array<string> = ['onlyBasicTariff','incompleteProfile',
        'premiumExpireIn', 'coachExpireIn', 'clubExpireIn',
        'expiredPremium','expiredCoach','expiredClub'];
    static $inject = ["AuthService", "$state"];

    constructor(private authService: AuthService, private $state: StateService) {}

    $onInit() {}

    action () {
        switch (this.message) {
            case 'incompleteProfile': {
                this.$state.go('settings/user', {uri: this.application.user.public.uri, '#': 'personal'});
                break;
            }
            case 'onlyBasicTariff': case 'expiredPremium': case 'expiredCoach': case 'expiredClub': {
                this.$state.go('settings/user', {uri: this.application.user.public.uri, '#': 'account'});
                break;
            }
        }
    }

    get message (): string {
        let m: string = null;
        this.status.map(s => this[s] && (m = s));
        return m;
    }

    get incompleteProfile (): boolean {
        return this.application.user.public.isCoach && !this.application.user.public.profileComplete;
    }

    get onlyBasicTariff (): boolean {
        let roles = ['ReportsPro_User', 'CoachProfile', 'CoachUnlimitedAthletes', 'ProfileClub'];
        return !this.authService.isAuthorized(roles, false);
    }

    get premiumExpireIn (): boolean {
        let role: string = 'ReportsPro_User';
        let diff = this.diffDays(role);
        return this.authService.isAuthorized([role], false) && diff && diff >= 0 && diff <= 3 || false;
    }

    get coachExpireIn (): boolean {
        let role: string = 'CoachUnlimitedAthletes';
        let diff = this.diffDays(role);
        return this.authService.isAuthorized([role], false) && diff && diff >= 0 && diff <= 3 || false;
    }

    get clubExpireIn (): boolean {
        let role: string = 'ProfileClub';
        let diff = this.diffDays(role);
        return this.authService.isAuthorized([role], false) && diff && diff >= 0 && diff <= 3 || false;
    }

    get expiredPremium (): boolean {
        let diff = this.diffDays('ReportsPro_User');
        return diff && diff >= -5 && diff <= -1 || false;
    }

    get expiredCoach (): boolean {
        let diff = this.diffDays('CoachUnlimitedAthletes');
        return diff && diff >= -5 && diff <= -1 || false;
    }

    get expiredClub (): boolean {
        let diff = this.diffDays('ProfileClub');
        return diff && diff >= -5 && diff <= -1 || false;
    }

    get wran (): boolean {
        return !~['onlyBasicTariff'].indexOf(this.message);
    }

    getStyle (): string {
        return ~['onlyBasicTariff'].indexOf(this.message) ? 'primary-600' : 'warn-600';
    }

    diffDays (role: string): number {
        let expiredDate = this.server !== 'testapp.staminity.com:8080' ?
            this.application.permissions[role] :
            JSON.parse(window.localStorage.getItem('permissions'))[role];

        return moment(expiredDate).diff(moment(), 'days') + 1;
    }

    getRoleByMessage (message: string): string {
        if (~['premiumExpireIn', 'expiredPremium'].indexOf(message)) { return 'ReportsPro_User';}
        else if (~['coachExpireIn', 'expiredCoach'].indexOf(message)) { return 'CoachUnlimitedAthletes';}
        else if (~['clubExpireIn', 'expiredClub'].indexOf(message)) {return 'ProfileClub';}
        else { return null; }
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
