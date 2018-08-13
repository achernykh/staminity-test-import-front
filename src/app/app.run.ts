import { StateDeclaration, StateService, TransitionService } from "angular-ui-router";
import { IAuthService, default as AuthService } from "./auth/auth.service";
import MessageService from "./core/message.service";
import LoaderService from "./share/loader/loader.service";
import { path } from "./share/utility/path";
import { SocketService } from "./core/socket/socket.service";
import { IStaminityState } from "./application.interface";
import DisplayService from "./core/display.service";
import UserService from "./core/user.service";
import {StorageService} from "@app/core";

function run(
    $transitions: TransitionService,
    $state: StateService,
    $translate,
    $mdToast,
    LoaderService: LoaderService,
    AuthService: AuthService,
    message: MessageService,
    storage: StorageService, // not used, just force DisplayService being initialized
    DisplayService: DisplayService, // not used, just force DisplayService being initialized
    UserService: UserService, // not used, just force UserService being initialized,
    socket: SocketService,
    $rootScope: any,
) {
    //window.navigator['standalone'] = true;
    console.log("app: run");
    const workerController = path(["serviceWorker", "controller"]) (navigator);
    if (workerController) {
        const checkWorkerState = () => {
            console.log("checkWorkerState", workerController);
            if (workerController.state === "redundant") {
                const toast = $mdToast.simple({ hideDelay: 0 })
                    .textContent($translate.instant("updateToast.message"))
                    .action($translate.instant("updateToast.action"))
                    .highlightAction(true)
                    .highlightClass("md-accent");

                $mdToast.show(toast)
                    .then((response) => {
                        if (response === "ok") {
                            window.location.reload();
                        }
                    });
            }
        };

        checkWorkerState();
        workerController.onstatechange = checkWorkerState;
    }
    $transitions.onBefore({to: "*", from: "*"}, (state) => {
        const routeTo = Object.assign(state.$to()) as IStaminityState;

        if (routeTo.loginRequired && !AuthService.isAuthenticated()) {
            message.systemWarning("forbidden_InsufficientAction");
            return $state.target("signin", {nextState: routeTo.name, nextParams: state.params()});
            //return false;
        }

        if (!!routeTo.authRequired && !AuthService.isAuthorized(routeTo.authRequired)) {
            //message.systemWarning('forbiddenAction');
            return true; // TODO после настройки state в предсталвениях поменять на false
        }
        LoaderService.show();
        //return routeTo.authRequired ? socket.init() : true;
    });
    $transitions.onSuccess({ to: "*", from: "*" }, (state) => {
        //omniSetup(state.$from().name, state.$to().name);
        window.document.title = $translate.instant(state.$to()['title'] || `${state.$to().name}.shortTitle`) + " | " + $translate.instant('staminity');
        let locale: any = {
            lang: DisplayService.getLocale(),
            locale: DisplayService.getLocaleName(),
            language: DisplayService.getLanguageName(),
            availableLanguage: [Object.keys(DisplayService.locales).map(lng => DisplayService.getLanguageName(lng))]
        };

        Object.assign($rootScope, {
            ...locale,
            title: $translate.instant(state.$to()['title'] || `${state.$to().name}.shortTitle`) + " | " + $translate.instant('staminity'),
            subtitle: $translate.instant(`${state.$to().name}.shortTitle`),
            urlLock: $translate.instant(`${state.$to().name}.urlLock`, {locale}),
            imageUrl: state.$to()['imageUrl'],
        });
        LoaderService.hide();
    });
    $state.defaultErrorHandler((error) => {
        console.error(error);
        //message.systemWarning(error.detail);
    });
}

function omniSetup(src: string, trg: string) {
    window['omni'][0].config({
        diplay_button: false, // название класса при значении false - omni-email-widget
        user_info: true, // при true передаём базовую информацию по пользователю в виде заметки
    });
    window['omni'][0].email_widget.ready(function() {
        window['omni'][0].email_widget.identify={
            user_full_name: 'Василий Пукин', //Заменить на фамилию / имя пользователя Staminity
            user_email: 'vas_pup@yandex.ru', //Заменить на e-mail
        };
    });
    /**let omniButtonState = ["welcome", "tariffs","plan"];
    console.debug(`src button ${~omniButtonState.indexOf(src)}, trg button${~omniButtonState.indexOf(trg)}`);
    if (src === "" || ~omniButtonState.indexOf(src) !== ~omniButtonState.indexOf(trg)) {
        debugger;
        if (~omniButtonState.indexOf(trg)) {
            Object.assign(window['omni'][0].g_config, {
                    widget_id: window.navigator.language.substr(0, 2) === 'en' ? "2574-hnkgahuc" : "2573-8q5ftnh6"
                });
            window['omni'][0].config({
                diplay_button: true, // название класса при значении false - omni-email-widget
                user_info: true, // при true передаём базовую информацию по пользователю в виде заметки
            });
        } else {
            Object.assign(window['omni'][0].g_config, {
                widget_id: window.navigator.language.substr(0, 2) === 'en' ? "2562-1cmh2449" : "2559-02bwft39"
            });
            window['omni'][0].config({
                diplay_button: false, // название класса при значении false - omni-email-widget
                user_info: true, // при true передаём базовую информацию по пользователю в виде заметки
            });
            window['omni'][0].email_widget.ready(function () {
                window['omni'][0].email_widget.identify = {
                    user_full_name: 'Stick', //Заменить на фамилию / имя пользователя Staminity
                    user_email: 'stick@staminity.com', //Заменить на e-mail
                };
            });
        }
    }**/

}

run.$inject = ["$transitions", "$state", "$translate", "$mdToast", "LoaderService", "AuthService", "message",
    'storage', "DisplayService", "UserService", 'SocketService', '$rootScope'];

export default run;
