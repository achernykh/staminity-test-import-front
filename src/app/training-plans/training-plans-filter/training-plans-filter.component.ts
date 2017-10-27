import './training-plans-filter.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import {TrainingPlan} from "../training-plan/training-plan.datamodel";

class TrainingPlansFilterCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['$scope', '$mdDialog'];

    private panel: 'plans' | 'events' | 'hide' = 'plans';

    constructor(private $scope: IScope, private $mdDialog: any) {

    }

    $onInit() {

    }

    onPost(env: Event) {

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

        }).then((response) => {}, () => {});

    }

}

const TrainingPlansFilterComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansFilterCtrl,
    template: require('./training-plans-filter.component.html') as string
};

export default TrainingPlansFilterComponent;