import { IScope } from 'angular';
import { TrainingPlan } from "./training-plan/training-plan.datamodel";

export class TrainingPlanDialogService {

    static $inject = ['$mdDialog'];

    constructor (
        private $mdDialog: any) {

    }

    post (env: Event) {

        this.$mdDialog.show({
            controller: [ '$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (chart, update) => $mdDialog.hide({ chart: chart, update: update });
            } ],
            controllerAs: '$ctrl',
            template: `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
                        <training-plan-form
                                layout="column" layout-fill class="training-plan-form"
                                mode="post"
                                plan="$ctrl.plan"
                                on-cancel="cancel()" on-save="answer(chart, update)">
                        </training-plan-form>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: new TrainingPlan()
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true

        }).then(() => {}, () => {});

    }

    view (plan: TrainingPlan, env: Event): void {

        this.$mdDialog.show({
            controller: [ '$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (chart, update) => $mdDialog.hide({ chart: chart, update: update });
            } ],
            controllerAs: '$ctrl',
            template: `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
                        <training-plan-form
                                layout="column" layout-fill class="training-plan-form"
                                mode="view"
                                plan="$ctrl.plan"
                                on-cancel="cancel()" on-save="answer(chart, update)">
                        </training-plan-form>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: plan,
                filter: null,
                categoriesByOwner: null
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true

        }).then(() => {}, () => {});

    }

}