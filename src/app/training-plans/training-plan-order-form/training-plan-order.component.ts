import './training-plan-order.component.scss';
import { IComponentOptions, IComponentController, IHttpPromiseCallbackArg,IScope, INgModelController } from 'angular';
import { TrainingPlanDialogService } from "../training-plan-dialog.service";
import { IUserProfile } from "@api/user";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import MessageService from "@app/core/message.service";
import AuthService from "@app/auth/auth.service";
import { ISession } from "@app/core";
import { TrainingPlansService } from "../training-plans.service";

class TrainingPlanOrderCtrl implements IComponentController {

    // public
    plan: TrainingPlan;
    user: IUserProfile;
    onSuccess: (response: any) => Promise<any>;
    onCancel: (response: any) => Promise<any>;
    
    // private
    private dataLoading: boolean = false;
    private enabled: boolean = true;
    private confirmation: boolean = false;
    private credentials;
    private authState: number = 0; // 0 - signup, 1 - signin
    private error: string = null;
    private signupForm: INgModelController;
    private signinForm: INgModelController;

    static $inject = ['$scope', 'TrainingPlanDialogService', 'TrainingPlansService', 'AuthService', '$auth', 'message'];

    constructor(
        private $scope: IScope,
        private trainingPlansDialog: TrainingPlanDialogService,
        private trainingPlansService: TrainingPlansService,
        private authService: AuthService,
        private $auth,
        private message: MessageService) {

    }

    $onInit() {
        if (!this.plan.hasOwnProperty('samples')) { this.getPlanDetails();} else {this.dataLoading = true;}
        // Типовая структура для создания нового пользователя
        this.credentials = {
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
                language: navigator.language || navigator['userLanguage'] || 'ru',
            },
            email: "",
            password: "",
            activatePremiumTrial: true,
            activateCoachTrial: false,
            activateClubTrial: false,
        };
    }

    authGuest (): Promise<TrainingPlan> {
        return Promise.resolve(_ => {})
                .then(_ => this.authState ?
                    this.authService.signIn(this.credentials) :
                    this.authService.signUp(this.credentials))
                .then(_ => this.trainingPlansService.getStoreItemAsGuest(this.plan.id, this.credentials.email),
                    e => { debugger; this.error = e.errorMessage || e; throw this.error; })
                .then(r => this.plan = new TrainingPlan(r), e => { throw e; });
    }

    pay (): void {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.error = null;
        Promise.resolve(() => {})
            .then(() => this.user.userId ? Promise.resolve(this.plan) : this.authGuest())
            .then((plan: TrainingPlan) => {
                if (plan.product) {
                    if (plan.monetization) {
                        return this.trainingPlansDialog.pay(this.plan.product);
                    } else {
                        return Promise.resolve('getFreeSuccess');
                    }
                } else {
                    throw Promise.reject('badPlanProduct');
                }
            }, e => {throw e;})
            .then(r => this.onSuccess({message: r, email: this.user.userId ? null : this.credentials.email}),
                e => {if (e) { this.error = e; } this.enabled = true;})
            .then(_ => this.$scope.$applyAsync());
    }

    OAuth(provider: string) {
        this.enabled = false; // форма ввода недоступна до получения ответа
        this.$auth.link(provider, {
            internalData: {
                postAsExternalProvider: false,
                provider,
                activateCoachTrial: this.credentials["activateCoachTrial"],
                activatePremiumTrial: true,
            },
        })
            .finally(() => this.enabled = true)
            .then((response: IHttpPromiseCallbackArg<{data: {userProfile: IUserProfile, systemFunctions: any}}>) => {
                const sessionData: ISession = response.data.data;
                this.authService.signedIn(sessionData);
                this.user = sessionData.userProfile;
                //this.redirect("calendar", {uri: sessionData.userProfile.public.uri});
            }, (error) => {
                if (error.hasOwnProperty("stack") && error.stack.indexOf("The popup window was closed") !== -1) {
                    this.message.toastInfo("userCancelOAuth");
                } else {
                    this.message.systemWarning(error.data.errorMessage || error.errorMessage || error);
                }
            }).catch((response) => this.message.systemError(response));
    }

    private getPlanDetails (): void {
        this.trainingPlansService.getStoreItem(this.plan.id)
            .then(result => this.plan = new TrainingPlan(result), error => this.errorHandler(error))
            .then(() => this.dataLoading = true);
    }

    errorHandler (error: string): void {
        this.message.toastError(error);
        this.onCancel(error);
    }

    get actionText (): string {
        if (this.user.userId && this.plan.price > 0) {
            return 'pay';
        } else if (this.user.userId && !this.plan.price) {
            return 'addFree';
        } else if (!this.user.userId && !this.authState && this.plan.price > 0) {
            return 'signupAndPay';
        } else if (!this.user.userId && !this.authState && !this.plan.price) {
            return 'signupAndAddFree';
        } else if (!this.user.userId && this.authState && this.plan.price > 0) {
            return 'signinAndPay';
        } else if (!this.user.userId && this.authState && !this.plan.price) {
            return 'signinAndAddFree';
        }
    }

    get isAuth (): boolean {
        return !!this.user.userId;
    }

    get isPayEnable (): boolean {
        return  this.confirmation && this.enabled && (
                (!this.isAuth && this.authState === 1 && this.signinForm.$valid) ||
                (!this.isAuth && this.authState === 0 && this.signupForm.$valid) ||
                this.isAuth);
    }

}

export const TrainingPlanOrderComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        user: '<',
        onSuccess: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanOrderCtrl,
    template: require('./training-plan-order.component.html') as string
};