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


class UsersCtrl {

    constructor ($scope, $mdDialog, User, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.User = User;
        this.API = API;
        
        this.users = usersList;
    }
};


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
