import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-bills.component.scss';

class UserSettingsBillsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['BillingService', 'dialogs', 'message'];

    constructor (
        private billingService: any,
        private dialogs: any,
        private message: any,
    ) {

    }

    invoiceStatus (bill) {
        return this.billingService.billStatus(bill);
    }

    viewBill (bill) {
        return this.dialogs.billDetails(bill, this.owner)
        .catch((info) => {
            this.message.systemWarning(info);
        });
    }
}

export const UserSettingsBillsComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsBillsCtrl,
    template: require('./user-settings-bills.component.html') as string
} as any;