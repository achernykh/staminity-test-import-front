import { pipe, groupBy, log, map, entries, fold, filter } from '../util/util'


const date = (x) => x[0]
const type = (x) => x[1]
const time = (x) => x[2] || 0
const count = (x) => x[3] || 0

const icons = {
  run: 'directions_run',
  swim: 'pool',
  fitness: 'fitness_center',
  bike: 'directions_bike'
}


const chart = {
    width: 430,
    height: 150,
    barWidth: 20,
    data: [],

    setStatistics (statistics) {
        this.data = pipe(
            filter(type),
            groupBy(date),
            entries,
            map(([date, series]) => ({ 
                label: moment(date).format('MMM'), 
                value: fold((a, x) => a + time(x), 0) (series)
            }))
        ) (statistics.series)
    }

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
  setStatistics (statistics) {
      this.data = pipe(
          filter(type),
          groupBy(type),
          entries,
          map(([type, series]) => ({ 
              icon: icons[type], 
              dist: '-', 
              hrs: fold((a, x) => a + time(x), 0) (series), 
              count: fold((a, x) => a + count(x), 0) (series)
          }))
      ) (statistics.series)

      this.total = { 
          icon: 'functions', 
          dist: '-', 
          hrs: fold((a, x) => a + time(x), 0) (statistics.series), 
          count: fold((a, x) => a + count(x), 0) (statistics.series)
      }
  }

  data: [],
  total: null
};


class ProfileCtrl {

    constructor ($scope, $mdDialog, dialogs, UserService, GroupService, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.dialogs = dialogs;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.API = API;
        
        this.years = [2015, 2016];
        this.year = 2016;
        this.ranges = ['Обзор года', 'Обзор месяца'];
        this.range = 'Обзор года';
        this.orders = ['время', 'кол-во трен.'];
        this.order = 'время';
        
        this.chart = chart;
        this.table = table;

        this.chart.setStatistics(this.summaryStatistics);
        this.table.setStatistics(this.summaryStatistics);
    }
  
    update () {
        return this.UserService.getProfile(this.user.userId)
            .then((user) => { this.user = user })
            .then(() => { this.$scope.$apply() })
    }

    getHeader () {
        return `url('${this.user.public.background? this.API.apiUrl('/content/background/' + this.user.public.background) : '/assets/picture/pattern0.jpg'}')`
    }
    
    coaches () {
        this.dialogs.group(this.user.connections.Coaches, 'Тренеры')
    }
    
    athletes () {
        this.dialogs.group(this.user.connections.Athletes, 'Спортсмены')
    }
    
    friends () {
        this.dialogs.group(this.user.connections.Friends, 'Друзья')
    }
    
    subscriptions () {
        this.dialogs.group(this.user.connections.Following, 'Подписки')
    }
    
    subscribers () {
        this.dialogs.group(this.user.connections.Followers, 'Подписчики')
    }
};


const user = {

    bindings: {
        view: '<',
        user: '<',
        summaryStatistics: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    transclude: false,

    controller: ProfileCtrl,

    templateUrl: 'user/user.html',

    $routeConfig: [
        { path: '/', name: 'Profile', component: 'user', useAsDefault: true },
        { path: '/:id', name: 'Profile', component: 'user' }
    ]

};


angular.module('staminity.user', ['ngMaterial', 'staminity.components'])
    .component('user', user);
