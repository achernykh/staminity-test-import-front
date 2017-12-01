import { FormMode } from "../application.interface";
import { TrainingPlan } from "./training-plan/training-plan.datamodel";

export class TrainingPlanDialogService {

    static $inject = ["$mdDialog"];

    constructor (private $mdDialog: any) {

    }

    open (env: Event, mode: FormMode, plan?: TrainingPlan): Promise<{mode: FormMode, plan: TrainingPlan}> {

        return this.$mdDialog.show({
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode,plan) => $mdDialog.hide({mode: mode, plan: plan});
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
                            <training-plan-form
                                    layout="column" layout-fill class="training-plan-form"
                                    mode="$ctrl.mode"
                                    plan="$ctrl.plan"
                                    on-cancel="cancel()" on-save="answer(mode,plan)">
                            </training-plan-form>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: plan || new TrainingPlan(),
                mode: mode,
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,
        });
    }

}