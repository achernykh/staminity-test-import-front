class DialogsService {
    
    constructor ($mdDialog) {
        this.$mdDialog = $mdDialog
    }
    
    uploadPicture () {
        return this.$mdDialog.show({
            controller: UploadPictureDialogController,
            templateUrl: 'dialogs/upload.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }
    
    confirm (message) {
        return this.$mdDialog.show({
            controller: ConfirmDialogController,
            locals: { message: message },
            templateUrl: 'dialogs/confirm.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }

    group (group, title) {
        this.$mdDialog.show({
            controller: FriendsController,
            locals: { users: group, title: title },
            templateUrl: 'dialogs/usersList.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
}


function ConfirmDialogController($scope, $mdDialog, message) {
    'ngInject';
    
    $scope.message = message
    
    $scope.cancel = () => {
        $mdDialog.cancel();
    };
    
    $scope.confirm = () => {
        $mdDialog.hide(true);
    };
}


function UploadPictureDialogController($scope, $mdDialog) {
    'ngInject';
    
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


function FriendsController($scope, $mdDialog, users, title) {
    'ngInject';

    $scope.users = users;
    $scope.title = title;

    $scope.close = () => {
        $mdDialog.cancel();
    };
}


angular.module('staminity.dialogs', ['ngMaterial'])
    .service("dialogs", DialogsService);