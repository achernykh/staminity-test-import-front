import { FormMode } from "@app/application.interface";
import { IPeriodizationScheme, IMesocycle } from "@api/seasonPlanning";
export class PeriodizationDialogService {
    static $inject = ['$mdDialog'];

    constructor (private $mdDialog: any) {

    }

    scheme (env: Event, mode: FormMode, scheme?: IPeriodizationScheme): Promise<{mode: FormMode, scheme: IPeriodizationScheme}> {

        return this.$mdDialog.show({
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, scheme) => $mdDialog.hide({mode: mode, scheme: scheme});
            }],
            controllerAs: '$ctrl',
            template: `<md-dialog id="periodization-scheme-dialog" aria-label="Training Season Form">
                            <st-periodization-scheme-dialog
                                    layout="column" layout-fill
                                    class="periodization-scheme-dialog"
                                    mode="$ctrl.mode"
                                    data="$ctrl.scheme"
                                    on-cancel="cancel()" on-save="answer(mode, scheme)">
                            </st-periodization-scheme-dialog>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                scheme: scheme || {},
                mode: mode
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true
        });
    }

    mesocycle (env: Event, mode: FormMode, schemeId: number, mesocycle?: IMesocycle): Promise<{mode: FormMode, mesocycle: IMesocycle}> {

        return this.$mdDialog.show({
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, mesocycle) => $mdDialog.hide({mode: mode, mesocycle: mesocycle});
            }],
            controllerAs: '$ctrl',
            template: `<md-dialog id="periodization-mesocycle-dialog" aria-label="Training Season Form">
                            <st-periodization-mesocycle-dialog
                                    layout="column" layout-fill
                                    class="periodization-mesocycle-dialog"
                                    mode="$ctrl.mode"
                                    data="$ctrl.mesocycle"
                                    scheme-id="$ctrl.schemeId"
                                    on-cancel="cancel()" on-save="answer(mode, mesocycle)">
                            </st-periodization-mesocycle-dialog>
                       </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                mesocycle: mesocycle || {},
                schemeId: schemeId,
                mode: mode
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true
        });
    }

}