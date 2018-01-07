import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-bills.component.scss';

class UserSettingsBillsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['BillingService', 'dialogs', 'message', 'UserService', '$scope'];

    constructor (
        private billingService: any,
        private dialogs: any,
        private message: any,
        private userService: any,
        private $scope: any,
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
    
    hasPaidBill () { 
        return this.owner.billing.bills.find((bill) => !!bill.receiptDate); 
    } 
 
    billsList () { 
        return this.dialogs.billsList(this.owner) 
        .then(() => {
            // this.reload(); 
        }, (error) => { 
            if (error) {
                // this.reload(); 
            }
        }); 
    } 
 
    autoPayment (isOn?: boolean) { 
        if (typeof isOn === 'undefined') { 
            return this.owner.billing['autoPayment']; 
        } 
 
        let userChanges = { 
            billing: { autoPayment: isOn } 
        }; 
 
        this.userService.putProfile(userChanges) 
        .then(() => { 
            this.owner.billing['autoPayment'] = isOn; 
            this.message.toastInfo('settingsSaveComplete'); 
            this.$scope.$apply(); 
        }) 
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