import BillingService from "@app/core/billing.service";
import {SessionService} from "@app/core";
import {IBillingTariff} from "@api/billing";
import {IUserProfile} from "@api/user";
import {EnableTariffCtrl} from "../../share/dialogs/enable-tariff/enable-tariff.controller";
import {getPremiumPageByFunction} from "../premium.functions";
import MessageService from "@app/core/message.service";

export class PremiumDialogService {

    // private
    private readonly defaultDialogOptions = {
        /**controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
            $scope.hide = () => $mdDialog.hide();
            $scope.cancel = () => $mdDialog.cancel();
            $scope.answer = (subscriptionPeriod) => $mdDialog.hide({ subscriptionPeriod });
        }],
        controllerAs: '$ctrl',**/
        parent: angular.element(document.body),
        bindToController: true,
        clickOutsideToClose: false,
        escapeToClose: true,
        fullscreen: true
    };

    static $inject = ['$mdDialog', 'BillingService', 'SessionService', 'message'];

    constructor (private $mdDialog,
                 private billingService: BillingService,
                 private session: SessionService,
                 private message: MessageService) {

    }

    open (e: Event, functionCode: string): Promise<any> {
        let user: IUserProfile = this.session.getUser();
        let tariff: IBillingTariff = user.billing.tariffs.filter(t => t.tariffCode === 'Premium')[0];
        let tariffId: number = tariff.tariffId;


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
            controller: EnableTariffCtrl,
            controllerAs: '$ctrl',
            targetEvent: e,
            locals: { user, tariff },
            resolve: {
                checkTariff: () => {
                    debugger;
                    if (tariff.isBlocked && tariff.isOn) {
                        return Promise.resolve(_ => {debugger;})
                            .then(_ => this.billingService.disableTariff(tariffId, user.userId))
                            .catch(e => this.message.toastError(e))
                    } else {
                        return true;
                    }
                },
                billing: () => this.billingService.getTariff(tariffId, ''),
                page: () => getPremiumPageByFunction(functionCode) || 0,
            },
            multiple: true
        }));
    }

    confirm (): Promise<any> {
        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {

        }));
    }

}