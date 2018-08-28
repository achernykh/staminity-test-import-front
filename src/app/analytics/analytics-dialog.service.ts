import {AnalyticsChart} from "@app/analytics/analytics-chart/analytics-chart.model";
import {IUserProfile} from "@api/user";

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

    templateSelector (e: Event, charts: AnalyticsChart[]): Promise<any> {
        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="analytics-template-selector" aria-label="Activity" layout="column">
                            <st-analytics-template-selector
                                    flex="auto" flex-gt-sm="none" layout="column"
                                    class="analytics-template-selector"
                                    style="margin: auto"
                                    charts="$ctrl.charts"
                                    tariff="$ctrl.tariff"
                                    billing="$ctrl.billing"
                                    page="$ctrl.page"
                                    on-cancel="$ctrl.cancel()" on-answer="answer(subscriptionPeriod)">
                            </st-analytics-template-selector>
                       </md-dialog>`,
            controllerAs: '$ctrl',
            targetEvent: e,
            locals: { charts},
            resolve: { },
        }));
    }

    settings (e: Event): Promise<any> {
        return Promise.resolve();
    }


    fullScreen (e: Event, owner: IUserProfile, chart: AnalyticsChart): Promise<any> {
        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="analytics-chart" aria-label="Activity" layout="column">
                            <analytics-chart class=""
                                 owner="$ctrl.owner"
                                 chart="$ctrl.chart"
                                 global-filter="$ctrl.globalFilter"
                                 on-change-filter="$ctrl.saveSettings('charts')"
                                 mobile-view="">
                            </analytics-chart>
                       </md-dialog>`,
            controllerAs: '$ctrl',
            targetEvent: e,
            locals: { chart, owner},
            resolve: { },
        }));
    }

}