 import moment from 'moment/min/moment-with-locales.js';
import './dialogs.scss';
import { id, uniqueBy, pipe, filter, map, prop, maybe } from '../util';


export default class DialogsService {
    
    constructor ($mdDialog, $mdMedia, BillingService, message) {
        this.$mdDialog = $mdDialog;
        this.$mdMedia = $mdMedia;
        this.BillingService = BillingService;
        this.message = message;
    }
    
    uploadPicture () {
        return this.$mdDialog.show({
            controller: UploadPictureDialogController,
            template: require('./upload.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }

    uploadFile () {
        return this.$mdDialog.show({
            controller: UploadFileDialogController,
            template: require('./file.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    confirm (messages, value = null) {
        return this.$mdDialog.show({
            controller: ConfirmDialogController,
            locals: { messages, value },
            template: require('./confirm.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }

    usersList (users, title) {
        return this.$mdDialog.show({
            controller: UsersListController,
            locals: { users: users, title: title },
            template: require('./users-list.html'),
            multiple: true,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: !this.$mdMedia('gt-sm')
        });
    }
    
    tariffs (tariffs, byClub, bySelf, message) {
        return this.$mdDialog.show({
            controller: TariffsController,
            locals: { tariffs, byClub, bySelf, message },
            template: require('./tariffs.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    selectUsers (users, selectedUsers, message) {
        return this.$mdDialog.show({
            controller: SelectUsersController,
            locals: { users, selectedUsers, message },
            template: require('./select-users.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    roles (roles, selectedRoles) {
        return this.$mdDialog.show({
            controller: RolesController,
            locals: { roles, selectedRoles },
            template: require('./roles.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }

    enableTariff (tariff, user) {
        return this.$mdDialog.show({
                locals: { user, tariff },
                resolve: {
                    billing: () => this.BillingService.getTariff(tariff.tariffId, '')
                        .catch((info) => {
                            this.message.systemWarning(info);
                            throw info;
                        })
                },
                controller: EnableTariffController,
                controllerAs: '$ctrl',
                template: require('./enable-tariff.html'),
                multiple: true,
                parent: angular.element(document.body),
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: !this.$mdMedia('gt-sm')
            });
    }

    disableTariff (tariff, user) {
        return this.$mdDialog.show({
                locals: { user, tariff },
                resolve: {
                    billing: () => this.BillingService.getTariff(tariff.tariffId, '')
                        .catch((info) => {
                            this.message.systemWarning(info);
                            throw info;
                        })
                },
                controller: DisableTariffController,
                controllerAs: '$ctrl',
                template: require('./disable-tariff.html'),
                multiple: true,
                parent: angular.element(document.body),
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: !this.$mdMedia('gt-sm')
            });
    }

    tariffDetails (tariff) {
        return this.$mdDialog.show({
                locals: { tariff },
                resolve: {
                    billing: () => this.BillingService.getTariff(tariff.tariffId, '')
                        .catch((info) => {
                            this.message.systemWarning(info);
                            throw info;
                        })
                },
                controller: TariffDetailsController,
                controllerAs: '$ctrl',
                template: require('./tariff-details.html'),
                multiple: true,
                parent: angular.element(document.body),
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: !this.$mdMedia('gt-sm')
            });
    }

    billsList (user) {
        return this.$mdDialog.show({
                locals: { user },
                resolve: {
                    bills: () => this.BillingService.getBillsList()
                        .catch((info) => {
                            this.message.systemWarning(info);
                            throw info;
                        })
                },
                controller: BillsListController,
                controllerAs: '$ctrl',
                template: require('./bills-list.html'),
                multiple: true,
                parent: angular.element(document.body),
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: !this.$mdMedia('gt-sm')
            });
    }

    billDetails (bill, user) {
        return this.$mdDialog.show({
                locals: { user },
                resolve: {
                    bill: () => this.BillingService.getBillDetails(bill.billId)
                        .catch((info) => {
                            this.message.systemWarning(info);
                            throw info;
                        })
                },
                controller: BillDetailsController,
                controllerAs: '$ctrl',
                template: require('./bill-details.html'),
                multiple: true,
                parent: angular.element(document.body),
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: !this.$mdMedia('gt-sm')
            });
    }

    feeDetails (fee, bill) {
        return this.$mdDialog.show({
            locals: { fee, bill },
            controller: FeeDetailsController,
            controllerAs: '$ctrl',
            template: require('./fee-details.html'),
            multiple: true,
            parent: angular.element(document.body),
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: !this.$mdMedia('gt-sm')
        });
    }

    iframe (url, title) {
        return this.$mdDialog.show({
            locals: { url, title },
            controller: IframeController,
            controllerAs: '$ctrl',
            template: require('./iframe.html'),
            multiple: true,
            parent: angular.element(document.body),
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: !this.$mdMedia('gt-sm')
        });
    }
}

DialogsService.$inject = ['$mdDialog', '$mdMedia', 'BillingService', 'message'];


function ConfirmDialogController($scope, $mdDialog, messages, value) {
    $scope.messages = messages;
    
    $scope.cancel = () => {
        $mdDialog.cancel();
    };
    
    $scope.confirm = () => {
        $mdDialog.hide(value);
    };
}

ConfirmDialogController.$inject = ['$scope','$mdDialog','messages', 'value'];


function UploadPictureDialogController($scope, $mdDialog) {
    var file, src;

    $scope.files = (files) => {
        file = files[0];
        let onLoad = (event) => (scope) => {
            src = event.target.result;
        };
        let reader = new FileReader();
        reader.onload = (event) => $scope.$apply(onLoad(event)); // результат загрузки передаем в src для вывод картинки на экран
        reader.readAsDataURL(file); //сохраняем загрузку
    };
    
    $scope.src = () => src;
    
    $scope.hide = () => {
        $mdDialog.hide();
    };
    
    $scope.cancel = () => {
        $mdDialog.cancel();
    };
    
    $scope.upload = () => {
        $mdDialog.hide(file);
    };
}

UploadPictureDialogController.$inject = ['$scope','$mdDialog'];


function UploadFileDialogController($scope, $mdDialog) {
    $scope.data = null;
    var file, src;

    $scope.files = (files) => {
        $scope.data = files;
        let onLoad = (event) => (scope) => {
            src = event.target.result;
        };
        let reader = new FileReader();

        for(let i=0; i < files.length; i++){
            file = files[i];
            reader.onload = (event) => $scope.$apply(onLoad(event));
            reader.readAsDataURL(file);
        }
    };

    $scope.src = () => src;

    $scope.hide = () => {
        $mdDialog.hide();
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };

    $scope.upload = () => {
        $mdDialog.hide(file);
    };
}

UploadFileDialogController.$inject = ['$scope','$mdDialog'];


function UsersListController($scope, $mdDialog, $state, users, title) {
    $scope.users = users;
    $scope.title = title;
    $scope.close = () => { $mdDialog.cancel() };
    $scope.go = (user) => {
        $mdDialog.cancel();
        $state.go("user", { uri: user.public.uri });
    };
}

UsersListController.$inject = ['$scope', '$mdDialog', '$state', 'users', 'title'];

const isChecked = (list) => (item) => (isChecked) => {
    if (isChecked === undefined) {
        return list.includes(item);
    }

    if (isChecked) {
        list.push(item);
    } else {
        let index = list.indexOf(item);
        list.splice(index, 1);
    }        
};


function RolesController ($scope, $mdDialog, roles, selectedRoles) {
    $scope.roles = roles;
    $scope.selectedRoles = selectedRoles.slice();
    $scope.isChecked = isChecked($scope.selectedRoles);    
    $scope.commit = () => { $mdDialog.hide($scope.selectedRoles) };
    $scope.cancel = () => { $mdDialog.hide() };
}

RolesController.$inject = ['$scope', '$mdDialog', 'roles', 'selectedRoles'];


function TariffsController ($scope, $mdDialog, tariffs, byClub, bySelf, message) {
    $scope.tariffs = tariffs;
    $scope.selectedTariffs = byClub.slice();
    $scope.tariffsBySelf = bySelf;
    $scope.message = message;
    $scope.isChecked = isChecked($scope.selectedTariffs);
    $scope.commit = () => { $mdDialog.hide($scope.selectedTariffs) };
    $scope.cancel = () => { $mdDialog.hide() };
}

TariffsController.$inject = ['$scope', '$mdDialog', 'tariffs', 'byClub', 'bySelf', 'message'];


function SelectUsersController ($scope, $mdDialog, users, selectedUsers, message) {
    $scope.message = message;
    $scope.users = users;
    $scope.selectedUsers = selectedUsers.slice();
    $scope.isChecked = isChecked($scope.selectedUsers);
    $scope.checked = () => $scope.users.filter((user) => $scope.selectedUsers.includes(user));
    $scope.unchecked = () => $scope.users.filter((user) => !$scope.selectedUsers.includes(user));
    $scope.commit = () => { $mdDialog.hide($scope.selectedUsers) };
    $scope.cancel = () => { $mdDialog.hide() };
}

SelectUsersController.$inject = ['$scope','$mdDialog', 'users', 'selectedUsers', 'message'];


function EnableTariffController($scope, $mdDialog, BillingService, dialogs, message, user, tariff, billing) {
    this.tariff = tariff;
    this.user = user;

    this.autoRenewal = true;
    this.promoCode = '';
    this.rejectedPromoCode = '';
    this.paymentSystem = 'fondy';
    this.agreement = false;

    this.discountedFee = (fee) => fee.rate * (1 + (fee.promo.discount || 0) / 100);

    this.hasMaxPaidCount = (fee) => {
        return fee.varMaxPaidCount && fee.varMaxPaidCount < 99999;
    };

    this.trialExpires = () => {
        return moment().add(this.billing.trialConditions.term, 'days').toDate();
    };

    this.getActivePromo = (billing) => {
        return billing.rates.map(prop('promo')).find((promo) => promo && promo.code);
    };

    this.setBilling = (billing) => {
        this.billing = billing;
        this.fee = this.billing.rates.find(fee => fee.rateType === 'Fixed');
        this.monthlyFee = this.billing.rates.find(fee => fee.rateType === 'Fixed' && fee.term === 1);
        this.yearlyFee = this.billing.rates.find(fee => fee.rateType === 'Fixed' && fee.term === 12);
        this.variableFees = this.billing.rates.filter(fee => fee.rateType === 'Variable');
        this.activePromo = this.getActivePromo(billing);
    };

    this.setBilling(billing);

    this.submitPromo = (promoCode) => {
        BillingService.getTariff(tariff.tariffId, promoCode)
        .then((billing) => {
            console.log('submitPromo', billing);
            this.setBilling(billing);
            this.rejectedPromoCode = this.activePromo? '' : promoCode;
            this.promoCode = '';
            $scope.$apply();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    this.cancel = function () {
        $mdDialog.cancel();
    };

    this.submit = function () {
        let trial = this.billing.trialConditions.isAvailable;
        BillingService.enableTariff(
            tariff.tariffId, 
            user.userId, 
            this.fee.term,
            this.autoRenewal,
            trial,
            maybe(this.activePromo) (prop('code')) (),
            this.paymentSystem
        )
        .then((bill) => {
            $mdDialog.hide();

            if (!trial) {
                dialogs.billDetails(bill, this.user);
            }

            return bill;
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    console.log('EnableTariffController', this);
}

EnableTariffController.$inject = ['$scope', '$mdDialog', 'BillingService', 'dialogs', 'message', 'user', 'tariff', 'billing'];


function DisableTariffController($scope, $mdDialog, BillingService, message, user, tariff, billing, $translate) {
    this.tariff = tariff;
    this.user = user;
    this.billing = billing;

    this.counts = () => {
        return billing.rates.filter(fee => fee.rateType === 'Variable' && fee.varActualCount);
    };

    this.canDisconnect = () => {
        return !this.counts().length;
    };

    this.countsText = () => {
        return this.counts()
            .map(fee => $translate.instant(`user.settings.billing.counts.${fee.varGroup}`, { count: fee.varActualCount }))
            .join(', ');
    };

    this.cancel = function () {
        $mdDialog.cancel();
    };

    this.submit = function () {
        BillingService.disableTariff(tariff.tariffId, user.userId)
        .then((info) => {
            message.systemSuccess(info.title);
            $mdDialog.hide();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    console.log('DisableTariffController', this);
}

DisableTariffController.$inject = ['$scope', '$mdDialog', 'BillingService', 'message', 'user', 'tariff', 'billing', '$translate'];


function TariffDetailsController ($scope, $mdDialog, dialogs, BillingService, message, tariff, billing) {
    this.tariff = tariff;
    this.billing = billing;
    this.terms = [1, 12];

    this.tariffStatus = BillingService.tariffStatus(tariff);
    this.tariffIsOwn = !BillingService.tariffEnablerClub(tariff) && !BillingService.tariffEnablerCoach(tariff);

    this.promoCode = '';
    this.rejectedPromoCode = '';

    this.discountedFee = (fee) => fee.rate * (1 + (fee.promo.discount || 0) / 100);

    this.getFixedFee = () => {
        return this.billing.rates.find(fee => fee.rateType === 'Fixed');
    };

    this.variableFees = () => {
        return this.billing.rates.filter(fee => fee.rateType === 'Variable');
    };

    this.hasMaxPaidCount = (fee) => {
        return fee.varMaxPaidCount && fee.varMaxPaidCount < 99999;
    };

    this.viewFeeObjectsList = (fee) => {
        dialogs.usersList(fee.varObjects, 'users');
    };

    this.fixedFeeTerm = (value) => {
        if (typeof value !== 'number') {
            return this.getFixedFee().term;
        }

        BillingService.getTariff(tariff.tariffId, '', value)
        .then((billing) => {
            const fixedFee = billing.rates.find((rate) => rate.rateType === 'Fixed' && rate.term === value);
            this.billing.rates = this.billing.rates.map((rate) => rate.rateType === 'Fixed' ? fixedFee : rate);
            this.fixedFee = this.getFixedFee();
            $scope.$apply();
        });
    };

    this.getActivePromo = (billing) => {
        return billing.rates.map(prop('promo')).find((promo) => promo && promo.code);
    };

    this.setBilling = (billing) => {
        this.billing = billing;
        this.fixedFee = this.getFixedFee();
        this.variableFees = this.billing.rates.filter(fee => fee.rateType === 'Variable');
        this.activePromo = this.getActivePromo(billing);
        this.autoRenewal = this.fixedFee.autoRenewal;
    };

    this.isTrial = () => {
        return this.tariffStatus === 'trial';
    };

    this.submitPromo = (promoCode) => {
        BillingService.getTariff(tariff.tariffId, promoCode)
        .then((billing) => {
            console.log('submitPromo', billing);
            if (this.getActivePromo(billing)) {
                this.setBilling(billing);
                this.rejectedPromoCode = '';
            } else {
                this.rejectedPromoCode = promoCode;
            }
            this.promoCode = '';
            $scope.$apply();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    this.cancel = () => {
        $mdDialog.cancel();
    };

    this.submit = () => {
        BillingService.updateTariff(
            tariff.tariffId, 
            this.autoRenewal,
            maybe(this.activePromo) (prop('code')) (),
            this.fixedFeeTerm(),
        ).then(() => {
            $mdDialog.hide();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    this.setBilling(billing);

    console.log('TariffDetailsController', this);
}

TariffDetailsController.$inject = ['$scope', '$mdDialog', 'dialogs', 'BillingService', 'message', 'tariff', 'billing'];


function BillsListController($scope, $mdDialog, dialogs, BillingService, message, user, bills, $translate) {
    this.user = user;
    this.bills = bills;

    this.close = function () {
        $mdDialog.cancel();
    };

    this.viewBill = (bill) => {
        return dialogs.billDetails(bill, user);
    };

    this.invoiceStatus = (bill) => {
        return BillingService.billStatus(bill);
    }

    console.log('BillsListController', this);
}

BillsListController.$inject = ['$scope', '$mdDialog', 'dialogs', 'BillingService', 'message', 'user', 'bills', '$translate'];


function BillDetailsController($scope, $mdDialog, dialogs, BillingService, message, bill) {
    this.setBill = (bill) => {
        this.bill = bill;
        this.billStatus = BillingService.billStatus(bill);
    };

    this.fixedFee = (tariff) => {
        return tariff.rates.find(fee => fee.rateType === 'Fixed');
    };

    this.variableFees = (tariff) => {
        return tariff.rates.filter(fee => fee.rateType === 'Variable');
    };

    this.feeDetails = (fee) => {
        return fee.transactions && fee.transactions.length && dialogs.feeDetails(fee, this.bill);
    };

    this.getPaymentSystem = () => {
        return this.bill.paymentSystem || 'fondy';
    };

    this.setPaymentSystem = (paymentSystem) => {
        return BillingService.updatePaymentSystem(this.bill.billId, paymentSystem)
            .then((bill) => this.setBill(bill), (info) => {
                message.systemWarning(info);
                throw info;
            });
    };

    this.submit = () => {
        let checkoutUrl = maybe(this.bill) (prop('payment')) (prop('checkoutUrl')) ();

        return checkoutUrl && BillingService.checkout(checkoutUrl)
            .then(() => {
                $mdDialog.hide();
            }, (info) => {
                message.systemWarning(info);
                throw info;
            });
    };

    this.cancel = () => {
        $mdDialog.cancel();
    };

    this.setBill(bill);

    $scope.$watch(() => this.paymentSystem, this.savePaymentSystem);

    console.log('BillDetailsController', this);
}

BillDetailsController.$inject = ['$scope', '$mdDialog', 'dialogs', 'BillingService', 'message', 'bill'];


function FeeDetailsController ($scope, $mdDialog, dialogs, fee, bill) {
    this.fee = fee;
    this.bill = bill;

    this.viewObjectsList = (entry) => { 
        dialogs.usersList(entry.varObjects, 'feeObjects');
    };

    this.close = () => { 
        $mdDialog.hide(); 
    };

    console.log('FeeDetailsController', this);
}

FeeDetailsController.$inject = ['$scope','$mdDialog', 'dialogs', 'fee', 'bill'];


function IframeController ($scope, $mdDialog, $sce, url, title) {
    this.$sce = $sce;
    this.url = url;
    this.title = title;

    localStorage.setItem('dialog-result', '');
    const handler = (event) => {
        const result = localStorage.getItem('dialog-result');
        if (result === 'success') {
            $mdDialog.hide(); 
            window.removeEventListener('storage', handler, false);
        } else if (result === 'failure') {
            $mdDialog.cancel();
            window.removeEventListener('storage', handler, false);
        }
    };
    window.addEventListener('storage', handler, false);

    this.close = () => { 
        $mdDialog.hide(); 
    };

    this.trust = (url) => {
        return $sce.trustAsResourceUrl(url);
    };

    console.log('IframeController', this);
}

IframeController.$inject = ['$scope','$mdDialog', '$sce', 'url', 'title'];