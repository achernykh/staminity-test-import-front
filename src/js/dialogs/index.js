class DialogsService {
    
    constructor ($mdDialog) {
        this.$mdDialog = $mdDialog
    }
    
    uploadPicture () {
        this.$mdDialog.show({
            controller: UploadPictureDialogController,
            template: 'dialogs/upload.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    }
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


angular.module('staminity.dialogs', ['ngMaterial'])
    .service("dialogs", DialogsService);