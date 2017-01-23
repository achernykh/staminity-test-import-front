export default class DialogsService {
    
    constructor ($mdDialog) {
        this.$mdDialog = $mdDialog
    }
    
    uploadPicture () {
        return this.$mdDialog.show({
            controller: UploadPictureDialogController,
            template: './dialogs/upload.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }
    
    confirm (message) {
        return this.$mdDialog.show({
            controller: ConfirmDialogController,
            locals: { message: message },
            template: './dialogs/confirm.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }

    group (group, title) {
        return this.$mdDialog.show({
            controller: FriendsController,
            locals: { users: group, title: title },
            template: './dialogs/usersList.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    subscriptions (users) {
        return this.$mdDialog.show({
            controller: SubscriptionsController,
            locals: { users },
            template: './dialogs/subscriptions.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    coaches (users, coaches) {
        return this.$mdDialog.show({
            controller: CoachesController,
            locals: { users, coaches },
            template: './dialogs/coaches.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }
    
    roles (roles) {
        return this.$mdDialog.show({
            controller: RolesController,
            locals: { roles },
            template: './dialogs/roles.html',
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
FriendsController.$inject = ['$scope','$mdDialog'];

function RolesController ($scope, $mdDialog, roles) {
    
    $scope.roles = roles;
    
    $scope.commit = () => {
        $mdDialog.hide($scope.roles);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}
RolesController.$inject = ['$scope','$mdDialog'];

function SubscriptionsController ($scope, $mdDialog, users) {
    
    $scope.commit = () => {
        $mdDialog.hide($scope.subscriptions);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}
SubscriptionsController.$inject = ['$scope','$mdDialog'];

function CoachesController ($scope, $mdDialog, users, coaches) {
    
    /*$scope.coaches = coaches.map((coach) => ({
        ...coach,
        checked: users[0].roleMembership.includes(coach) 
    }));*/
    
    $scope.commit = () => {
        $mdDialog.hide($scope.coaches);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}
CoachesController.$inject = ['$scope','$mdDialog'];