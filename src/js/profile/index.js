class ProfileCtrl {

    constructor ($scope, $mdDialog, UserService, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this._UserService = UserService;
        this._API = API;
        this.updateNoCache();
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
      .then((file) => this.User.setUserpic(file))
      .then((userProfile) => { this.app.user = userProfile })
      .then(() => { this.updateNoCache() });
    }

    uploadHeader () {
      this.$mdDialog.show({
        controller: UploadDialogController,
        templateUrl: 'profile/upload.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
      .then((file) => this.User.setHeader(file))
      .then((userProfile) => { this.app.user = userProfile })
      .then(() => { this.updateNoCache() });
    }

    getUsername () {
        return this.app.user && `${this.app.user.public.firstName} ${this.app.user.public.lastName}`
    }

    getUserpic () {
        return `url('${this.app.user && this.app.user.public.avatar? this.API.apiUrl('/content/avatar/' + this.app.user.public.avatar + this.getNoCache()) : '/assets/avatar/default.png'}')`
    }

    getHeader () {
        return `url('${this.app.user &&  this.app.user.public.background? this.API.apiUrl('/content/background/' + this.app.user.public.background + this.getNoCache()) : ''}')`
    }
    
    updateNoCache () {
      this.noCache = new Date().getTime()
    }
    
    getNoCache () {
      return '?noCache=' + this.noCache
    }

};


function UploadDialogController($scope, $mdDialog) {
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
