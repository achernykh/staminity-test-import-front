export class AnalyticsDialogService {

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

    constructor (private $mdDialog) {}

    templateSelector (e: Event): Promise<any> {
        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="premium-dialog" aria-label="Activity" layout="column">
                            <st-premium-dialog
                                    flex="auto" flex-gt-sm="none" layout="column"
                                    class="premium-dialog"
                                    style="margin: auto"
                                    user="$ctrl.user"
                                    tariff="$ctrl.tariff"
                                    billing="$ctrl.billing"
                                    page="$ctrl.page"
                                    on-cancel="$ctrl.cancel()" on-answer="answer(subscriptionPeriod)">
                            </st-premium-dialog>
                       </md-dialog>`,
            controllerAs: '$ctrl',
            targetEvent: e,
            locals: { },
            resolve: { },
        }));
    }

    settings (e: Event): Promise<any> {
        return Promise.resolve();
    }


    fullScreen (e: Event): Promise<any> {
        return Promise.resolve();
    }

}