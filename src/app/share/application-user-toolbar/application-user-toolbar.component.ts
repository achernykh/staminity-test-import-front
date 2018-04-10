import {IComponentController, IComponentOptions} from "angular";
import {StateService} from 'angular-ui-router';
import moment from 'moment/min/moment-with-locales.js';
import AuthService from "../../auth/auth.service";
import "./application-user-toolbar.component.scss";
import {ApplicationFrameCtrl} from "@app/share/application-frame/application-frame.component";
import * as _connection from "../../core/env.js";
import { toDay } from "../../activity/activity-datamodel/activity.datamodel";

class ApplicationUserToolbarCtrl implements IComponentController {

    data: any;
    onEvent: (response: Object) => Promise<void>;
    application: ApplicationFrameCtrl;
    private server: string = _connection.server;
    private permissions = window.localStorage.getItem('permissions') && JSON.parse(window.localStorage.getItem('permissions'));
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
            case 'onlyBasicTariff': case 'expiredPremium': case 'expiredCoach': case 'expiredClub':
            case 'premiumExpireIn': case 'coachExpireIn': case 'clubExpireIn': {
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
        console.debug('ProfileClub auth:',this.authService.isAuthorized(['ProfileClub']));
        return this.application.user.public.isCoach && !this.application.user.public.profileComplete &&
            !this.authService.isAuthorized(['ProfileClub']);
    }

    get onlyBasicTariff (): boolean {
        let roles = ['ReportsPro_User', 'CoachProfile', 'CoachUnlimitedAthletes', 'ProfileClub'];
        return !this.authService.isAuthorized(roles, false);
    }

    get premiumExpireIn (): boolean {
        let role: string = 'ReportsPro_User';
        let diff = this.diffDays(role);
        return this.authService.isAuthorized([role], false) && diff >= 0 && diff <= 3 || false;
    }

    get coachExpireIn (): boolean {
        let role: string = 'CoachUnlimitedAthletes';
        let diff = this.diffDays(role);
        return this.authService.isAuthorized([role], false) && diff >= 0 && diff <= 3 || false;
    }

    get clubExpireIn (): boolean {
        let role: string = 'ProfileClub';
        let diff = this.diffDays(role);
        return this.authService.isAuthorized([role], false) && diff >= 0 && diff <= 3 || false;
    }

    get expiredPremium (): boolean {
        let diff = this.diffDays('ReportsPro_User');
        return diff >= -5 && diff <= -1 || false;
    }

    get expiredCoach (): boolean {
        let diff = this.diffDays('CoachUnlimitedAthletes');
        return diff >= -5 && diff <= -1 || false;
    }

    get expiredClub (): boolean {
        let diff = this.diffDays('ProfileClub');
        return diff >= -5 && diff <= -1 || false;
    }

    getStyle (): string {
        return ~['onlyBasicTariff'].indexOf(this.message) ? 'primary-600' : 'warn-600';
    }

    diffDays (role: string): number {
        let expiredDate = this.server !== 'testapp.staminity.com:8080' ?
            this.application.permissions[role] :
            this.permissions && this.permissions[role];
        let diff = Math.ceil((toDay(new Date(expiredDate)).getTime() - toDay(new Date()).getTime())/(1000*3600*24));
        return diff !== null && diff !== undefined && diff; // || null;
            //(diff > 0 && diff + 1 || diff < 0 && diff - 1 || diff) || null;
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
