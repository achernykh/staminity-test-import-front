import { FormMode } from "../application.interface";
import { TrainingPlan } from "./training-plan/training-plan.datamodel";
import { SessionService } from "@app/core";
import { IMonetaAssistantFormData } from "@api/trainingPlans";
import { IUserProfile } from "../../../api/user/user.interface";
import { ITrainingPlanSearchRequest } from "../../../api/trainingPlans/training-plans.interface";

export class TrainingPlanDialogService {

    static $inject = ["$mdDialog", 'SessionService', 'dialogs'];

    constructor(private $mdDialog: any, private session: SessionService, private dialogs) {

    }

    open(env: Event, mode: FormMode, plan?: TrainingPlan): Promise<{mode: FormMode, plan: TrainingPlan}> {

        return this.$mdDialog.show({
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, plan) => $mdDialog.hide({mode, plan});
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
                            <training-plan-form
                                    layout="column" layout-fill class="training-plan-form"
                                    mode="$ctrl.mode"
                                    data="$ctrl.plan"
                                    on-cancel="cancel()" on-save="answer(mode,plan)">
                            </training-plan-form>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: plan || new TrainingPlan(),
                mode,
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        });
    }

    store(env: Event, plan?: TrainingPlan): Promise<any> {
        return this.$mdDialog.show({
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, plan) => $mdDialog.hide({mode, plan});
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="training-plan-store-item" aria-label="Training Plan Store Item">
                            <st-training-plan-store-item
                                    layout="column" layout-fill class="training-plan-store-item"
                                    data="$ctrl.plan"
                                    on-cancel="cancel()" on-save="answer(mode,plan)"/>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: plan || new TrainingPlan(),
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        });
    }

    publish (e: Event, plan: TrainingPlan): Promise<any> {
        let dialog = {
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, plan) => $mdDialog.hide({mode, plan});
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="training-plan-publish" aria-label="Training Plan Publish">
                            <st-training-plan-publish
                                    layout="column" layout-fill class="training-plan-order"
                                    plan="$ctrl.plan"
                                    user="$ctrl.currentUser"
                                    on-cancel="cancel()" on-save="answer(mode,plan)"/>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: e,
            locals: {
                plan: plan,
                currentUser: this.session.getUser()
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        };
        return this.$mdDialog.show(dialog);
    }

    order (e: Event, plan: TrainingPlan): Promise<any> {
        let dialog = {
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (response) => $mdDialog.hide({response});
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="training-plan-order" aria-label="Training Plan Order Confirmation">
                            <st-training-plan-order
                                    layout="column" layout-fill class="training-plan-order"
                                    plan="$ctrl.plan"
                                    user="$ctrl.currentUser"
                                    on-cancel="cancel()" on-save="answer(response)"/>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: e,
            locals: {
                plan: plan,
                currentUser: this.session.getUser()
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        };
        return this.$mdDialog.show(dialog);
    }

    filter (e: Event, filter: ITrainingPlanSearchRequest): Promise<any> {
        let dialog = {
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (response) => $mdDialog.hide(response);
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="training-plans-filter" aria-label="Training Plan Order Confirmation"
                                  layout="column" layout-fill>
                            <md-toolbar flex="none" class="md-default">
                                <div class="md-toolbar-tools">
                                    <h2 class="" translate="trainingPlans.filter"></h2>
                                    <span flex></span>
                                    <md-button class="md-icon-button" ng-click="cancel()">
                                        <md-tooltip md-direction="left">{{::'activity.settings.close' | translate}}</md-tooltip>
                                        <md-icon class="material-icons md-dark md-active" aria-label="Close dialog">close</md-icon>
                                    </md-button>
                                </div>
                            </md-toolbar>
                            <training-plans-filter flex="auto" layout="column" layout-fill class="training-plans-search__filter"
                               filter="$ctrl.filter"
                               view="search"
                               dialog="true"
                               on-cancel="cancel()"
                               on-search="answer(filter)"/>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: e,
            locals: {
                filter: filter,
                currentUser: this.session.getUser()
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        };
        return this.$mdDialog.show(dialog);
    }

    pay (product: IMonetaAssistantFormData): Promise<any> {

        const url = `https://demo.moneta.ru/assistant.widget?` +
            Object.keys(product).map(k => `${k}=${product[k]}`).join('&');// MNT_ID=${product.MNT_ID}&MNT_AMOUNT=${product.MNT_AMOUNT}&MNT_CURRENCY_CODE=${product.MNT_CURRENCY_CODE}&MNT_TRANSACTION_ID=${product.MNT_TRANSACTION_ID}&MNT_SIGNATURE=${product.MNT_SIGNATURE}&MNT_TEST_MODE=${product.MNT_TEST_MODE}&MNT_DESCRIPTION=${product.MNT_DESCRIPTION}`;
        //const url = `https://demo.moneta.ru/assistant.widget?MNT_ID=64994513&MNT_AMOUNT=100.15&MNT_CURRENCY_CODE=RUB&MNT_TRANSACTION_ID=test_tran_1&MNT_SIGNATURE=676d53a77f08ec5b46cb6581f2e6f615&MNT_TEST_MODE=1&MNT_DESCRIPTION=`;

        const handler = (event) => {
            debugger;
            const result = localStorage.getItem('moneta-result');
            if (result === 'success') {
                this.$mdDialog.hide('success');
                return Promise.resolve('success');
            } else if (result === 'fail') {
                this.$mdDialog.hide('fail');
                return Promise.reject('fail');
            } else if (result === 'inprogress') {
                this.$mdDialog.hide('inprogress');
                return Promise.resolve('inprogress');
            } else if (result === 'return') {
                this.$mdDialog.hide('return');
                return Promise.reject('return');
            }
        };

        window.addEventListener('storage', handler, false);

        return this.dialogs.iframe(url, "trainingPlans.pay.title")
            .then(() => {
                window.removeEventListener('storage', handler, false);
                localStorage.removeItem('moneta-result');
            }, () => {
                window.removeEventListener('storage', handler, false);
                localStorage.removeItem('moneta-result');
                return Promise.reject('close');
            });
    }



    assignment(env: Event, plan: TrainingPlan, customer: boolean, state?: 'form' | 'list'): Promise<{mode: FormMode, plan: TrainingPlan}> {
        let user: IUserProfile = this.session.getUser();
        let athletes: Array<IUserProfile> = customer ?
            [user] :
            user.connections.hasOwnProperty('allAthletes') && user.connections.allAthletes.groupMembers || null;

        let dialog = {
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, plan) => $mdDialog.hide({mode, plan});
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="training-plan-assignment" aria-label="Training Plan Assignment Form">
                            <st-training-plan-assignment
                                    layout="column" layout-fill class="training-plan-assignment"
                                    state="$ctrl.state"
                                    plan="$ctrl.plan"
                                    athletes="$ctrl.athletes"
                                    on-cancel="cancel()" on-save="answer(mode,plan)">
                            </st-training-plan-assignment>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: plan,
                state,
                athletes: athletes
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        };
        return this.$mdDialog.show(dialog);
    }

}
