import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IBillingTariff } from "@api/billing";
import BillingService from "../../../core/billing.service";
import './user-settings-tariffs.component.scss';

class UserSettingsTariffsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['BillingService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private billingService: BillingService,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
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
        }
    }

    selectTariff (tariff: any) {
        if (!tariff.isBlocked) {
            tariff.isOn? this.viewTariff(tariff) : this.enableTariff(tariff);
        }
    }

    enableTariff (tariff: any) {
        return this.dialogs.enableTariff(tariff, this.owner)
        .catch((info) => {
            this.message.systemWarning(info);
        });
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
        .catch((info) => {
            this.message.systemWarning(info);
        });
    }

    viewTariff (tariff: any) {
        return this.dialogs.tariffDetails(tariff, this.owner)
        .catch((info) => {
            this.message.systemWarning(info);
        });
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