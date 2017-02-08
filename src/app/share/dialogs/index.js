import './dialogs.scss';

export default class DialogsService {
    
    constructor ($mdDialog) {
        this.$mdDialog = $mdDialog
    }
    
    uploadPicture () {
        return this.$mdDialog.show({
            controller: UploadPictureDialogController,
            template: require('./upload.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }
    
    confirm (message) {
        return this.$mdDialog.show({
            controller: ConfirmDialogController,
            locals: { message: message },
            template: require('./confirm.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
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
    
    tariffs (tariffs, byWho) {
        return this.$mdDialog.show({
            controller: TariffsController,
            locals: { tariffs, byWho },
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
        })
    }
    
    roles (roles) {
        return this.$mdDialog.show({
            controller: RolesController,
            locals: { roles },
            template: require('./roles.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }
}
DialogsService.$inject = ['$mdDialog'];

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
        let onLoad = (event) => (scope) => { src = event.target.result };
        let reader = new FileReader();
        reader.onload = (event) => { $scope.$apply(onLoad(event)) };
        reader.readAsDataURL(file);
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

function TariffsController ($scope, $mdDialog, tariffs, byWho) {
    $scope.tariffs = tariffs;
    $scope.tariffsBySelf = tariffs.filter(t => t.bySelf);
    $scope.byWho = byWho;
    $scope.commit = () => { $mdDialog.hide($scope.tariffs) };
    $scope.cancel = () => { $mdDialog.hide() };
}
TariffsController.$inject = ['$scope', '$mdDialog', 'tariffs', 'byWho'];

function SelectUsersController ($scope, $mdDialog, users, message) {
    $scope.message = message
    $scope.users = users
    $scope.checked = () => users.filter(user => user.checked);
    $scope.unchecked = () => users.filter(user => !user.checked);
    $scope.commit = () => { $mdDialog.hide($scope.users) };
    $scope.cancel = () => { $mdDialog.hide() };
}
SelectUsersController.$inject = ['$scope','$mdDialog', 'users', 'message'];