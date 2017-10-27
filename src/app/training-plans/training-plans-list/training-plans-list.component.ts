import './training-plans-list.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {TrainingPlansList} from "./training-plans-list.datamodel";
import {TrainingPlan} from "../training-plan/training-plan.datamodel";

class TrainingPlansListCtrl implements IComponentController {

    public plans: TrainingPlansList;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['$scope', '$mdDialog'];

    constructor(private $scope: any, private $mdDialog: any) {

    }

    $onInit() {

    }

    onView(plan: TrainingPlan, env: Event) {

        this.$mdDialog.show({
            controller: ['$scope','$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (chart,update) => $mdDialog.hide({chart: chart,update: update});
            }],
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
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

        }).then((response) => {}, () => {});

    }
}

const TrainingPlansListComponent:IComponentOptions = {
    bindings: {
        plans: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansListCtrl,
    template: require('./training-plans-list.component.html') as string
};

export default TrainingPlansListComponent;