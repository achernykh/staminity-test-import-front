import { IComponentController, IComponentOptions, IHttpPromiseCallbackArg, ILocationService, IScope} from "angular";
import {StateService} from "@uirouter/angularjs";
import {IUserProfile, IUserProfilePersonal} from "../../../api/user/user.interface";
import {SessionService} from "../core";
import {IMessageService} from "../core/message.service";
import "./auth.component.scss";
import {gaEmailSignup, gaSocialSignup, gtmEvent} from "../share/google/google-analitics.functions";
import AuthService from "@app/auth/auth.service";
import {ISystemMessage} from "@api/core";
import DisplayService, {GeoInfo} from "@app/core/display.service";
import {IUserProfilePublic, IUserProfileDisplay} from "@api/user";
import {UserSettingsService} from "@app/user/settings/user-settings.service";
import {countriesList} from "../user/settings/user-settings.constants";
import { getUser } from "../core/session/session.service";
import {fbqLog} from "../share/facebook/fbq.functions";
import {yaReachGoal} from "../share/yandex/yandex.function";
declare var dataLayer: any[];

interface UserCredentials {
    public: IUserProfilePublic;
    personal: IUserProfilePersonal;
    display: IUserProfileDisplay;
    device: string;
    email: string;
    password: string;
    activatePremiumTrial: boolean;
    activateCoachTrial: boolean;
    activateClubTrial: boolean;
}

class AuthCtrl implements IComponentController {

    // bind
    ipInfo: GeoInfo;

    // private
    private enabled: boolean = true;
    private showConfirm: boolean = false;
    private credentials: UserCredentials;
    private role: string;
    private passwordStrength: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    private countriesList = countriesList;
    private countrySearchText: string;

    static $inject = ["$scope", "AuthService", "SessionService", "$state", "$stateParams", "$location", "message", "$auth",
        'DisplayService', 'UserSettingsService'];

    constructor(
        private $scope: IScope,
        private AuthService: AuthService,
        private SessionService: SessionService,
        private $state: StateService,
        private $stateParams: any,
        private $location: ILocationService,
        private message: IMessageService,
        private $auth: any,
        private displayService: DisplayService,
        private userSettingsService: UserSettingsService) {

        this.prepareCredentials();

        this.displayService.getIpInfo()
            .then(result => this.ipInfo = result)
            .then(_ => this.prepareCredentials());
    }

    get device (): string {
        if (window.hasOwnProperty('ionic')) {
            return 'mobile';
        }
        else if (/Mobi/.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) {
            return 'mobilebrowser';
        } else {
            return 'webbrowser';
        }
    }

    $onInit() {
        /**
         * Переход в компонент по ссылке /signout
         * Сбрасываем данные в localStorage и переходим на экран входа пользователя
         */
        if (this.$state.$current.name === "signout") {
            this.AuthService.signOut();
            this.$state.go("signin");
            gtmEvent('appEvent', 'signout', 'signout', 'signoutButton');
        }
        /**
         * Переход в компонент по ссылке /confirm?request={request}
         * В AuthService отправляем POST - подтверждение, что пользователь активировал свою учетную запись
         */
        if (this.$state.$current.name === "confirm") {
            if (this.$location["$$search"].hasOwnProperty("request")) {
                this.AuthService.confirm({request: this.$location["$$search"].request})
                    .then((message: ISystemMessage) => {
                        this.message.systemSuccess(message.title);
                        this.$state.go("signin");
                    }, (error) => {
                        this.message.systemWarning(error);
                        this.$state.go("signup");
                    });
            } else {
                this.$state.go("signup");
            }
        }

        this.displayService.getLngObservable()
            .subscribe(lng => {
                this.credentials.display.language = lng;
                this.$scope.$applyAsync();
            });
    }

    prepareCredentials () {
        // Типовая структура для создания нового пользователя
        this.credentials = {
            device: this.device,
            public: {
                firstName: "",
                lastName: "",
                avatar: "default.jpg",
                background: "default.jpg",
            },
            personal: {
                country: this.ipInfo && this.ipInfo.country_code2 || null,
                city: this.ipInfo && this.ipInfo.city || null,
            },
            display: {
                units: "metric",
                firstDayOfWeek: 1,
                timezone: this.ipInfo && this.ipInfo.time_zone.name || "Europe/Moscow",
                language: this.displayService.getLocale(),
            },
            email: this.$stateParams.hasOwnProperty("email") && this.$stateParams.email || "",
            password: "",
            activatePremiumTrial: this.$stateParams.hasOwnProperty("activatePremiumTrial") && this.$stateParams.activatePremiumTrial || true,
            activateCoachTrial: this.$stateParams.hasOwnProperty("activateCoachTrial") && this.$stateParams.activateCoachTrial || false,
            activateClubTrial: this.$stateParams.hasOwnProperty("activateClubTrial") && this.$stateParams.activateClubTrial || false,
        };

        if (this.credentials.activateClubTrial) {
            this.role = 'clubManager';
        } else if (this.credentials.activateCoachTrial) {
            this.role = 'coach';
        } else {
            this.role = 'athlete';
        }
    }

    changeRole (): void {
        switch (this.role) {
            case 'athlete': {
                this.credentials.activatePremiumTrial = true;
                this.credentials.activateClubTrial = false;
                this.credentials.activateCoachTrial = false;
                break;
            }
            case 'coach': {
                this.credentials.activatePremiumTrial = false;
                this.credentials.activateCoachTrial = true;
                this.credentials.activateClubTrial = false;
                break;
            }
            case 'clubCoach': {
                this.credentials.activatePremiumTrial = false;
                this.credentials.activateCoachTrial = false;
                this.credentials.activateClubTrial = false;
                break;
            }
            case 'clubManager': {
                this.credentials.activatePremiumTrial = false;
                this.credentials.activateCoachTrial = false;
                this.credentials.activateClubTrial = true;
                break;
            }
        }
    }

    /**
     * Вход пользователя
     * @param credentials
     */
    signin(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.AuthService.signIn({device: this.device, email: credentials.email, password: credentials.password})
            .then(profile => {
                this.redirect("calendar", {uri: profile.public.uri});
                gtmEvent('appEvent', 'signin', 'signinEmail', 'email');
                }, e => this.message.systemError(e))
            .then(_ => this.enabled = true);
    }

    /**
     * Регистрация/создание нового пользователя
     * @param credentials
     */
    signup(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.credentials.display.language = this.displayService.getLocale();
        this.AuthService.signUp(Object.assign({}, credentials, {utm: {...this.getUtmParams()}}))
            //.finally(() => this.enabled = true)
            .then((m: ISystemMessage) => {
                    this.message.systemSuccess(m.title);
                    this.showConfirm = true;
                    gtmEvent('appEvent', 'signup', 'signupEmail', 'signupButton');
                    fbqLog('CompleteRegistration', {status: 'emailSignup'});
                    yaReachGoal('CREATE_ACCOUNT');
                }, e => e => this.message.systemWarning(e))
            .then(_ => this.enabled = true);
    }

    /**
     * Сброс пароля
     * @param credentials
     */
    reset(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.AuthService.resetPassword(credentials.email)
            .then((m: ISystemMessage) => this.message.systemSuccess(m.title), (error) => this.message.systemWarning(error))
            .then(() => this.enabled = true);
    }

    /**
     * Установка пароля
     * @param credentials
     */
    setpass(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.AuthService.setPassword(credentials.password, this.$location["$$search"].request)
            .then((m: ISystemMessage) => this.message.systemSuccess(m.title), e => this.message.systemWarning(e))
            .then(_ => this.enabled = true)
            .then(_ => this.$state.go("signin"));
    }

    /**
     *
     */
    putInvite(credentials) {
        this.enabled = false;
        this.AuthService.putInvite(Object.assign(credentials, {token: this.$location["$$search"].request}))
            //.finally(() => this.enabled = true)
            .then((sessionData) => {
                this.AuthService.signedIn(sessionData);
                this.redirect("calendar", {uri: sessionData.userProfile.public.uri});
                gtmEvent('appEvent', 'signup', 'signupInvite', 'inviteButton');
                fbqLog('CompleteRegistration', {status: `invite`});
            }, (error) => {this.message.systemWarning(error.errorMessage || error);})
            .then(_ => this.enabled = true);
    }

    OAuth(flowType: 'signUp' | 'signIn', provider: string) {
        this.credentials.display.language = this.displayService.getLocale();
        let data = Object.assign({
            flowType: flowType,
            device: this.device,
            display: this.credentials.display,
            postAsExternalProvider: false,
            provider,
            activateCoachTrial: this.credentials.activateCoachTrial,
            activatePremiumTrial: true,
            utm: {...this.getUtmParams()}
        });
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.$auth.link(provider, {internalData: data})
            //.finally(() => this.enabled = true)
            .then((r: IHttpPromiseCallbackArg<any>) => {
                this.AuthService.signedIn(r.data.data);
                if (flowType === 'signUp') {
                    fbqLog('CompleteRegistration', {status: `${provider}Signup`});
                    gtmEvent('appEvent', 'signup', `socialButton`, `signup${provider.substr(0,1).toUpperCase()}${provider.substr(1)}`);
                    yaReachGoal('CREATE_ACCOUNT');
                } else {
                    gtmEvent('appEvent', 'signin', `${provider}`, `signin${provider.substr(0,1).toUpperCase()}${provider.substr(1)}`);
                }
                this.redirect("calendar", {uri: this.SessionService.getUser().public.uri});

            }, e => this.errorHandler(e))
            .then(_ => this.enabled = true);
    }

    errorHandler (e) {
        if (e.hasOwnProperty("stack") && e.stack.indexOf("The popup window was closed") !== -1) {
            this.message.toastInfo("userCancelOAuth");
        } else if (e.errorMessage === 'forbidden_need_signUp' || e.data.errorMessage === 'forbidden_need_signUp') {
            this.message.systemWarning(e.errorMessage || e.data.errorMessage);
            this.$state.go('signup');
        } else {
            this.message.systemWarning(e.data.errorMessage || e.errorMessage || e);
        }
        throw e;
    }

    redirect(state: string = "calendar", params: Object): void {
        const redirectState = this.$stateParams.hasOwnProperty("nextState") && this.$stateParams.nextState || state;
        const redirectParams = this.$stateParams.hasOwnProperty("nextParams") && this.$stateParams.nextParams || params;

        if (redirectState === "calendar" && redirectParams.hasOwnProperty("#") && redirectParams["#"]) {
            redirectParams["#"] = null;
        }
        //  Устанавливаем таймаут на случай выхода/входа пользователя. Без тайм-аута вход без выхода не успевает
        setTimeout(() => this.$state.go(redirectState, redirectParams), 1000);
    }

    private getUtmParams (): Object {
        return JSON.parse(window.sessionStorage.getItem('utm')) || {};
    }

    /**
     * Поиск страны
     * @param query: string
     * @returns {string[]}
     */
    countrySearch (query: string) : string[] {
        return this.userSettingsService.countrySearch(query);
    }

    /**
     * Название страны
     * @param key: string
     * @returns {string}
     */
    getCountryName (key: string) : string {
        return countriesList[this.displayService.getLocale()][key];
    }

}

const AuthComponent: IComponentOptions = {
    bindings: {
        view: "<",
        signUpButton: '<',
    },
    controller: AuthCtrl,
    template: require("./auth.component.html") as string,
};

export default AuthComponent;
