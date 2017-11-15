import { TrainingPlan } from "./training-plan/training-plan.datamodel";
import { FormMode } from "../application.interface";

export class TrainingPlanDialogService {

    static $inject = ['$mdDialog'];

    constructor (private $mdDialog: any) {

    }

    open (env: Event, mode: FormMode, plan?: TrainingPlan): Promise<TrainingPlan> {

        return this.$mdDialog.show({
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (plan) => $mdDialog.hide(plan);
            }],
            controllerAs: '$ctrl',
            template: `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
                            <training-plan-form
                                    layout="column" layout-fill class="training-plan-form"
                                    mode="$ctrl.mode"
                                    plan="$ctrl.plan"
                                    on-cancel="cancel()" on-save="answer(plan)">
                            </training-plan-form>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: plan || new TrainingPlan(),
                mode: mode
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true
        });
    }

}