import { StateDeclaration, StateService, TransitionService } from "angular-ui-router";
import {IAuthService} from "./auth/auth.service";
import MessageService from "./core/message.service";
import LoaderService from "./share/loader/loader.service";
import { path } from "./share/utility/path";
import { SocketService } from "./core/socket/socket.service";
import { IStaminityState } from "./application.interface";

function run(
    $transitions: TransitionService,
    $state: StateService,
    $translate,
    $mdToast,
    LoaderService: LoaderService,
    AuthService: IAuthService,
    message: MessageService,
    DisplayService: any, // not used, just force DisplayService being initialized
    UserService: any, // not used, just force UserService being initialized,
    socket: SocketService
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
        const routeTo: IStaminityState = Object.assign(state.$to());
        console.info(`app run: $transition onBefore ${routeTo.name}`);

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
        console.info(`app run: $transition onSuccess ${state.$to().name}`);
        LoaderService.hide();
    });

    $state.defaultErrorHandler((error) => {
        console.error(error);
        //message.systemWarning(error.detail);
    });
}

run.$inject = ["$transitions", "$state", "$translate", "$mdToast", "LoaderService", "AuthService", "message",
    "DisplayService", "UserService", 'SocketService'];

export default run;
