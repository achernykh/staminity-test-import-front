import { FormMode } from "../application.interface";
import { TrainingSeason } from "./training-season/training-season.datamodel";

export class TrainingSeasonDialogSerivce {
    static $inject = ['$mdDialog'];

    constructor (private $mdDialog: any) {

    }

    open (env: Event, mode: FormMode, season?: TrainingSeason): Promise<{mode: FormMode, season: TrainingSeason}> {

        return this.$mdDialog.show({
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, season) => $mdDialog.hide({mode: mode, season: season});
            }],
            controllerAs: '$ctrl',
            template: `<md-dialog id="training-season-form" aria-label="Training Season Form">
                            <st-training-season-form
                                    layout="column" layout-fill class="training-season-form"
                                    mode="$ctrl.mode"
                                    data="$ctrl.season"
                                    on-cancel="cancel()" on-save="answer(mode, season)">
                            </st-training-season-form>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                season: season || new TrainingSeason(),
                mode: mode
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true
        });
    }

}