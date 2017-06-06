import './dialogs.scss';

export default class DialogsService {
    
    constructor ($mdDialog, $mdMedia, BillingService) {
        this.$mdDialog = $mdDialog;
        this.$mdMedia = $mdMedia;
        this.BillingService = BillingService;
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
    
    confirm (message) {
        return this.$mdDialog.show({
            controller: ConfirmDialogController,
            locals: { message: message },
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
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    tariffs (tariffs, byUs, bySelf, byWho) {
        return this.$mdDialog.show({
            controller: TariffsController,
            locals: { tariffs, byUs, bySelf, byWho },
            template: require('./tariffs.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    selectUsers (users, message) {
        return this.$mdDialog.show({
            controller: SelectUsersController,
            locals: { users, message },
            template: require('./select-users.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    roles (roles) {
        return this.$mdDialog.show({
            controller: RolesController,
            locals: { roles },
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
                },
                controller: EnableTariffController,
                controllerAs: '$ctrl',
                template: require('./enable-tariff.html'),
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
                },
                controller: DisableTariffController,
                controllerAs: '$ctrl',
                template: require('./disable-tariff.html'),
                parent: angular.element(document.body),
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: !this.$mdMedia('gt-sm')
            });
    }

    tariffDetails (tariff, user) {
        return this.$mdDialog.show({
                locals: { user, tariff },
                resolve: {
                    billing: () => this.BillingService.getTariff(tariff.tariffId, '')
                },
                controller: TariffDetailsController,
                controllerAs: '$ctrl',
                template: require('./tariff-details.html'),
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
                },
                controller: BillsListController,
                controllerAs: '$ctrl',
                template: require('./bills-list.html'),
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
                },
                controller: BillDetailsController,
                controllerAs: '$ctrl',
                template: require('./bill-details.html'),
                parent: angular.element(document.body),
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: !this.$mdMedia('gt-sm')
            });
    }

    feeDetails (fee, bill) {
        return this.$mdDialog.show({
            locals: {  fee, bill },
            controller: FeeDetailsController,
            controllerAs: '$ctrl',
            template: require('./fee-details.html'),
            parent: angular.element(document.body),
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: !this.$mdMedia('gt-sm')
        });
    }
}

DialogsService.$inject = ['$mdDialog', '$mdMedia', 'BillingService'];


function ConfirmDialogController($scope, $mdDialog, message) {
    $scope.message = message
    
    $scope.cancel = () => {
        $mdDialog.cancel();
    };
    
    $scope.confirm = () => {
        $mdDialog.hide(true);
    };
}

ConfirmDialogController.$inject = ['$scope','$mdDialog','message'];


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
        debugger;
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
        debugger;
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


function RolesController ($scope, $mdDialog, roles) {
    $scope.roles = roles;
    $scope.commit = () => { $mdDialog.hide($scope.roles) };
    $scope.cancel = () => { $mdDialog.hide() };
}

RolesController.$inject = ['$scope', '$mdDialog', 'roles'];


function TariffsController ($scope, $mdDialog, tariffs, byUs, bySelf, byWho) {
    $scope.tariffs = tariffs;
    $scope.selectedTariffs = byUs.slice();
    $scope.tariffsBySelf = bySelf;
    $scope.byWho = byWho;
    $scope.toggle = (tariff) => {
        if ($scope.tariffsBySelf.includes(tariff)) return;
        
        if ($scope.selectedTariffs.includes(tariff)) {
            let index = $scope.selectedTariffs.indexOf(tariff);
            $scope.selectedTariffs.splice(index, 1);
        } else {
            $scope.selectedTariffs.push(tariff);
        }
    };
    $scope.commit = () => { $mdDialog.hide($scope.selectedTariffs) };
    $scope.cancel = () => { $mdDialog.hide() };
}

TariffsController.$inject = ['$scope', '$mdDialog', 'tariffs', 'byUs', 'bySelf', 'byWho'];


function SelectUsersController ($scope, $mdDialog, users, message) {
    $scope.message = message;
    $scope.users = users;
    $scope.checked = () => users.filter(user => user.checked);
    $scope.unchecked = () => users.filter(user => !user.checked);
    $scope.commit = () => { $mdDialog.hide($scope.users) };
    $scope.cancel = () => { $mdDialog.hide() };
}

SelectUsersController.$inject = ['$scope','$mdDialog', 'users', 'message'];


function EnableTariffController($scope, $mdDialog, BillingService, message, user, tariff, billing) {
    this.tariff = tariff;
    this.user = user;

    this.autoRenewal = true;
    this.promoCode = '';
    this.paymentSystem = 'fondy';

    this.setBilling = (billing) => {
        this.billing = billing;
        this.fee = this.billing.rates.find(fee => fee.rateType === 'Fixed');
        this.monthlyFee = this.billing.rates.find(fee => fee.rateType === 'Fixed' && fee.term === 1);
        this.yearlyFee = this.billing.rates.find(fee => fee.rateType === 'Fixed' && fee.term === 12);
        this.variableFees = this.billing.rates.filter(fee => fee.rateType === 'Variable');
    };

    this.hasMaxPaidCount = (fee) => {
        return fee.varMaxPaidCount && fee.varMaxPaidCount < 99999;
    };

    this.setBilling(billing);

    this.submitPromo = () => {
        BillingService.getTariff(tariff.tariffId, this.promoCode)
        .then((billing) => {
            this.activePromo = this.promoCode;
            this.setBilling(billing);
            console.log('submitPromo', billing);
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
        BillingService.enableTariff(
            tariff.tariffId, 
            user.userId, 
            this.fee.term,
            this.autoRenewal,
            this.billing.trialConditions.isAvailable,
            this.activePromo,
            this.paymentSystem
        ).then(() => {
            $mdDialog.hide();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    console.log('EnableTariffController', this);
}

EnableTariffController.$inject = ['$scope', '$mdDialog', 'BillingService', 'message', 'user', 'tariff', 'billing'];


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
            .map(fee => $translate.instant(`settings.billing.counts.${fee.varGroup}`, { count: fee.varActualCount }))
            .join(', ');
    };

    this.cancel = function () {
        $mdDialog.cancel();
    };

    this.submit = function () {
        BillingService.disableTariff(tariff.tariffId, user.userId)
        .then(() => {
            $mdDialog.hide();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    console.log('DisableTariffController', this);
}

DisableTariffController.$inject = ['$scope', '$mdDialog', 'BillingService', 'message', 'user', 'tariff', 'billing', '$translate'];


function TariffDetailsController($scope, $mdDialog, dialogs, BillingService, message, user, tariff, billing) {
    this.user = user;
    this.tariff = tariff;
    this.billing = billing;

    this.autoRenewal = true;
    this.promoCode = '';

    this.fixedFee = () => {
        return this.billing.rates.find(fee => fee.rateType === 'Fixed');
    };

    this.variableFees = () => {
        return this.billing.rates.filter(fee => fee.rateType === 'Variable');
    };

    this.tariffStatus = (tariff) => {
        return tariff.isEnabled && tariff.isTrial && 'trial'
            || tariff.isEnabled && 'enabled'
            || 'notEnabled';
    };

    this.hasMaxPaidCount = (fee) => {
        return fee.varMaxPaidCount && fee.varMaxPaidCount < 99999;
    };

    this.submitPromo = () => {
        BillingService.getTariff(tariff.tariffId, this.promoCode)
        .then((billing) => {
            this.activePromo = this.promoCode;
            this.billing = billing;
            console.log('submitPromo', billing);
            $scope.$apply();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    this.canChange = () => {
        return this.tariff.clubProfile || this.tariff.userProfilePayer && this.tariff.userProfilePayer.userId !== this.user.userId;
    };

    this.cancel = function () {
        $mdDialog.cancel();
    };

    this.submit = function () {
        BillingService.enableTariff(
            tariff.tariffId, 
            user.userId, 
            this.fee.term,
            this.autoRenewal,
            this.billing.trialConditions.isAvailable,
            this.activePromo,
            this.paymentSystem
        ).then(() => {
            $mdDialog.hide();
        }, (info) => {
            message.systemWarning(info);
            throw info;
        });
    };

    console.log('TariffDetailsController', this);
}

TariffDetailsController.$inject = ['$scope', '$mdDialog', 'dialogs', 'BillingService', 'message', 'user', 'tariff', 'billing'];


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


function BillDetailsController($scope, $mdDialog, dialogs, BillingService, message, user, bill) {
    this.user = user;
    this.bill = bill;

    this.fixedFee = (tariff) => {
        return tariff.rates.find(fee => fee.rateType === 'Fixed');
    };

    this.variableFees = (tariff) => {
        return tariff.rates.filter(fee => fee.rateType === 'Variable');
    };

    this.isPaid = () => {
        return this.bill.billDate && !this.bill.receiptDate;
    };

    this.feeDetails = (fee) => {
        return fee.transactions.length && dialogs.feeDetails(fee, this.bill);
    };

    this.cancel = function () {
        $mdDialog.cancel();
    };

    this.pay = function () {
        
    };

    console.log('BillDetailsController', this);
}

BillDetailsController.$inject = ['$scope', '$mdDialog', 'dialogs', 'BillingService', 'message', 'user', 'bill'];


function FeeDetailsController ($scope, $mdDialog, dialogs, fee, bill) {
    this.fee = fee;
    this.bill = bill;

    this.connections = (connections) => { 
        dialogs.usersList(connections, 'База начисления');
    };

    this.close = () => { 
        $mdDialog.hide(); 
    };

    console.log('FeeDetailsController', this);
}

FeeDetailsController.$inject = ['$scope','$mdDialog', 'dialogs', 'fee', 'bill'];