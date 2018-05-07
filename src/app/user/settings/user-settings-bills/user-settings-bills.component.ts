import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IBill } from "@api/billing";
import BillingService from "../../../core/billing.service";
import { UserSettingsService } from "../user-settings.service";
import './user-settings-bills.component.scss';
import { Subject } from 'rxjs/Rx';

class UserSettingsBillsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    // private
    private destroy = new Subject();

    static $inject = ['BillingService', 'dialogs', 'message', 'UserSettingsService', '$scope'];

    constructor (
        private billingService: BillingService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
        private $scope: any,
    ) {

    }

    $onInit (): void {
        this.billingService.messages
            .takeUntil(this.destroy)
            .subscribe(this.reload.bind(this));

    }

    $onDestroy () {
        this.destroy.next();
        this.destroy.complete();
    }


    /**
     * Статус счёта
     * @param bill: IBillingTariff
     * @returns {string}
     */
    invoiceStatus (bill: IBill) : string {
        return this.billingService.billStatus(bill);
    }

    /**
     * Просмотр счёта
     * @param bill: IBill
     */
    viewBill (bill: IBill) {
        this.dialogs.billDetails(bill, this.owner)
        .catch((info) => {
            // this.message.systemWarning(info);
        });
    }
    
    /**
     * Есть ли у пользователя оплаченный счёт
     * @returns {boolean}
     */
    hasPaidBill () : boolean { 
        return !!this.owner.billing.bills.find((bill) => !!bill.receiptDate); 
    } 
 
    /**
     * Показать полный список счетов
     */
    billsList () { 
        return this.dialogs.billsList(this.owner) 
        .then((result) => {
            this.reload(); 
        }, (error) => { 
            if (error) {
                this.reload(); 
            }
        }); 
    } 
 
    /**
     * Геттер-сеттер autoPayment
     * @param isOn?: boolean
     * @returns {boolean | void}
     */
    autoPayment (isOn?: boolean) : boolean | void { 
        if (typeof isOn === 'undefined') { 
            return this.owner.billing['autoPayment']; 
        } 
 
        this.userSettingsService.saveSettings({ 
            userId: this.owner.userId,
            revision: this.owner.revision,
            billing: Object.assign({}, this.owner.billing, { autoPayment: isOn } )
        }) 
        .then(() => { 
            this.owner.billing['autoPayment'] = isOn; 
            //this.message.toastInfo('settingsSaveComplete');
            this.$scope.$apply(); 
        }) 
        .catch((info) => { 
            this.message.systemWarning(info); 
        }); 
    }

    /* 
     * Перезагрузить профиль
     */
    reload () {
        this.userSettingsService.reload(this.owner.userId);
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