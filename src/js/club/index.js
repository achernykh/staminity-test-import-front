class ClubCtrl {

  constructor ($scope, $mdDialog, GroupService, API) {
    'ngInject';
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.GroupService = GroupService;

    console.log($scope);
  }

  getUserpic () {
    return `url('${this.app.user && this.app.user.public.avatar? this.API.apiUrl('/content/avatar/' + this.app.user.public.avatar) : '/assets/avatar/default.png'}')`
  }

  getHeader () {
    return `url('${this.app.user &&  this.app.user.public.background? this.API.apiUrl('/content/background/' + this.app.user.public.background) : '/assets/picture/pattern0.jpg'}')`
  }
  
  update () {
    return this.GroupService.getProfile(this.club.groupUri)
      .then((club) => { this.club = club })
      .then(() => { this.$scope.$apply() })
  }

};


const club = {

    bindings: {
        view: '<',
        club: '<',
        userId: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    transclude: false,

    controller: ClubCtrl,

    templateUrl: 'club/club.html',

    $routeConfig: [
        { path: '/', name: 'Profile', component: 'club', useAsDefault: true },
        { path: '/:id', name: 'Profile', component: 'club' }
    ]

};


angular.module('staminity.club', ['ngMaterial', 'staminity.components'])
    .component('club', club);
