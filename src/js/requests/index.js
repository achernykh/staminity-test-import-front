const users = [
  { userpic: '', username: 'Черных Александр' },
];

const types = [
  'Запрос от спортсмена тренеру'
];

const requestsList = {
  inbox: {
    new: [{ 
      from: users[0], type: types[0], time: '2 мин'
    }, {
      from: users[0], type: types[0], time: '3 д'
    }],
    old: [{ 
      from: users[0], type: types[0], fulfilled: true
    }, { 
      from: users[0], type: types[0], fulfilled: false
    }, { 
      from: users[0], type: types[0], fulfilled: true
    }, { 
      from: users[0], type: types[0], fulfilled: true
    }, { 
      from: users[0], type: types[0], fulfilled: false
    }, { 
      from: users[0], type: types[0], fulfilled: true
    }]
  },
  outbox: {
    new: [],
    old: []
  }
};


class RequestsCtrl {

    constructor ($scope, $mdDialog, $mdSidenav, User, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this._$mdSidenav = $mdSidenav;
        this.User = User;
        this.API = API;
        
        this.requests = requestsList;
    }
    
    close () {
      this._$mdSidenav('requests').toggle();
    }

};


const requests = {

    bindings: {
        view: '<',
        profile: '<currentUser'
    },

    require: {
        app: '^staminityApplication'
    },

    transclude: false,

    controller: RequestsCtrl,

    templateUrl: 'requests/requests.html',

    $routeConfig: [
        { path: '/', name: 'Profile', component: 'requests', useAsDefault: true },
        { path: '/:id', name: 'Profile', component: 'requests' }
    ]

};


angular.module('staminity.requests', ['ngMaterial'])
    .component('requests', requests);
