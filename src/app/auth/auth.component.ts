import { IComponentController, IComponentOptions, IHttpPromiseCallbackArg, ILocationService} from "angular";
import {StateService} from "@uirouter/angularjs";
import {IUserProfile} from "../../../api/user/user.interface";
import {SessionService} from "../core";
import {IMessageService} from "../core/message.service";
import "./auth.component.scss";

class AuthCtrl implements IComponentController {

    private enabled: boolean = true;
    private showConfirm: boolean = false;
    private credentials: Object = null;
    private passwordStrength: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    static $inject = ["AuthService", "SessionService", "$state", "$stateParams", "$location", "message", "$auth"];

    constructor(
        private AuthService: any,
        private SessionService: SessionService,
        private $state: StateService,
        private $stateParams: any,
        private $location: ILocationService,
        private message: IMessageService, private $auth: any) {
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
        }
        /**
         * Переход в компонент по ссылке /confirm?request={request}
         * В AuthService отправляем POST - подтверждение, что пользователь активировал свою учетную запись
         */
        if (this.$state.$current.name === "confirm") {
            if (this.$location["$$search"].hasOwnProperty("request")) {
                this.AuthService.confirm({request: this.$location["$$search"].request})
                    .then((message) => {
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

        // Типовая структура для создания нового пользователя
        this.credentials = {
            device: this.device,
            public: {
                firstName: "",
                lastName: "",
                avatar: "default.jpg",
                background: "default.jpg",
            },
            display: {
                units: "metric",
                firstDayOfWeek: 1,
                timezone: "Europe/Moscow",
                language: "ru",
            },
            email: this.$stateParams.hasOwnProperty("email") && this.$stateParams.email || "",
            password: "",
            activatePremiumTrial: this.$stateParams.hasOwnProperty("activatePremiumTrial") && this.$stateParams.activatePremiumTrial || true,
            activateCoachTrial: this.$stateParams.hasOwnProperty("activateCoachTrial") && this.$stateParams.activateCoachTrial || false,
            activateClubTrial: this.$stateParams.hasOwnProperty("activateClubTrial") && this.$stateParams.activateClubTrial || false,
        };
    }

    /**
     * Вход пользователя
     * @param credentials
     */
    signin(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.AuthService.signIn({device: this.device, email: credentials.email, password: credentials.password})
            .finally(() => this.enabled = true)
            .then((profile: IUserProfile) => {
                this.redirect("calendar", {uri: profile.public.uri});
            }, (error) => {
                this.message.systemError(error);
            });
    }

    /**
     * Регистрация/создание нового пользователя
     * @param credentials
     */
    signup(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.AuthService.signUp(credentials)
            .finally(() => this.enabled = true)
            .then((message) => {
                this.showConfirm = true;
                this.message.systemSuccess(message.title);
            }, (error) => {
                this.message.systemWarning(error);
            });
    }

    /**
     * Сброс пароля
     * @param credentials
     */
    reset(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.AuthService.resetPassword(credentials.email)
            .then((message) => this.message.systemSuccess(message.title), (error) => this.message.systemWarning(error))
            .then(() => this.enabled = true);
    }

    /**
     * Установка пароля
     * @param credentials
     */
    setpass(credentials) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.AuthService.setPassword(credentials.password, this.$location["$$search"].request)
            .then((message) => this.message.systemSuccess(message.title), (error) => this.message.systemWarning(error))
            .then(() => this.enabled = true)
            .then(() => this.$state.go("signin"));
    }

    /**
     *
     */
    putInvite(credentials) {
        this.enabled = false;
        this.AuthService.putInvite(Object.assign(credentials, {token: this.$location["$$search"].request}))
            .finally(() => this.enabled = true)
            .then((sessionData) => {
                this.AuthService.signedIn(sessionData);
                this.redirect("calendar", {uri: sessionData.userProfile.public.uri});
            }, (error) => {
                this.message.systemWarning(error.errorMessage || error);
            });
    }

    OAuth(provider: string) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.$auth.link(provider, {
            internalData: {
                device: this.device,
                postAsExternalProvider: false,
                provider,
                activateCoachTrial: this.credentials["activateCoachTrial"],
                activatePremiumTrial: true,
            },
        })
            .finally(() => this.enabled = true)
            .then((response: IHttpPromiseCallbackArg<{data: {userProfile: IUserProfile, systemFunctions: any}}>) => {
                const sessionData = response.data.data;
                this.AuthService.signedIn(sessionData);
                this.redirect("calendar", {uri: sessionData.userProfile.public.uri});
            }, (error) => {
                if (error.hasOwnProperty("stack") && error.stack.indexOf("The popup window was closed") !== -1) {
                    this.message.toastInfo("userCancelOAuth");
                } else {
                    this.message.systemWarning(error.data.errorMessage || error.errorMessage || error);
                }
            }).catch((response) => this.message.systemError(response));
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

}

const AuthComponent: IComponentOptions = {
    bindings: {
        view: "<",
    },
    controller: AuthCtrl,
    template: require("./auth.component.html") as string,
};

export default AuthComponent;
