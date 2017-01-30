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

    group (group, title) {
        return this.$mdDialog.show({
            controller: FriendsController,
            locals: { users: group, title: title },
            template: require('./usersList.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    subscriptions (tariffs) {
        return this.$mdDialog.show({
            controller: SubscriptionsController,
            locals: { tariffs },
            template: require('./subscriptions.html'),
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    coaches (coaches) {
        return this.$mdDialog.show({
            controller: CoachesController,
            locals: { coaches },
            template: require('./coaches.html'),
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
ConfirmDialogController.$inject = ['$scope','$mdDialog'];


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

function FriendsController($scope, $mdDialog, users, title) {
    $scope.users = users;
    $scope.title = title;

    $scope.close = () => {
        $mdDialog.cancel();
    };
}
FriendsController.$inject = ['$scope', '$mdDialog', 'users', 'title'];

function RolesController ($scope, $mdDialog, roles) {
    
    $scope.roles = roles;
    
    $scope.commit = () => {
        $mdDialog.hide($scope.roles);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}
RolesController.$inject = ['$scope', '$mdDialog', 'roles'];

function SubscriptionsController ($scope, $mdDialog, tariffs) {
    $scope.tariffs = tariffs;

    $scope.commit = () => {
        $mdDialog.hide($scope.subscriptions);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}
SubscriptionsController.$inject = ['$scope', '$mdDialog', 'tariffs'];

function CoachesController ($scope, $mdDialog, coaches) {
    $scope.coaches = coaches;
    
    $scope.commit = () => {
        $mdDialog.hide($scope.coaches);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}
CoachesController.$inject = ['$scope','$mdDialog', 'coaches'];