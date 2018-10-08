import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IBillingTariff } from "@api/billing";
import BillingService from "../../../core/billing.service";
import { UserSettingsService } from "../user-settings.service";
import './user-settings-tariffs.component.scss';
import {gtmViewTariff} from "../../../share/google/google-analitics.functions";

class UserSettingsTariffsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['BillingService', 'dialogs', 'message', '$mdDialog', 'UserSettingsService', '$scope'];

    constructor (
        private billingService: BillingService,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
        private userSettingsService: UserSettingsService,
        private $scope: any,
    ) {
        window['UserSettingsTariffsCtrl'] = this;
    }

    tariffStatus (tariff: IBillingTariff) {
        return this.billingService.tariffStatus(tariff);
    }

    tariffIsEnabled (tariff: any) {
        return (isOn) => {
            if (typeof isOn === 'undefined') {
                return tariff.isOn;
            }

            return tariff.isOn? this.disableTariff(tariff) : this.enableTariff(tariff);
        };
    }

    selectTariff (tariff: any) {
        if (!tariff.isBlocked) {
            tariff.isOn? this.viewTariff(tariff) : this.enableTariff(tariff);
        }
    }

    enableTariff (tariff: any) {
        return this.dialogs.enableTariff(tariff, this.owner)
            .then(_ => this.reload())
            .catch(info => {});// this.message.systemWarning(info));
    }

    disableTariff (tariff: any) {
        return (tariff.isAvailable && tariff.isBlocked ? (
            this.billingService.disableTariff(tariff.tariffId, this.owner.userId)
            .then((info) => {
                this.message.systemSuccess(info.title);
                this.$mdDialog.hide();
            })
        ) : (
            this.dialogs.disableTariff(tariff, this.owner)
        ))
        .then(() => {
            this.reload();
        })
        .catch((info) => {
            // this.message.systemWarning(info);
        });
    }

    viewTariff (tariff: any) {
        return this.dialogs.tariffDetails(tariff, this.owner)
        .then(() => {
            this.reload();
        })
        .catch((info) => {
            // this.message.systemWarning(info);
        });
    }

    /* 
     * Перезагрузить профиль
     */
    reload () {
        this.userSettingsService.reload(this.owner.userId);
    }
}

export const UserSettingsTariffsComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsTariffsCtrl,
    template: require('./user-settings-tariffs.component.html') as string
} as any;