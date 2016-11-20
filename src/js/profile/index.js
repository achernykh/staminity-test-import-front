class ProfileCtrl {
    
    constructor ($scope, $mdDialog, User) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        console.log(this.profile);
        console.log($scope);
    }
    
    uploadUserpic () {
      this.$mdDialog.show({
        controller: UploadDialogController,
        templateUrl: 'profile/upload.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
      .then((picture) => { this.app.user && (this.app.user.userpic = picture) });   
    }
    
    uploadHeader () {
      this.$mdDialog.show({
        controller: UploadDialogController,
        templateUrl: 'profile/upload.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
      .then((picture) => { this.app.user && (this.app.user.header = picture) }); 
    }
    
    getUsername () {
        return this.app.user && `${this.app.user.public.firstName} ${this.app.user.public.lastName}`
    }
    
    getUserpic () {
        return this.app.user && this.app.user.userpic
    }
    
    getHeader () {
        return this.app.user && this.app.user.header
    }
    
};


function UploadDialogController($scope, $mdDialog) {
  'ngInject';
  
  var src;
  
  $scope.files = (files) => {
    let onLoad = (event) => (scope) => { src = event.target.result };
    let reader = new FileReader();
    reader.onload = (event) => { $scope.$apply(onLoad(event)) };
    reader.readAsDataURL(files[0]);
  };
  
  $scope.src = () => src;
  
  $scope.hide = () => {
    $mdDialog.hide();
  };

  $scope.cancel = () => {
    $mdDialog.cancel();
  };

  $scope.upload = () => {
    $mdDialog.hide(src);
  };
}


const profile = {
    
    bindings: {
        view: '<',
        profile: '<currentUser'
    },
    
    require: {
        app: '^staminityApplication'
    },
    
    transclude: false,
    
    controller: ProfileCtrl,
    
    templateUrl: 'profile/profile.html',
    
    $routeConfig: [
        { path: '/', name: 'Profile', component: 'profile', useAsDefault: true },
        { path: '/:id', name: 'Profile', component: 'profile' }
    ]
    
};


function onFiles() {
    return {
      
        scope: {
            onFiles: "<"
        },
        
        link (scope, element, attributes) {
            let onFiles = (event) => (scope) => { scope.onFiles(event.target.files) };
            element.bind("change", (event) => { scope.$apply(onFiles(event)) });
        }
        
    };
}


angular.module('staminity.profile', ['ngMaterial'])
    .component('profile', profile)
    .directive("onFiles", onFiles);