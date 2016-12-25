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
  }
};


class RequestsCtrl {

    constructor ($scope, $mdDialog, $mdSidenav, UserService, GroupService, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this._$mdSidenav = $mdSidenav;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.API = API;
        
        this.loadMore()
        
        this.requests = requestsList;
    }
    
    loadMore () {
      this.GroupService.getMembershipRequest(0, 20)
      .then((data) => {
        console.log('requests', data)
      })
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
