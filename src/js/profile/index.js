const chart = {
  width: 430,
  height: 150,
  barWidth: 20,
  data: [
    { label: "Янв", value: 18 },
    { label: "Фев", value: 23 },
    { label: "Мар", value: 19 },
    { label: "Апр", value: 25 },
    { label: "Май", value: 26 },
    { label: "Июн", value: 27 },
    { label: "Июл", value: 24 },
    { label: "Авг", value: 29 },
    { label: "Сен", value: 28 },
    { label: "Окт", value: 30 },
    { label: "Ноя", value: 31 },
    { label: "Дек", value: 33 }
  ],
  x (index) {
    return (index + 0.5) * (this.width / this.data.length);
  },
  y (value) {
    if (!this.yScale) {
      this.yScale = this.height / this.data.reduce((m, { value }) => Math.max(m, value), 0);
    }
    return this.height - value * this.yScale;
  },
  bars () {
    if (!this._bars) {
      this._bars = this.data.map(({ label, value }) => ({ label, value, height: this.height - this.y(value) }));
    }
    return this._bars;
  },
  lines () {
    if (!this._lines) {
      this._lines = [10, 20, 30, 40].map((value) => ({ label: `${value} ч`, y: this.y(value) }));
    }
    return this._lines;
  }
};


const table = {
  data: [
    { icon: 'pool', dist: 210, hrs: '16:08', count: 18 },
    { icon: 'fitness_center', dist: 210, hrs: '15:23', count: 18 },
    { icon: 'directions_run', dist: 210, hrs: '32:33', count: 18 },
    { icon: 'directions_bike', dist: 210, hrs: '04:47', count: 18 }
  ],
  total: { icon: 'functions', dist: 210, hrs: '68:51', count: 18 }
};


class ProfileCtrl {

    constructor ($scope, $mdDialog, User, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.User = User;
        this.API = API;
        this.updateNoCache();
        
        this.years = [2015, 2016];
        this.year = 2016;
        this.ranges = ['Обзор года', 'Обзор месяца'];
        this.range = 'Обзор года';
        this.orders = ['время', 'кол-во трен.'];
        this.order = 'время';
        
        this.chart = chart;
        this.table = table;
        
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
        return `url('${this.app.user &&  this.app.user.public.background? this.API.apiUrl('/content/background/' + this.app.user.public.background + this.getNoCache()) : '/assets/picture/pattern0.jpg'}')`
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
