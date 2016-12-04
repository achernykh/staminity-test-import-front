const usersList = [
    { userpic: '', username: 'Евгений Захаринский', role: 'Менеджер, +2', coach: 'Задорожный Андрей', subscription: 'Тренер, Премиум', athlets: '8', city: 'Россия, Москва', ageGroup: 'M40-44' },
    { userpic: '', username: 'Черных Александр', role: 'Спортсмен', coach: 'Хабаров Евгений, +1', subscription: 'Премиум', athlets: '-', city: 'Россия, Москва', ageGroup: 'M30-34' },
    { userpic: '', username: 'Иванов Денис', role: 'Спортсмен', coach: 'Задорожный Андрей', subscription: '', athlets: '-', city: 'Россия, Москва', ageGroup: 'M30-34' },
    { userpic: '', username: 'Калинин Алексей', role: 'Спортсмен', coach: 'Хабаров Евгений', subscription: 'Премиум', athlets: '-', city: 'Россия, Москва', ageGroup: 'M40-44' },
    { userpic: '', username: 'Евгений Захаринский', role: 'Спортсмен', coach: 'Хабаров Евгений', subscription: 'Премиум', athlets: '-', city: 'Россия, Москва', ageGroup: 'M35-39' },
    { userpic: '', username: 'Калинин Алексей', role: 'Спортсмен', coach: 'Хабаров Евгений', subscription: '', athlets: '-', city: 'Россия, Москва', ageGroup: 'M40-44' },
    { userpic: '', username: 'Черных Александр', role: 'Спортсмен', coach: 'Хабаров Евгений, +1', subscription: '', athlets: '-', city: 'Россия, Москва', ageGroup: 'M35-39' },
    { userpic: '', username: 'Иванов Денис', role: 'Спортсмен', coach: 'Задорожный Андрей', subscription: '', athlets: '-', city: 'Россия, Москва', ageGroup: 'M40-44' },
    { userpic: '', username: 'Калинин Алексей', role: 'Спортсмен', coach: 'Задорожный Андрей', subscription: 'Премиум', athlets: '-', city: 'Россия, Москва', ageGroup: 'M30-34' },
    { userpic: '', username: 'Евгений Захаринский', role: 'Спортсмен', coach: 'Хабаров Евгений', subscription: '', athlets: '-', city: 'Россия, Москва', ageGroup: 'M35-39' }
];

const roles = ['Спортсмен', 'Тренер', 'Менеджер'];

const coaches = ['Задорожный Андрей', 'Хабаров Евгений'];

function unique (xs) {
    return Object.keys(xs.reduce((r, x) => {
        r[x] = true;
        return r;
    }, {}));
}

function equals (x0, x1) {
    return x0 === x1;
}

function allEqual (xs, p = equals) {
    return !xs.length || !xs.find((x) => !equals(x, xs[0]));
}


class UsersCtrl {

    constructor ($scope, $mdDialog, UserService, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.UserService = UserService;
        this.API = API;
        
        this.users = usersList;
    }
    
    get checked () {
        return this.users.filter((user) => user.checked);
    }
    
    set allChecked (value) {
        if (this.allChecked) {
            this.users.forEach((user) => { user.checked = false; });
        } else {
            this.users.forEach((user) => { user.checked = true; });
        }
    }
    
    get allChecked () {
        return this.users.every((user) => user.checked);
    }
    
    get subscriptionsAvailable () {
        return allEqual(this.checked.map((user) => user.subscription))
    }
    
    subscriptions () {
        this.$mdDialog.show({
            controller: SubscriptionsController,
            locals: { users: this.checked },
            templateUrl: 'users/subscriptions.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    get coachesAvailable () {
        return allEqual(this.checked.map((user) => user.coach))
    }
    
    coaches () {
        this.$mdDialog.show({
            controller: CoachesController,
            locals: { users: this.checked },
            templateUrl: 'users/coaches.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    get rolesAvailable() {
        return allEqual(this.checked.map((user) => user.role))
    }
    
    roles () {
        this.$mdDialog.show({
            controller: RolesController,
            locals: { users: this.checked },
            templateUrl: 'users/roles.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    remove () {
        this.users = this.users.filter((user) => !user.checked);
    }
    
    filters (key, value) {
      
    }
};


function RolesController ($scope, users, $mdDialog) {
    'ngInject';
    
    $scope.roles = roles.map((role) => ({ 
        name: role, 
        checked: users[0].role.includes(role) 
    }));
    
    $scope.commit = () => {
        $mdDialog.hide($scope.roles);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}


function SubscriptionsController ($scope, users, $mdDialog) {
    'ngInject';
    
    $scope.commit = () => {
        $mdDialog.hide($scope.subscriptions);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}


function CoachesController ($scope, users, $mdDialog) {
    'ngInject';
    
    $scope.coaches = coaches.map((coach) => ({ 
        name: coach, 
        checked: users[0].coach.includes(coach) 
    }));
    
    $scope.commit = () => {
        $mdDialog.hide($scope.coaches);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}


const users = {

    bindings: {
        view: '<',
        profile: '<currentUser'
    },

    require: {
        app: '^staminityApplication'
    },

    transclude: false,

    controller: UsersCtrl,

    templateUrl: 'users/users.html',

    $routeConfig: [
        { path: '/', name: 'Users', component: 'users', useAsDefault: true },
        { path: '/:id', name: 'Users', component: 'users' }
    ]

};


angular.module('staminity.users', ['ngMaterial'])
    .component('users', users);
