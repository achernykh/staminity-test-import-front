import {CalendarItemDialogService} from "../../calendar-item/calendar-item-dialog.service";

export class PremiumDialogService {

    // private
    private readonly defaultDialogOptions = {
        controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
            $scope.hide = () => $mdDialog.hide();
            $scope.cancel = () => $mdDialog.cancel();
            $scope.answer = (subscriptionPeriod) => $mdDialog.hide({ subscriptionPeriod });
        }],
        controllerAs: '$ctrl',
        parent: angular.element(document.body),
        bindToController: true,
        clickOutsideToClose: false,
        escapeToClose: true,
        fullscreen: true
    };

    static $inject = ['$mdDialog'];

    constructor (private $mdDialog) {

    }

    open (e: Event, functionCode: string): Promise<any> {
        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="premium-dialog" aria-label="Activity" layout="column">
                            <st-premium-dialog
                                    flex="auto" flex-gt-sm="none" layout="row"
                                    class="premium-dialog"
                                    style="margin: auto"
                                    data="$ctrl.page"
                                 
                                    on-cancel="cancel()" on-answer="answer(subscriptionPeriod)">
                            </st-premium-dialog>
                       </md-dialog>`,
            targetEvent: e,
            locals: {
                page: functionCode
            }
        }));
    }

}