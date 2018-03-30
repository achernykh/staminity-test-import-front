import './training-plan-order.component.scss';
import { IComponentOptions, IComponentController, IHttpPromiseCallbackArg } from 'angular';
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
    static $inject = ['TrainingPlanDialogService', 'TrainingPlansService', 'AuthService', '$auth', 'message'];

    constructor(
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

    pay (): void {
        this.enabled = false; // форма ввода недоступна до получения ответа
        if (!this.plan.price) {
            this.onSuccess({response: 'success'});
        }
        else if (this.user.userId) {
            this.trainingPlansDialog.pay(this.plan.product)
                .then(response => this.onSuccess({response: response}), e => this.onCancel({response: e}));
        } else {
            this.authService.signUp(this.credentials)
                .then(() => this.trainingPlansService.getStoreItemAsGuest(this.plan.id, this.credentials.email),
                    error => this.message.toastError(error))
                .then(response => this.plan = new TrainingPlan(response), error => this.message.toastError(error))
                .then(_ => this.trainingPlansDialog.pay(this.plan.product))
                .then(_ => {debugger;}, error => {debugger;});
        }
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